# Theme Generator

Status: documented · Last scan: 43a7a02 · Sources:
`apps/web/app/theme-generator/{page.tsx,theme-state.ts,use-theme-state.ts,presets.ts,exporters.ts,contrast.ts,sample-dialog.tsx,radius-emit.test.tsx}`,
`apps/web/app/styles/theme.css`,
`apps/web/app/styles/__tests__/{app-pattern-tokens.test.ts,reduced-motion-scoping.test.ts}`.

## Summary

Interactive three-layer token editor at `/theme-generator`. Users edit
a structured `Theme` shape, see live updates in a preview pane, check
WCAG contrast for every semantic pair, switch between presets
(default plum+gold / neon / sunset), and export the result as **CSS
variables**, **Tailwind v4 inline theme**, or **JSON**.

The architecture is laid out as a clean three-layer model documented in
`docs/specs/2026-04-24-theme-architecture-refactor-design.md`.

## The three-layer Theme model

```
Layer 1 — Raw palette       (ink/brand/paper scales)
   ↓ derives
Layer 2 — Semantic tokens   (background/foreground pairs, intent, status, chrome)
   ↑ overridable directly
Layer 3 — Identity          (medals, charts, nav-on-dark, app pattern)
plus foundations: typography, radius, shadow-memphis, shadow-soft, motion
```

Each layer is **per-mode** (light + dark variants stored independently).
The user can:
- Change a raw palette step → semantic recomputes (in the default
  derivation flow).
- Override a semantic value directly → breaks the derivation chain
  for that token.
- Edit identity tokens (medals etc.) per-mode without touching the
  palette.

### `Theme` shape (`theme-state.ts`)

```ts
interface Theme {
  palette:        { light: RawPalette; dark: RawPalette }
  semantic:       { light: SemanticTheme; dark: SemanticTheme }
  identity:       { light: IdentityTheme; dark: IdentityTheme }
  typography:     { light: TypographyFoundation; dark: TypographyFoundation }
  radius:         { light: RadiusFoundation; dark: RadiusFoundation }
  shadowMemphis:  { light: ShadowMemphisFoundation; dark: ShadowMemphisFoundation }
  shadowSoft:     { light: ShadowSoftFoundation; dark: ShadowSoftFoundation }
  motion:         { light: MotionFoundation; dark: MotionFoundation }
}
```

Every leaf field is `readonly` — the file's JSDoc explicitly states:
"All nested objects are treated as immutable — the reducer returns
new copies on every update."

This is the contract that makes the reducer pattern work: every
update must produce a new `Theme` object (and new sub-objects along
the touched path).

### `RawPalette` keys

```ts
ink:   '100' | '300' | '500' | '700' | '800' | '900'  (6 steps)
brand: '100' | '200' | '300' | '400' | '500'          (5 steps)
paper: '50'  | '100' | '200' | '300'                  (4 steps)
```

15 raw palette tokens per mode = 30 across light/dark.

### `SemanticTheme` — the public token surface

The semantic layer mirrors what the lib ships (`tokens.css`):
- 8 surface pairs (background, card, popover, muted)
- 3 intent pairs (primary, secondary, destructive)
- 3 status pairs (success, warning, info)
- 3 chrome (border, borderStrong, ring)
- 2 Memphis identity (memphisShadowColor, memphisBorderColor)
- 1 badge pair (badgeFeatured)

= ~30 semantic tokens per mode, 60 across light/dark.

Each is editable directly (Identity tab) or auto-derived from
the palette (Palette tab).

### `IdentityTheme`

```ts
medals:     { bronze, silver, gold, master, grandmaster } × { outer, inner, text }
charts:     '1' | '2' | '3' | '4' | '5'
navOnDark:  { accent, accentStrong, foreground, foregroundStrong }
appPattern: { color1, color2, color3, size }
```

Identity is the lib's "decorative chrome" — values that aren't
straight semantic tokens but characterise the brand. Users can
diverge identity per-mode (gold medals can be different in light
vs dark).

### Foundations

Per-mode editable scales:

- **Typography**: 3 font families + 7 size steps (xs → 3xl)
- **Radius**: 6 keys (none / sm / md / selection / pill / full)
- **Shadow Memphis**: 6 tiers (sm / card / md / lg / hover / active),
  each as `{x, y, color}`
- **Shadow Soft**: 1 tier (md) as opacity `0.08`-style scalar
- **Motion**: 4 durations + 2 easings

## Internal architecture

### `useThemeState` (`use-theme-state.ts`)

A `useReducer`-based controller. Action types include:
- `SET_PRESET` / `SYNC_PRESET`
- `SET_PALETTE_STEP` (mode, group, step, value)
- `SET_SEMANTIC` (mode, key, value)
- `SET_MEDAL` (mode, rank, slot, value)
- `SET_CHART` / `SET_NAV_ON_DARK` / `SET_APP_PATTERN_COLOR` /
  `SET_APP_PATTERN_SIZE`
- `SET_TYPOGRAPHY` / `SET_RADIUS` / `SET_SHADOW_MEMPHIS` /
  `SET_SHADOW_SOFT` / `SET_MOTION`
- `RESET`, `IMPORT_THEME`, etc.

The reducer is **immutable per the type declarations** — every
mutation returns a new theme object.

The hook also handles:
- **Persistence** — saves to localStorage on change.
- **DOM sync** — applies the current `Theme` to `document.documentElement`
  by setting CSS variables, so the lib's components in the preview
  pane re-render live.

### `presets.ts`

Three preset palettes at the moment:

```ts
export type PresetName = 'default' | 'neon' | 'sunset'

export const PRESET_LABELS = {
  default: 'Plum + Gold (default)',
  neon:    'Neon (magenta + lime)',
  sunset:  'Sunset (terracotta + orange)',
}
```

Each preset defines `RawPalette` for both light and dark.
`applyPreset(theme, preset)` returns a new `Theme` with palette
swapped and semantic recomputed via `computeSemanticLight` /
`computeSemanticDark`. Identity is preserved (per spec — users may
diverge identity from preset).

### `computeSemanticLight` / `computeSemanticDark`

Pure functions in `theme-state.ts` that derive semantic tokens
from a `RawPalette`:

```ts
function computeSemanticLight(p: RawPalette): SemanticTheme {
  return {
    background: p.paper['50'],
    foreground: p.ink['900'],
    card: '#ffffff',
    cardForeground: p.ink['900'],
    muted: p.paper['100'],
    mutedForeground: p.ink['700'],
    primary: p.brand['500'],
    primaryForeground: '#ffffff',
    secondary: p.ink['500'],
    secondaryForeground: p.paper['50'],
    // ...
    border: p.ink['900'] + '1f',  // hex alpha 12%
    borderStrong: p.ink['900'] + '38',  // hex alpha ~22%
    ring: p.brand['500'],
    // ...
  }
}
```

The dark variant inverts surfaces (`background = ink-900`,
`foreground = paper-50`) and adjusts status colors. **These two
functions are the contract** between the palette and the semantic
layer — when the lib's `tokens.css` defaults change, these need to
follow (or the docs lie).

### `exporters.ts`

Three exporters:

| Format    | Output |
|-----------|--------|
| **CSS**   | `:root` blocks for light/dark, palette + semantic + identity + foundations |
| **Tailwind** | v4 `@theme inline { … }` block with semantic vars + foundations |
| **JSON**  | The full `Theme` object serialised |

Includes `IncludeFlags` to let the user opt sections in/out:

```ts
interface IncludeFlags {
  rawPalette: boolean
  semanticLight: boolean
  semanticDark: boolean
  identity: boolean
  foundations: boolean
}
```

The CSS export is **delta-encoded** for the dark mode: full semantic
re-declaration (because semantic layers are expected to fully
override per theme) but **only the differing palette + identity tokens**
are emitted in the dark block.

### `contrast.ts`

Re-exports / wraps the lib's `contrast-utils.ts` (or duplicates it —
not certain from the file count alone) for WCAG ratio calculation
and AA badge rendering on every semantic background+foreground pair
in the editor.

### `sample-dialog.tsx`

A purpose-built preview canvas — renders a sample Dialog with various
states so the user sees the theme applied in a non-trivial scenario.

### `page.tsx`

The 1218-line UI. Two main columns:

- **Left sidebar** — three tabs:
  - **Palette** — raw palette steps (ink/brand/paper × light/dark)
  - **Theme** — semantic bg+fg pairs with WCAG contrast badges,
    light/dark edit mode
  - **Identity** — medals, charts, nav-on-dark, typography, radius,
    shadows, spacing, motion

- **Right main pane** — two tabs:
  - **Preview** — scene selector + preview-mode toggle (light/dark)
  - **Export** — CSS / Tailwind / JSON sub-tabs

Imports a long list of lib components (Accordion, Button, Checkbox,
ColorPicker, Input, Label, Select, Sidebar, Slider, Tabs, …) — the
generator is itself the most demanding consumer of `@damo/ui`.

## Notes & gotchas

1. **The semantic derivation is opinionated.** Editing the palette
   recomputes semantic via `computeSemanticLight` / `Dark`. If the
   user has manually overridden a semantic value, that override is
   **lost** when the palette changes (unless the derivation function
   keeps existing overrides — verify in the reducer if uncertain).

2. **`hex + '1f'` and `'38'` for border alphas** in the derivation
   functions assume 6-digit hex. If a user enters an `rgb(...)` or
   8-digit hex, concatenation produces invalid CSS.

3. **`appPattern.size` is in pixels**, not a token. The pattern
   layer is consumer-app-specific (lives in the playground, not
   the lib).

4. **Dark-mode CSS export uses delta encoding** for palette /
   identity but full encoding for semantic. Don't simplify to
   "delta everything" — semantic tokens need full re-declaration
   because dark-mode semantic values fundamentally differ from
   light (inverted surfaces, etc.).

5. **The default theme uses Audiowide + Exo 2** — Google Fonts
   loaded by the root layout. Consumers exporting the theme need
   to wire those fonts (or substitute) in their app.

6. **`sample-dialog.tsx` is a preview surface** — not a
   reusable component for the lib. Specific to this page.

7. **Radius emit semantics** (commit fix in PR #67). The DOM-sync
   layer formats radius values per key, not uniformly:
   - `pill` → `<N>px` (was forced to `999px`, ignoring user input)
   - `full` → `<N>%` (was forced to `50%`)
   - any other key with value `0` → the literal string `'0'`
   - otherwise → `<N>px`
   Regression guard: `radius-emit.test.tsx` (uses
   `@testing-library/react`'s `renderHook` to assert
   `SET_RADIUS` → emit pipeline).

8. **Reduced-motion scoping** (PR #48 / AC-1). The earlier
   `apps/web/app/styles/theme.css` shipped a *universal*
   `@media (prefers-reduced-motion: reduce) { *, *::before, *::after
   { transition-duration: 0.01ms !important } }` that overrode every
   duration token edited in the generator — making the Motion
   sliders silently inert for any visitor whose OS had reduced
   motion enabled. The rule is now scoped so genuine opt-in still
   suppresses motion but the editor's preview pane stays
   demonstrative. Regression guard: `reduced-motion-scoping.test.ts`.

9. **App-pattern token guard** (PR #52 / AC-5). The four
   `--app-pattern-{color1,color2,color3,size}` tokens edited in the
   generator update `apps/web/app/styles/patterns.css` consumers via
   the same DOM-sync path as semantic tokens. Regression guard:
   `app-pattern-tokens.test.ts` (asserts the tokens are referenced
   in `patterns.css` and not hard-coded literals).

## How to consume (the export contract)

The CSS export is the canonical artifact. A consumer's recipe:

1. Open `/theme-generator`, edit until visually correct.
2. Switch preview to dark to verify.
3. Hit Export → CSS, copy.
4. Paste into the consumer's stylesheet **after** the lib's
   `tokens.css` import (so the consumer overrides the neutral
   defaults).
5. Remove or keep the foundation sections per `IncludeFlags`.

The Tailwind export targets the v4 `@theme inline` directive and
goes alongside `@damo/ui/styles/theme.css`.

The JSON export is for programmatic re-import (the page accepts
JSON paste-back to re-load a saved theme).

## Open questions

1. **Spec alignment.** The architecture references
   `docs/specs/2026-04-24-theme-architecture-refactor-design.md` —
   keep the spec and these files in sync. A drift could leave the
   generator implementing an older model than what the spec
   describes.
2. **Semantic-override preservation.** When palette changes
   recompute semantic, are user overrides lost or preserved? The
   reducer behavior should be documented (and probably: preserve
   overrides, but offer a "reset semantic" action).
3. **Export verification.** No automated check that the exported
   CSS, applied to a fresh page, reproduces the editor's visual.
   Round-trip tests would catch regressions.
4. **Theme generator is the most coupled consumer.** Changes to the
   lib's token surface (additions, removals) must be mirrored in
   `SemanticTheme` and the derivation functions. A type-level
   audit (or a single source of truth shared with the lib) would
   prevent drift.
5. **Preset count is small** (3). For a public release, more
   presets would showcase the system better.
6. **No "share via URL" feature.** Users editing for hours can lose
   work if localStorage is cleared. Encoding the theme into a URL
   query (or a shareable hash) would help.
7. **Per-instance Memphis tinted-shadow recipe is broken at runtime
   (open issue #58).** Editing `--primary` (or `--destructive`,
   etc.) in the generator does **not** retint the offset shadow on
   Button ghost / Input invalid / Toast variants / Dialog danger,
   even though the per-instance class
   `[--memphis-shadow-color:var(--primary)]` is present. CSS
   custom-property substitution semantics resolve the inner
   `var(--memphis-shadow-color)` against `:root`, ignoring the
   element-level override. See `10-library/20-theming/README.md`
   Architecture #4. Path-B fix (per-color `@utility` blocks) is
   parked in #66 because Tailwind v4 strips custom rules outside
   known namespaces.
8. **Preview-scene UX gaps** (open bug #64). Some editable tokens
   (rounded-sm, rounded-selection, shadow-memphis-card) have no
   visible consumer in the default preview scene, so a user editing
   them sees no immediate feedback. Either add a consumer to the
   default scene or surface a "no preview consumer" hint.
