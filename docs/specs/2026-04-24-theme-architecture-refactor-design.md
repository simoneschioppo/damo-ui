# Theme Architecture Refactor — Design Spec

**Context:** the current Damo UI theme system has a two-tier color model (raw palette + semantic aliases) where components freely mix both layers, and only part of the semantic layer is overridden in dark mode. This causes visible breakage (colors that don't swap between light/dark, e.g. the PRO badge staying plum-900 on a plum-900 background) and makes the system fragile to customize. This refactor aligns the architecture with the shadcn/ui pattern: **one unified semantic layer where every token is fully declared in each theme, every surface has a paired foreground, and raw palette is no longer exposed to consumers.**

**Non-goals:** changing the Memphis visual language (brand colors, shapes, shadows stay). Making the lib public-npm-ready. Redesigning the playground UX beyond the theme-generator page (see §8). Extracting a tokens-only package.

**Status:** drafted 2026-04-24.

---

## 1. Problem

### 1.1 Symptoms

- Components use raw palette classes directly (`bg-plum-900`, `text-paper-50`, `bg-gold-500`). These do not change between light and dark, producing contrast failures (PRO badge on plum-900 background is invisible in dark mode because the badge already uses plum-900; gold borders look correct in light but wrong on dark plum).
- Semantic tokens are partially overridden in dark mode. `--bg`, `--surface`, `--ink`, `--border` flip, but `--accent`, `--accent-strong`, `--ring`, `--success`, `--danger`, `--warning`, `--rage`, `--info` stay put. Contrast between `--accent` (gold) and `--bg` (dark plum) is unchecked.
- The "primary" concept is split across two variables: `--accent` (semantic name) and `bg-gold-500` (raw class). Components pick one or the other inconsistently. `button.variants.ts` has a `primary` variant using `bg-gold-500` AND an `accent` variant using `bg-plum-500` — neither references `var(--accent)`.
- Status colors (`--success`, `--danger`, etc.) have no paired foreground. Components hardcode `text-paper-50` or `text-white` next to them, producing WCAG AA failures when themes change.

### 1.2 Root cause

The current model lets components reach past the semantic layer into the palette. The semantic layer itself is incomplete (no paired foregrounds, partial dark overrides), which forced component authors to reach around it in the first place.

The shadcn model is more disciplined:
1. A single semantic layer, fully declared in both `:root` (light) and `[data-theme='dark']` (dark).
2. Every fill token has a paired foreground token — `--primary` + `--primary-foreground`, `--card` + `--card-foreground`, etc.
3. Raw palette is private to the theme file. Consumers never see it.

---

## 2. Final token taxonomy

### 2.1 Layer 1 — Internal raw palette (private)

Not exposed as Tailwind utilities. Consumers cannot write `bg-plum-500`. Used only inside `themes.css` to compute semantic values.

| Group | Tokens |
|---|---|
| Plum scale | `--plum-100`, `-300`, `-500`, `-700`, `-800`, `-900` |
| Gold scale | `--gold-100`, `-200`, `-300`, `-400`, `-500` |
| Paper scale | `--paper-50`, `-100`, `-200`, `-300` |
| Mono | `--white`, `--black` |

Palette presets (neon, sunset) override this layer via `[data-palette='<name>']`. Theme (`[data-theme='dark']`) does **not** override this layer — only the semantic layer.

### 2.2 Layer 2 — Semantic chrome (public, paired bg↔fg)

All tokens in this section are declared for BOTH light and dark, always in the same order and grouping.

**Surfaces:**

| Token | Light value | Dark value |
|---|---|---|
| `--background` + `--foreground` | paper-50 / plum-900 | plum-900 / paper-50 |
| `--card` + `--card-foreground` | white / plum-900 | plum-800 / paper-50 |
| `--popover` + `--popover-foreground` | white / plum-900 | plum-800 / paper-50 |
| `--muted` + `--muted-foreground` | paper-100 / plum-700 | plum-700 / plum-300 |

**Intent (actions / emphasis):**

| Token | Light value | Dark value |
|---|---|---|
| `--primary` + `--primary-foreground` | gold-500 / white | gold-500 / plum-900 |
| `--secondary` + `--secondary-foreground` | plum-500 / paper-50 | plum-500 / paper-50 |
| `--accent` + `--accent-foreground` | gold-100 / plum-900 | plum-700 / gold-200 |
| `--destructive` + `--destructive-foreground` | #a13a2c / paper-50 | #c94a2f / paper-50 |

**Status (all paired):**

| Token | Light value | Dark value |
|---|---|---|
| `--success` + `--success-foreground` | #4f8a3c / paper-50 | #6fa85c / plum-900 |
| `--warning` + `--warning-foreground` | #8a6326 / paper-50 | #c4942a / plum-900 |
| `--info` + `--info-foreground` | plum-500 / paper-50 | plum-300 / plum-900 |
| `--rage` + `--rage-foreground` | #c94a2f / paper-50 | #e06b4f / plum-900 |

**Chrome primitives (no foreground):**

| Token | Light value | Dark value |
|---|---|---|
| `--border` | `color-mix(oklab, plum-900 12%, transparent)` | `color-mix(oklab, paper-50 12%, transparent)` |
| `--border-strong` | `color-mix(oklab, plum-900 22%, transparent)` | `color-mix(oklab, paper-50 22%, transparent)` |
| `--input` | same as `--border` | same as `--border` |
| `--ring` | gold-500 | gold-500 |

### 2.3 Layer 2a — Nav-on-dark identity tokens (public)

These tokens are for components that always render on a dark surface regardless of theme (e.g. a dark `Sidebar` embedded in a light app). They do NOT flip with `[data-theme]`.

| Token | Value (light & dark) |
|---|---|
| `--nav-on-dark-accent` | `var(--gold-200)` |
| `--nav-on-dark-accent-strong` | `var(--gold-400)` |
| `--nav-on-dark-foreground` | `rgba(255,255,255,0.72)` |
| `--nav-on-dark-foreground-strong` | `var(--white)` |

### 2.4 Layer 2b — Memphis identity tokens (public)

| Token | Light value | Dark value |
|---|---|---|
| `--memphis-shadow-color` | black | paper-50 |
| `--memphis-border-color` | black | paper-50 |

Both are exposed as Tailwind color utilities: `shadow-memphis` reads `--memphis-shadow-color`, `border-memphis` reads `--memphis-border-color`.

### 2.5 Layer 2c — Badge-specific tokens (public, dedicated)

Per decision C: dedicated tokens rather than reusing `--muted` / `--accent`.

| Variant | Light bg / fg | Dark bg / fg |
|---|---|---|
| `--badge-featured` + `-foreground` | gold-500 / black | gold-500 / plum-900 |
| `--badge-copper` + `-foreground` | gold-500 / white | gold-500 / paper-50 |
| `--badge-navy` + `-foreground` | plum-900 / gold-200 | plum-700 / gold-200 |
| `--badge-draw` + `-foreground` | paper-100 / plum-900 | plum-700 / paper-50 |
| `--badge-rank` + `-foreground` | gold-100 / plum-900 | plum-700 / gold-200 |

### 2.6 Layer 3 — Identity / data tokens (public, theme-agnostic)

Not affected by `[data-theme]`. Defined once.

- `--medal-{bronze,silver,gold,master,grandmaster}-{outer,inner,text}` — intentionally fixed rank colors.
- `--chart-1` through `--chart-5` — new, for Stat / future data-viz components.
- `--app-pattern-color-1..3`, `--app-pattern-size` — Memphis pattern; derive from `--primary`, `--secondary`, etc. so the pattern automatically reflects the active palette.

### 2.7 Typography / radius / shadow / spacing / motion / z-index

Unchanged. These tokens are not theme-dependent. No renaming.

---

## 3. File layout

```
packages/ui/src/styles/
├── tokens.css           # Layer 1 (raw palette + palette presets) + Layer 3 + typography/radius/etc.
├── themes.css           # Layer 2 + 2b + 2c, full light & dark declarations
├── globals.css          # Base reset + body styles (unchanged)
├── patterns.css         # Memphis pattern, references Layer 2 tokens
└── theme.css            # Tailwind v4 @theme inline bridge — exposes ONLY Layers 2/2b/2c/3
```

### 3.1 `tokens.css` structure

```css
:root {
  /* Layer 1 — default raw palette (plum + gold + paper) */
  --plum-100: #e0c6e2; ... --plum-900: #2a0f2d;
  --gold-100: #f8e5bc; ... --gold-500: #c4942a;
  --paper-50: #fbf7ee; ... --paper-300: #ddd0ae;
  --white: #ffffff;
  --black: #000000;

  /* Layer 3 — identity (theme-agnostic) */
  --medal-bronze-outer: ...; ... (all medal ranks)
  --chart-1: ...; ... --chart-5: ...;
  --app-pattern-color-1: var(--primary);
  --app-pattern-color-2: var(--secondary);
  --app-pattern-color-3: var(--foreground);
  --app-pattern-size: 140px;

  /* Typography, radius, shadow (non-memphis), spacing, motion, z-index, density */
  ... (unchanged from current tokens.css)
}

:root[data-palette='neon']  { --plum-100: ...; --gold-500: ...; /* only plum + gold overrides */ }
:root[data-palette='sunset'] { --plum-100: ...; --gold-500: ...; }
```

### 3.2 `themes.css` structure

```css
/* Light — default when no [data-theme] is set */
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
  --accent: var(--gold-100);
  --accent-foreground: var(--plum-900);
  --destructive: #a13a2c;
  --destructive-foreground: var(--paper-50);

  /* Status */
  --success: #4f8a3c; --success-foreground: var(--paper-50);
  --warning: #8a6326; --warning-foreground: var(--paper-50);
  --info: var(--plum-500); --info-foreground: var(--paper-50);
  --rage: #c94a2f; --rage-foreground: var(--paper-50);

  /* Chrome primitives */
  --border: color-mix(in oklab, var(--plum-900) 12%, transparent);
  --border-strong: color-mix(in oklab, var(--plum-900) 22%, transparent);
  --input: var(--border);
  --ring: var(--gold-500);

  /* Memphis identity */
  --memphis-shadow-color: var(--black);
  --memphis-border-color: var(--black);

  /* Badge-specific */
  --badge-featured: var(--gold-500); --badge-featured-foreground: var(--black);
  --badge-copper: var(--gold-500); --badge-copper-foreground: var(--white);
  --badge-navy: var(--plum-900); --badge-navy-foreground: var(--gold-200);
  --badge-draw: var(--paper-100); --badge-draw-foreground: var(--plum-900);
  --badge-rank: var(--gold-100); --badge-rank-foreground: var(--plum-900);
}

/* Dark — complete override of Layer 2 */
:root[data-theme='dark'] {
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
  --accent: var(--plum-700);
  --accent-foreground: var(--gold-200);
  --destructive: #c94a2f;
  --destructive-foreground: var(--paper-50);

  --success: #6fa85c; --success-foreground: var(--plum-900);
  --warning: var(--gold-500); --warning-foreground: var(--plum-900);
  --info: var(--plum-300); --info-foreground: var(--plum-900);
  --rage: #e06b4f; --rage-foreground: var(--plum-900);

  --border: color-mix(in oklab, var(--paper-50) 12%, transparent);
  --border-strong: color-mix(in oklab, var(--paper-50) 22%, transparent);
  --input: var(--border);
  --ring: var(--gold-500);

  --memphis-shadow-color: var(--paper-50);
  --memphis-border-color: var(--paper-50);

  --badge-featured: var(--gold-500); --badge-featured-foreground: var(--plum-900);
  --badge-copper: var(--gold-500); --badge-copper-foreground: var(--paper-50);
  --badge-navy: var(--plum-700); --badge-navy-foreground: var(--gold-200);
  --badge-draw: var(--plum-700); --badge-draw-foreground: var(--paper-50);
  --badge-rank: var(--plum-700); --badge-rank-foreground: var(--gold-200);
}

/* Scoped dark preview (theme-generator) — same body as [data-theme='dark'] */
[data-theme-preview='dark'] { /* same as :root[data-theme='dark'] above */ }
```

### 3.3 `theme.css` (Tailwind v4 bridge)

Exposes only Layer 2 / 2b / 2c / 3 via `--color-*` variables inside `@theme inline`. **Raw palette tokens (`--color-plum-*`, `--color-gold-*`, `--color-paper-*`) are deleted** from this file — so `bg-plum-500`, `text-gold-500`, etc. stop being valid utility classes.

---

## 4. Palette presets × themes matrix

The current lib has three palettes (default, neon, sunset) and two themes (light, dark). All six combinations must work.

**Architecture:** palette preset overrides Layer 1 only. Theme overrides Layer 2 only. They are orthogonal — six combinations work without writing six full token sets.

```
:root                                     → default palette, light theme
:root[data-theme='dark']                  → default palette, dark theme
:root[data-palette='neon']                → neon palette, light theme
:root[data-palette='neon'][data-theme='dark']  → works automatically (no rule needed)
:root[data-palette='sunset']              → sunset palette, light theme
:root[data-palette='sunset'][data-theme='dark'] → works automatically
```

**Validation:** each preset must define raw palette values that are contrast-safe in BOTH themes. Neon's plum-900 must be dark enough to serve as dark-mode background. Sunset's plum-900 must be dark enough. This is already true for the current values but will be asserted with a contrast test (see §7.3).

---

## 5. Component migration map

55 raw-palette-class occurrences across 32 components; 12 components use raw `var(--plum|gold|paper|black)` in inline styles or arbitrary values. Migration is 1-to-1 and mechanical.

### 5.1 Tailwind class migration table

| Old | New | Applies to |
|---|---|---|
| `bg-gold-500 text-white` | `bg-primary text-primary-foreground` | button primary, hint, theme-switcher, density-switcher |
| `bg-gold-500 text-black` | `bg-badge-featured text-badge-featured-foreground` | badge featured |
| `bg-gold-500 text-white` (badge) | `bg-badge-copper text-badge-copper-foreground` | badge copper |
| `bg-gold-500` (standalone, e.g. slider range, tooltip-card badge) | `bg-primary` | slider, tooltip-card, switch checked, chip active |
| `hover:bg-gold-400` | `hover:bg-primary/90` | button primary hover |
| `bg-gold-100 text-plum-900` | `bg-badge-rank text-badge-rank-foreground` | badge rank |
| `text-gold-200` (badge navy) | `text-badge-navy-foreground` | badge navy |
| `text-gold-200` (nav-item onDark current) | `text-[var(--nav-on-dark-accent)]` — dedicated identity token (`--nav-on-dark-accent: var(--gold-200)`, not theme-flipped because `onDark` is by definition always on a dark surface regardless of active theme) | nav-item |
| `text-gold-400` / `bg-gold-400` (nav rail decorative bar) | `bg-[var(--nav-on-dark-accent-strong)]` (sibling token, `= var(--gold-400)`) | nav-item before pseudo |
| `bg-plum-500 text-paper-50` | `bg-secondary text-secondary-foreground` | button accent (renamed to `secondary`), theme-switcher active, density-switcher active, hint |
| `hover:bg-plum-700` | `hover:bg-secondary/80` | button secondary hover |
| `bg-plum-500` (standalone, dots) | `bg-secondary` | dropdown-menu dot, context-menu dot, progress bar, radio dot |
| `bg-plum-900 text-paper-50` | `bg-foreground text-background` | avatar, segmented active, app-shell dark footer, table header, tooltip, checkbox checked, card dark, pagination current, switch bg, user-card |
| `bg-plum-900 text-gold-200` | `bg-badge-navy text-badge-navy-foreground` | badge navy |
| `bg-paper-100 text-plum-900` | `bg-badge-draw text-badge-draw-foreground` | badge draw |
| `bg-paper-50` | `bg-background` | slider thumb, pattern-swatch |
| `border-plum-700` | `border-border` or `border-border-strong` | tooltip |
| `text-paper-50` (standalone) | `text-background` | any filled-dark component |

### 5.2 Semantic class migration table

| Old | New |
|---|---|
| `bg-bg` | `bg-background` |
| `bg-surface` | `bg-card` |
| `bg-surface-2` | `bg-muted` |
| `text-ink` | `text-foreground` (when on `bg-background`) or `text-card-foreground` (on `bg-card`) |
| `text-ink-soft` | `text-foreground/70` (eliminated as named token) |
| `text-ink-muted` | `text-muted-foreground` |
| `border-border` | unchanged |
| `border-border-strong` | unchanged |
| `border-border-memphis` | `border-memphis` |
| `bg-accent` | `bg-primary` (old `--accent` was gold = primary CTA) |
| `bg-accent-strong` | eliminated; use `bg-primary/90` or explicit token |
| `text-accent` | `text-primary` |
| `bg-danger` | `bg-destructive` |
| `shadow-m-*`, `shadow-memphis-*` | unchanged (the color token behind them is renamed but class names stay) |

### 5.3 CSS variable migration table (inline styles, arbitrary Tailwind values)

| Old inline/arbitrary | New |
|---|---|
| `var(--gold-500)` | `var(--primary)` |
| `var(--plum-500)` | `var(--secondary)` |
| `var(--plum-900)` | `var(--foreground)` |
| `var(--paper-50)` | `var(--background)` |
| `var(--paper-100)` | `var(--muted)` |
| `var(--black)` (in shadows) | `var(--memphis-shadow-color)` |
| `var(--surface)` | `var(--card)` |
| `var(--surface-2)` | `var(--muted)` |
| `var(--ink)` | `var(--foreground)` or `var(--card-foreground)` (context) |
| `var(--ink-muted)` | `var(--muted-foreground)` |
| `var(--border-memphis)` | `var(--memphis-border-color)` |
| `[--shadow-memphis-color:var(--gold-500)]` | `[--memphis-shadow-color:var(--primary)]` |

### 5.4 Component variant API changes

These are **breaking** for consumers (internally only the playground consumes the lib today; no external consumers).

| Component | Old API | New API | Reason |
|---|---|---|---|
| `Button` | `variant="accent"` | `variant="secondary"` | `accent` meant plum-500 which is semantically "secondary"; the word `accent` now means subtle hover/highlight to match shadcn convention |
| `Button` | `variant="primary"`, `"ghost"`, `"outline"`, `"danger"`, `"link"` | unchanged names | Internal colors rewritten to semantics |
| `Card` | `variant="dark"` | `variant="inverse"` | `dark` was misleading (it was "inverse of current theme", not literally dark); `inverse` is accurate in both themes |
| `Badge` | variant names unchanged | unchanged | Internal colors mapped to badge-specific tokens |

---

## 6. Migration plan (outline — detailed in implementation plan)

This is a single atomic refactor. Dual-token "soft migration" is rejected — it preserves the broken system longer and doubles maintenance. The work is split into commits within one PR, each commit leaving the build green.

1. **Commit 1 — Token layer:** rewrite `tokens.css`, `themes.css`, `theme.css`, `patterns.css`. Old semantic vars deleted, raw palette utilities deleted from Tailwind bridge. Build will break — expected.
2. **Commits 2..N — Component migration:** migrate components in groups (button/card/badge first as they cascade into many, then form elements, then layout, then showcase-specific). Each commit: code changes + updated tests + visual verification on Ladle.
3. **Commit N+1 — Playground migration (non-generator):** update `apps/playground/app/page.tsx`, `apps/playground/app/design-system/**`, and any other non-generator pages to use new tokens.
4. **Commit N+2..N+K — Theme generator rewrite:** implement §8 in phases (state model, presets, exporters, page UI, contrast utility). Tests updated alongside.
5. **Final commit — Docs:** update `README.md`, `packages/ui/README.md`, CHANGELOG, `docs/specs/*`, `docs/plans/*` references.

Version bump: `@damo/ui` `0.1.0` → `0.2.0` (minor, pre-1.0 convention allows breaking).

---

## 7. Verification

### 7.1 Build & type

- `pnpm -C packages/ui build` passes after each commit.
- `pnpm -C apps/playground build` passes after commit N+1.
- `pnpm -r test` passes after the final commit.

### 7.2 Visual regression — Ladle stories

Every story in `packages/ui/src/components/**/*.stories.tsx` renders correctly in:
- light + default palette
- dark + default palette
- light + neon
- dark + neon
- light + sunset
- dark + sunset

A checklist (components × 6 matrix) is part of the implementation plan's test step.

### 7.3 Automated contrast assertion (body-text pairs only)

A utility test (added under `packages/ui/src/styles/__tests__/contrast.test.ts`) parses the resolved semantic token values (via JSDOM + computed style) and asserts WCAG AA contrast (≥ 4.5:1) for the **body-text pairs** across all six theme × palette combinations.

**Pairs enforced by CI:**
- `(background, foreground)`
- `(card, card-foreground)`
- `(popover, popover-foreground)`
- `(muted, muted-foreground)`

These are the pairs where a failing contrast directly breaks readability of paragraph text, labels, and form inputs — the places where users spend real reading time.

**Pairs NOT enforced by CI** (reviewed visually, tuned for Memphis aesthetic impact):
- `(primary, primary-foreground)`, `(secondary, secondary-foreground)`, `(accent, accent-foreground)`
- `(destructive, destructive-foreground)`
- All `(status, status-foreground)` pairs
- All `(badge-*, badge-*-foreground)` pairs

Rationale: Memphis design traditionally uses high-saturation, bold-weight CTAs and badges where text is large, short, and intentionally high-impact. Imposing AA on `primary` would force gold-on-plum (losing the white-on-gold look the lib ships with) without a readability payoff. These pairs still get contrast ratios displayed in the theme-generator UI (§8.6) so theme authors see the number, but CI won't fail.

This test fails CI if a body-text pair regresses. It replaces manual eyeballing for the pairs where readability is non-negotiable.

### 7.4 Manual UX smoke

The screenshots reported in the ticket (PRO badge contrast, accent-on-dark mismatch) are re-captured against the refactored build to confirm the visible regressions are resolved.

---

## 8. Theme generator redesign

The `/theme-generator` page (`apps/playground/app/theme-generator/*`) is the live editor for the tokens system. Its data model and UI currently mirror the OLD two-tier structure (raw palette + flat semantic list). The new taxonomy requires a substantial rework.

### 8.1 Conceptual shift

The old generator treats everything as "one big list of colors" with groups. The new generator reflects the **three-layer architecture**:

1. **Palette layer** — the raw plum/gold/paper scales. Users edit these when they want to create a new palette preset (or tweak existing).
2. **Theme layer** — the semantic mapping (what `--primary` points to, what `--muted` points to, etc.), split by light/dark. Users edit these when they want to change *how* the palette is used.
3. **Identity layer** — medals, charts, memphis tokens. Less frequently edited.

### 8.2 New state model (theme-state.ts)

```ts
type PaletteName = 'default' | 'neon' | 'sunset' | 'custom'
type ThemeMode = 'light' | 'dark'

interface RawPalette {
  plum: { 100: string; 300: string; 500: string; 700: string; 800: string; 900: string }
  gold: { 100: string; 200: string; 300: string; 400: string; 500: string }
  paper: { 50: string; 100: string; 200: string; 300: string }
}

interface SemanticTheme {
  // Surfaces + foregrounds
  background: string; foreground: string
  card: string; cardForeground: string
  popover: string; popoverForeground: string
  muted: string; mutedForeground: string
  // Intent + foregrounds
  primary: string; primaryForeground: string
  secondary: string; secondaryForeground: string
  accent: string; accentForeground: string
  destructive: string; destructiveForeground: string
  // Status + foregrounds
  success: string; successForeground: string
  warning: string; warningForeground: string
  info: string; infoForeground: string
  rage: string; rageForeground: string
  // Chrome primitives
  border: string; borderStrong: string; input: string; ring: string
  // Memphis identity
  memphisShadowColor: string; memphisBorderColor: string
  // Badge-specific
  badgeFeatured: string; badgeFeaturedForeground: string
  badgeCopper: string; badgeCopperForeground: string
  badgeNavy: string; badgeNavyForeground: string
  badgeDraw: string; badgeDrawForeground: string
  badgeRank: string; badgeRankForeground: string
}

interface Theme {
  readonly palette: RawPalette
  readonly semantic: { readonly light: SemanticTheme; readonly dark: SemanticTheme }
  readonly identity: { readonly medals: ...; readonly charts: ...; readonly navOnDark: ... }
  readonly typography: ...    // unchanged
  readonly radius: ...         // unchanged
  readonly shadowMemphis: ... // unchanged
  readonly shadowSoft: ...    // unchanged
  readonly spacing: ...        // unchanged
  readonly motion: ...         // unchanged
}
```

### 8.3 New page layout (page.tsx)

The sidebar (left) hosts three top-level sections accessed via `Tabs`:

1. **Palette** — edit raw plum/gold/paper scales. Loading a preset (default/neon/sunset) just replaces this section. Includes a "Save as custom" action.
2. **Theme** — edit semantic mapping. A top-of-panel toggle switches between "Light" and "Dark" editing contexts. Color pickers are rendered as **paired rows**: `[bg-color-picker] [fg-color-picker] [contrast-badge]`. The contrast badge shows AA/AAA/fail live.
3. **Identity** — edit medals, charts, nav-on-dark tokens, memphis colors, typography, radius, shadow, spacing, motion. Mostly unchanged from today, just relocated.

The main pane (right) has two sub-panes:

- **Preview** — renders the five existing stock scenes (Gallery, Auth, Dashboard, Profile, Feed). A toggle above the preview switches between "Preview light" and "Preview dark" independently of which theme context is being *edited* (so you can edit the light theme while previewing how dark renders, and vice versa).
- **Export** — the four export formats (CSS, Tailwind, JSON, Figma). The CSS export now emits BOTH `:root` and `:root[data-theme='dark']` blocks.

### 8.4 Presets (presets.ts)

A preset now describes only the raw palette (plum/gold/paper values). Semantic mapping is computed identically for all presets (the mapping rules from §3.2 apply). This matches the new architecture where palette is orthogonal to theme.

Presets shipped:
- `default` (plum + gold + cream paper)
- `neon` (magenta + lime + cream paper)
- `sunset` (terracotta + warm orange + cream paper)

A user can also author a custom palette via the Palette tab and save it locally (localStorage) — not a server feature.

### 8.5 Exporters (exporters.ts)

- **CSS export** — emits `:root { ... light semantic values ... }` + `:root[data-theme='dark'] { ... dark semantic values ... }` + `:root[data-palette='<name>'] { ... raw palette overrides ... }` if a non-default palette is active. Also emits the Layer 3 identity tokens, typography, radius, etc. just once.
- **Tailwind preset export** — emits the `@theme inline` block mapping semantic tokens to `--color-*` Tailwind variables (mirror of `theme.css` in the lib).
- **JSON export** — nested structure reflecting the three layers, matching the `Theme` type above.
- **Figma Tokens Studio export** — same structure as JSON but in the Tokens Studio schema. Light and dark become two `token sets`.

### 8.6 Contrast assistance in the UI

Every paired row in the Theme tab shows a live WCAG contrast ratio. Icon + color badge:
- ≥ 7.0 → AAA (green check)
- ≥ 4.5 → AA (amber check)
- < 4.5 → fail (red warning)

This makes the contrast test from §7.3 visible during authoring — the user can't accidentally ship a failing pair.

### 8.7 Migration of current generator code

Files affected:
- `apps/playground/app/theme-generator/theme-state.ts` — full rewrite of types + DEFAULT_THEME
- `apps/playground/app/theme-generator/use-theme-state.ts` — reducer updated for new shape
- `apps/playground/app/theme-generator/presets.ts` — presets reshaped to raw-palette-only
- `apps/playground/app/theme-generator/exporters.ts` — rewrite emit functions for new shape
- `apps/playground/app/theme-generator/exporters.test.ts` — new expectations
- `apps/playground/app/theme-generator/page.tsx` — tab-restructured editor, paired pickers, dual-mode preview
- New: `apps/playground/app/theme-generator/contrast.ts` — WCAG 2.1 contrast calculation (small pure function, no deps)

---

## 9. Out of scope (deferred)

- **Per-component foreground overrides** (e.g. a `Button` that accepts `foreground="custom-color"`). Current API doesn't have this and we're not adding it here.
- **New semantic tokens** beyond what's listed in §2. Any missing pair surfaces later becomes a separate change.
- **CSS-in-JS support.** The lib remains tokens + Tailwind only.
- **Public npm publish.** Still private per the redesign spec.
- **System-preference auto-detection** (`prefers-color-scheme`). Theme is controlled explicitly by `[data-theme]` on `<html>`. Wiring to system pref can be added later with a one-file change.
