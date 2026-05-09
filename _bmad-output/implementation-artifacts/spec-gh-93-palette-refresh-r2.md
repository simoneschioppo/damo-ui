# Spec gh-93 — Palette refresh round 2 (Neon → Cyberpunk + Forest, Sunset border)

> **Status:** FROZEN-AFTER-APPROVAL — once Intent/Boundaries/I-O are approved by
> the user, edits require a new explicit approval round.

## 1. Intent

Round 2 of the default-palette revision started in #91.

The Plum+Gold defaults landed in #91. This round refreshes the **other two**
presets that ship with the theme-generator:

- **Drop Neon** (magenta+lime) — the user does not like its visual identity.
- **Add Cyberpunk** (electric violet + neon amber) — replaces Neon, keeps the
  "punchy/electric" niche.
- **Add Forest** (deep green + warm amber) — fills the "grounded/organic"
  niche, complementary to the warm Plum default.
- **Patch Sunset** — keep the dark Memphis frame at `#000000` (#91 lifted the
  global dark default to `#cccccc` for plum/gold legibility, but Sunset's
  terracotta surfaces let black borders breathe).

The PR introduces a **per-preset semantic-overrides** primitive in
`applyPreset` so a single preset can diverge from the canonical
`computeSemanticLight/Dark` mapping without reverting the global default. This
is the only architectural change; the three-layer architecture is preserved.

## 2. Boundaries

### In scope

- New raw palettes for Cyberpunk and Forest (Layer 1, both modes).
- Per-preset semantic-override system (`PresetSemanticOverrides` + plumbing in
  `applyPreset`).
- Two override entries:
  - `sunset.dark.memphisBorderColor = '#000000'`
  - `cyberpunk.light.primaryForeground = '#170731'` (cyberpunk ink.900) —
    required because vivid amber `brand.500 = #ffab00` fails WCAG AA with
    white text.
- Migration of every `'neon'` reference in the codebase to either
  `'cyberpunk'`, `'forest'`, or removal (when example was Neon-specific):
  `presets.ts`, `presets.test.ts`, `reducer.test.ts`, `theme-generator/page.tsx`,
  `theme-generator/use-theme-state.ts`, `_components/DocsPreferencesMenu.tsx`,
  `app/docs/{foundations,components,getting-started}/...`, `messages/{en,it}.json`,
  `app/styles/theme.css`, `packages/ui/README.md`,
  `packages/ui/src/components/{dropdown-menu,attr-toggle-group}/*.stories.tsx`,
  `e2e/tests/scenarios/issue-fixes.spec.ts`.
- Tests: vitest (unit) + Playwright (e2e) covering the new presets and Sunset
  border override.
- Multi-agent code review (code-reviewer + security-reviewer + architect).
- Kipi `*4` knowledge sync.

### Out of scope (deferred to future tasks)

- Light-mode revision of the Plum+Gold default.
- Adding any preset beyond the 4 final ones (default / sunset / cyberpunk /
  forest).
- Refactoring `computeSemanticLight/Dark` to take an explicit overrides
  argument — the override merge happens in `applyPreset` only, so the helpers
  stay pure derivations of the raw palette.
- Promoting `data-palette` to a runtime API on the lib side (still consumer
  app territory; lib defaults remain neutral grayscale).
- Auto-deriving `primaryForeground` from `brand.500` luminance (we accept the
  static override per-preset for now).

## 3. I/O matrix

### Cyberpunk palette (raw)

| Token       | Light & Dark value     | Notes                                                                                        |
| ----------- | ---------------------- | -------------------------------------------------------------------------------------------- |
| `ink.100`   | `#f0d4ff`              | lavender mist                                                                                |
| `ink.300`   | `#b388ff`              | light violet                                                                                 |
| `ink.500`   | `#7c4dff`              | electric violet                                                                              |
| `ink.700`   | `#3d1c75`              | deep violet                                                                                  |
| `ink.800`   | `#2a1052`              | very deep violet                                                                             |
| `ink.900`   | `#170731`              | near-black violet (`--background` in dark; `--foreground` & `--primary-foreground` in light) |
| `brand.100` | `#fff4b3`              | palest yellow                                                                                |
| `brand.200` | `#ffe57a`              | light yellow                                                                                 |
| `brand.300` | `#ffd740`              | yellow                                                                                       |
| `brand.400` | `#ffc107`              | amber-yellow (dark-mode primary)                                                             |
| `brand.500` | `#ffab00`              | deep amber (light-mode primary; **needs ink.900 text**)                                      |
| `paper.*`   | unchanged from default | shared cream paper across presets                                                            |

### Forest palette (raw)

| Token       | Light & Dark value | Notes                                               |
| ----------- | ------------------ | --------------------------------------------------- |
| `ink.100`   | `#d6ead2`          | palest leaf                                         |
| `ink.300`   | `#8cbf85`          | sage                                                |
| `ink.500`   | `#2f6b3b`          | medium forest                                       |
| `ink.700`   | `#1d4226`          | deep forest                                         |
| `ink.800`   | `#14301c`          | very deep forest                                    |
| `ink.900`   | `#0c1f12`          | near-black forest                                   |
| `brand.100` | `#fde6b8`          | cream amber                                         |
| `brand.200` | `#f7d28a`          | warm cream                                          |
| `brand.300` | `#f0bb55`          | mid amber                                           |
| `brand.400` | `#e6a02e`          | vivid amber (dark-mode primary)                     |
| `brand.500` | `#a8590e`          | warm dark amber (light-mode primary; AA white text) |
| `paper.*`   | unchanged          | shared cream paper                                  |

### Per-preset semantic overrides

| Preset    | Mode  | Token                | Override            | Reason                                                                                     |
| --------- | ----- | -------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| sunset    | dark  | `memphisBorderColor` | `#000000`           | terracotta surfaces let black borders read; #91 default `#cccccc` was sized for plum/gold  |
| cyberpunk | light | `primaryForeground`  | `#170731` (ink.900) | `brand.500 = #ffab00` ⨯ white = WCAG ratio ≈ 1.97 (FAIL); ink.900 ratio ≈ 12.96 (PASS AAA) |

### Default + Forest

No semantic overrides — `computeSemanticLight/Dark(palette)` produces the
final semantic for these presets unchanged.

### `theme.css` block migration

Replace `:root[data-palette='neon'] { ... }` with two new blocks:

```css
:root[data-palette='cyberpunk'] {
  /* raw palette overrides */
  --ink-100: #f0d4ff;
  --ink-300: #b388ff;
  --ink-500: #7c4dff;
  --ink-700: #3d1c75;
  --ink-800: #2a1052;
  --ink-900: #170731;
  --brand-100: #fff4b3;
  --brand-200: #ffe57a;
  --brand-300: #ffd740;
  --brand-400: #ffc107;
  --brand-500: #ffab00;
  /* semantic override: vivid amber brand.500 needs dark text */
  --primary-foreground: var(--ink-900);
}

:root[data-palette='forest'] {
  --ink-100: #d6ead2;
  --ink-300: #8cbf85;
  --ink-500: #2f6b3b;
  --ink-700: #1d4226;
  --ink-800: #14301c;
  --ink-900: #0c1f12;
  --brand-100: #fde6b8;
  --brand-200: #f7d28a;
  --brand-300: #f0bb55;
  --brand-400: #e6a02e;
  --brand-500: #a8590e;
}

:root[data-theme='dark'][data-palette='sunset'] {
  /* gh-93: Sunset keeps the black Memphis border in dark — the
     gh-91 global lift to #cccccc was sized for plum/gold. */
  --memphis-border-color: #000000;
}
```

## 4. Code map

| File                                                                         | Change                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/app/theme-generator/presets.ts`                                    | replace `PresetName` union, drop `NEON_PALETTE`, add `CYBERPUNK_PALETTE` + `FOREST_PALETTE`, add `PresetSemanticOverrides` type + `PRESET_SEMANTIC_OVERRIDES` map, extend `applyPreset` with override merge |
| `apps/web/app/theme-generator/presets.test.ts`                               | drop `'neon'` test; add `'cyberpunk'` + `'forest'` tests; add Sunset border-override test                                                                                                                   |
| `apps/web/app/theme-generator/reducer.test.ts`                               | replace `'neon'` literals with `'cyberpunk'` (preserves the test's intent: switching to a non-default preset)                                                                                               |
| `apps/web/app/theme-generator/use-theme-state.ts`                            | extend the attr→preset coercion to `'cyberpunk'` / `'forest'`                                                                                                                                               |
| `apps/web/app/theme-generator/page.tsx`                                      | update the `attr === 'neon'` ternary to handle the new presets                                                                                                                                              |
| `apps/web/app/styles/theme.css`                                              | replace `[data-palette='neon']` block with `[data-palette='cyberpunk']` + `[data-palette='forest']`; add `[data-theme='dark'][data-palette='sunset']` border override                                       |
| `apps/web/app/_components/DocsPreferencesMenu.tsx`                           | `PALETTE_VALUES` and the unionised type                                                                                                                                                                     |
| `apps/web/messages/{en,it}.json`                                             | rename `palette.options.neon` → `cyberpunk` + `forest`; update narrative `paletteBullet` / `paletteCardBody` examples                                                                                       |
| `apps/web/app/docs/foundations/theming/page.tsx`                             | example snippets                                                                                                                                                                                            |
| `apps/web/app/docs/foundations/colors/page.tsx`                              | CSS example block                                                                                                                                                                                           |
| `apps/web/app/docs/components/attr-toggle-group/page.tsx`                    | option arrays (2 occurrences)                                                                                                                                                                               |
| `apps/web/app/docs/getting-started/page.tsx`                                 | option arrays                                                                                                                                                                                               |
| `packages/ui/README.md`                                                      | example HTML snippet                                                                                                                                                                                        |
| `packages/ui/src/components/dropdown-menu/dropdown-menu.stories.tsx`         | RadioItem                                                                                                                                                                                                   |
| `packages/ui/src/components/attr-toggle-group/attr-toggle-group.stories.tsx` | option array                                                                                                                                                                                                |
| `e2e/tests/scenarios/issue-fixes.spec.ts`                                    | rename test + update assertions to `'default, sunset, cyberpunk, forest'`                                                                                                                                   |
| `e2e/tests/scenarios/palette-refresh-r2.spec.ts` (NEW)                       | runtime tests for cyberpunk + forest preset switching + sunset dark border                                                                                                                                  |

## 5. Tasks

1. **TDD-RED** — extend tests to assert the new behavior:
   - presets.test.ts: cyberpunk semantic deltas, forest semantic basics, sunset border override, no-`neon` invariant.
   - reducer.test.ts: keep semantic identical, swap the literal.
2. **GREEN** — implement `presets.ts` (palettes + overrides + applyPreset merge).
3. **CSS** — update `theme.css` blocks.
4. **Docs/i18n migration** — sweep all 17 files.
5. **e2e** — write `palette-refresh-r2.spec.ts`.
6. **Multi-agent review** — code-reviewer + security-reviewer + architect in parallel.
7. **Address HIGH/CRITICAL** review findings.
8. **Kipi `*4`** — queue + drain for theme-generator + foundations chapters.
9. **Push, open PR, wait CI green, merge with `--merge --delete-branch`**.

## 6. Acceptance criteria

- **AC-1:** `PresetName` is exactly `'default' | 'sunset' | 'cyberpunk' | 'forest'`.
- **AC-2:** `applyPreset(theme, 'sunset').semantic.dark.memphisBorderColor === '#000000'` (and light unchanged).
- **AC-3:** `applyPreset(theme, 'cyberpunk').semantic.light.primaryForeground === '#170731'`.
- **AC-4:** `applyPreset(theme, 'cyberpunk')` and `applyPreset(theme, 'forest')` produce a `Theme` with `palette.{light,dark}` matching the I/O matrix above and semantic re-derived (with overrides where listed).
- **AC-5:** `theme.css` contains exactly four palette-scoped blocks: default (implicit `:root`), `[data-palette='sunset']`, `[data-palette='cyberpunk']`, `[data-palette='forest']` — and one mode-and-palette-scoped block: `[data-theme='dark'][data-palette='sunset']`. No `[data-palette='neon']` block remains.
- **AC-6:** No file under `apps/web/`, `packages/ui/src/`, `e2e/`, or `core-knowledge/` (except prose narrative outside scope) references the literal `'neon'` as a palette identifier.
- **AC-7:** `pnpm lint` + `pnpm -w test` + `pnpm --filter web test` + Playwright e2e tests all green; multi-agent review CRITICAL/HIGH addressed; Kipi `*4` queue+run logged.

## 7. Design notes

### WCAG contrast verification (the reason for cyberpunk's override)

| Pair                                                                       | Ratio   | Verdict                      |
| -------------------------------------------------------------------------- | ------- | ---------------------------- |
| white text on `brand.500 = #ffab00` (cyberpunk light primary)              | ≈ 1.97  | **FAIL** all levels          |
| `ink.900 = #170731` text on `brand.500 = #ffab00`                          | ≈ 12.96 | PASS AAA                     |
| `ink.900 = #170731` text on `brand.400 = #ffc107` (cyberpunk dark primary) | ≈ 11.0  | PASS AAA                     |
| `ink.900 = #0c1f12` text on `brand.400 = #e6a02e` (forest dark primary)    | ≈ 9.6   | PASS AAA                     |
| white text on `brand.500 = #a8590e` (forest light primary)                 | ≈ 6.7   | PASS AA, fails AAA non-large |
| `ink.900 = #170731` (cyberpunk) on `paper.50 = #fbf7ee` (light bg)         | ≈ 18.5  | PASS AAA                     |
| `ink.900 = #0c1f12` (forest) on `paper.50 = #fbf7ee` (light bg)            | ≈ 19.5  | PASS AAA                     |

### Why the override goes in `applyPreset`, not `computeSemanticLight`

`computeSemanticLight/Dark` are intentionally pure functions of the raw palette
— they encode the "canonical mapping". The override is a per-preset _exception_,
so it lives at the preset-application boundary. This keeps the semantic helpers
stable and lets future presets opt in or out.

### Specifity guard for `theme.css` palette overrides

`:root[data-palette='X']` and `:root[data-theme='dark']` have equal CSS
specificity. The palette block must be **declared after** the dark block in the
file so that, when both attributes are set, palette overrides win — which is
what we want: `data-palette='sunset'` should override `data-theme='dark'`'s
gh-91 `--memphis-border-color: #cccccc`. The Sunset block is therefore the
mode-and-palette-scoped variant `[data-theme='dark'][data-palette='sunset']`,
which has specifity (0,2,0) and reliably wins.

### Why the palette covers both light and dark

Same as #91: `applyPreset` resets `palette.light` and `palette.dark` to the
preset's palette. Per-mode palette divergence (a feature of the architecture)
is intentionally discarded so the user sees the preset's intended look.
Identity (medals/charts/navOnDark/appPattern) is preserved across preset
switches per #91.
