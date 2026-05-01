# Theme Architecture Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Damo UI from the current two-tier (raw palette + partial semantic) color model to a shadcn-style three-layer model where raw palette is private, semantic tokens are paired (bg + foreground) and fully declared per theme, and palette presets stay orthogonal to light/dark. Includes the parallel redesign of the `/theme-generator` page.

**Architecture:** Incremental migration with transient dual tokens — new tokens are added alongside old ones, components migrate one group at a time with the build staying green after every commit, then the old tokens are deleted in a final cleanup. Spec at `docs/specs/2026-04-24-theme-architecture-refactor-design.md`.

**Tech Stack:** Tailwind v4 with `@theme inline`, CSS custom properties, CVA variants, Vitest + @testing-library, Ladle stories.

---

## Files we'll touch

### Rewritten

- `packages/ui/src/styles/tokens.css` — raw palette moves to private section; identity tokens (medal, chart, memphis) live here
- `packages/ui/src/styles/themes.css` — full light + dark semantic layer declarations, badge-specific tokens, palette preset overrides (raw palette only)
- `packages/ui/src/styles/theme.css` — Tailwind bridge now exposes only semantic + identity tokens (no raw palette classes)
- `packages/ui/src/styles/patterns.css` — pattern colors derive from semantic tokens
- `packages/ui/src/styles/globals.css` — scrollbar uses new semantic names

### New

- `packages/ui/src/styles/__tests__/contrast.test.ts` — WCAG 2.1 assertion for body-text pairs across 6 theme × palette combinations
- `packages/ui/src/styles/__tests__/contrast-utils.ts` — pure WCAG contrast calculation helper (shared with theme-generator)
- `apps/playground/app/theme-generator/contrast.ts` — re-export of the utility for generator UI

### Modified (component migration)

Any component file listed in Tasks 5–16 below. Corresponds to the 55 raw-palette-class occurrences in 32 files + 12 files with inline `var(--plum|gold|paper|black)`.

### Rewritten (theme generator)

- `apps/playground/app/theme-generator/theme-state.ts` — new three-layer shape
- `apps/playground/app/theme-generator/use-theme-state.ts` — reducer for new shape
- `apps/playground/app/theme-generator/presets.ts` — presets shaped to raw-palette-only
- `apps/playground/app/theme-generator/exporters.ts` — emits `:root` + `:root[data-theme='dark']` blocks
- `apps/playground/app/theme-generator/exporters.test.ts` — expectations for new output
- `apps/playground/app/theme-generator/page.tsx` — tab-structured UI, paired pickers, dual-mode preview

### Modified (playground non-generator)

- `apps/playground/app/page.tsx`
- `apps/playground/app/design-system/page.tsx`
- `apps/playground/app/design-system/patterns.tsx`
- `apps/playground/app/layout.tsx` (inline styles, if any)

### Modified (docs)

- `README.md`
- `packages/ui/README.md`
- `CHANGELOG.md`
- `packages/ui/package.json` (version bump)

---

## Execution phase overview

| Phase                | Goal                                                                      | Tasks |
| -------------------- | ------------------------------------------------------------------------- | ----- |
| 1. Infrastructure    | Add new tokens, bridge, contrast utility — dual tokens, build stays green | 1–4   |
| 2. Core variants     | Button, Card, Badge migrate first (cascades into many consumers)          | 5–7   |
| 3. Form elements     | Inputs, pickers, checkables                                               | 8–9   |
| 4. Overlays & chrome | Dialog family, tooltips, toasts, hint, navigation                         | 10–12 |
| 5. Data & misc       | Avatar/user-card/table, chip, showcase specifics                          | 13–16 |
| 6. Playground pages  | Non-generator page migration                                              | 17    |
| 7. Theme generator   | Full rewrite per §8 of the spec                                           | 18–23 |
| 8. Cleanup           | Delete old tokens, version bump, docs                                     | 24–27 |

---

## Phase 1: Infrastructure (build green after each task)

### Task 1: WCAG contrast utility + unit tests

**Files:**

- Create: `packages/ui/src/styles/__tests__/contrast-utils.ts`
- Create: `packages/ui/src/styles/__tests__/contrast-utils.test.ts`

- [ ] **Step 1: Write failing tests**

Create `packages/ui/src/styles/__tests__/contrast-utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { hexToRgb, relativeLuminance, contrastRatio, passesAA } from './contrast-utils'

describe('contrast-utils', () => {
  describe('hexToRgb', () => {
    it('parses 6-char hex', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#c4942a')).toEqual({ r: 196, g: 148, b: 42 })
    })

    it('parses 3-char hex', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('is case-insensitive', () => {
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 })
    })
  })

  describe('relativeLuminance', () => {
    it('returns 1.0 for white', () => {
      expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1.0, 3)
    })

    it('returns 0.0 for black', () => {
      expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0.0, 3)
    })
  })

  describe('contrastRatio', () => {
    it('returns 21 for black on white', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21.0, 1)
    })

    it('returns 1 for same color', () => {
      expect(contrastRatio('#c4942a', '#c4942a')).toBeCloseTo(1.0, 3)
    })

    it('is commutative', () => {
      expect(contrastRatio('#000', '#fff')).toBeCloseTo(contrastRatio('#fff', '#000'), 3)
    })
  })

  describe('passesAA', () => {
    it('passes black on white', () => {
      expect(passesAA('#000000', '#ffffff')).toBe(true)
    })

    it('fails gold on white', () => {
      expect(passesAA('#c4942a', '#ffffff')).toBe(false)
    })

    it('passes black on gold', () => {
      expect(passesAA('#000000', '#c4942a')).toBe(true)
    })
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `pnpm -C packages/ui test contrast-utils -- --run`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the utility**

Create `packages/ui/src/styles/__tests__/contrast-utils.ts`:

```ts
export interface RGB {
  r: number
  g: number
  b: number
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const normalized =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

function channelLuminance(channel: number): number {
  const v = channel / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

export function relativeLuminance(rgb: RGB): number {
  const r = channelLuminance(rgb.r)
  const g = channelLuminance(rgb.g)
  const b = channelLuminance(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(hexToRgb(fg))
  const l2 = relativeLuminance(hexToRgb(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function passesAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `pnpm -C packages/ui test contrast-utils -- --run`
Expected: 10 tests pass.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/styles/__tests__/contrast-utils.ts \
        packages/ui/src/styles/__tests__/contrast-utils.test.ts
git commit -m "feat(styles): add WCAG contrast utility for theme validation"
```

---

### Task 2: Add new semantic tokens to themes.css (dual with old)

**Files:**

- Modify: `packages/ui/src/styles/tokens.css`
- Modify: `packages/ui/src/styles/themes.css`

**Strategy:** Keep all existing tokens untouched. Add the new semantic layer alongside, with equivalent values. Build stays green because consumers still see the old tokens.

- [ ] **Step 1: Add Layer 3 identity tokens to tokens.css**

In `packages/ui/src/styles/tokens.css`, inside the first `:root` block, after the existing `--medal-*` block, append:

```css
/* ── Chart colors (data viz, theme-agnostic) ──────── */
--chart-1: #7a3980;
--chart-2: #c4942a;
--chart-3: #4f8a3c;
--chart-4: #a13a2c;
--chart-5: #522357;

/* ── Nav-on-dark identity (always on dark surface) ─── */
--nav-on-dark-accent: var(--gold-200);
--nav-on-dark-accent-strong: var(--gold-400);
--nav-on-dark-foreground: rgba(255, 255, 255, 0.72);
--nav-on-dark-foreground-strong: var(--white);
```

- [ ] **Step 2: Add new semantic layer to themes.css (light)**

In `packages/ui/src/styles/themes.css`, at the TOP of the file (before the dark `:root[data-theme='dark']` block), insert:

```css
/* ════════════════════════════════════════════════════════════════
 * New semantic layer (shadcn-style, paired bg↔fg)
 * Added alongside the legacy semantic vars until component migration
 * completes. See docs/specs/2026-04-24-theme-architecture-refactor-design.md
 * ════════════════════════════════════════════════════════════════ */

:root,
:root[data-theme='light'] {
  /* Surfaces */
  --background: var(--paper-50);
  --foreground: var(--plum-900);
  --card: var(--white);
  --card-foreground: var(--plum-900);
  --popover: var(--white);
  --popover-foreground: var(--plum-900);
  --muted: var(--paper-100);
  --muted-foreground: var(--plum-700);

  /* Intent */
  --primary: var(--gold-500);
  --primary-foreground: var(--white);
  --secondary: var(--plum-500);
  --secondary-foreground: var(--paper-50);
  --accent-new: var(--gold-100);
  --accent-new-foreground: var(--plum-900);
  --destructive: #a13a2c;
  --destructive-foreground: var(--paper-50);

  /* Status (paired) */
  --success-foreground: var(--paper-50);
  --warning-foreground: var(--paper-50);
  --info-foreground: var(--paper-50);
  --rage-foreground: var(--paper-50);

  /* Chrome primitives */
  --input: color-mix(in oklab, var(--plum-900) 12%, transparent);

  /* Memphis identity */
  --memphis-shadow-color: var(--black);
  --memphis-border-color: var(--black);

  /* Badge-specific */
  --badge-featured: var(--gold-500);
  --badge-featured-foreground: var(--black);
  --badge-copper: var(--gold-500);
  --badge-copper-foreground: var(--white);
  --badge-navy: var(--plum-900);
  --badge-navy-foreground: var(--gold-200);
  --badge-draw: var(--paper-100);
  --badge-draw-foreground: var(--plum-900);
  --badge-rank: var(--gold-100);
  --badge-rank-foreground: var(--plum-900);
}
```

Note: `--accent-new` is temporary — it's the new "subtle highlight" meaning of `--accent`. It will be renamed to `--accent` in the cleanup task once the old `--accent` (which means "gold, primary CTA") is fully migrated.

- [ ] **Step 3: Extend the existing dark block with new semantics**

In `packages/ui/src/styles/themes.css`, inside `:root[data-theme='dark']`, append after the existing overrides:

```css
/* New semantic layer — dark values */
--background: var(--plum-900);
--foreground: var(--paper-50);
--card: var(--plum-800);
--card-foreground: var(--paper-50);
--popover: var(--plum-800);
--popover-foreground: var(--paper-50);
--muted: var(--plum-700);
--muted-foreground: var(--plum-300);

--primary: var(--gold-500);
--primary-foreground: var(--plum-900);
--secondary: var(--plum-500);
--secondary-foreground: var(--paper-50);
--accent-new: var(--plum-700);
--accent-new-foreground: var(--gold-200);
--destructive: #c94a2f;
--destructive-foreground: var(--paper-50);

--success-foreground: var(--plum-900);
--warning-foreground: var(--plum-900);
--info-foreground: var(--plum-900);
--rage-foreground: var(--plum-900);

--input: color-mix(in oklab, var(--paper-50) 12%, transparent);

--memphis-shadow-color: var(--paper-50);
--memphis-border-color: var(--paper-50);

--badge-featured: var(--gold-500);
--badge-featured-foreground: var(--plum-900);
--badge-copper: var(--gold-500);
--badge-copper-foreground: var(--paper-50);
--badge-navy: var(--plum-700);
--badge-navy-foreground: var(--gold-200);
--badge-draw: var(--plum-700);
--badge-draw-foreground: var(--paper-50);
--badge-rank: var(--plum-700);
--badge-rank-foreground: var(--gold-200);
```

Also extend `[data-theme-preview='dark']` (the scoped preview block) with the SAME additions so the theme-generator's dark preview renders correctly. Copy the block verbatim.

Adjust the override values for `success`, `warning`, `info`, `rage` in dark too:

```css
--success: #6fa85c;
--warning: var(--gold-500);
--info: var(--plum-300);
--rage: #e06b4f;
```

- [ ] **Step 4: Build lib and playground to verify nothing broke**

Run: `pnpm -C packages/ui build && pnpm -C apps/playground build`
Expected: Both succeed.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/styles/tokens.css packages/ui/src/styles/themes.css
git commit -m "feat(styles): add new shadcn-style semantic tokens alongside legacy"
```

---

### Task 3: Expose new tokens through Tailwind bridge

**Files:**

- Modify: `packages/ui/src/styles/theme.css`

- [ ] **Step 1: Append new semantic color bridges**

In `packages/ui/src/styles/theme.css`, inside the `@theme inline` block, AFTER the existing semantic colors section, append:

```css
/* ── NEW semantic color bridge (shadcn-style, paired) ── */
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-card: var(--card);
--color-card-foreground: var(--card-foreground);
--color-popover: var(--popover);
--color-popover-foreground: var(--popover-foreground);
--color-muted: var(--muted);
--color-muted-foreground: var(--muted-foreground);
--color-primary: var(--primary);
--color-primary-foreground: var(--primary-foreground);
--color-secondary: var(--secondary);
--color-secondary-foreground: var(--secondary-foreground);
--color-accent-new: var(--accent-new);
--color-accent-new-foreground: var(--accent-new-foreground);
--color-destructive: var(--destructive);
--color-destructive-foreground: var(--destructive-foreground);

/* Status foregrounds (bg utilities already exist) */
--color-success-foreground: var(--success-foreground);
--color-warning-foreground: var(--warning-foreground);
--color-info-foreground: var(--info-foreground);
--color-rage-foreground: var(--rage-foreground);

/* Chrome primitives */
--color-input: var(--input);

/* Memphis identity */
--color-memphis: var(--memphis-border-color);
--color-memphis-shadow: var(--memphis-shadow-color);

/* Badge-specific */
--color-badge-featured: var(--badge-featured);
--color-badge-featured-foreground: var(--badge-featured-foreground);
--color-badge-copper: var(--badge-copper);
--color-badge-copper-foreground: var(--badge-copper-foreground);
--color-badge-navy: var(--badge-navy);
--color-badge-navy-foreground: var(--badge-navy-foreground);
--color-badge-draw: var(--badge-draw);
--color-badge-draw-foreground: var(--badge-draw-foreground);
--color-badge-rank: var(--badge-rank);
--color-badge-rank-foreground: var(--badge-rank-foreground);

/* Charts */
--color-chart-1: var(--chart-1);
--color-chart-2: var(--chart-2);
--color-chart-3: var(--chart-3);
--color-chart-4: var(--chart-4);
--color-chart-5: var(--chart-5);
```

- [ ] **Step 2: Verify Tailwind generates new classes**

Run: `pnpm -C apps/playground build` and then inspect `apps/playground/.next/static/css/app/layout.css` for class names like `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`.

Expected: classes present.

Grep: `grep -E 'bg-background|bg-primary|text-primary-foreground' apps/playground/.next/static/css/app/layout.css` returns matches.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/styles/theme.css
git commit -m "feat(styles): expose new semantic tokens via Tailwind bridge"
```

---

### Task 4: CI contrast test for body-text pairs

**Files:**

- Create: `packages/ui/src/styles/__tests__/contrast.test.ts`

- [ ] **Step 1: Resolve the actual hex values to test**

The test hardcodes the resolved hex values per theme/palette since parsing live CSS variables in JSDOM is brittle. Values are read from `tokens.css` / `themes.css` manually.

- [ ] **Step 2: Write the test**

Create `packages/ui/src/styles/__tests__/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { passesAA } from './contrast-utils'

/**
 * Body-text pairs — pairs where contrast failure breaks readability of
 * paragraph text, labels, and form inputs. Must pass WCAG AA (≥ 4.5:1).
 *
 * Decorative pairs (primary, secondary, accent, destructive, status,
 * badges) are intentionally NOT tested here — Memphis aesthetic allows
 * lower contrast on large/bold CTAs.
 *
 * See docs/specs/2026-04-24-theme-architecture-refactor-design.md §7.3.
 */

type Pair = readonly [label: string, bg: string, fg: string]

const resolveBorder = (baseHex: string, opacity: number): string => {
  // Approximate — the actual CSS uses color-mix which we can't fully
  // resolve here. For the body-text pairs tested, --border isn't one of
  // them, so this is only used if we extend the matrix later.
  return baseHex
}

// Default palette — paper + plum + gold raw values
const PAPER_50 = '#fbf7ee'
const PAPER_100 = '#f5efde'
const PAPER_300 = '#ddd0ae'
const PLUM_300 = '#b17cb5'
const PLUM_500 = '#7a3980'
const PLUM_700 = '#522357'
const PLUM_800 = '#3d1a40'
const PLUM_900 = '#2a0f2d'
const WHITE = '#ffffff'

// Neon palette raw values
const NEON_PLUM_300 = '#e26dbb'
const NEON_PLUM_700 = '#491a40'
const NEON_PLUM_800 = '#321029'
const NEON_PLUM_900 = '#1f0819'

// Sunset palette raw values
const SUNSET_PLUM_300 = '#dd8a6d'
const SUNSET_PLUM_700 = '#5a2514'
const SUNSET_PLUM_800 = '#3f170d'
const SUNSET_PLUM_900 = '#2a0d07'

describe('semantic contrast — body-text pairs only (WCAG AA, ≥ 4.5:1)', () => {
  describe('default palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, PLUM_900],
      ['card / card-foreground', WHITE, PLUM_900],
      ['popover / popover-foreground', WHITE, PLUM_900],
      ['muted / muted-foreground', PAPER_100, PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('default palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PLUM_900, PAPER_50],
      ['card / card-foreground', PLUM_800, PAPER_50],
      ['popover / popover-foreground', PLUM_800, PAPER_50],
      ['muted / muted-foreground', PLUM_700, PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('neon palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, NEON_PLUM_900],
      ['card / card-foreground', WHITE, NEON_PLUM_900],
      ['popover / popover-foreground', WHITE, NEON_PLUM_900],
      ['muted / muted-foreground', PAPER_100, NEON_PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('neon palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', NEON_PLUM_900, PAPER_50],
      ['card / card-foreground', NEON_PLUM_800, PAPER_50],
      ['popover / popover-foreground', NEON_PLUM_800, PAPER_50],
      ['muted / muted-foreground', NEON_PLUM_700, NEON_PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('sunset palette — light', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', PAPER_50, SUNSET_PLUM_900],
      ['card / card-foreground', WHITE, SUNSET_PLUM_900],
      ['popover / popover-foreground', WHITE, SUNSET_PLUM_900],
      ['muted / muted-foreground', PAPER_100, SUNSET_PLUM_700],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })

  describe('sunset palette — dark', () => {
    const pairs: ReadonlyArray<Pair> = [
      ['background / foreground', SUNSET_PLUM_900, PAPER_50],
      ['card / card-foreground', SUNSET_PLUM_800, PAPER_50],
      ['popover / popover-foreground', SUNSET_PLUM_800, PAPER_50],
      ['muted / muted-foreground', SUNSET_PLUM_700, SUNSET_PLUM_300],
    ]
    pairs.forEach(([label, bg, fg]) => {
      it(label, () => {
        expect(passesAA(fg, bg)).toBe(true)
      })
    })
  })
})
```

- [ ] **Step 3: Run the test**

Run: `pnpm -C packages/ui test contrast.test -- --run`
Expected: 24 tests pass (4 pairs × 6 combinations).

If any fail: the corresponding raw palette value needs adjusting. Do NOT relax the test — fix the values. The most likely offender is sunset `muted` pair (plum-700 + plum-300) if the new plum-700 is too close to plum-300. Adjust the hex in `themes.css` and update the constant in the test.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/styles/__tests__/contrast.test.ts
git commit -m "test(styles): assert WCAG AA on body-text pairs across palettes"
```

---

## Phase 2: Core variants (Button, Card, Badge)

### Task 5: Migrate Button variants + tests

**Files:**

- Modify: `packages/ui/src/components/button/button.variants.ts`
- Modify: `packages/ui/src/components/button/button.test.tsx`

**Breaking API change:** `variant="accent"` becomes `variant="secondary"`. Playground is the only consumer — Task 17 updates it.

- [ ] **Step 1: Update test to assert new class names**

Read existing tests at `packages/ui/src/components/button/button.test.tsx`. Replace assertions per this table:

| Old assertion                                            | New assertion                                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `.toContain('bg-gold-500')`                              | `.toContain('bg-primary')`                                                               |
| `.toContain('text-white')` (on primary variant)          | `.toContain('text-primary-foreground')`                                                  |
| `.toContain('bg-plum-500')`                              | `.toContain('bg-secondary')`                                                             |
| `.toContain('text-paper-50')` (on accent/danger variant) | `.toContain('text-secondary-foreground')` or `.toContain('text-destructive-foreground')` |
| `.toContain('bg-danger')`                                | `.toContain('bg-destructive')`                                                           |
| `variant="accent"` in render calls                       | `variant="secondary"`                                                                    |

Also add one test for the renamed variant:

```tsx
it('renders secondary variant (renamed from accent)', () => {
  const { getByRole } = render(<Button variant="secondary">Click</Button>)
  const btn = getByRole('button')
  expect(btn.className).toContain('bg-secondary')
  expect(btn.className).toContain('text-secondary-foreground')
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `pnpm -C packages/ui test button -- --run`
Expected: FAIL with assertion errors on the changed class names.

- [ ] **Step 3: Rewrite button.variants.ts**

Replace the full content of `packages/ui/src/components/button/button.variants.ts` with:

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap cursor-pointer',
    'font-body font-semibold',
    'transition-[transform,box-shadow,background-color,color] duration-snap ease-memphis',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:bg-primary/90 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:bg-secondary/80 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        ghost: [
          'bg-card text-card-foreground',
          'border-2 border-memphis rounded-none',
          '[--memphis-shadow-color:var(--primary)] shadow-memphis',
          'hover:bg-muted hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:brightness-110 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        outline: [
          'bg-card text-card-foreground',
          'border-2 border-memphis rounded-none',
          'hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        link: [
          'bg-transparent text-primary underline underline-offset-2',
          'border-none shadow-none rounded-none p-0',
          'hover:text-primary/80',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 text-base gap-2',
        lg: 'px-7 py-3.5 text-lg gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'link', size: 'sm', class: '!p-0 text-sm' },
      { variant: 'link', size: 'md', class: '!p-0 text-base' },
      { variant: 'link', size: 'lg', class: '!p-0 text-lg' },
      { variant: 'link', size: 'icon', class: '!p-0 h-auto w-auto' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

Note: `border-memphis` and `[--memphis-shadow-color:...]` require that the Tailwind bridge expose a class matching `.border-memphis` (from `--color-memphis` added in Task 3) — verified in Task 3 step 2.

Note: `danger` variant was renamed to `destructive` — this is a breaking change. Tests for the variant name need the matching update.

- [ ] **Step 4: Run tests, verify pass**

Run: `pnpm -C packages/ui test button -- --run`
Expected: all pass.

- [ ] **Step 5: Visual verify in Ladle**

Run: `pnpm -C packages/ui dev` and open `http://localhost:61001`. Check `button.stories.tsx` renders primary/secondary/destructive/outline/ghost/link correctly in light + dark + neon + sunset.

Kill the dev server with Ctrl+C after verification.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/components/button/
git commit -m "refactor(button): migrate to new semantic tokens, rename accent→secondary, danger→destructive"
```

---

### Task 6: Migrate Card variants + tests

**Files:**

- Modify: `packages/ui/src/components/card/card.variants.ts`
- Modify: `packages/ui/src/components/card/card.test.tsx`

**Breaking API change:** `variant="dark"` becomes `variant="inverse"`.

- [ ] **Step 1: Update card.test.tsx assertions**

Change:

- `expect(...).toContain('bg-surface')` → `expect(...).toContain('bg-card')`
- `expect(...).toContain('text-ink')` → `expect(...).toContain('text-card-foreground')`
- Any `variant="dark"` → `variant="inverse"`
- `expect(...).toContain('bg-plum-900')` (on dark variant) → `expect(...).toContain('bg-foreground')`
- `expect(...).toContain('text-paper-50')` (on dark variant) → `expect(...).toContain('text-background')`

Run: `pnpm -C packages/ui test card -- --run`
Expected: FAIL on changed assertions.

- [ ] **Step 2: Rewrite card.variants.ts**

Replace with:

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva(['bg-card text-card-foreground'], {
  variants: {
    variant: {
      default: ['border-2 border-memphis shadow-memphis rounded-none'],
      elevated: ['border-2 border-memphis shadow-m-lg rounded-none'],
      featured: [
        '[--memphis-shadow-color:var(--primary)]',
        'border-2 border-memphis shadow-memphis rounded-none',
      ],
      interactive: [
        'border-2 border-memphis shadow-memphis rounded-none',
        'cursor-pointer select-none',
        'transition-[transform,box-shadow] duration-snap ease-memphis',
        'hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      ],
      inverse: [
        'bg-foreground text-background',
        'border border-[color-mix(in_oklab,var(--background)_12%,transparent)]',
        'shadow-md rounded-md',
      ],
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export type CardVariants = VariantProps<typeof cardVariants>
```

- [ ] **Step 3: Run tests, verify pass**

Run: `pnpm -C packages/ui test card -- --run`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/card/
git commit -m "refactor(card): migrate to semantic tokens, rename dark→inverse"
```

---

### Task 7: Migrate Badge variants + tests

**Files:**

- Modify: `packages/ui/src/components/badge/badge.variants.ts`
- Modify: `packages/ui/src/components/badge/badge.test.tsx`

- [ ] **Step 1: Update badge.test.tsx assertions**

The existing tests in `badge.test.tsx` use a parametrized table like:

```tsx
const cases = [
  ['default', 'bg-surface-2'],
  ['featured', 'bg-gold-500'],
  ['copper', 'bg-gold-500'],
  ['navy', 'bg-plum-900'],
  ['win', 'bg-[var(--success)]'],
  ['loss', 'bg-[var(--danger)]'],
  ['draw', 'bg-paper-100'],
  ['rank', 'bg-gold-100'],
]
```

Replace with:

```tsx
const cases = [
  ['default', 'bg-muted'],
  ['featured', 'bg-badge-featured'],
  ['copper', 'bg-badge-copper'],
  ['navy', 'bg-badge-navy'],
  ['win', 'bg-success'],
  ['loss', 'bg-destructive'],
  ['draw', 'bg-badge-draw'],
  ['rank', 'bg-badge-rank'],
  ['outline', 'bg-transparent'],
]
```

Run: `pnpm -C packages/ui test badge -- --run`
Expected: FAIL.

- [ ] **Step 2: Rewrite badge.variants.ts**

```ts
import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 px-2 py-0.5',
    'text-[11px] font-mono font-bold uppercase tracking-[0.08em]',
    'rounded-none whitespace-nowrap',
    'border-2 border-memphis shadow-memphis-sm',
  ],
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        featured: 'bg-badge-featured text-badge-featured-foreground',
        copper: 'bg-badge-copper text-badge-copper-foreground',
        navy: 'bg-badge-navy text-badge-navy-foreground',
        win: 'bg-success text-success-foreground',
        loss: 'bg-destructive text-destructive-foreground',
        draw: 'bg-badge-draw text-badge-draw-foreground',
        rank: 'bg-badge-rank text-badge-rank-foreground',
        outline: 'bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
```

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test badge -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/badge/
git commit -m "refactor(badge): migrate to dedicated semantic tokens"
```

---

## Phase 3: Form elements

### Task 8: Migrate form inputs (focus-ring pattern)

**Files:**

- Modify: `packages/ui/src/components/input/input.tsx`
- Modify: `packages/ui/src/components/textarea/textarea.tsx`
- Modify: `packages/ui/src/components/select/select.tsx`
- Modify: `packages/ui/src/components/combobox/combobox.tsx`
- Modify: `packages/ui/src/components/date-picker/date-picker.tsx`

All share the pattern `focus-visible:[--shadow-memphis-color:var(--gold-500)]`.

- [ ] **Step 1: Update each file**

For every file above, replace the occurrence of:

```
focus-visible:[--shadow-memphis-color:var(--gold-500)]
```

with:

```
focus-visible:[--memphis-shadow-color:var(--primary)]
```

Exact sed-equivalent (but use Edit tool, not sed):

- Old string: `focus-visible:[--shadow-memphis-color:var(--gold-500)] focus-visible:shadow-memphis`
- New string: `focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis`

Also if any of these files use `border-accent`, replace with `border-primary`.

- [ ] **Step 2: Update related tests**

Check each file's `.test.tsx` for assertions referencing `var(--gold-500)` or `--shadow-memphis-color`. Update references.

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test input textarea select combobox date-picker -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{input,textarea,select,combobox,date-picker}/
git commit -m "refactor(forms): migrate text inputs to new memphis token names"
```

---

### Task 9: Migrate checkable form elements

**Files:**

- Modify: `packages/ui/src/components/checkbox/checkbox.tsx`
- Modify: `packages/ui/src/components/radio-group/radio-group.tsx`
- Modify: `packages/ui/src/components/switch/switch.tsx`
- Modify: `packages/ui/src/components/slider/slider.tsx`
- Plus their test files

Replacements:

| Old                                                                              | New                                                                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `data-[state=checked]:bg-plum-900 data-[state=checked]:text-paper-50` (checkbox) | `data-[state=checked]:bg-foreground data-[state=checked]:text-background` |
| `bg-plum-900` (radio dot)                                                        | `bg-foreground`                                                           |
| `data-[state=checked]:bg-gold-500` (switch)                                      | `data-[state=checked]:bg-primary`                                         |
| `bg-plum-900` (switch track bg)                                                  | `bg-foreground`                                                           |
| `data-[state=checked]:bg-paper-50` (switch thumb)                                | `data-[state=checked]:bg-background`                                      |
| `bg-gold-500` (slider range)                                                     | `bg-primary`                                                              |
| `bg-paper-50 border-2 border-border-memphis` (slider thumb)                      | `bg-background border-2 border-memphis`                                   |

- [ ] **Step 1: Update each component file**

For each file, apply the replacements above. Use Edit tool with exact strings.

- [ ] **Step 2: Update test assertions**

For each test file, replace `bg-plum-900` → `bg-foreground`, `text-paper-50` → `text-background`, `bg-gold-500` → `bg-primary`, etc.

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test checkbox radio-group switch slider -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{checkbox,radio-group,switch,slider}/
git commit -m "refactor(forms): migrate checkables and slider to semantic tokens"
```

---

## Phase 4: Overlays, feedback, navigation

### Task 10: Migrate overlays (dialog family, tooltip, toast, hint, banner)

**Files:**

- Modify: `packages/ui/src/components/tooltip/tooltip.tsx`
- Modify: `packages/ui/src/components/tooltip-card/tooltip-card.tsx`
- Modify: `packages/ui/src/components/hint/hint.tsx`
- Plus related test files

**Note:** `dialog`, `alert-dialog`, `drawer`, `popover`, `dropdown-menu`, `context-menu`, `toast`, `banner` use only the OLD semantic names (`bg-surface`, `text-ink`, etc.) which we'll migrate in Task 24 (not raw palette) — they don't need changes here.

Replacements for THIS task's files:

| File               | Old                                                          | New                                                              |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| `tooltip.tsx`      | `z-tooltip bg-plum-900 text-paper-50`                        | `z-tooltip bg-foreground text-background`                        |
| `tooltip.tsx`      | `border border-plum-700 rounded-md shadow-md`                | `border border-border-strong rounded-md shadow-md`               |
| `tooltip-card.tsx` | `absolute bg-gold-500 border-2 border-border-memphis`        | `absolute bg-primary border-2 border-memphis`                    |
| `tooltip-card.tsx` | `boxShadow: '4px 4px 0 var(--border-memphis)'`               | `boxShadow: '4px 4px 0 var(--memphis-border-color)'`             |
| `hint.tsx`         | `border-2 border-border-memphis bg-plum-500 text-paper-50`   | `border-2 border-memphis bg-secondary text-secondary-foreground` |
| `hint.tsx`         | `'color-mix(in oklab, var(--plum-500) 22%, var(--surface))'` | `'color-mix(in oklab, var(--secondary) 22%, var(--card))'`       |
| `hint.tsx`         | `'4px 4px 0 var(--shadow-memphis-color)'`                    | `'4px 4px 0 var(--memphis-shadow-color)'`                        |

- [ ] **Step 1: Apply replacements**

- [ ] **Step 2: Update tests (tooltip-card.test.tsx, hint.test.tsx)**

Update assertions referencing the old classes to match new names.

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test tooltip tooltip-card hint -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{tooltip,tooltip-card,hint}/
git commit -m "refactor(overlays): migrate tooltip/hint to semantic tokens"
```

---

### Task 11: Migrate navigation (nav-item, app-shell, pagination, segmented-control, breadcrumbs, tabs)

**Files:**

- Modify: `packages/ui/src/components/nav-item/nav-item.variants.ts`
- Modify: `packages/ui/src/components/app-shell/app-shell.tsx`
- Modify: `packages/ui/src/components/pagination/pagination.tsx`
- Modify: `packages/ui/src/components/segmented-control/segmented-control.tsx`
- Plus tests

Replacements:

| Context                                    | Old                                                                                                           | New                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `nav-item.variants.ts` onDark current      | `aria-[current=page]:text-gold-200`                                                                           | `aria-[current=page]:text-[var(--nav-on-dark-accent)]`                                                     |
| `nav-item.variants.ts` onDark current rail | `aria-[current=page]:before:bg-gold-400`                                                                      | `aria-[current=page]:before:bg-[var(--nav-on-dark-accent-strong)]`                                         |
| `app-shell.tsx`                            | `'bg-plum-900 text-paper-50'`                                                                                 | `'bg-foreground text-background'`                                                                          |
| `pagination.tsx`                           | `aria-[current=page]:bg-plum-900 aria-[current=page]:text-paper-50 aria-[current=page]:border-border-memphis` | `aria-[current=page]:bg-foreground aria-[current=page]:text-background aria-[current=page]:border-memphis` |
| `segmented-control.tsx`                    | `data-[state=on]:bg-plum-900 data-[state=on]:text-paper-50`                                                   | `data-[state=on]:bg-foreground data-[state=on]:text-background`                                            |

**For `breadcrumbs`, `tabs`, `sidebar`, `app-top-bar`**: only OLD semantic names used (no raw palette). Migrate in Task 24.

- [ ] **Step 1: Apply replacements**

- [ ] **Step 2: Update related tests**

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test nav-item app-shell pagination segmented-control -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{nav-item,app-shell,pagination,segmented-control}/
git commit -m "refactor(nav): migrate navigation chrome to semantic tokens"
```

---

### Task 12: Migrate theme-switcher, density-switcher

**Files:**

- Modify: `packages/ui/src/components/theme-switcher/theme-switcher.tsx`
- Modify: `packages/ui/src/components/density-switcher/density-switcher.tsx`
- Plus tests

Replacements:

| Context          | Old                                                              | New                                                                                    |
| ---------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| both `.tsx`      | `isActive ? 'bg-plum-500 text-paper-50' : 'bg-surface text-ink'` | `isActive ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground'` |
| both `.test.tsx` | `.toContain('bg-plum-500')`, `.toContain('text-paper-50')`       | `.toContain('bg-secondary')`, `.toContain('text-secondary-foreground')`                |

- [ ] **Step 1: Apply replacements**

- [ ] **Step 2: Run tests**

Run: `pnpm -C packages/ui test theme-switcher density-switcher -- --run`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/{theme-switcher,density-switcher}/
git commit -m "refactor(switchers): migrate theme/density switchers to semantic tokens"
```

---

## Phase 5: Data display & misc

### Task 13: Migrate avatar, user-card, table

**Files:**

- Modify: `packages/ui/src/components/avatar/avatar.tsx`
- Modify: `packages/ui/src/components/user-card/user-card.tsx`
- Modify: `packages/ui/src/components/table/table.tsx`
- Plus tests

All three share the "navy" pattern `bg-plum-900 text-paper-50`.

Replacements:

| File                            | Old                                                                    | New                                                                        |
| ------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `avatar.tsx`                    | `'bg-plum-900 text-paper-50 font-semibold font-display tracking-wide'` | `'bg-foreground text-background font-semibold font-display tracking-wide'` |
| `user-card.tsx` (2 occurrences) | `...border-border-memphis bg-plum-900 text-paper-50`                   | `...border-memphis bg-foreground text-background`                          |
| `table.tsx`                     | `'bg-plum-900 text-paper-50'`                                          | `'bg-foreground text-background'`                                          |
| `table.tsx` (other places)      | `bg-surface`, `text-ink`, `border-border-memphis`                      | `bg-card`, `text-card-foreground`, `border-memphis`                        |
| Tests                           | `.toContain('bg-plum-900')`, `.toContain('text-paper-50')`             | `.toContain('bg-foreground')`, `.toContain('text-background')`             |

- [ ] **Step 1: Apply replacements**

- [ ] **Step 2: Run tests**

Run: `pnpm -C packages/ui test avatar user-card table -- --run`
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/{avatar,user-card,table}/
git commit -m "refactor(display): migrate avatar/user-card/table to semantic tokens"
```

---

### Task 14: Migrate dot-indicator components + chip + progress + spinner stories

**Files:**

- Modify: `packages/ui/src/components/dropdown-menu/dropdown-menu.tsx`
- Modify: `packages/ui/src/components/context-menu/context-menu.tsx`
- Modify: `packages/ui/src/components/progress/progress.tsx`
- Modify: `packages/ui/src/components/chip/chip.variants.ts`
- Modify: `packages/ui/src/components/chip/chip.tsx`
- Plus tests

Replacements:

| File                                                                                                                                                                                                                                   | Old                                                        | New                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| `dropdown-menu.tsx`, `context-menu.tsx`                                                                                                                                                                                                | `h-2 w-2 rounded-full bg-plum-500`                         | `h-2 w-2 rounded-full bg-secondary`                             |
| `progress.tsx`                                                                                                                                                                                                                         | `bg-plum-500 transition-transform ...`                     | `bg-secondary transition-transform ...`                         |
| `chip.variants.ts` active variants — replace `var(--gold-500)` → `var(--primary)`, `var(--plum-500)` → `var(--secondary)`, `var(--surface)` → `var(--card)`, `var(--ink)` → `var(--foreground)` throughout the color-mix() expressions | both occurrences in the cva array                          |
| `chip.tsx` comment example                                                                                                                                                                                                             | `"bg-gold-500 text-white border-border-memphis"`           | `"bg-primary text-primary-foreground border-memphis"`           |
| `chip.tsx` active                                                                                                                                                                                                                      | `active && 'bg-gold-500 text-white border-border-memphis'` | `active && 'bg-primary text-primary-foreground border-memphis'` |

- [ ] **Step 1: Apply replacements**

- [ ] **Step 2: Update tests (chip.test.tsx references `bg-gold-500`)**

Replace chip test assertions for `bg-gold-500` → `bg-primary`.

Note: `chip.test.tsx` passes `<Chip dotColor="var(--gold-500)">` as a dynamic prop — leave the PROP value alone (callers can still pass any CSS color string); only the default/example references in chip.tsx change. But the test assertion `expect(dot!.style.background).toContain('var(--gold-500)')` stays valid because the prop is passed through literally.

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test dropdown-menu context-menu progress chip -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{dropdown-menu,context-menu,progress,chip}/
git commit -m "refactor(data): migrate dot-indicators and chip to semantic tokens"
```

---

### Task 15: Migrate showcase-specific (feature-card, showcase-card, color-scale, type-specimen, token-swatch, section-header, memphis-shape, pattern-swatch)

**Files:**

- Modify: `packages/ui/src/components/feature-card/feature-card.tsx`
- Modify: `packages/ui/src/components/showcase-card/showcase-card.tsx`
- Modify: `packages/ui/src/components/color-scale/color-scale.tsx`
- Modify: `packages/ui/src/components/type-specimen/type-specimen.tsx`
- Modify: `packages/ui/src/components/token-swatch/token-swatch.tsx`
- Modify: `packages/ui/src/components/section-header/section-header.tsx`
- Modify: `packages/ui/src/components/memphis-shape/memphis-shape.tsx`
- Modify: `packages/ui/src/components/pattern-swatch/pattern-swatch.tsx`
- Plus their test files

Replacements by file:

| File                         | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `feature-card.tsx`           | `boxShadow: '4px 4px 0 var(--gold-500)'` → `boxShadow: '4px 4px 0 var(--primary)'`                                                                                                                                                                                                                                                                                                                                                                                  |
| `feature-card.test.tsx`      | `expect(root.style.boxShadow).toContain('var(--gold-500)')` → `expect(root.style.boxShadow).toContain('var(--primary)')`                                                                                                                                                                                                                                                                                                                                            |
| `showcase-card.tsx`          | `boxShadow: '4px 4px 0 var(--black)'` → `boxShadow: '4px 4px 0 var(--memphis-shadow-color)'`                                                                                                                                                                                                                                                                                                                                                                        |
| `color-scale.tsx`            | `boxShadow: '6px 6px 0 var(--black)'` → `boxShadow: '6px 6px 0 var(--memphis-shadow-color)'`                                                                                                                                                                                                                                                                                                                                                                        |
| `color-scale.test.tsx`       | Test references `var(--plum-300)` and `var(--plum-500)`. These are showcase tests — the ColorScale component renders raw palette as input data. Update the component to accept raw hex strings passed as props, and update the test fixture accordingly. See Step 2 of this task.                                                                                                                                                                                   |
| `type-specimen.tsx`          | `boxShadow: '6px 6px 0 var(--black)'` → `boxShadow: '6px 6px 0 var(--memphis-shadow-color)'`                                                                                                                                                                                                                                                                                                                                                                        |
| `token-swatch.tsx`           | `boxShadow: '3px 3px 0 var(--black)'` → `boxShadow: '3px 3px 0 var(--memphis-shadow-color)'`. Also `border: '2px solid var(--border-memphis)'` → `border: '2px solid var(--memphis-border-color)'`. Also `background: 'var(--surface)'` → `background: 'var(--card)'`. Also `color: 'var(--ink)'` → `color: 'var(--foreground)'`. Also `color: 'var(--accent)'` → `color: 'var(--primary)'`. Also `color: 'var(--ink-muted)'` → `color: 'var(--muted-foreground)'`. |
| `section-header.tsx`         | `style={{ color: 'var(--gold-500)' }}` → `style={{ color: 'var(--primary)' }}`                                                                                                                                                                                                                                                                                                                                                                                      |
| `section-header.tsx` comment | Update comment `// doesn't expose the raw var(--gold-500) token as a text color utility.` → `// uses var(--primary) directly because the eyebrow is an explicit gold accent regardless of theme context.`                                                                                                                                                                                                                                                           |
| `memphis-shape.tsx`          | `color = 'var(--plum-500)'` → `color = 'var(--secondary)'`                                                                                                                                                                                                                                                                                                                                                                                                          |
| `memphis-shape.tsx` JSDoc    | `/** ... Default var(--plum-500). */` → `/** ... Default var(--secondary). */`                                                                                                                                                                                                                                                                                                                                                                                      |
| `memphis-shape.test.tsx`     | `expect(...).toBe('var(--plum-500)')` → `expect(...).toBe('var(--secondary)')`                                                                                                                                                                                                                                                                                                                                                                                      |
| `pattern-swatch.tsx`         | `aspect-square bg-paper-50 relative overflow-hidden` → `aspect-square bg-background relative overflow-hidden`                                                                                                                                                                                                                                                                                                                                                       |
| `pattern-swatch.test.tsx`    | `.toContain('bg-paper-50')` → `.toContain('bg-background')`                                                                                                                                                                                                                                                                                                                                                                                                         |

- [ ] **Step 1: Read color-scale.tsx to confirm it accepts raw hex props**

Read `packages/ui/src/components/color-scale/color-scale.tsx` to confirm that the CSS values it applies come from a `colors` prop passed by the consumer (not hardcoded tokens). If yes, no code change needed in the component; only the test fixture needs to stay valid. The test passes hardcoded strings like `var(--plum-300)` which are valid CSS — the tests continue to work.

If the component has hardcoded raw palette references, list them and replace them with reads from a prop.

- [ ] **Step 2: Apply all other replacements from the table**

- [ ] **Step 3: Run tests**

Run: `pnpm -C packages/ui test feature-card showcase-card color-scale type-specimen token-swatch section-header memphis-shape pattern-swatch -- --run`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/{feature-card,showcase-card,color-scale,type-specimen,token-swatch,section-header,memphis-shape,pattern-swatch}/
git commit -m "refactor(showcase): migrate showcase components to semantic token names"
```

---

### Task 16: Migrate remaining semantic-only references (dialog, alert-dialog, drawer, popover, dropdown-menu parent, context-menu parent, accordion, banner, toast, tabs, sidebar, app-top-bar, breadcrumbs, separator, page-header, scroll-area, spinner, sub-panel, label, form-field, medal, ornament, palette-switcher, article-card, skeleton, input-parent, etc.)

**Files:** All other `packages/ui/src/components/**/*.tsx` and their `.variants.ts` files that contain old semantic names (`bg-surface`, `bg-surface-2`, `text-ink`, `text-ink-soft`, `text-ink-muted`, `border-border`, `border-border-memphis`, `bg-accent`, `text-accent`, `bg-accent-strong`, `ring-ring`).

**Strategy:** This is a mechanical sweep. Each file gets the renames below.

Rename map (apply globally across all component files not yet touched):

| Old class                                      | New class                                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `bg-bg`                                        | `bg-background`                                                                               |
| `bg-surface`                                   | `bg-card`                                                                                     |
| `bg-surface-2`                                 | `bg-muted`                                                                                    |
| `text-ink`                                     | `text-foreground` (on `bg-background`) or `text-card-foreground` (on `bg-card`) — use context |
| `text-ink-soft`                                | `text-foreground/70`                                                                          |
| `text-ink-muted`                               | `text-muted-foreground`                                                                       |
| `border-border-memphis`                        | `border-memphis`                                                                              |
| `bg-accent`                                    | `bg-primary` (old accent meant gold = new primary)                                            |
| `text-accent`                                  | `text-primary`                                                                                |
| `hover:text-accent-strong`                     | `hover:text-primary/80`                                                                       |
| `bg-accent-strong`                             | `bg-primary/90`                                                                               |
| `bg-danger`                                    | `bg-destructive`                                                                              |
| `ring-ring`, `outline-ring`, `focus:ring-ring` | unchanged                                                                                     |
| `border-border`, `border-border-strong`        | unchanged                                                                                     |

**Disambiguating `text-ink` for text-on-card vs text-on-bg:**

- If the same block also sets `bg-surface` → `bg-card` / `text-card-foreground`
- If no bg set in the same block, the element inherits → use `text-foreground`

- [ ] **Step 1: Run a grep to enumerate remaining files**

Run Grep tool with pattern: `(bg|text|border|ring|fill|stroke|divide|outline)-(bg|surface|surface-2|ink|ink-soft|ink-muted|border-memphis|accent|accent-strong|danger)(\b|[^a-z-])` inside `packages/ui/src/components`, output_mode `files_with_matches`. Expect ~60 files (every component touches at least one).

- [ ] **Step 2: For each file, apply the renames**

Use Edit tool with `replace_all: true` per old/new pair. Be careful with `text-ink` — it maps to two different names depending on the surrounding bg. Do `text-ink-soft` and `text-ink-muted` FIRST (replace_all is safe because they're unambiguous), then do `text-ink` case by case.

Alternative: since `text-ink` in a paired context (next to `bg-surface`) should become `text-card-foreground`, and in a top-level page context should become `text-foreground`, you can do `replace_all: 'text-ink' → 'text-foreground'` for simplicity and accept that some places will show `text-foreground` on a card surface — this still works because `--foreground` and `--card-foreground` have the same value in both themes for the default palette. Then only fix the cases where they'd diverge (check visually).

For safer correctness: replace `bg-surface text-ink` → `bg-card text-card-foreground` as a paired string; then replace remaining `text-ink` → `text-foreground`.

- [ ] **Step 3: Update test assertions**

Similarly grep `.test.tsx` files for old class-name assertions and update.

- [ ] **Step 4: Run full test suite**

Run: `pnpm -C packages/ui test -- --run`
Expected: all tests pass.

- [ ] **Step 5: Run build**

Run: `pnpm -C packages/ui build`
Expected: builds cleanly.

- [ ] **Step 6: Visual-verify in Ladle**

Run: `pnpm -C packages/ui dev` and browse all component stories. Compare light/dark/neon/sunset combinations. Kill server after.

- [ ] **Step 7: Commit**

```bash
git add packages/ui/src/
git commit -m "refactor(components): bulk rename legacy semantic classes to new taxonomy"
```

---

## Phase 6: Playground pages (non-generator)

### Task 17: Migrate playground app pages

**Files:**

- Modify: `apps/playground/app/page.tsx`
- Modify: `apps/playground/app/design-system/page.tsx`
- Modify: `apps/playground/app/design-system/patterns.tsx`
- Modify: `apps/playground/app/layout.tsx` (if it contains inline styles with tokens)

Also:

- The `Button` variant `accent` usage needs renaming to `secondary`.
- The `Card` variant `dark` usage needs renaming to `inverse`.

- [ ] **Step 1: Grep for old semantic names + variant names in playground**

```
Grep pattern: 'bg-plum-|bg-gold-|bg-paper-|text-plum-|text-gold-|text-paper-|bg-bg\b|bg-surface\b|bg-surface-2\b|text-ink\b|text-ink-soft\b|text-ink-muted\b|border-border-memphis\b|bg-accent\b|bg-accent-strong\b|text-accent\b|bg-danger\b|variant="accent"|variant="dark"|var\\(--bg\\)|var\\(--surface\\)|var\\(--surface-2\\)|var\\(--ink\\)|var\\(--ink-muted\\)|var\\(--ink-soft\\)|var\\(--border-memphis\\)|var\\(--accent\\)|var\\(--shadow-memphis-color\\)|var\\(--plum|var\\(--gold|var\\(--paper|var\\(--black'
Scope: apps/playground/app (exclude theme-generator)
Output: files_with_matches + content preview
```

- [ ] **Step 2: Apply the same rename table as Task 16, plus variant renames**

Per file, use Edit. `variant="accent"` → `variant="secondary"`, `variant="dark"` → `variant="inverse"`.

- [ ] **Step 3: Build playground**

Run: `pnpm -C apps/playground build`
Expected: builds cleanly.

- [ ] **Step 4: Visual-verify at runtime**

Run: `pnpm -C apps/playground dev` and browse `/`, `/design-system`, `/design-system/patterns`. Confirm rendering in light + dark. Kill server after.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/app/
git commit -m "refactor(playground): migrate non-generator pages to new semantic tokens"
```

---

## Phase 7: Theme generator rewrite

### Task 18: Add contrast.ts utility for theme-generator

**Files:**

- Create: `apps/playground/app/theme-generator/contrast.ts`

- [ ] **Step 1: Create the re-export**

Create `apps/playground/app/theme-generator/contrast.ts`:

```ts
// Re-export the contrast utilities from the lib so both the generator
// UI (live badges) and the lib tests (CI) use the same implementation.
export {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  passesAA,
} from '@damo/ui/internal/contrast-utils'

export function contrastLevel(fg: string, bg: string): 'aaa' | 'aa' | 'fail' {
  // Import inline to avoid circular re-export
  const ratio = calcRatio(fg, bg)
  if (ratio >= 7.0) return 'aaa'
  if (ratio >= 4.5) return 'aa'
  return 'fail'
}

function calcRatio(fg: string, bg: string): number {
  // Keep the function pure + local to avoid importing into the UI bundle
  // at module-init time if the consumer only needs the `level` helper.
  const l1 = luminance(parse(fg))
  const l2 = luminance(parse(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function parse(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '')
  const n =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  }
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  const ch = (v: number) => {
    const n = v / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * ch(rgb.r) + 0.7152 * ch(rgb.g) + 0.0722 * ch(rgb.b)
}
```

- [ ] **Step 2: Expose `contrast-utils` from the lib for re-use**

Check if `@damo/ui/internal/contrast-utils` is a valid export path. It probably isn't — the util lives under `__tests__/`. Two options:

- (A) Move `contrast-utils.ts` out of `__tests__/` to `packages/ui/src/lib/contrast-utils.ts`, export from the lib's `internal` subpath.
- (B) Duplicate the ~20 LOC utility into the theme-generator. Simpler, acceptable given size.

Go with (A) for DRY. Modify:

1. Move `packages/ui/src/styles/__tests__/contrast-utils.ts` → `packages/ui/src/lib/contrast-utils.ts` (Bash `mv`, then Edit the import in `contrast-utils.test.ts`).
2. Update import in `packages/ui/src/styles/__tests__/contrast-utils.test.ts` to `from '../../lib/contrast-utils'`.
3. Update import in `packages/ui/src/styles/__tests__/contrast.test.ts` to `from '../../lib/contrast-utils'`.
4. Add export to `packages/ui/package.json` exports field (if `./internal` sub-entrypoint doesn't exist, add it).

Or simpler (B): duplicate the pure functions into `contrast.ts` (as in step 1 above — that's what the step 1 code already shows; the import comment at the top is aspirational). Remove the `export {} from '@damo/ui/internal/contrast-utils'` line and keep only the local implementation.

Decision: **go with (B)**. The utility is 20 LOC. Duplication is cheaper than a new package export.

Revised `contrast.ts`:

```ts
/**
 * WCAG contrast helpers for the theme-generator UI (live badges).
 * Mirrors packages/ui/src/styles/__tests__/contrast-utils.ts but lives
 * in the app to avoid cross-package export setup.
 */

function parse(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '')
  const n =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  }
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  const ch = (v: number) => {
    const n = v / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * ch(rgb.r) + 0.7152 * ch(rgb.g) + 0.0722 * ch(rgb.b)
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(parse(fg))
  const l2 = luminance(parse(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type ContrastLevel = 'aaa' | 'aa' | 'fail'

export function contrastLevel(fg: string, bg: string): ContrastLevel {
  const r = contrastRatio(fg, bg)
  if (r >= 7.0) return 'aaa'
  if (r >= 4.5) return 'aa'
  return 'fail'
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/playground/app/theme-generator/contrast.ts
git commit -m "feat(theme-generator): add WCAG contrast helpers"
```

---

### Task 19: Rewrite theme-state.ts

**Files:**

- Modify: `apps/playground/app/theme-generator/theme-state.ts`

- [ ] **Step 1: Rewrite types + DEFAULT_THEME**

Replace entire file content with:

```ts
/**
 * Theme generator — core types + canonical defaults.
 *
 * Models the three-layer architecture from
 * docs/specs/2026-04-24-theme-architecture-refactor-design.md:
 *   Layer 1 — raw palette (plum/gold/paper scales, swap per preset)
 *   Layer 2 — semantic (paired bg+fg, separate light/dark values)
 *   Layer 3 — identity (medals, charts, nav-on-dark, theme-agnostic)
 * plus typography / radius / shadow / spacing / motion scales.
 *
 * All nested objects are treated as immutable — the reducer returns new
 * copies on every update.
 */

export type TypographySizeKey = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
export type RadiusKey = 'none' | 'sm' | 'md' | 'lg' | 'pill' | 'full'
export type ShadowMemphisKey = 'sm' | 'md' | 'lg' | 'hover' | 'active'
export type ShadowSoftKey = 'sm' | 'md' | 'lg'
export type MotionDurationKey = 'snap' | 'fast' | 'base' | 'slow'
export type MotionEasingKey = 'memphis' | 'out' | 'in-out'

export type MedalRank = 'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'

export interface ShadowMemphisValue {
  x: number
  y: number
  color: string
}

// ─── Layer 1: Raw palette ────────────────────────────────────

export interface RawPalette {
  readonly plum: Readonly<Record<'100' | '300' | '500' | '700' | '800' | '900', string>>
  readonly gold: Readonly<Record<'100' | '200' | '300' | '400' | '500', string>>
  readonly paper: Readonly<Record<'50' | '100' | '200' | '300', string>>
}

// ─── Layer 2: Semantic (paired bg+fg) ────────────────────────

export interface SemanticTheme {
  // Surfaces + foregrounds
  readonly background: string
  readonly foreground: string
  readonly card: string
  readonly cardForeground: string
  readonly popover: string
  readonly popoverForeground: string
  readonly muted: string
  readonly mutedForeground: string
  // Intent + foregrounds
  readonly primary: string
  readonly primaryForeground: string
  readonly secondary: string
  readonly secondaryForeground: string
  readonly accent: string
  readonly accentForeground: string
  readonly destructive: string
  readonly destructiveForeground: string
  // Status + foregrounds
  readonly success: string
  readonly successForeground: string
  readonly warning: string
  readonly warningForeground: string
  readonly info: string
  readonly infoForeground: string
  readonly rage: string
  readonly rageForeground: string
  // Chrome primitives (no foreground)
  readonly border: string
  readonly borderStrong: string
  readonly input: string
  readonly ring: string
  // Memphis identity
  readonly memphisShadowColor: string
  readonly memphisBorderColor: string
  // Badge-specific
  readonly badgeFeatured: string
  readonly badgeFeaturedForeground: string
  readonly badgeCopper: string
  readonly badgeCopperForeground: string
  readonly badgeNavy: string
  readonly badgeNavyForeground: string
  readonly badgeDraw: string
  readonly badgeDrawForeground: string
  readonly badgeRank: string
  readonly badgeRankForeground: string
}

// ─── Layer 3: Identity (theme-agnostic) ──────────────────────

export interface MedalTokens {
  readonly outer: string
  readonly inner: string
  readonly text: string
}

export interface IdentityTheme {
  readonly medals: Readonly<Record<MedalRank, MedalTokens>>
  readonly charts: Readonly<Record<'1' | '2' | '3' | '4' | '5', string>>
  readonly navOnDark: {
    readonly accent: string
    readonly accentStrong: string
    readonly foreground: string
    readonly foregroundStrong: string
  }
  readonly appPattern: {
    readonly color1: string
    readonly color2: string
    readonly color3: string
    readonly size: number
  }
}

// ─── Full theme ──────────────────────────────────────────────

export interface Theme {
  readonly palette: RawPalette
  readonly semantic: {
    readonly light: SemanticTheme
    readonly dark: SemanticTheme
  }
  readonly identity: IdentityTheme
  readonly typography: {
    readonly fontDisplay: string
    readonly fontBody: string
    readonly fontMono: string
    readonly sizes: Readonly<Record<TypographySizeKey, number>>
  }
  readonly radius: Readonly<Record<RadiusKey, number>>
  readonly shadowMemphis: Readonly<Record<ShadowMemphisKey, ShadowMemphisValue>>
  readonly shadowSoft: Readonly<Record<ShadowSoftKey, number>>
  readonly spacing: { readonly scale: number }
  readonly motion: {
    readonly durations: Readonly<Record<MotionDurationKey, number>>
    readonly easings: Readonly<Record<MotionEasingKey, string>>
  }
}

// ─── Iteration helpers ───────────────────────────────────────

export const PALETTE_STEPS = {
  plum: ['100', '300', '500', '700', '800', '900'] as const,
  gold: ['100', '200', '300', '400', '500'] as const,
  paper: ['50', '100', '200', '300'] as const,
}

export const SEMANTIC_GROUPS = {
  surfaces: [
    { bg: 'background', fg: 'foreground', label: 'Page background' },
    { bg: 'card', fg: 'cardForeground', label: 'Card' },
    { bg: 'popover', fg: 'popoverForeground', label: 'Popover' },
    { bg: 'muted', fg: 'mutedForeground', label: 'Muted' },
  ],
  intents: [
    { bg: 'primary', fg: 'primaryForeground', label: 'Primary' },
    { bg: 'secondary', fg: 'secondaryForeground', label: 'Secondary' },
    { bg: 'accent', fg: 'accentForeground', label: 'Accent (highlight)' },
    { bg: 'destructive', fg: 'destructiveForeground', label: 'Destructive' },
  ],
  statuses: [
    { bg: 'success', fg: 'successForeground', label: 'Success' },
    { bg: 'warning', fg: 'warningForeground', label: 'Warning' },
    { bg: 'info', fg: 'infoForeground', label: 'Info' },
    { bg: 'rage', fg: 'rageForeground', label: 'Rage' },
  ],
  chrome: [
    { key: 'border', label: 'Border' },
    { key: 'borderStrong', label: 'Border (strong)' },
    { key: 'input', label: 'Input border' },
    { key: 'ring', label: 'Focus ring' },
  ],
  memphis: [
    { key: 'memphisShadowColor', label: 'Memphis shadow' },
    { key: 'memphisBorderColor', label: 'Memphis border' },
  ],
  badges: [
    { bg: 'badgeFeatured', fg: 'badgeFeaturedForeground', label: 'Badge featured' },
    { bg: 'badgeCopper', fg: 'badgeCopperForeground', label: 'Badge copper' },
    { bg: 'badgeNavy', fg: 'badgeNavyForeground', label: 'Badge navy' },
    { bg: 'badgeDraw', fg: 'badgeDrawForeground', label: 'Badge draw' },
    { bg: 'badgeRank', fg: 'badgeRankForeground', label: 'Badge rank' },
  ],
} as const

// ─── Canonical default values ────────────────────────────────

const LIGHT_SEMANTIC: SemanticTheme = {
  background: '#fbf7ee',
  foreground: '#2a0f2d',
  card: '#ffffff',
  cardForeground: '#2a0f2d',
  popover: '#ffffff',
  popoverForeground: '#2a0f2d',
  muted: '#f5efde',
  mutedForeground: '#522357',

  primary: '#c4942a',
  primaryForeground: '#ffffff',
  secondary: '#7a3980',
  secondaryForeground: '#fbf7ee',
  accent: '#f8e5bc',
  accentForeground: '#2a0f2d',
  destructive: '#a13a2c',
  destructiveForeground: '#fbf7ee',

  success: '#4f8a3c',
  successForeground: '#fbf7ee',
  warning: '#8a6326',
  warningForeground: '#fbf7ee',
  info: '#7a3980',
  infoForeground: '#fbf7ee',
  rage: '#c94a2f',
  rageForeground: '#fbf7ee',

  border: '#2a0f2d1f',
  borderStrong: '#2a0f2d38',
  input: '#2a0f2d1f',
  ring: '#c4942a',

  memphisShadowColor: '#000000',
  memphisBorderColor: '#000000',

  badgeFeatured: '#c4942a',
  badgeFeaturedForeground: '#000000',
  badgeCopper: '#c4942a',
  badgeCopperForeground: '#ffffff',
  badgeNavy: '#2a0f2d',
  badgeNavyForeground: '#f0d49a',
  badgeDraw: '#f5efde',
  badgeDrawForeground: '#2a0f2d',
  badgeRank: '#f8e5bc',
  badgeRankForeground: '#2a0f2d',
} as const

const DARK_SEMANTIC: SemanticTheme = {
  background: '#2a0f2d',
  foreground: '#fbf7ee',
  card: '#3d1a40',
  cardForeground: '#fbf7ee',
  popover: '#3d1a40',
  popoverForeground: '#fbf7ee',
  muted: '#522357',
  mutedForeground: '#b17cb5',

  primary: '#c4942a',
  primaryForeground: '#2a0f2d',
  secondary: '#7a3980',
  secondaryForeground: '#fbf7ee',
  accent: '#522357',
  accentForeground: '#f0d49a',
  destructive: '#c94a2f',
  destructiveForeground: '#fbf7ee',

  success: '#6fa85c',
  successForeground: '#2a0f2d',
  warning: '#c4942a',
  warningForeground: '#2a0f2d',
  info: '#b17cb5',
  infoForeground: '#2a0f2d',
  rage: '#e06b4f',
  rageForeground: '#2a0f2d',

  border: '#fbf7ee1f',
  borderStrong: '#fbf7ee38',
  input: '#fbf7ee1f',
  ring: '#c4942a',

  memphisShadowColor: '#fbf7ee',
  memphisBorderColor: '#fbf7ee',

  badgeFeatured: '#c4942a',
  badgeFeaturedForeground: '#2a0f2d',
  badgeCopper: '#c4942a',
  badgeCopperForeground: '#fbf7ee',
  badgeNavy: '#522357',
  badgeNavyForeground: '#f0d49a',
  badgeDraw: '#522357',
  badgeDrawForeground: '#fbf7ee',
  badgeRank: '#522357',
  badgeRankForeground: '#f0d49a',
} as const

export const DEFAULT_THEME: Theme = {
  palette: {
    plum: {
      '100': '#e0c6e2',
      '300': '#b17cb5',
      '500': '#7a3980',
      '700': '#522357',
      '800': '#3d1a40',
      '900': '#2a0f2d',
    },
    gold: {
      '100': '#f8e5bc',
      '200': '#f0d49a',
      '300': '#e5bc6d',
      '400': '#d5a845',
      '500': '#c4942a',
    },
    paper: {
      '50': '#fbf7ee',
      '100': '#f5efde',
      '200': '#ece2c6',
      '300': '#ddd0ae',
    },
  },
  semantic: { light: LIGHT_SEMANTIC, dark: DARK_SEMANTIC },
  identity: {
    medals: {
      bronze: { outer: '#5a3f20', inner: '#8a6236', text: '#ffffff' },
      silver: { outer: '#4a4a55', inner: '#8a8a9a', text: '#ffffff' },
      gold: { outer: '#2a0f2d', inner: '#c4942a', text: '#2a0f2d' },
      master: { outer: '#2a0f2d', inner: '#7a3980', text: '#fbf7ee' },
      grandmaster: { outer: '#000000', inner: '#c4942a', text: '#2a0f2d' },
    },
    charts: { '1': '#7a3980', '2': '#c4942a', '3': '#4f8a3c', '4': '#a13a2c', '5': '#522357' },
    navOnDark: {
      accent: '#f0d49a',
      accentStrong: '#d5a845',
      foreground: 'rgba(255, 255, 255, 0.72)',
      foregroundStrong: '#ffffff',
    },
    appPattern: { color1: '#c4942a', color2: '#7a3980', color3: '#522357', size: 140 },
  },
  typography: {
    fontDisplay: "'Audiowide', system-ui, sans-serif",
    fontBody: "'Exo 2', system-ui, sans-serif",
    fontMono: "'Exo 2', ui-monospace, monospace",
    sizes: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 },
  },
  radius: { none: 0, sm: 2, md: 4, lg: 8, pill: 999, full: 50 },
  shadowMemphis: {
    sm: { x: 3, y: 3, color: '#000000' },
    md: { x: 6, y: 6, color: '#000000' },
    lg: { x: 9, y: 9, color: '#000000' },
    hover: { x: 7, y: 7, color: '#000000' },
    active: { x: 2, y: 2, color: '#000000' },
  },
  shadowSoft: { sm: 0.06, md: 0.08, lg: 0.12 },
  spacing: { scale: 1 },
  motion: {
    durations: { snap: 80, fast: 150, base: 200, slow: 300 },
    easings: {
      memphis: 'cubic-bezier(0.4, 1.3, 0.5, 1)',
      out: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const

/**
 * The base spacing scale multiplier affects every `--space-N` token.
 * These are the raw (pre-scale) values in px.
 */
export const SPACING_BASE_PX: ReadonlyArray<readonly [string, number]> = [
  ['space-0', 0],
  ['space-1', 4],
  ['space-2', 8],
  ['space-3', 12],
  ['space-4', 16],
  ['space-5', 20],
  ['space-6', 24],
  ['space-8', 32],
  ['space-10', 40],
  ['space-12', 48],
  ['space-16', 64],
  ['space-20', 80],
]
```

- [ ] **Step 2: Run type check**

Run: `pnpm -C apps/playground typecheck` (if that script exists) or `pnpm -C apps/playground exec tsc --noEmit`.
Expected: many type errors in `page.tsx`, `use-theme-state.ts`, `presets.ts`, `exporters.ts` because they use the OLD flat shape. This is expected — those files get rewritten in Tasks 20–23.

DO NOT try to fix those errors here. This task only lands the new shape.

- [ ] **Step 3: Commit (with broken build — intentional, fixed over Tasks 20–23)**

```bash
git add apps/playground/app/theme-generator/theme-state.ts
git commit -m "refactor(theme-generator): rewrite Theme type for three-layer architecture

NOTE: breaks dependents (use-theme-state, presets, exporters, page.tsx) —
Tasks 20–23 in the implementation plan restore green build."
```

---

### Task 20: Rewrite presets.ts

**Files:**

- Modify: `apps/playground/app/theme-generator/presets.ts`

- [ ] **Step 1: Replace file**

```ts
/**
 * Theme presets — raw palette overrides.
 *
 * Each preset overrides ONLY the raw palette (Layer 1). Semantic mapping
 * (Layer 2) is applied uniformly via themes.css in the lib. This matches
 * the new architecture where palette and theme are orthogonal.
 */

import { DEFAULT_THEME, type Theme, type RawPalette } from './theme-state'

export type PresetName = 'default' | 'neon' | 'sunset'

export const PRESET_LABELS: Record<PresetName, string> = {
  default: 'Plum + Gold (default)',
  neon: 'Neon (magenta + lime)',
  sunset: 'Sunset (terracotta + orange)',
}

const NEON_PALETTE: RawPalette = {
  plum: {
    '100': '#f8c8e7',
    '300': '#e26dbb',
    '500': '#b01680',
    '700': '#491a40',
    '800': '#321029',
    '900': '#1f0819',
  },
  gold: {
    '100': '#e3facb',
    '200': '#ccf2a6',
    '300': '#b4ea7e',
    '400': '#9be04a',
    '500': '#7fd321',
  },
  paper: DEFAULT_THEME.palette.paper,
}

const SUNSET_PALETTE: RawPalette = {
  plum: {
    '100': '#f8d4c0',
    '300': '#dd8a6d',
    '500': '#a8402a',
    '700': '#5a2514',
    '800': '#3f170d',
    '900': '#2a0d07',
  },
  gold: {
    '100': '#ffe7cd',
    '200': '#ffd2a3',
    '300': '#ffbb75',
    '400': '#fda047',
    '500': '#f58a1e',
  },
  paper: DEFAULT_THEME.palette.paper,
}

export const PRESET_PALETTES: Record<PresetName, RawPalette> = {
  default: DEFAULT_THEME.palette,
  neon: NEON_PALETTE,
  sunset: SUNSET_PALETTE,
}

export function applyPreset(theme: Theme, preset: PresetName): Theme {
  return { ...theme, palette: PRESET_PALETTES[preset] }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/playground/app/theme-generator/presets.ts
git commit -m "refactor(theme-generator): rewrite presets as raw-palette overrides"
```

---

### Task 21: Rewrite exporters.ts + test

**Files:**

- Modify: `apps/playground/app/theme-generator/exporters.ts`
- Modify: `apps/playground/app/theme-generator/exporters.test.ts`

- [ ] **Step 1: Write the new tests first**

Replace content of `exporters.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { DEFAULT_THEME } from './theme-state'
import { buildCssExport, buildJsonExport, buildTailwindExport, buildFigmaExport } from './exporters'

describe('exporters', () => {
  describe('buildCssExport', () => {
    it('emits a :root block with raw palette and identity tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain(':root {')
      expect(css).toContain('--plum-500: #7a3980;')
      expect(css).toContain('--gold-500: #c4942a;')
      expect(css).toContain('--paper-50: #fbf7ee;')
      expect(css).toContain('--medal-bronze-outer: #5a3f20;')
      expect(css).toContain('--chart-1: #7a3980;')
    })

    it('emits :root and :root[data-theme="dark"] for semantic tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      // Light block
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--background: #fbf7ee;/s)
      expect(css).toMatch(/:root,\s*:root\[data-theme='light'\] \{[^}]*--foreground: #2a0f2d;/s)
      // Dark block
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--background: #2a0f2d;/s)
      expect(css).toMatch(/:root\[data-theme='dark'\] \{[^}]*--foreground: #fbf7ee;/s)
    })

    it('emits paired badge tokens', () => {
      const css = buildCssExport(DEFAULT_THEME)
      expect(css).toContain('--badge-navy: #2a0f2d;')
      expect(css).toContain('--badge-navy-foreground: #f0d49a;')
    })
  })

  describe('buildJsonExport', () => {
    it('produces a nested object matching the three-layer shape', () => {
      const json = JSON.parse(buildJsonExport(DEFAULT_THEME))
      expect(json.palette.plum['500']).toBe('#7a3980')
      expect(json.semantic.light.background).toBe('#fbf7ee')
      expect(json.semantic.dark.background).toBe('#2a0f2d')
      expect(json.identity.medals.gold.inner).toBe('#c4942a')
    })
  })

  describe('buildTailwindExport', () => {
    it('emits @theme inline with --color-* bridges for semantic tokens', () => {
      const tw = buildTailwindExport(DEFAULT_THEME)
      expect(tw).toContain('@theme inline')
      expect(tw).toContain('--color-background: var(--background);')
      expect(tw).toContain('--color-primary: var(--primary);')
      expect(tw).toContain('--color-primary-foreground: var(--primary-foreground);')
    })

    it('does NOT emit raw palette as tailwind utilities', () => {
      const tw = buildTailwindExport(DEFAULT_THEME)
      expect(tw).not.toMatch(/--color-plum-\d+:/)
      expect(tw).not.toMatch(/--color-gold-\d+:/)
    })
  })

  describe('buildFigmaExport', () => {
    it('produces Tokens Studio format with separate light and dark sets', () => {
      const fig = JSON.parse(buildFigmaExport(DEFAULT_THEME))
      expect(fig.light).toBeDefined()
      expect(fig.dark).toBeDefined()
      expect(fig.light.colors.background.value).toBe('#fbf7ee')
      expect(fig.dark.colors.background.value).toBe('#2a0f2d')
    })
  })
})
```

- [ ] **Step 2: Run tests, verify fail**

Run: `pnpm -C apps/playground test exporters -- --run`
Expected: FAIL — the exporters.ts still uses the old shape.

- [ ] **Step 3: Rewrite exporters.ts**

Replace file content:

```ts
/**
 * Theme exporters — pure functions that serialise a `Theme` into one of
 * the four download formats surfaced in the UI.
 *
 * All functions are side-effect free (no DOM access, no I/O).
 */

import {
  type Theme,
  type SemanticTheme,
  type RawPalette,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  type MedalRank,
  SPACING_BASE_PX,
} from './theme-state'

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_KEYS: ReadonlyArray<MotionEasingKey> = ['memphis', 'out', 'in-out']
const MEDAL_RANKS: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']

const CHART_KEYS = ['1', '2', '3', '4', '5'] as const

const shadowMemphisToCss = (s: { x: number; y: number; color: string }): string =>
  `${s.x}px ${s.y}px 0 ${s.color}`

const radiusToCss = (k: RadiusKey, v: number): string => {
  if (k === 'pill') return '999px'
  if (k === 'full') return '50%'
  if (v === 0) return '0'
  return `${v}px`
}

const sizeKey = (k: TypographySizeKey): string => (k === 'base' ? '--text-base' : `--text-${k}`)
const radiusKey = (k: RadiusKey): string => `--radius-${k}`
const shadowMemphisKey = (k: ShadowMemphisKey): string =>
  k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
const shadowSoftKey = (k: 'sm' | 'md' | 'lg'): string => `--shadow-${k}`
const durationKey = (k: MotionDurationKey): string => `--duration-${k}`
const easingKey = (k: MotionEasingKey): string => `--ease-${k}`

// Convert a camelCase semantic key to CSS kebab: cardForeground → card-foreground
const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

function emitRawPalette(palette: RawPalette, lines: string[]): void {
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    lines.push(`  --plum-${step}: ${palette.plum[step]};`)
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    lines.push(`  --gold-${step}: ${palette.gold[step]};`)
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    lines.push(`  --paper-${step}: ${palette.paper[step]};`)
  }
  lines.push(`  --white: #ffffff;`)
  lines.push(`  --black: #000000;`)
}

function emitSemantic(semantic: SemanticTheme, lines: string[]): void {
  for (const key of Object.keys(semantic) as ReadonlyArray<keyof SemanticTheme>) {
    lines.push(`  --${toKebab(key as string)}: ${semantic[key]};`)
  }
}

/**
 * Emit a `:root` block with raw palette + identity + scales, plus
 * `:root[data-theme='light']` and `:root[data-theme='dark']` blocks for
 * the semantic layer.
 */
export function buildCssExport(theme: Theme): string {
  const lines: string[] = []

  // ─── :root (raw palette + identity + scales) ───
  lines.push(':root {')
  emitRawPalette(theme.palette, lines)
  lines.push('')
  lines.push('  /* Identity — theme-agnostic */')
  MEDAL_RANKS.forEach((rank) => {
    lines.push(`  --medal-${rank}-outer: ${theme.identity.medals[rank].outer};`)
    lines.push(`  --medal-${rank}-inner: ${theme.identity.medals[rank].inner};`)
    lines.push(`  --medal-${rank}-text: ${theme.identity.medals[rank].text};`)
  })
  CHART_KEYS.forEach((k) => {
    lines.push(`  --chart-${k}: ${theme.identity.charts[k]};`)
  })
  lines.push(`  --nav-on-dark-accent: ${theme.identity.navOnDark.accent};`)
  lines.push(`  --nav-on-dark-accent-strong: ${theme.identity.navOnDark.accentStrong};`)
  lines.push(`  --nav-on-dark-foreground: ${theme.identity.navOnDark.foreground};`)
  lines.push(`  --nav-on-dark-foreground-strong: ${theme.identity.navOnDark.foregroundStrong};`)
  lines.push(`  --app-pattern-color-1: ${theme.identity.appPattern.color1};`)
  lines.push(`  --app-pattern-color-2: ${theme.identity.appPattern.color2};`)
  lines.push(`  --app-pattern-color-3: ${theme.identity.appPattern.color3};`)
  lines.push(`  --app-pattern-size: ${theme.identity.appPattern.size}px;`)
  lines.push('')

  // Typography
  lines.push(`  --font-display: ${theme.typography.fontDisplay};`)
  lines.push(`  --font-body: ${theme.typography.fontBody};`)
  lines.push(`  --font-mono: ${theme.typography.fontMono};`)
  SIZE_KEYS.forEach((k) => {
    lines.push(`  ${sizeKey(k)}: ${theme.typography.sizes[k]}px;`)
  })

  // Radius
  RADIUS_KEYS.forEach((k) => {
    lines.push(`  ${radiusKey(k)}: ${radiusToCss(k, theme.radius[k])};`)
  })

  // Shadow — memphis
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    lines.push(`  ${shadowMemphisKey(k)}: ${shadowMemphisToCss(theme.shadowMemphis[k])};`)
  })

  // Shadow — soft
  lines.push(`  --shadow-sm: 0 1px 2px rgba(0,0,0,${theme.shadowSoft.sm});`)
  lines.push(`  --shadow-md: 0 2px 8px rgba(0,0,0,${theme.shadowSoft.md});`)
  lines.push(`  --shadow-lg: 0 8px 24px rgba(0,0,0,${theme.shadowSoft.lg});`)

  // Spacing
  SPACING_BASE_PX.forEach(([k, px]) => {
    lines.push(`  --${k}: ${px * theme.spacing.scale}px;`)
  })

  // Motion
  DURATION_KEYS.forEach((k) => {
    lines.push(`  ${durationKey(k)}: ${theme.motion.durations[k]}ms;`)
  })
  EASING_KEYS.forEach((k) => {
    lines.push(`  ${easingKey(k)}: ${theme.motion.easings[k]};`)
  })
  lines.push('}')
  lines.push('')

  // ─── :root[data-theme='light'] — semantic layer ───
  lines.push(':root,')
  lines.push(":root[data-theme='light'] {")
  emitSemantic(theme.semantic.light, lines)
  lines.push('}')
  lines.push('')

  // ─── :root[data-theme='dark'] — semantic layer ───
  lines.push(":root[data-theme='dark'] {")
  emitSemantic(theme.semantic.dark, lines)
  lines.push('}')

  return lines.join('\n')
}

/**
 * JSON export — flat nested structure matching the Theme type.
 */
export function buildJsonExport(theme: Theme): string {
  return JSON.stringify(theme, null, 2)
}

/**
 * Tailwind export — emits the `@theme inline` block with --color-*
 * bridges for semantic tokens only (matches theme.css in the lib).
 */
export function buildTailwindExport(theme: Theme): string {
  const lines: string[] = ["@import 'tailwindcss';", '', '@theme inline {']

  const semanticKeys = Object.keys(theme.semantic.light) as ReadonlyArray<keyof SemanticTheme>
  semanticKeys.forEach((k) => {
    const cssName = toKebab(k as string)
    lines.push(`  --color-${cssName}: var(--${cssName});`)
  })

  // Charts (also exposed as utilities)
  CHART_KEYS.forEach((k) => {
    lines.push(`  --color-chart-${k}: var(--chart-${k});`)
  })

  // Memphis aliases for the Tailwind class shortcuts
  lines.push(`  --color-memphis: var(--memphis-border-color);`)
  lines.push(`  --color-memphis-shadow: var(--memphis-shadow-color);`)

  // Typography, radius, shadow, spacing, motion, z-index — same as theme.css
  lines.push(`  --font-display: var(--font-display);`)
  lines.push(`  --font-body: var(--font-body);`)
  lines.push(`  --font-mono: var(--font-mono);`)

  RADIUS_KEYS.forEach((k) => {
    lines.push(`  ${radiusKey(k)}: var(${radiusKey(k)});`)
  })
  SHADOW_MEMPHIS_KEYS.forEach((k) => {
    lines.push(`  ${shadowMemphisKey(k)}: var(${shadowMemphisKey(k)});`)
  })
  lines.push(`  --shadow-sm: var(--shadow-sm);`)
  lines.push(`  --shadow-md: var(--shadow-md);`)
  lines.push(`  --shadow-lg: var(--shadow-lg);`)
  DURATION_KEYS.forEach((k) => {
    lines.push(`  --animate-duration-${k}: var(--duration-${k});`)
  })
  lines.push(`  --ease-memphis: var(--ease-memphis);`)
  lines.push(`  --ease-out-memphis: var(--ease-out);`)

  lines.push('}')
  return lines.join('\n')
}

/**
 * Figma Tokens Studio export — light and dark token sets.
 */
export function buildFigmaExport(theme: Theme): string {
  const toTokens = (semantic: SemanticTheme) => {
    const colors: Record<string, { value: string; type: 'color' }> = {}
    for (const k of Object.keys(semantic) as ReadonlyArray<keyof SemanticTheme>) {
      colors[toKebab(k as string)] = { value: semantic[k], type: 'color' }
    }
    return { colors }
  }

  return JSON.stringify(
    {
      light: toTokens(theme.semantic.light),
      dark: toTokens(theme.semantic.dark),
    },
    null,
    2,
  )
}
```

- [ ] **Step 4: Run tests**

Run: `pnpm -C apps/playground test exporters -- --run`
Expected: all 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/app/theme-generator/exporters.ts apps/playground/app/theme-generator/exporters.test.ts
git commit -m "refactor(theme-generator): rewrite exporters for three-layer shape"
```

---

### Task 22: Update use-theme-state.ts reducer

**Files:**

- Modify: `apps/playground/app/theme-generator/use-theme-state.ts`

- [ ] **Step 1: Read existing file**

Read `apps/playground/app/theme-generator/use-theme-state.ts`. It likely has actions like `SET_COLOR`, `SET_PRESET`, etc. tied to the flat `colors` record. These need to be reshaped to operate on `palette`, `semantic.light`, `semantic.dark`, or `identity`.

- [ ] **Step 2: Rewrite the reducer + applyThemeToRoot**

Replace file content with:

```ts
'use client'

import { useCallback, useReducer, useEffect, useState } from 'react'
import {
  DEFAULT_THEME,
  type Theme,
  type SemanticTheme,
  type RawPalette,
  type MedalRank,
  type TypographySizeKey,
  type RadiusKey,
  type ShadowMemphisKey,
  type MotionDurationKey,
  type MotionEasingKey,
  SPACING_BASE_PX,
} from './theme-state'
import { PRESET_PALETTES, type PresetName, applyPreset } from './presets'

type Action =
  | { type: 'SET_PRESET'; preset: PresetName }
  | { type: 'SET_PALETTE_STEP'; group: 'plum' | 'gold' | 'paper'; step: string; value: string }
  | { type: 'SET_SEMANTIC'; mode: 'light' | 'dark'; key: keyof SemanticTheme; value: string }
  | { type: 'SET_MEDAL'; rank: MedalRank; slot: 'outer' | 'inner' | 'text'; value: string }
  | { type: 'SET_CHART'; index: '1' | '2' | '3' | '4' | '5'; value: string }
  | {
      type: 'SET_NAV_ON_DARK'
      key: 'accent' | 'accentStrong' | 'foreground' | 'foregroundStrong'
      value: string
    }
  | { type: 'SET_TYPOGRAPHY_FONT'; slot: 'display' | 'body' | 'mono'; value: string }
  | { type: 'SET_TYPOGRAPHY_SIZE'; key: TypographySizeKey; value: number }
  | { type: 'SET_RADIUS'; key: RadiusKey; value: number }
  | {
      type: 'SET_SHADOW_MEMPHIS'
      key: ShadowMemphisKey
      slot: 'x' | 'y' | 'color'
      value: number | string
    }
  | { type: 'SET_SHADOW_SOFT'; key: 'sm' | 'md' | 'lg'; value: number }
  | { type: 'SET_SPACING_SCALE'; value: number }
  | { type: 'SET_DURATION'; key: MotionDurationKey; value: number }
  | { type: 'SET_EASING'; key: MotionEasingKey; value: string }
  | { type: 'RESET' }

function reducer(state: Theme, action: Action): Theme {
  switch (action.type) {
    case 'SET_PRESET':
      return applyPreset(state, action.preset)

    case 'SET_PALETTE_STEP': {
      const group = state.palette[action.group] as Readonly<Record<string, string>>
      return {
        ...state,
        palette: {
          ...state.palette,
          [action.group]: { ...group, [action.step]: action.value },
        } as RawPalette,
      }
    }

    case 'SET_SEMANTIC':
      return {
        ...state,
        semantic: {
          ...state.semantic,
          [action.mode]: { ...state.semantic[action.mode], [action.key]: action.value },
        },
      }

    case 'SET_MEDAL':
      return {
        ...state,
        identity: {
          ...state.identity,
          medals: {
            ...state.identity.medals,
            [action.rank]: { ...state.identity.medals[action.rank], [action.slot]: action.value },
          },
        },
      }

    case 'SET_CHART':
      return {
        ...state,
        identity: {
          ...state.identity,
          charts: { ...state.identity.charts, [action.index]: action.value },
        },
      }

    case 'SET_NAV_ON_DARK':
      return {
        ...state,
        identity: {
          ...state.identity,
          navOnDark: { ...state.identity.navOnDark, [action.key]: action.value },
        },
      }

    case 'SET_TYPOGRAPHY_FONT':
      return {
        ...state,
        typography: {
          ...state.typography,
          [action.slot === 'display'
            ? 'fontDisplay'
            : action.slot === 'body'
              ? 'fontBody'
              : 'fontMono']: action.value,
        },
      }

    case 'SET_TYPOGRAPHY_SIZE':
      return {
        ...state,
        typography: {
          ...state.typography,
          sizes: { ...state.typography.sizes, [action.key]: action.value },
        },
      }

    case 'SET_RADIUS':
      return { ...state, radius: { ...state.radius, [action.key]: action.value } }

    case 'SET_SHADOW_MEMPHIS':
      return {
        ...state,
        shadowMemphis: {
          ...state.shadowMemphis,
          [action.key]: { ...state.shadowMemphis[action.key], [action.slot]: action.value },
        },
      }

    case 'SET_SHADOW_SOFT':
      return {
        ...state,
        shadowSoft: { ...state.shadowSoft, [action.key]: action.value },
      }

    case 'SET_SPACING_SCALE':
      return { ...state, spacing: { scale: action.value } }

    case 'SET_DURATION':
      return {
        ...state,
        motion: {
          ...state.motion,
          durations: { ...state.motion.durations, [action.key]: action.value },
        },
      }

    case 'SET_EASING':
      return {
        ...state,
        motion: {
          ...state.motion,
          easings: { ...state.motion.easings, [action.key]: action.value },
        },
      }

    case 'RESET':
      return DEFAULT_THEME

    default:
      return state
  }
}

/**
 * Write theme values to :root and :root[data-theme='dark'] so the live
 * preview updates. Uses the passed `previewMode` to decide which
 * semantic set is active on :root (so changing the preview toggle flips
 * the visible styling without waiting for a re-render cycle).
 */
function applyThemeToRoot(theme: Theme, previewMode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  const setVar = (name: string, value: string | number): void => {
    root.style.setProperty(name, String(value))
  }
  const toKebab = (s: string): string => s.replace(/([A-Z])/g, '-$1').toLowerCase()

  // Layer 1 — raw palette
  for (const step of ['100', '300', '500', '700', '800', '900'] as const) {
    setVar(`--plum-${step}`, theme.palette.plum[step])
  }
  for (const step of ['100', '200', '300', '400', '500'] as const) {
    setVar(`--gold-${step}`, theme.palette.gold[step])
  }
  for (const step of ['50', '100', '200', '300'] as const) {
    setVar(`--paper-${step}`, theme.palette.paper[step])
  }

  // Layer 2 — semantic (apply the preview mode)
  const active = previewMode === 'dark' ? theme.semantic.dark : theme.semantic.light
  Object.entries(active).forEach(([k, v]) => {
    setVar(`--${toKebab(k)}`, v as string)
  })

  // Layer 3 — identity (theme-agnostic)
  const ranks: ReadonlyArray<MedalRank> = ['bronze', 'silver', 'gold', 'master', 'grandmaster']
  ranks.forEach((rank) => {
    setVar(`--medal-${rank}-outer`, theme.identity.medals[rank].outer)
    setVar(`--medal-${rank}-inner`, theme.identity.medals[rank].inner)
    setVar(`--medal-${rank}-text`, theme.identity.medals[rank].text)
  })
  ;(['1', '2', '3', '4', '5'] as const).forEach((k) => {
    setVar(`--chart-${k}`, theme.identity.charts[k])
  })
  setVar(`--nav-on-dark-accent`, theme.identity.navOnDark.accent)
  setVar(`--nav-on-dark-accent-strong`, theme.identity.navOnDark.accentStrong)
  setVar(`--nav-on-dark-foreground`, theme.identity.navOnDark.foreground)
  setVar(`--nav-on-dark-foreground-strong`, theme.identity.navOnDark.foregroundStrong)

  // Typography, radius, shadow, spacing, motion — same as before but
  // referencing the new shape
  setVar('--font-display', theme.typography.fontDisplay)
  setVar('--font-body', theme.typography.fontBody)
  setVar('--font-mono', theme.typography.fontMono)
  ;(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const).forEach((k) => {
    setVar(k === 'base' ? '--text-base' : `--text-${k}`, `${theme.typography.sizes[k]}px`)
  })
  ;(['none', 'sm', 'md', 'lg', 'pill', 'full'] as const).forEach((k) => {
    const v = theme.radius[k]
    const css = k === 'pill' ? '999px' : k === 'full' ? '50%' : v === 0 ? '0' : `${v}px`
    setVar(`--radius-${k}`, css)
  })
  ;(['sm', 'md', 'lg', 'hover', 'active'] as const).forEach((k) => {
    const s = theme.shadowMemphis[k]
    const cssName = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
    setVar(cssName, `${s.x}px ${s.y}px 0 ${s.color}`)
  })
  SPACING_BASE_PX.forEach(([k, px]) => {
    setVar(`--${k}`, `${px * theme.spacing.scale}px`)
  })
  ;(['snap', 'fast', 'base', 'slow'] as const).forEach((k) => {
    setVar(`--duration-${k}`, `${theme.motion.durations[k]}ms`)
  })
  ;(['memphis', 'out', 'in-out'] as const).forEach((k) => {
    setVar(`--ease-${k}`, theme.motion.easings[k])
  })
}

export function useThemeState() {
  const [theme, dispatch] = useReducer(reducer, DEFAULT_THEME)

  // The generator previews light or dark independently of the rest of the app.
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')

  const applyLive = useCallback(() => {
    applyThemeToRoot(theme, previewMode)
  }, [theme, previewMode])

  useEffect(() => {
    applyLive()
  }, [applyLive])

  return { theme, dispatch, previewMode, setPreviewMode }
}
```

- [ ] **Step 2: Run type check**

Run: `pnpm -C apps/playground exec tsc --noEmit`
Expected: page.tsx still has errors (handled in Task 23). No errors in theme-state.ts / use-theme-state.ts / presets.ts / exporters.ts.

- [ ] **Step 3: Commit**

```bash
git add apps/playground/app/theme-generator/use-theme-state.ts
git commit -m "refactor(theme-generator): reshape reducer + applyThemeToRoot for new layers"
```

---

### Task 23: Rewrite page.tsx

**Files:**

- Modify: `apps/playground/app/theme-generator/page.tsx`

This is the largest single file change. Implementation is extensive; break into steps.

- [ ] **Step 1: Plan the new UI sections**

Per spec §8.3, the new page has:

- Left sidebar: Tabs = { Palette, Theme, Identity }
- Right main pane: sub-tabs = { Preview, Export }
- "Edit mode" toggle (inside Theme tab): Light / Dark
- "Preview mode" toggle (above preview pane): Light / Dark

- [ ] **Step 2: Scaffold the new page file**

Replace content:

```tsx
'use client'

/**
 * /theme-generator — three-layer token editor.
 *
 * See docs/specs/2026-04-24-theme-architecture-refactor-design.md §8.
 */

import { useState, type CSSProperties } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ColorPicker,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarSubtitle,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@damo/ui'
import {
  AuthPreview,
  DashboardPreview,
  FeedPreview,
  GalleryPreview,
  ProfilePreview,
} from '@damo/ui/mocks'

import { useThemeState } from './use-theme-state'
import { PRESET_LABELS, type PresetName } from './presets'
import {
  SEMANTIC_GROUPS,
  PALETTE_STEPS,
  type TypographySizeKey,
  type RadiusKey,
  type SemanticTheme,
} from './theme-state'
import { contrastLevel, contrastRatio } from './contrast'
import { buildCssExport, buildFigmaExport, buildJsonExport, buildTailwindExport } from './exporters'

// ═══════════════════════════════════════════════════════════
// Layout (inline styles — layout only)
// ═══════════════════════════════════════════════════════════

const pageStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  minHeight: '100vh',
  background: 'var(--background)',
  color: 'var(--foreground)',
}
const mainStyle: CSSProperties = { padding: '32px 48px 64px', minWidth: 0 }
const stackStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }
const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 }
const pairedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 72px',
  gap: 8,
  alignItems: 'center',
}
const preBoxStyle: CSSProperties = {
  maxHeight: 360,
  overflow: 'auto',
  padding: 16,
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  background: 'var(--muted)',
  border: '2px solid var(--memphis-border-color)',
}
const previewHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
}

// ═══════════════════════════════════════════════════════════

type SceneTab = 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
type ExportTab = 'css' | 'tailwind' | 'json' | 'figma'
type EditorTab = 'palette' | 'theme' | 'identity'
type EditMode = 'light' | 'dark'

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']

// ─── Contrast badge used next to every paired semantic row ──

function ContrastBadge({ fg, bg }: { fg: string; bg: string }) {
  const level = contrastLevel(fg, bg)
  const ratio = contrastRatio(fg, bg).toFixed(1)
  const colorForLevel: Record<typeof level, string> = {
    aaa: 'var(--success)',
    aa: 'var(--warning)',
    fail: 'var(--destructive)',
  }
  return (
    <span
      aria-label={`Contrast ${ratio}:1 (${level.toUpperCase()})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        padding: '2px 6px',
        color: '#fff',
        background: colorForLevel[level],
        textTransform: 'uppercase',
        minWidth: 56,
        textAlign: 'center',
      }}
    >
      {level} {ratio}
    </span>
  )
}

// ─── Main page ─────────────────────────────────────────────

export default function ThemeGeneratorPage() {
  const { theme, dispatch, previewMode, setPreviewMode } = useThemeState()

  const [editorTab, setEditorTab] = useState<EditorTab>('theme')
  const [editMode, setEditMode] = useState<EditMode>('light')
  const [sceneTab, setSceneTab] = useState<SceneTab>('gallery')
  const [exportTab, setExportTab] = useState<ExportTab>('css')
  const [previewPaneTab, setPreviewPaneTab] = useState<'preview' | 'export'>('preview')

  const semantic = theme.semantic[editMode]

  return (
    <div style={pageStyle}>
      <Sidebar>
        <SidebarHeader>
          <SidebarBrand>Theme Generator</SidebarBrand>
          <SidebarSubtitle>Edit palette, theme and identity tokens</SidebarSubtitle>
        </SidebarHeader>
        <SidebarBody>
          <div style={stackStyle}>
            <Label>Preset</Label>
            <Select
              value={/* detect preset based on palette values */ 'default'}
              onValueChange={(v) => dispatch({ type: 'SET_PRESET', preset: v as PresetName })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRESET_LABELS) as ReadonlyArray<PresetName>).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRESET_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as EditorTab)}>
            <TabsList>
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
            </TabsList>

            <TabsContent value="palette">
              <PaletteEditor theme={theme} dispatch={dispatch} />
            </TabsContent>

            <TabsContent value="theme">
              <div style={{ ...rowStyle, marginBottom: 12 }}>
                <Label>Editing:</Label>
                <Button
                  variant={editMode === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('light')}
                >
                  Light
                </Button>
                <Button
                  variant={editMode === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('dark')}
                >
                  Dark
                </Button>
              </div>
              <ThemeEditor
                semantic={semantic}
                onChange={(key, value) =>
                  dispatch({ type: 'SET_SEMANTIC', mode: editMode, key, value })
                }
              />
            </TabsContent>

            <TabsContent value="identity">
              <IdentityEditor theme={theme} dispatch={dispatch} />
            </TabsContent>
          </Tabs>
        </SidebarBody>
        <SidebarFooter>
          <Button variant="outline" onClick={() => dispatch({ type: 'RESET' })}>
            Reset
          </Button>
        </SidebarFooter>
      </Sidebar>

      <main style={mainStyle}>
        <Tabs
          value={previewPaneTab}
          onValueChange={(v) => setPreviewPaneTab(v as 'preview' | 'export')}
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div style={previewHeaderStyle}>
              <Tabs value={sceneTab} onValueChange={(v) => setSceneTab(v as SceneTab)}>
                <TabsList>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                </TabsList>
              </Tabs>
              <div style={rowStyle}>
                <Label>Preview mode:</Label>
                <Button
                  variant={previewMode === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('light')}
                >
                  Light
                </Button>
                <Button
                  variant={previewMode === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('dark')}
                >
                  Dark
                </Button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              {sceneTab === 'gallery' && <GalleryPreview />}
              {sceneTab === 'auth' && <AuthPreview />}
              {sceneTab === 'dashboard' && <DashboardPreview />}
              {sceneTab === 'profile' && <ProfilePreview />}
              {sceneTab === 'feed' && <FeedPreview />}
            </div>
          </TabsContent>

          <TabsContent value="export">
            <Tabs value={exportTab} onValueChange={(v) => setExportTab(v as ExportTab)}>
              <TabsList>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
                <TabsTrigger value="figma">Figma</TabsTrigger>
              </TabsList>
              <TabsContent value="css">
                <pre style={preBoxStyle}>{buildCssExport(theme)}</pre>
              </TabsContent>
              <TabsContent value="tailwind">
                <pre style={preBoxStyle}>{buildTailwindExport(theme)}</pre>
              </TabsContent>
              <TabsContent value="json">
                <pre style={preBoxStyle}>{buildJsonExport(theme)}</pre>
              </TabsContent>
              <TabsContent value="figma">
                <pre style={preBoxStyle}>{buildFigmaExport(theme)}</pre>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────

function PaletteEditor({
  theme,
  dispatch,
}: {
  theme: ReturnType<typeof useThemeState>['theme']
  dispatch: ReturnType<typeof useThemeState>['dispatch']
}) {
  return (
    <Accordion type="multiple" defaultValue={['plum', 'gold', 'paper']}>
      {(['plum', 'gold', 'paper'] as const).map((group) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger>
            {group} ({PALETTE_STEPS[group].length} steps)
          </AccordionTrigger>
          <AccordionContent>
            <div style={stackStyle}>
              {PALETTE_STEPS[group].map((step) => (
                <div key={step} style={rowStyle}>
                  <Label style={{ minWidth: 80 }}>
                    {group}-{step}
                  </Label>
                  <ColorPicker
                    value={theme.palette[group][step as keyof (typeof theme.palette)[typeof group]]}
                    onChange={(value) => dispatch({ type: 'SET_PALETTE_STEP', group, step, value })}
                  />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function ThemeEditor({
  semantic,
  onChange,
}: {
  semantic: SemanticTheme
  onChange: (key: keyof SemanticTheme, value: string) => void
}) {
  return (
    <Accordion type="multiple" defaultValue={['surfaces', 'intents', 'statuses']}>
      {(Object.keys(SEMANTIC_GROUPS) as ReadonlyArray<keyof typeof SEMANTIC_GROUPS>).map(
        (groupKey) => (
          <AccordionItem key={groupKey} value={groupKey}>
            <AccordionTrigger style={{ textTransform: 'capitalize' }}>{groupKey}</AccordionTrigger>
            <AccordionContent>
              <div style={stackStyle}>
                {SEMANTIC_GROUPS[groupKey].map((entry) => {
                  // Paired entries have both bg and fg
                  if ('bg' in entry && 'fg' in entry) {
                    const bg = semantic[entry.bg as keyof SemanticTheme]
                    const fg = semantic[entry.fg as keyof SemanticTheme]
                    return (
                      <div key={entry.label}>
                        <Label>{entry.label}</Label>
                        <div style={pairedRowStyle}>
                          <ColorPicker
                            value={bg}
                            onChange={(v) => onChange(entry.bg as keyof SemanticTheme, v)}
                          />
                          <ColorPicker
                            value={fg}
                            onChange={(v) => onChange(entry.fg as keyof SemanticTheme, v)}
                          />
                          <ContrastBadge fg={fg} bg={bg} />
                        </div>
                      </div>
                    )
                  }
                  // Chrome primitives — single color, no pair
                  const value = semantic[entry.key as keyof SemanticTheme]
                  return (
                    <div key={entry.label} style={rowStyle}>
                      <Label style={{ minWidth: 140 }}>{entry.label}</Label>
                      <ColorPicker
                        value={value}
                        onChange={(v) => onChange(entry.key as keyof SemanticTheme, v)}
                      />
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ),
      )}
    </Accordion>
  )
}

function IdentityEditor({
  theme,
  dispatch,
}: {
  theme: ReturnType<typeof useThemeState>['theme']
  dispatch: ReturnType<typeof useThemeState>['dispatch']
}) {
  return (
    <Accordion type="multiple" defaultValue={['medals']}>
      <AccordionItem value="medals">
        <AccordionTrigger>Medals</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).map((rank) => (
              <div key={rank}>
                <Label style={{ textTransform: 'capitalize' }}>{rank}</Label>
                {(['outer', 'inner', 'text'] as const).map((slot) => (
                  <div key={slot} style={rowStyle}>
                    <Label style={{ minWidth: 60 }}>{slot}</Label>
                    <ColorPicker
                      value={theme.identity.medals[rank][slot]}
                      onChange={(v) => dispatch({ type: 'SET_MEDAL', rank, slot, value: v })}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="charts">
        <AccordionTrigger>Charts</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['1', '2', '3', '4', '5'] as const).map((index) => (
              <div key={index} style={rowStyle}>
                <Label style={{ minWidth: 80 }}>Chart {index}</Label>
                <ColorPicker
                  value={theme.identity.charts[index]}
                  onChange={(v) => dispatch({ type: 'SET_CHART', index, value: v })}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="nav-on-dark">
        <AccordionTrigger>Nav on dark</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['accent', 'accentStrong', 'foreground', 'foregroundStrong'] as const).map((key) => (
              <div key={key} style={rowStyle}>
                <Label style={{ minWidth: 160 }}>{key}</Label>
                <ColorPicker
                  value={theme.identity.navOnDark[key]}
                  onChange={(v) => dispatch({ type: 'SET_NAV_ON_DARK', key, value: v })}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Typography, Radius, Shadows, Spacing, Motion — same as before but under this tab */}
      {/* (abbreviated here; full implementation carries over the existing controls) */}
    </Accordion>
  )
}
```

Note: The Identity editor abbreviates the typography/radius/shadow/spacing/motion sections. During implementation, port those controls from the current page.tsx — they already exist and only need to be relocated into `IdentityEditor`.

- [ ] **Step 3: Build + type check**

Run: `pnpm -C apps/playground exec tsc --noEmit`
Expected: no errors.

Run: `pnpm -C apps/playground build`
Expected: builds cleanly.

- [ ] **Step 4: Runtime smoke**

Run: `pnpm -C apps/playground dev` and open `/theme-generator`. Check:

1. Sidebar Tabs switch between Palette / Theme / Identity
2. Theme tab shows paired bg+fg pickers with contrast badges
3. Edit mode toggle (Light/Dark) swaps which semantic values are edited
4. Preview pane shows scenes correctly
5. Preview mode toggle (Light/Dark) flips preview independently
6. Export panes show well-formed CSS / Tailwind / JSON / Figma outputs

Kill server after.

- [ ] **Step 5: Commit**

```bash
git add apps/playground/app/theme-generator/page.tsx
git commit -m "feat(theme-generator): rebuild page UI for three-layer architecture"
```

---

## Phase 8: Cleanup

### Task 24: Remove legacy semantic tokens from themes.css + Tailwind bridge

**Files:**

- Modify: `packages/ui/src/styles/themes.css`
- Modify: `packages/ui/src/styles/theme.css`
- Modify: `packages/ui/src/styles/patterns.css`
- Modify: `packages/ui/src/styles/globals.css`

**Strategy:** Delete the old `--bg`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`, `--ink-muted`, `--accent`, `--accent-strong`, `--danger`, `--shadow-memphis-color` (the old name), `--border-memphis` (old name) declarations. Rename `--accent-new` → `--accent`. Remove raw palette exposure from theme.css (`--color-plum-*`, `--color-gold-*`, `--color-paper-*`).

- [ ] **Step 1: Grep for any remaining usage of deprecated tokens**

Run Grep tool with pattern: `(bg-bg|bg-surface\b|bg-surface-2|text-ink\b|text-ink-soft|text-ink-muted|border-border-memphis|bg-accent\b|text-accent\b|bg-accent-strong|bg-danger\b|var\\(--bg\\)|var\\(--surface\\)|var\\(--surface-2\\)|var\\(--ink\\)|var\\(--ink-muted\\)|var\\(--ink-soft\\)|var\\(--accent\\)|var\\(--accent-strong\\)|var\\(--danger\\)|var\\(--border-memphis\\)|var\\(--shadow-memphis-color\\))` across `packages/ui/src` and `apps/playground/app`.

Expected: zero matches. If there are matches, go back to the relevant earlier task and fix.

- [ ] **Step 2: Delete old tokens from tokens.css**

In `packages/ui/src/styles/tokens.css`, remove these lines:

- `--bg: var(--paper-50);`
- `--surface: var(--white);`
- `--surface-2: var(--paper-100);`
- `--ink: var(--plum-900);`
- `--ink-soft: var(--plum-700);`
- `--ink-muted: var(--plum-300);`
- `--border-memphis: var(--black);`
- `--accent: var(--gold-500);`
- `--accent-strong: var(--gold-400);`
- `--ring: var(--gold-500);` (keep — it's still the new token)
- `--shadow-memphis-color: var(--black);`

Keep `--border` and `--border-strong` — those names carried over.

- [ ] **Step 3: Delete the legacy block from themes.css**

In `themes.css`, in the `:root[data-theme='dark']` block, remove the OLD overrides (the first block that overrode `--bg`, `--surface`, `--ink`, `--border-memphis` using old names). Keep the new semantic overrides added in Task 2.

Similarly clean up `[data-theme-preview='dark']`.

- [ ] **Step 4: Rename `--accent-new` → `--accent` in themes.css**

Search-and-replace `--accent-new` → `--accent` (and `-foreground` suffix too) in themes.css and theme.css. Also in any component that references `bg-accent-new` → `bg-accent`.

Grep first: `--accent-new|accent-new` across `packages/ui/src` and `apps/playground/app`. Replace all.

- [ ] **Step 5: Remove raw palette from theme.css Tailwind bridge**

In `packages/ui/src/styles/theme.css`, delete the sections that expose raw palette as Tailwind utilities:

```
--color-plum-100..900
--color-gold-100..500
--color-paper-50..300
```

Also delete the legacy semantic mappings:

```
--color-bg
--color-surface
--color-surface-2
--color-ink
--color-ink-soft
--color-ink-muted
--color-border-memphis
--color-accent (old)
--color-accent-strong
--color-danger
```

Keep only the new-semantic `--color-*` entries plus status + medal + chart + memphis + badge.

- [ ] **Step 6: Update patterns.css to reference new tokens**

In `packages/ui/src/styles/patterns.css`, change:

```
--app-pattern-color-1: var(--gold-500);
--app-pattern-color-2: var(--plum-500);
--app-pattern-color-3: var(--plum-700);
```

to:

```
--app-pattern-color-1: var(--primary);
--app-pattern-color-2: var(--secondary);
--app-pattern-color-3: var(--foreground);
```

This keeps the pattern derived from the active semantic theme rather than hardcoded raw palette.

- [ ] **Step 7: Update globals.css scrollbar tokens**

In `globals.css`, change:

```
::-webkit-scrollbar-thumb { background: var(--border-strong); ... border: 3px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--ink-muted); }
```

to:

```
::-webkit-scrollbar-thumb { background: var(--border-strong); ... border: 3px solid var(--background); }
::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
```

- [ ] **Step 8: Run full test suite**

Run: `pnpm -r test`
Expected: all pass.

- [ ] **Step 9: Run full build**

Run: `pnpm -C packages/ui build && pnpm -C apps/playground build`
Expected: both succeed.

- [ ] **Step 10: Visual smoke across 6 matrix cells**

Run: `pnpm -C apps/playground dev`. In the browser, manually toggle `[data-theme]` + `[data-palette]` on `<html>` via DevTools to cover all 6 combinations. Verify the home page + `/design-system` look correct. Kill server.

- [ ] **Step 11: Commit**

```bash
git add packages/ui/src/styles/ apps/playground/
git commit -m "refactor(styles): delete legacy tokens, rename --accent-new → --accent"
```

---

### Task 25: Bump version + update CHANGELOG

**Files:**

- Modify: `packages/ui/package.json`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Bump version**

In `packages/ui/package.json`, change `"version": "0.1.0"` to `"version": "0.2.0"`.

- [ ] **Step 2: Add CHANGELOG entry**

At the top of `CHANGELOG.md`, add:

```md
## 0.2.0 — 2026-04-24

### Breaking

- **Theme architecture rewrite.** Raw palette classes (`bg-plum-*`, `text-gold-*`, `bg-paper-*`) are no longer exposed as Tailwind utilities — consumers must use semantic tokens (`bg-primary`, `text-foreground`, etc.). See `docs/specs/2026-04-24-theme-architecture-refactor-design.md` for full mapping.
- Semantic tokens renamed: `bg-bg → bg-background`, `bg-surface → bg-card`, `bg-surface-2 → bg-muted`, `text-ink → text-foreground` (or `text-card-foreground` when on a card surface), `text-ink-muted → text-muted-foreground`, `bg-accent → bg-primary` (old "accent" was the gold primary CTA), `bg-danger → bg-destructive`, `border-border-memphis → border-memphis`.
- `Button.variant="accent"` renamed to `variant="secondary"`. `Button.variant="danger"` renamed to `variant="destructive"`.
- `Card.variant="dark"` renamed to `variant="inverse"`.
- New `--accent` token now means "subtle highlight" (pale gold in light, plum-700 in dark). This replaces the old `--accent` which was the primary CTA color.
- All semantic tokens now have a paired foreground — `bg-primary` ships with `text-primary-foreground`, etc. Components should use paired classes rather than hand-picking a contrast color.
- Status tokens gained paired foregrounds: `--success-foreground`, `--warning-foreground`, `--info-foreground`, `--rage-foreground`, `--destructive-foreground`.

### New

- Badge-specific tokens: `--badge-featured`, `--badge-copper`, `--badge-navy`, `--badge-draw`, `--badge-rank` (all paired).
- Chart tokens: `--chart-1` through `--chart-5`.
- Nav-on-dark identity tokens: `--nav-on-dark-accent`, `--nav-on-dark-accent-strong`, `--nav-on-dark-foreground`, `--nav-on-dark-foreground-strong`.
- WCAG contrast CI test for body-text pairs across all 6 theme × palette combinations.
- Theme generator rebuilt for the three-layer architecture with paired bg+fg pickers, dual-mode preview, and live contrast badges.

### Internal

- Raw palette (`--plum-*`, `--gold-*`, `--paper-*`) still defined in `tokens.css` — used internally to compute semantic values, not exposed as utilities.
- Palette presets (`default`, `neon`, `sunset`) now override only the raw palette and are orthogonal to `[data-theme]`, so all six palette × theme combinations work automatically.
```

- [ ] **Step 3: Commit**

```bash
git add packages/ui/package.json CHANGELOG.md
git commit -m "chore(release): bump @damo/ui to 0.2.0 — theme architecture refactor"
```

---

### Task 26: Final grep sweep + build verification

**Files:** Read-only verification. No file changes unless a leftover is found.

- [ ] **Step 1: Grep for any remaining raw-palette class**

Run Grep with pattern `(bg|text|border|ring|fill|stroke|decoration|divide|outline|shadow|placeholder)-(plum|gold|paper)-(50|100|200|300|400|500|700|800|900)` across `packages/ui/src/components` (exclude stories/tests if they're intentional for showcase). Expected: zero matches (or documented intentional ones).

- [ ] **Step 2: Grep for raw palette `var()` references in non-style files**

Run Grep with pattern `var\\(--(plum|gold|paper|white|black)-?(\\d+)?\\)` across `packages/ui/src/components` (exclude stories) and `apps/playground/app`. Expected: zero matches except in `color-scale.tsx` (by design — it renders raw palette as showcase data) and theme-generator files (which legitimately operate on raw palette).

- [ ] **Step 3: Grep for old semantic names**

Run Grep with pattern `(bg-bg|bg-surface\\b|bg-surface-2|text-ink\\b|text-ink-soft|text-ink-muted|border-border-memphis|bg-accent-strong|bg-danger\\b|var\\(--bg\\)|var\\(--surface\\)|var\\(--surface-2\\)|var\\(--ink\\)|var\\(--ink-muted\\)|var\\(--ink-soft\\)|var\\(--accent-strong\\)|var\\(--danger\\)|var\\(--border-memphis\\)|var\\(--shadow-memphis-color\\))`. Expected: zero matches.

- [ ] **Step 4: Run full test suite and build**

Run: `pnpm -r test && pnpm -r build`
Expected: everything green.

- [ ] **Step 5: Start both dev servers and smoke manually**

Terminal A: `pnpm -C packages/ui dev` (Ladle)
Terminal B: `pnpm -C apps/playground dev` (Next.js)

Check (via browser):

- Playground home, /design-system, /design-system/patterns, /theme-generator all render in light
- Switch `<html data-theme="dark">` via DevTools, all still render correctly
- Switch `<html data-palette="neon">`, then `sunset` — all 6 combinations visually correct
- Theme generator: edit a color, see live update; toggle edit mode; toggle preview mode

Kill servers.

- [ ] **Step 6: No commit if clean**

If all above green with no changes needed, no commit. If something was missed, fix inline and commit.

---

### Task 27: Update docs

**Files:**

- Modify: `README.md`
- Modify: `packages/ui/README.md`

- [ ] **Step 1: Update the repo-root README**

Read `README.md`. Replace any mention of old token names (`--bg`, `--surface`, `--ink`, etc.) with the new names. Add a "Theming" section that briefly explains:

- Three-layer architecture (private raw palette, public paired semantics, identity)
- How to override theme (set `data-theme` on `<html>`)
- How to switch palette (set `data-palette` on `<html>`)
- Where the contract lives (CSS files + spec reference)

- [ ] **Step 2: Update packages/ui/README.md**

Similarly update. Include a token quick-reference table for consumers:

```md
## Tokens

Use these Tailwind classes (sourced from semantic CSS variables):

**Surfaces:** `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, paired with `text-foreground`, `text-card-foreground`, `text-popover-foreground`, `text-muted-foreground`.

**Intent:** `bg-primary`/`text-primary-foreground`, `bg-secondary`/`text-secondary-foreground`, `bg-accent`/`text-accent-foreground`, `bg-destructive`/`text-destructive-foreground`.

**Status:** `bg-success`/`text-success-foreground`, `bg-warning`/`text-warning-foreground`, `bg-info`/`text-info-foreground`, `bg-rage`/`text-rage-foreground`.

**Chrome:** `border-border`, `border-border-strong`, `border-memphis`, `border-input`, `ring-ring`.

**Memphis:** `shadow-memphis` (reads `--memphis-shadow-color`), `shadow-memphis-sm/lg/hover/active`.

Raw palette (`plum-*`, `gold-*`, `paper-*`) is NOT exposed as utilities. Use semantic tokens.
```

- [ ] **Step 3: Commit**

```bash
git add README.md packages/ui/README.md
git commit -m "docs: update token reference for new semantic layer"
```

---

## Self-review checklist

Before shipping the PR, confirm:

- [ ] Spec §1 (problem) — addressed by Tasks 2+3 (new semantic layer) and Tasks 5–17 (component migration). ✅
- [ ] Spec §2 (taxonomy) — Task 2/3 add all tokens from §2.2–2.6. ✅
- [ ] Spec §3 (file layout) — Tasks 2, 3, 24 touch each of the 5 files. ✅
- [ ] Spec §4 (palette × theme matrix) — Task 26 Step 5 smoke-tests all 6. ✅
- [ ] Spec §5 (migration map) — Tasks 5–17 cover every class/var/variant listed. ✅
- [ ] Spec §6 (migration plan) — followed: atomic refactor across commits within one branch. ✅
- [ ] Spec §7 (verification) — Tasks 4 (contrast CI), 26 (grep + build + manual smoke), test runs after each component task. ✅
- [ ] Spec §8 (theme-generator) — Tasks 18–23. ✅
- [ ] Spec §9 (out of scope) — honored: no per-component foreground overrides added, no CSS-in-JS, no system-pref detection, no public npm. ✅

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-04-24-theme-architecture-refactor.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good for a refactor of this size because the context for each task is self-contained in the plan.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

Which approach?
