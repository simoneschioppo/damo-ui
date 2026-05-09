# spec-gh-91 — Plum+Gold dark mode refinement (semantic + identity)

**Issue:** [#91](https://github.com/simoneschioppo/damo-ui/issues/91)
**Branch:** `feat/gh-91-plum-gold-dark-refinement`
**Status:** FROZEN-AFTER-APPROVAL — no body edits during implementation
**Closes:** #91
**Series:** Task 1 of N (default-theme review)

---

## Intent

First in a series of palette-refinement tasks. Tighten the **Plum+Gold default's dark mode** by fixing token collisions and improving Memphis-tinted-shadow legibility on dark plum surfaces. Two layers move: dark semantic tokens (in `apps/web/app/styles/theme.css` + the generator's `computeSemanticDark`) and dark identity tokens (medals, charts, app-pattern — the generator currently shares `DEFAULT_IDENTITY` across modes).

The lib's `packages/ui/src/styles/tokens.css` ships only neutral grayscale fallbacks and is **not in scope** — Plum+Gold lives in the docs-site theme layer + the generator's defaults. Component code is **not touched** (only token values move).

## Why

Three distinct findings drive the change:

1. **Memphis tinted shadow muddy in dark** — Button ghost on `card = ink.800 #3d1a40` paints `shadow-memphis-primary = brand.500 #c4942a` (dark gold). The dark-on-dark stack reads as a brown smudge; user verified visually (#91 reference image). Lifting `--primary` to `brand.400 #d5a845` increases L\*-delta against the card.
2. **`--warning` collides with `--primary`** in dark — current `computeSemanticDark` returns `warning: brand.500` and `primary: brand.500` (verified line 254 + line 263 of `theme-state.ts`). Toast warning rendered next to a Button primary uses identical hue, breaking the intent contract.
3. **Identity layer never adapted to dark** — `theme-state.ts` line 367 sets `identity: { light: DEFAULT_IDENTITY, dark: DEFAULT_IDENTITY }`. Three concrete consequences in dark mode:
   - `medals.gold.outer = ink.900` matches `--background = ink.900` → outer ring fully invisible.
   - `medals.master.outer = ink.900` → same invisibility.
   - `charts.1 = ink.500 #7a3980` and `charts.5 = ink.700 #522357` are deep plums on a deep-plum background — sub-3:1 contrast, unreadable for data viz.
   - `appPattern.color2 = ink.500`, `appPattern.color3 = ink.700` — same low-contrast issue (decorative pattern, lower stakes, but inconsistent).

The docs-site `:root[data-theme='dark']` block in `theme.css` redeclares only semantic surfaces + intents — it never overrides `--chart-*` or `--medal-*`, so charts and medals inherit the light values verbatim into dark mode.

## Boundaries

### In-scope

- **Dark semantic tokens** (in `apps/web/app/styles/theme.css` `:root[data-theme='dark']` block + mirrored in `theme-state.ts` `computeSemanticDark`):
  - `--muted: ink.700 → ink.800` (matches user's JSON edit; tightens muted/card differentiation)
  - `--muted-foreground: ink.300 → paper.50` (matches user's JSON edit — intentional full-white text on muted surfaces; the muted-fg/foreground equality is design-by-choice, not a bug — confirmed in approval)
  - `--primary: brand.500 → brand.400 #d5a845` (Ghost-shadow legibility fix)
  - `--ring: brand.500 → brand.400` (follow primary)
  - `--badge-featured: brand.500 → brand.400` (follow primary)
  - `--warning: brand.500 → custom amber #e8a435` (decouple from primary; warmer-than-gold so still distinct from `success`/`info`)
- **Dark identity tokens** (new `DEFAULT_IDENTITY_DARK` in `theme-state.ts`, mirrored in the docs `:root[data-theme='dark']` block):
  - `medals.gold.outer: ink.900 → paper.50` (visible frame on dark bg)
  - `medals.master.outer: ink.900 → paper.50`
  - All other medal slots unchanged.
  - `charts.1: ink.500 → ink.300` (high-contrast plum)
  - `charts.2: brand.500 → brand.400` (match new primary)
  - `charts.3: #4f8a3c (light success) → #6fa85c (dark success)`
  - `charts.4: #a13a2c (light destructive) → #c94a2f (dark destructive)`
  - `charts.5: ink.700 → ink.100` (high-contrast pale plum)
  - `appPattern.color1: brand.500 → brand.400`
  - `appPattern.color2: ink.500 → ink.300`
  - `appPattern.color3: ink.700 → ink.500` (mid-plum, still recognisably plum but not muddy)
  - `navOnDark.*` unchanged (already designed for dark surfaces in any mode).
- **Tests:** add source-contract assertions for `computeSemanticDark`, `DEFAULT_IDENTITY_DARK`, and the dark CSS block; e2e visual smoke for Ghost button + Toast warning under `data-theme='dark'`.
- **Kipi handshake:** queue paths into `_bmad/agents/kipi/workflow-state.json` `workflows.update.queued[]`.

### Out-of-scope

- Light theme changes (separate task if needed).
- Other presets — `Neon` and `Sunset` palettes get their own future tasks.
- Theme-generator UI changes.
- Component code (no `*.tsx` / `*.variants.ts` edits — only token values).
- Lib's `packages/ui/src/styles/tokens.css` (ships neutral grayscale only; out of scope by design).
- Memphis shadow color overrides per-mode (currently solid black in both modes per existing comment at `apps/web/app/styles/theme.css:136-139`; deliberate decision to keep).
- New tokens / new semantic layers.

## I/O matrix

### Dark semantic tokens

| Token                | Current (computed)         | Proposed (computed)             | Rationale                                                |
| -------------------- | -------------------------- | ------------------------------- | -------------------------------------------------------- |
| `--muted`            | `p.ink['700']` `#522357`   | `p.ink['800']` `#3d1a40`        | User's JSON edit; tighter step from background           |
| `--muted-foreground` | `p.ink['300']` `#c590c9`   | `p.paper['50']` `#fbf7ee`       | User's JSON edit; intentional full-white text on muted   |
| `--primary`          | `p.brand['500']` `#c4942a` | `p.brand['400']` `#d5a845`      | Memphis-shadow legibility on dark plum (Ghost button)    |
| `--ring`             | `p.brand['500']` `#c4942a` | `p.brand['400']` `#d5a845`      | Follow primary                                           |
| `--badge-featured`   | `p.brand['500']` `#c4942a` | `p.brand['400']` `#d5a845`      | Follow primary                                           |
| `--warning`          | `p.brand['500']` `#c4942a` | literal `#e8a435`               | Decouple from primary; warm amber distinct from gold     |
| `--warning-foreground` | `p.ink['900']` `#2a0f2d` | `p.ink['900']` `#2a0f2d` (kept) | Dark text still legible on warm amber (verified ≥ 4.5:1) |

All other dark semantic tokens unchanged.

### Dark identity tokens (new `DEFAULT_IDENTITY_DARK`)

| Token                       | Current (shared with light) | Proposed (dark)             | Rationale                              |
| --------------------------- | --------------------------- | --------------------------- | -------------------------------------- |
| `medals.gold.outer`         | `#2a0f2d` (= ink.900)       | `#fbf7ee` (= paper.50)      | Was invisible (= bg); paper outer pops |
| `medals.master.outer`       | `#2a0f2d` (= ink.900)       | `#fbf7ee` (= paper.50)      | Was invisible (= bg)                   |
| `charts.1`                  | `#7a3980` (ink.500)         | `#c590c9` (ink.300)         | High-contrast on dark bg               |
| `charts.2`                  | `#c4942a` (brand.500)       | `#d5a845` (brand.400)       | Match new primary                      |
| `charts.3`                  | `#4f8a3c` (light success)   | `#6fa85c` (dark success)    | Match dark success token               |
| `charts.4`                  | `#a13a2c` (light destr.)    | `#c94a2f` (dark destr.)     | Match dark destructive token           |
| `charts.5`                  | `#522357` (ink.700)         | `#e0c6e2` (ink.100)         | High-contrast pale plum                |
| `appPattern.color1`         | `#c4942a` (brand.500)       | `#d5a845` (brand.400)       | Match primary                          |
| `appPattern.color2`         | `#7a3980` (ink.500)         | `#c590c9` (ink.300)         | High-contrast                          |
| `appPattern.color3`         | `#522357` (ink.700)         | `#7a3980` (ink.500)         | Mid-plum, still plum-flavoured         |
| All bronze / silver / grandmaster medals | (unchanged)    | (unchanged)                 | Already work on dark bg                |
| `navOnDark.*`               | (unchanged)                 | (unchanged)                 | Designed for dark surfaces in any mode |

## Code map

### Source files touched

- `apps/web/app/styles/theme.css` — dark block at lines 108–143:
  - Update `--muted`, `--primary`, `--ring`, `--badge-featured`, `--warning`.
  - Append `--chart-{1..5}` overrides.
  - Append `--medal-gold-outer`, `--medal-master-outer` overrides.
  - (No `--app-pattern-*` CSS vars exist — pattern lives only in generator's data model.)
- `apps/web/app/theme-generator/theme-state.ts`:
  - `computeSemanticDark`: update `muted`, `primary`, `ring`, `badgeFeatured`, `warning` lines.
  - Add `const DEFAULT_IDENTITY_DARK: IdentityTheme = {…}` (with the per-token deltas above) — keep `DEFAULT_IDENTITY` as the light identity (renamed `DEFAULT_IDENTITY_LIGHT` for clarity).
  - `DEFAULT_THEME`: change `identity: { light: DEFAULT_IDENTITY_LIGHT, dark: DEFAULT_IDENTITY_DARK }`.
- `apps/web/app/theme-generator/presets.ts`:
  - No code change required — `applyPreset` already preserves identity per-mode (line 76 docstring confirms). But verify that switching from a preset that diverged identity back to `default` re-applies the new dark identity (audit during implementation).

### Test files touched

- New: `apps/web/app/theme-generator/theme-state.test.ts` (or extend if it exists) — assert:
  - `computeSemanticDark(DEFAULT_PALETTE).primary === '#d5a845'`
  - `computeSemanticDark(DEFAULT_PALETTE).warning === '#e8a435'`
  - `computeSemanticDark(DEFAULT_PALETTE).warning !== computeSemanticDark(DEFAULT_PALETTE).primary` (no-collision invariant)
  - `computeSemanticDark(DEFAULT_PALETTE).mutedForeground === '#fbf7ee'` (paper.50, full-white-on-muted by design — see Design notes)
  - `computeSemanticLight(DEFAULT_PALETTE).mutedForeground !== computeSemanticLight(DEFAULT_PALETTE).foreground` (light-mode muted hierarchy preserved as ink.700 ≠ ink.900)
- `apps/web/app/theme-generator/presets.test.ts` — extend if needed to cover the dark identity branch.
- `apps/web/__tests__/theme-css-dark-block.test.ts` (new) — read `app/styles/theme.css`, assert the dark block contains the new declarations (regex source-contract). Mirrors the `theme-bridge-coverage.test.ts` pattern from packages/ui.

### E2E

- New: `e2e/tests/scenarios/dark-theme-tokens.spec.ts`:
  - Visit `/`, set `<html data-theme='dark'>`.
  - Read `getComputedStyle(html).getPropertyValue('--primary')` → asserts `rgb(213, 168, 69)` (= `brand.400`).
  - Render a Button ghost; read `getComputedStyle(btn).boxShadow` → contains `rgb(213, 168, 69)`.
  - Read `--warning` → asserts `rgb(232, 164, 53)`; assert `--warning !== --primary`.
  - Read `--medal-gold-outer` → asserts `rgb(251, 247, 238)` (= paper.50).

### Kipi paths to queue

- `apps/web/app/styles/theme.css`
- `apps/web/app/theme-generator/theme-state.ts`
- (Affects chapters: `core-knowledge/10-library/20-theming/README.md`, `core-knowledge/20-web-app/00-architecture.md`.)

## Tasks

1. **TDD: failing source-contract tests** — write `theme-state.test.ts` cases for `computeSemanticDark` deltas + identity-dark deltas; write `theme-css-dark-block.test.ts` regex assertions. Run them — they fail.
2. **TDD: failing e2e** — write `dark-theme-tokens.spec.ts`. Run against current code — fails (`--primary` is brand.500, etc.).
3. **Implement `theme-state.ts` changes** — `computeSemanticDark` updates, `DEFAULT_IDENTITY_DARK` split.
4. **Implement `theme.css` changes** — dark block updates + chart/medal overrides.
5. **Run quality gates** — `pnpm --filter @damo/web test`, lint, typecheck. (Lib package shouldn't be affected — verify no false-positive snapshot drift.)
6. **Multi-agent code review** — three rounds (code-reviewer, security-reviewer, edge-case-hunter) on the diff. Fix HIGH/CRITICAL findings.
7. **Run e2e** — `cd e2e && pnpm exec playwright test --project=chromium`. New `dark-theme-tokens.spec.ts` must pass; existing theme-related specs must not regress.
8. **Visual smoke** — start dev server, visit `/`, toggle dark mode, verify: Ghost button shadow reads as gold-amber (not dark-gold-on-dark-plum); Toast warning ≠ Button primary; gold medal has visible outer; chart 1 / chart 5 readable.
9. **Kipi handshake** — append the two paths to `_bmad/agents/kipi/workflow-state.json` `workflows.update.queued[]`. Stop before `*4 Update Knowledge`.
10. **Open PR** with the title `feat(theme): refine Plum+Gold dark mode (semantic + identity) (#91)`. Stop before merge for user's final review.

## Acceptance criteria

- **AC-1 (formula contract)**: `computeSemanticDark(DEFAULT_PALETTE)` returns the new tokens (`primary === '#d5a845'`, `warning === '#e8a435'`, `muted === '#3d1a40'`, etc.). Asserted by Vitest.
- **AC-2 (no-collision invariants)**: in dark mode, `primary !== warning`, `medals.gold.outer !== background`, `medals.master.outer !== background`. In light mode, `mutedForeground !== foreground`. (Dark `mutedForeground === foreground` is deliberate — see Design notes.) Asserted by Vitest.
- **AC-3 (CSS source contract)**: `apps/web/app/styles/theme.css` `:root[data-theme='dark']` block declares the new values. Regex tests pass.
- **AC-4 (runtime — Ghost button)**: under `data-theme='dark'`, Button ghost paints `box-shadow` with `rgb(213, 168, 69)`. Playwright asserts.
- **AC-5 (runtime — chart visibility)**: under `data-theme='dark'`, `--chart-1` and `--chart-5` resolve to ink.300 / ink.100 respectively. Playwright asserts.
- **AC-6 (runtime — gold medal)**: under `data-theme='dark'`, `--medal-gold-outer` resolves to paper.50. Playwright asserts.
- **AC-7 (gates)**: `pnpm --filter @damo/web` test/lint/typecheck all green; e2e green; existing theme-bridge-coverage tests in packages/ui green (lib unaffected).

## Design notes

### Why `paper.50` for medal outer in dark, not a plum tone

Two alternatives considered: (a) `brand.500 #c4942a` outer with `brand.300 #e5bc6d` inner — keeps gold-on-gold tonal but loses the "frame around medal" semantic. (b) `ink.300 #c590c9` outer — recognisably plum, but sub-3:1 contrast against `card = ink.800` if the medal sits on a card surface. `paper.50` is the simplest readable frame across all dark surfaces (bg + card + popover) and matches the `medals.master.text` token already used.

### Why a custom hex for dark `--warning`, not a `brand` step

`brand.300 #e5bc6d` was the obvious "lighter than primary" choice but reads as light gold — too close to primary visually. `brand.200 #f0d49a` is even paler. A custom amber `#e8a435` (slightly redder hue than the brand) gives `warning` a recognisable warm character that's distinct from both primary (gold) and destructive (red-orange).

### Why `mutedForeground === foreground` in dark is deliberate

User's JSON had `dark.semantic.mutedForeground = #fbf7ee` which equals `--foreground`. The user confirmed in approval that this is design-by-choice: muted-bg surfaces in dark mode use the same paper-50 text as the rest of the app — the muted distinction lives entirely in the surface (`muted = ink.800` is a darker plum, distinct from `card = ink.800`… wait, equal — see next paragraph), not in the text color. Light mode preserves the standard hierarchy (`mutedForeground = ink.700`, distinct from `foreground = ink.900`).

Note: with `--muted = --card = ink.800` in dark, the muted surface is no longer visually distinct from a default card surface. Components that paint a `bg-muted` rectangle inside a `bg-card` parent will read flush. This is a known consequence of the user's `muted = ink.800` choice and is in scope of this PR's "user-approved deltas". A follow-up could differentiate by introducing a small color-mix offset, but it's not blocking.

### Identity per-mode — why split now

Splitting `DEFAULT_IDENTITY` into `_LIGHT` / `_DARK` in `theme-state.ts` is the precedent for per-mode identity divergence — needed by `medals.gold.outer` and `medals.master.outer` (cannot be ink.900 in dark). Once the split exists, fixing chart visibility in dark is a free incremental change (no new architectural cost).

### Theme-generator interaction

`applyPreset` (in `presets.ts`) preserves identity per-mode by design (its docstring at line 76: "Preserves identity (medals/charts/navOnDark/appPattern) for both modes"). After this PR's split, switching to the `default` preset still preserves user-diverged identity in both modes — but a fresh load from `DEFAULT_THEME` (or an explicit identity reset) gives the user the corrected dark identity. Generator UI changes are out of scope.

### Memphis shadow color stays black in dark

The existing comment at `apps/web/app/styles/theme.css:136-139` documents the deliberate choice. Changing it would require a new `--memphis-shadow-color` redeclaration in dark and changes to the foundational shadow tokens — out of scope.

## Verification

- Source-contract tests (`pnpm --filter @damo/web test`) — at least 6 new cases (3 collision invariants + 3 token values) must pass; identity-dark assertions must pass.
- E2E (`cd e2e && pnpm exec playwright test --project=chromium`) — new `dark-theme-tokens.spec.ts` must pass; existing `theme-generator-token-runtime-propagation.spec.ts` and `tinted-memphis-shadow-runtime.spec.ts` must not regress.
- Visual smoke under `data-theme='dark'` on `/`: Ghost button shadow is amber-gold (lighter, more saturated than current); Toast warning is amber-orange (clearly distinct from Button primary); gold medal has visible white outer ring; chart 1 / chart 5 readable; app-pattern visible.
