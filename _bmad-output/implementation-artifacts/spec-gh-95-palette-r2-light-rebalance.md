# Spec gh-95 — Palette refresh r2.5: rebalance Cyberpunk + Forest light identities

> **Status:** FROZEN-AFTER-APPROVAL.

## 1. Intent

After #93 (PR #94) merged with Cyberpunk and Forest as new presets, the four built-in palettes all collapsed to the same "cream paper + dark-text + amber/orange brand" formula in light mode — the user could not visually distinguish them. This PR moves Cyberpunk and Forest into non-amber color zones so each preset has a recognisable identity at a glance:

- **Cyberpunk** → electric cyan/teal (brand) + cool cyan cream (paper). Violet ink stays.
- **Forest** → copper/rust (brand) + sage cream (paper). Forest green ink stays.

The deep-teal `brand.500 = #0f766e` contrasts AA with white text (~5.7), so the gh-93 `cyberpunk.light.primaryForeground = ink.900` semantic override gets removed. Sunset's gh-93 dark border override (`#000000`) stays.

## 2. Boundaries

### In scope

- New `CYBERPUNK_PALETTE` (15 hex values: ink unchanged, brand cyan, paper cool cyan cream).
- New `FOREST_PALETTE` (15 hex values: ink unchanged, brand copper rust, paper sage cream).
- Removal of `PRESET_SEMANTIC_OVERRIDES.cyberpunk` (no longer needed).
- `theme.css` blocks rewritten for both presets; the `[data-palette='cyberpunk']:not([data-theme='dark'])` light-only override block deleted.
- Test updates: presets.test.ts hex assertions + canonical-equivalence; reducer.test.ts SYNC_PRESET cyberpunk regression test removed (no override to guard).
- e2e: `palette-refresh-r2.spec.ts` test 1 inverted (cyberpunk light primary-foreground stays white; no override path); test 3 forest brand.500 hex updated.
- Docs snippet refresh in `apps/web/app/docs/foundations/{theming,colors}/page.tsx` for the cyberpunk example values.

### Out of scope

- Default plum+gold or sunset light revisions.
- New presets beyond the four current ones.
- Per-mode palette divergence (palette stays mirrored light=dark).
- Auto-luminance `primaryForeground` derivation (still deferred from gh-91/93).
- i18n labels (`Cyberpunk` and `Forest` stay; only the palette ramps move).

## 3. I/O matrix

### Cyberpunk (raw)

| Token       | Value (light & dark)  |
| ----------- | --------------------- |
| `ink.100`   | `#f0d4ff` (unchanged) |
| `ink.300`   | `#b388ff` (unchanged) |
| `ink.500`   | `#7c4dff` (unchanged) |
| `ink.700`   | `#3d1c75` (unchanged) |
| `ink.800`   | `#2a1052` (unchanged) |
| `ink.900`   | `#170731` (unchanged) |
| `brand.100` | `#c0fffa` ← new       |
| `brand.200` | `#80f5ec` ← new       |
| `brand.300` | `#40e3d4` ← new       |
| `brand.400` | `#14b8a6` ← new       |
| `brand.500` | `#0f766e` ← new       |
| `paper.50`  | `#f3fbfa` ← new       |
| `paper.100` | `#e7f5f3` ← new       |
| `paper.200` | `#d3ebe7` ← new       |
| `paper.300` | `#b8d6d1` ← new       |

### Forest (raw)

| Token       | Value (light & dark)  |
| ----------- | --------------------- |
| `ink.100`   | `#d6ead2` (unchanged) |
| `ink.300`   | `#8cbf85` (unchanged) |
| `ink.500`   | `#2f6b3b` (unchanged) |
| `ink.700`   | `#1d4226` (unchanged) |
| `ink.800`   | `#14301c` (unchanged) |
| `ink.900`   | `#0c1f12` (unchanged) |
| `brand.100` | `#fde4d3` ← new       |
| `brand.200` | `#f7c19f` ← new       |
| `brand.300` | `#ed996c` ← new       |
| `brand.400` | `#c87444` ← new       |
| `brand.500` | `#8e4318` ← new       |
| `paper.50`  | `#f6f7eb` ← new       |
| `paper.100` | `#ecede0` ← new       |
| `paper.200` | `#ddddc8` ← new       |
| `paper.300` | `#c1c1a8` ← new       |

### Per-preset semantic overrides (post-gh-95)

| Preset        | Mode      | Token                   | Override      | Status                                          |
| ------------- | --------- | ----------------------- | ------------- | ----------------------------------------------- |
| sunset        | dark      | `memphisBorderColor`    | `#000000`     | unchanged from gh-93                            |
| ~~cyberpunk~~ | ~~light~~ | ~~`primaryForeground`~~ | ~~`ink.900`~~ | **removed** (deep teal contrasts AA with white) |

## 4. WCAG verification

| Pair                                                                       | Ratio | Verdict  |
| -------------------------------------------------------------------------- | ----- | -------- |
| white text on `brand.500 = #0f766e` (cyberpunk light primary)              | ≈ 5.7 | PASS AA  |
| `ink.900 = #170731` text on `brand.400 = #14b8a6` (cyberpunk dark primary) | ≈ 6.0 | PASS AA  |
| white text on `brand.500 = #8e4318` (forest light primary)                 | ≈ 7.3 | PASS AAA |
| `ink.900 = #0c1f12` text on `brand.400 = #c87444` (forest dark primary)    | ≈ 5.1 | PASS AA  |
| `ink.900` text on `paper.50` (cyberpunk + forest light bg)                 | > 18  | PASS AAA |

## 5. Code map

| File                                                                             | Change                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web/app/theme-generator/presets.ts`                                        | rewrite `CYBERPUNK_PALETTE` + `FOREST_PALETTE`; drop `PRESET_SEMANTIC_OVERRIDES.cyberpunk`                                                                             |
| `apps/web/app/theme-generator/presets.test.ts`                                   | update Cyberpunk + Forest expected ramps; replace cyberpunk-primaryForeground-override test with no-override canonical-equivalence assertion                           |
| `apps/web/app/theme-generator/reducer.test.ts`                                   | drop the SYNC_PRESET cyberpunk regression case (no override left to verify); keep sunset case                                                                          |
| `apps/web/app/styles/theme.css`                                                  | rewrite `[data-palette='cyberpunk']` + `[data-palette='forest']` blocks; **remove** `[data-palette='cyberpunk']:not([data-theme='dark'])` block; update header comment |
| `e2e/tests/scenarios/palette-refresh-r2.spec.ts`                                 | flip test 1 (cyberpunk light primary-foreground stays white, no override); update test 3 forest hex                                                                    |
| `apps/web/app/docs/foundations/theming/page.tsx`                                 | swap cyberpunk example hex (`#ffab00 / #170731 / #7c4dff` → `#0f766e / #ffffff / #7c4dff`)                                                                             |
| `apps/web/app/docs/foundations/colors/page.tsx`                                  | same                                                                                                                                                                   |
| `_bmad-output/implementation-artifacts/spec-gh-95-palette-r2-light-rebalance.md` | this file (NEW)                                                                                                                                                        |

## 6. Tasks

1. **TDD-RED** — update unit tests; run vitest (expect failures on hex literals).
2. **GREEN** — `presets.ts` + `theme.css`.
3. **e2e + docs snippets** — adjust runtime + pedagogical examples.
4. **Multi-agent review** (code-reviewer + security-reviewer + architect).
5. **e2e re-run** to confirm 6/6 green.
6. **Kipi `*4` sync** — chapter `20-web-app/20-theme-generator/README.md` (palette ramps + override-removal).
7. **Push, open PR, wait CI green** — then **STOP**. The user verifies live `/theme-generator` switching between presets before authorising the merge.

## 7. Acceptance criteria

- **AC-1 / AC-2:** Cyberpunk + Forest palette objects equal the I/O matrix above.
- **AC-3:** `PRESET_SEMANTIC_OVERRIDES.cyberpunk` is absent (`Object.keys(PRESET_SEMANTIC_OVERRIDES) === ['sunset']`).
- **AC-4:** `theme.css` no longer contains `[data-palette='cyberpunk']:not([data-theme='dark'])`; both palette blocks reflect new ramps.
- **AC-5–6:** vitest 191+ green; e2e 6/6 green (chromium + webkit).
- **AC-7:** `pnpm format:check` + `pnpm lint` clean.
- **AC-8:** Kipi sync committed; PR opened; **no merge without explicit user "mergia"**.

## 8. Design notes

- **Why drop the cyberpunk override now**: its only purpose was raising contrast with white text on the vivid amber `#ffab00`. Deep teal `#0f766e` already contrasts AA with white — the override would be a no-op at best and dead code at worst.
- **Why diversify `paper` too**: keeping paper.50 = `#fbf7ee` cream across all presets was the main reason all four presets read the same in light mode. A 1-step shift (slightly cyan / slightly sage) preserves the "warm cream" ergonomics while encoding the preset's identity into the bg itself, not just the brand accent.
- **Forest brand-500 = #8e4318** is a saturated rust-copper that is unambiguously different from gold (`#c4942a`) and orange (`#f58a1e`). Deep enough to contrast AAA with white text, no override needed.
- **Cyberpunk dark surfaces** (ink.900 = `#170731` violet, brand.400 = `#14b8a6` teal) produce the classic "violet-black + teal accent" cyberpunk dark UI without any extra overrides.
