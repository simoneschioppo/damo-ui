# Theming

Status: documented · Last scan: 43a7a02 · Sources:
`packages/ui/tailwind.preset.ts`,
`packages/ui/src/styles/tokens.css`,
`packages/ui/src/styles/theme.css`,
`packages/ui/src/styles/globals.css`,
`packages/ui/src/styles/contrast-utils.ts`,
`packages/ui/src/styles/__tests__/contrast-utils.test.ts`,
`packages/ui/package.json` (exports surface).

## Summary

Theming in `damo-ui` is a **two-layer CSS-variables system** with a thin
TypeScript helper for contrast checks.

- **Layer 1 — values** live in `tokens.css` as plain CSS custom properties on
  `:root`. This is the lib's neutral default identity (grayscale surfaces,
  shadcn-style intent pairs, Memphis signature shadows, motion, z-index,
  density).
- **Layer 2 — Tailwind bridge** lives in `theme.css`. It does **not** define
  values; it uses `@theme inline { … }` to expose the tokens to Tailwind v4
  so they generate utility classes (`bg-primary`, `text-foreground`,
  `shadow-memphis`, `ease-memphis`, …).
- A **legacy v3 preset** (`tailwind.preset.ts`) mirrors the same surface for
  consumers still on Tailwind v3.
- A small **contrast helper** (`contrast-utils.ts`) provides WCAG ratio /
  AA-pass checks and is reused by the web app's theme generator.

The lib ships only one **light, neutral** theme. Dark mode, palette variants,
and the Memphis decorative pattern are explicitly **not** in the lib —
they are consumer responsibilities. This is deliberate: it keeps the lib's
visual brand minimal and lets every consumer (or the bundled theme generator)
override semantic vars from a parent selector without forking files.

## Public API

The theming surface is exposed via `package.json` `exports`. Consumers see:

| Subpath                       | Kind      | Purpose                                          |
| ----------------------------- | --------- | ------------------------------------------------ |
| `@damo/ui/styles/tokens.css`  | CSS       | Layer 1 — declares every CSS variable on `:root` |
| `@damo/ui/styles/theme.css`   | CSS       | Layer 2 — Tailwind v4 bridge (`@theme inline`)   |
| `@damo/ui/styles/globals.css` | CSS       | Optional reset + base typography utilities       |
| `@damo/ui/tailwind.preset`    | TS module | Legacy v3-style preset (Tailwind v3 compat shim) |

Recommended consumer wiring (Tailwind **v4**):

```css
/* in the consumer's root stylesheet */
@import '@damo/ui/styles/tokens.css'; /* values */
@import '@damo/ui/styles/theme.css'; /* tailwind bridge */
@import '@damo/ui/styles/globals.css'; /* optional reset */
```

Tailwind v4 picks up the bridged tokens automatically — no preset needed.

Recommended consumer wiring (Tailwind **v3**):

```ts
// tailwind.config.ts
import damo from '@damo/ui/tailwind.preset'
export default { presets: [damo], content: [...] }
```

The TypeScript module surface for theming is intentionally tiny:

| Export                           | From                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| `default` (preset)               | `@damo/ui/tailwind.preset`                                 |
| `hexToRgb`, `relativeLuminance`, | `contrast-utils.ts` (internal — not                        |
| `contrastRatio`, `passesAA`      | re-exported from `src/index.ts`)                           |
| `useResolvedCssVars` (hook)      | `@damo/ui` (consumes tokens at runtime; see hooks chapter) |

Contrast utilities are **not** part of the public package export today; they
are consumed in-tree by tests and by the web app's theme generator (which
imports source-relative). They should remain a candidate for promotion
once stabilized — see Open questions.

## Internal architecture

### Token taxonomy (single source: `tokens.css`)

The token set is the result of an explicit **v1 audit**: every token has at
least one in-lib consumer; tokens with zero consumers were removed and
documented as such inside `tokens.css` (see "dropped" comments). This audit
is load-bearing — re-introducing dropped tokens is a deliberate decision,
not a casual addition.

Token groups currently shipped:

- **Surfaces (paired):** `--background/--foreground`, `--card`/-`-foreground`,
  `--popover`/-`-foreground`, `--muted`/-`-foreground`.
- **Intent (paired):** `--primary`, `--secondary`, `--destructive`. Each has
  a `*-foreground` companion. `--accent` was dropped: components use
  `bg-muted` for hover/active surfaces.
- **Status (paired):** `--success`, `--warning`, `--info` + foregrounds.
- **Chrome:** `--border`, `--border-strong`, `--ring`. `--input` was
  dropped — Input/Textarea/Select use the Memphis idiom
  `border-2 border-memphis`.
- **Memphis identity:** `--memphis-border-color`, `--memphis-shadow-color`.
- **Badge featured:** `--badge-featured` + foreground (only badge-specific
  pair kept; other badge variants reuse intent/status pairs).
- **Charts:** `--chart-1` … `--chart-5`.
- **Nav-on-dark:** `--nav-on-dark-accent`, `--nav-on-dark-foreground`
  (and `*-strong` variants) — for surfaces that are always dark
  regardless of theme (e.g. AppTopBar variant).
- **Medal ranks:** `--medal-{bronze,silver,gold,master,grandmaster}-{outer,inner,text}`.
- **Typography families:** `--font-display`, `--font-body`, `--font-mono`.
- **Radius:** `--radius-{none,sm,md,selection,pill,full}`.
- **Shadow — soft tier:** `--shadow-md` (single soft tier kept, used for
  tooltips, ContextMenu, Card elevated). `--shadow-sm`/`--shadow-lg` were
  dropped.
- **Shadow — Memphis tier (signature):** `--shadow-memphis-sm`,
  `--shadow-memphis-card`, `--shadow-memphis`, `--shadow-memphis-lg`,
  `--shadow-memphis-hover`, `--shadow-memphis-active`. Each is a hard
  offset shadow `Npx Npx 0 var(--memphis-shadow-color)` — the lib's
  visual signature.
- **Motion:** `--duration-{snap,fast,base,slow}`, `--ease-memphis`,
  `--ease-out`. `--ease-in-out` was dropped.
- **Z-index:** `--z-{header,dropdown,overlay,modal,toast,tooltip}`. The
  base/sticky tiers were dropped (no consumers).
- **Chrome geometry:** `--header-height`.
- **Density:** `--density-scale-y` plus `[data-density='compact'|
'normal'|'comfortable']` selectors.

### Layer 2 — `theme.css` (Tailwind v4 bridge)

Two distinct mechanisms inside this file:

1. **`@theme inline { … }`** maps each Damo token to the Tailwind v4
   namespace that auto-generates utilities. Examples:
   `--color-primary: var(--primary)` → `bg-primary`, `text-primary`,
   `border-primary` are emitted; `--ease-memphis: var(--ease-memphis)`
   → `ease-memphis` utility is emitted.

2. **`@utility duration-{snap,fast,base,slow} { … }`** declares custom
   utility classes for transition-duration. **Why this exists:** Tailwind
   v4 has no `--duration-*` namespace mirroring `--ease-*`. Without these
   blocks, a class like `duration-fast` would silently emit nothing —
   which previously caused the theme generator's Motion sliders to have
   no visible effect. This is documented inline and is a non-obvious
   invariant: keep these `@utility` blocks if you add or rename
   `--duration-*` tokens.

3. **`@utility shadow-memphis-{sm,card,lg,hover,active}` (and
   `shadow-memphis`, `shadow-md`)** declare the Memphis offset-shadow
   utilities outside `@theme inline`. **Why this exists:** declaring
   them inside `@theme inline` (as `--shadow-memphis-X: var(--shadow-memphis-X)`)
   caused Tailwind v4 to emit a top-level `:root, :host { --shadow-memphis-X:
var(--shadow-memphis-X) }` rule that **clobbers** the value declared
   in `tokens.css` (higher cascade weight than `:root`). The token
   wiped out, the resulting `box-shadow: var(--shadow-memphis-X)`
   resolved to a self-referential cycle and the painted shadow was
   wrong everywhere. Mirroring the `duration-*` pattern bypasses the
   `@theme inline` emission path entirely so the token from
   `tokens.css` flows through. See #58 for the full forensic trace.

4. **Per-instance Memphis tinted-shadow recipe is broken at runtime
   (open issue #58 / #66 parked).** The recipe
   `[--memphis-shadow-color:var(--X)] shadow-memphis` (used by Button
   ghost, Input invalid, Toast variants, Dialog danger, …) sets the
   custom property on the consuming element, but `var()` references
   inside `--shadow-memphis-X` are substituted **at the declaring
   element** (`:root`) per the CSS Custom Properties spec — not at
   the consumer. The override is therefore ignored and the painted
   shadow falls back to the default Memphis color. Closing the gap
   needs per-color `@utility` blocks (`@utility shadow-memphis-primary
{ box-shadow: 6px 6px 0 var(--primary); }`) — but Tailwind v4
   silently strips any `@utility` block whose name doesn't match a
   known prefix, so path B was abandoned (see #66 comment for the
   investigation).

5. **`--text-{xs..3xl}` re-bridged in `@theme inline`.** Without this,
   the typography editor in `/theme-generator` was muted because
   Tailwind v4's built-in `--text-*` namespace resolves at build time
   and ignores runtime `:root --text-*` overrides. Fallbacks match
   Tailwind's stock scale so external consumers without an override
   still get the default sizes.

6. **Density** is bridged by re-binding Tailwind's foundational spacing
   unit: `--spacing: calc(0.25rem * var(--density-scale-y))`. Because
   Tailwind v4 derives **every** `p-*`, `m-*`, `gap-*` etc. from
   `--spacing`, flipping `[data-density]` re-scales the whole spacing
   system in one line. This is one of the most load-bearing tokens in
   the lib — see Invariants.

### Layer 2 — `tailwind.preset.ts` (v3 compatibility shim)

Mirrors the same surface as `theme.css`, hand-rolled in TS so v3 consumers
get utility classes for the **same** tokens. The file's header is explicit:
the v1 audit removed tokens (`rage`, `accent`, `input`, `radius-lg`,
`border-thin/base/thick`, `space-N`, `shadow-sm/lg`, `ease-in-out`,
`z-base`, `z-sticky`) and they are intentionally absent from the preset so
v3 consumers don't get utility classes resolving to undefined.

### Layer 0 — `globals.css` (optional reset)

Not strictly part of theming, but ships from the same folder and is loaded
together. Three concerns:

1. **Box-sizing reset and basic body styles** in `@layer base`. The
   `@layer` is intentional: utility classes (`@layer utilities`) must beat
   the reset, otherwise native rules like `button { background: none }`
   would override `.bg-primary` and primary buttons would render
   transparent. This is documented inline as a hard invariant.
2. **Typography utility classes** (`.display`, `.mono`, `.eyebrow`) sit
   **outside** `@layer` so they win by default — they are stylistic
   defaults, not resets.
3. **Webkit scrollbars** themed with `--border-strong` /
   `--muted-foreground` and a `--radius-pill` thumb. **Not** behind a
   `@layer` (intentional — they are decorative tokenized styling).
4. **`@keyframes shimmer`** for the Skeleton component lives here so
   Skeleton can be a pure utility-class consumer with no local CSS.

### Contrast utilities (`contrast-utils.ts`)

Pure functions, no React, no DOM:

- `hexToRgb(hex)` — accepts both 3-digit and 6-digit hex.
- `relativeLuminance(rgb)` — WCAG sRGB luminance with the gamma-corrected
  per-channel formula.
- `contrastRatio(fg, bg)` — the `(L1 + 0.05) / (L2 + 0.05)` ratio.
- `passesAA(fg, bg)` — boolean threshold at 4.5.

Used by:

- The theme generator to flag low-contrast token pairs as the user edits.
- Internal tests for token-pair sanity (see Sub-chapters).

These are not WCAG AAA (no 7.0 threshold helper) and not large-text-aware
(no 3.0 threshold helper). Add explicit helpers rather than overload —
see Open questions.

## Sub-chapters

This chapter has no sub-files yet. Likely future sub-chapters:

- `tokens-reference.md` — full alphabetical token list with description
  and consumer count (auto-generatable from a future audit script).
- `dark-mode-recipes.md` — once a consumer dark theme is canonized.
- `palette-cookbook.md` — patterns for plum/gold/paper-style palettes.

## Invariants & gotchas

1. **Single source of truth = `tokens.css`.** `theme.css` and
   `tailwind.preset.ts` only reference, never define. Adding a value in
   the preset without a backing variable in `tokens.css` is a smell — the
   preset is a _bridge_, not a fallback.

2. **The `@utility duration-*` and `@utility shadow-memphis-*` blocks
   in `theme.css` are mandatory.** Tailwind v4 has no auto-namespace
   for transition-duration, and the `--shadow-*` namespace cannot
   safely host the Memphis tiers from inside `@theme inline` (see
   Architecture #3). Removing or renaming either family silently
   breaks the theme generator's motion sliders or paints every
   Memphis component without its signature offset shadow. **Do not**
   add new tinted shadow utilities (`shadow-memphis-primary`, etc.)
   here — Tailwind v4 strips custom rules outside known namespaces,
   tracked as parked work in #66.

3. **Density works because `--spacing` is rebound.** Do **not** introduce
   alternative spacing tokens (e.g. `--spacing-compact`) — flipping
   `[data-density]` cascades through every Tailwind spacing utility
   precisely because they all read the same root variable.

4. **Reset rules belong in `@layer base`, typography utilities do not.**
   The layer ordering is what makes utilities win over native element
   defaults. Inverting this caused primary buttons to render transparent
   in the past and is documented inline.

5. **The lib ships only the light neutral theme.** Dark mode is consumer
   territory. Pattern: declare a selector (e.g. `[data-theme='dark']`) on
   a parent and redeclare every semantic var. The lib's components don't
   query `prefers-color-scheme` and don't ship a dark `:root` block.

6. **Memphis pattern is not a token group.** It's decorative consumer
   CSS. Do not migrate it back into the lib without an explicit decision.

7. **The v1 audit is load-bearing.** Dropped tokens are commented-in-place
   in `tokens.css` with the rationale. Re-introduce only with a paired
   consumer and an updated comment.

8. **Sub-tree density scoping requires the duplicated selectors.**
   `tokens.css` declares both `:root[data-density='…']` (for the html
   element via specificity) **and** plain `[data-density='…']` (for
   sub-trees). Both are needed; removing the second breaks scoped
   density on inner regions.

9. **Hex parsing accepts only `#rgb` / `#rrggbb`.** No alpha hex
   (`#rrggbbaa`), no `rgb()` / `oklch()` / `hsl()`. Theme tokens that
   move to non-hex notation will need `contrast-utils.ts` extended.

## How to consume (shadcn-style copy)

A consumer who is copying-pasting components rather than depending on
`@damo/ui` needs:

1. **Copy `tokens.css`** into the consumer's `app/styles/` (or
   equivalent) and import it from the consumer's root stylesheet. Edit
   the values freely — they are the consumer's default identity now.
2. **Tailwind v4:** copy `theme.css` (or paste its contents into the
   consumer's existing root stylesheet). Keep the `@utility duration-*`
   blocks.
3. **Tailwind v3:** copy `tailwind.preset.ts` and add it to the
   `presets` array in the consumer's `tailwind.config`.
4. **`globals.css`:** optional. If the consumer already has a CSS reset,
   they only need the `.display` / `.mono` / `.eyebrow` utilities and
   the `@keyframes shimmer` (Skeleton dependency).
5. **`contrast-utils.ts`:** copy alongside any tooling that mutates
   token pairs (a custom theme generator, a lint script, etc.).

For **dark mode**, copy a snippet like:

```css
[data-theme='dark'] {
  --background: #0a0a0a;
  --foreground: #fafafa;
  /* … redeclare every semantic var the consumer cares about … */
}
```

For **a brand palette** (plum/gold/paper), do the same on `:root` or on a
parent selector — no fork needed.

## Open questions

1. Should `contrast-utils.ts` be promoted to the public package export?
   It is already imported source-relative by the web app, which is fine
   in the monorepo but hostile to a copy-paste consumer who adopts a
   single component.
2. Should the lib ship a canonical `dark.css` snippet (still optional,
   still consumer-loaded) so the most common case stops being copy-paste
   prose?
3. Is a `passesAAA(fg, bg)` (7.0) and a large-text-aware variant (3.0)
   worth shipping, or do consumers always have specific contrast targets
   and should write their own predicate?
4. Should the lib expose a token-audit script (CLI) that lists every
   token with its current consumer count, so future audits don't depend
   on manual grep?
5. Long-term: when distribution flips to shadcn-style copy-paste on npm,
   should `tokens.css` be split per concern (colors / radius / shadow /
   motion / density) so consumers can copy only what they need?
