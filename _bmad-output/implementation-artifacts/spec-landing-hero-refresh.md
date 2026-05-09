# Spec — Landing Hero Refresh

Status: in-progress · Owner: simoneschioppo · Date: 2026-05-09 ·
Branch: `feat/landing-hero-refresh` · Type: UI tweak (no GitHub issue).

## Intent

Refresh the landing hero on `/` (apps/web) with two surgical changes:

1. **Swap the hero mascot artwork.** The current
   `apps/web/public/mascot-hero.png` shows the axolotl perched on a
   stack of books. Replace with a new ChatGPT-generated illustration
   showing the axolotl waving from behind a laptop on a desk (with
   plants, books, tablet, mug). The new asset arrives as
   `~/Downloads/ChatGPT Image 9 mag 2026, 21_31_29.png` (RGB, 1667×943,
   uniform `#f3e4d6` cream background that must be removed so the
   transparent PNG sits cleanly on top of the Memphis chrome behind it).

2. **Tighten the hero headline.** Today renders as
   `Damo UI — / tokens, components, / patterns Memphis.` — three lines
   joined by an em-dash. The user wants it shorter, more direct, **no
   `—` characters**, but not cocky.

## Boundaries

- **In scope:** `apps/web/public/mascot-hero.png` (asset replacement),
  `apps/web/lib/brand.ts` (width/height/alt updates), `apps/web/app/page.tsx`
  (drop em-dash from JSX), `apps/web/messages/{en,it}.json`
  (`home.headlineLine1`, `home.headlineLine2`).
- **Out of scope:** `mascot.png` (smaller mascot used in the navbar —
  unchanged); any other docs page; the eyebrow / lead / CTA copy;
  Memphis chrome shapes around the hero.
- **Not a BMad sprint story.** No `sprint-status.yaml` entry. Tracked
  inline as a UI maintenance task, following the same spec format as
  prior `spec-*` files in `_bmad-output/implementation-artifacts/` for
  continuity.

## Code map

| Area         | File                              | What changes                                                              |
| ------------ | --------------------------------- | ------------------------------------------------------------------------- |
| Asset        | `apps/web/public/mascot-hero.png` | Replace with bg-removed + cropped variant of the new image                |
| Brand source | `apps/web/lib/brand.ts`           | `mascotHeroWidth`, `mascotHeroHeight`, `mascotHeroAlt` (new pose)         |
| Hero JSX     | `apps/web/app/page.tsx`           | Drop the literal ` —` after `{BRAND.libName}`; bump `<img width>` 320→440 |
| Copy (EN)    | `apps/web/messages/en.json`       | New `home.headlineLine1`, `home.headlineLine2` — no em-dash, more concise |
| Copy (IT)    | `apps/web/messages/it.json`       | Italian counterparts (mirror EN structure)                                |

## Image processing approach

The new image's background is a uniform cream (`#f3e4d6`) on top + side
edges; the desk extends to the bottom edge in a saturated brown. So:

1. Load image with PIL, convert RGBA.
2. Flood-fill from the four corners that read cream (TL, TR, plus left
   and right midpoints) with tolerance ≈ 25 → set those pixels to
   `(0,0,0,0)`. The desk doesn't connect to the cream, so it survives.
3. Auto-crop to the bounding box of opaque pixels with ~16 px padding.
4. Save back over `apps/web/public/mascot-hero.png`.

`rembg` was considered but unnecessary here — the bg is solid and the
subject contrast is high. Keeping a Python venv just for one asset is
overhead; PIL is already on the system.

## Headline rewrite

Constraints:

- **No `—`** anywhere in the rendered output.
- Concise and **direct** — say what the kit _is_, not what feels nice.
- **Not boastful.** "Best", "world-class", "modern" → out.
- Mirror in IT.

Chosen copy:

| Locale | Field                | Value                 |
| ------ | -------------------- | --------------------- |
| EN     | `home.headlineLine1` | `Components, tokens,` |
| EN     | `home.headlineLine2` | `Memphis patterns.`   |
| IT     | `home.headlineLine1` | `Componenti, token,`  |
| IT     | `home.headlineLine2` | `pattern Memphis.`    |

Renders as:

```
DOCUMENTATION
Damo UI
Components, tokens,
Memphis patterns.
```

Picked over the earlier "Memphis components for React + Next.js."
draft because the React+Next.js framework angle is already covered by
the lead paragraph; repeating it in the headline would be redundant.
The contents list ("Components, tokens, Memphis patterns.") preserves
the breadth signal while fixing the awkward "patterns Memphis." word
order from the previous EN copy.

The em-dash literal in `page.tsx` is removed; lines feed via `<br />`.

## Acceptance criteria

- AC-1: `apps/web/public/mascot-hero.png` is RGBA with no cream-pixel
  background; opaque axolotl + desk; alpha at corners.
- AC-2: `BRAND.mascotHeroWidth` / `mascotHeroHeight` reflect the cropped
  PNG's actual `Image.size` (1469 × 893); `BRAND.mascotHeroAlt` describes
  the new pose (laptop / desk), in EN.
- AC-3: `apps/web/app/page.tsx` no longer renders the literal ` —`.
- AC-4: Both EN and IT catalogs carry the rewritten lines; no `—`,
  `–`, `&mdash;`, or `—` substrings present in the home block.
- AC-5: `pnpm typecheck`, `pnpm test --filter @damo/web`, `pnpm build`
  pass. (E2E unaffected, no need to re-run the full suite.)
- AC-6: No regression in the docs site i18n catalog parity (the catalog
  parity guard surfaces missing keys via the request handler's
  `onError` in non-prod).

## Risks

- **Aspect ratio jump:** new asset is wide-landscape (cropped 1469×893,
  ratio ≈ 1.64) vs previous portrait (923×1298, ratio ≈ 0.71). At the
  old `width=320`, the new image would render only ~195 px tall in a
  460 px column — visually too sparse next to the 3-line headline.
  Mitigation: bumped `width` from 320 → 440 in `page.tsx` so the hero
  fills the column more evenly (~268 px tall). This is the only layout
  number changed; the `MemphisShape` accents and the striped clipPath
  bg sit on the parent wrapper so their position is unchanged.
- **Translation drift:** IT mirrors EN structure ("Componenti, token, /
  pattern Memphis."); same word count, same line break point.

## Verification plan

1. `pnpm typecheck` — both packages.
2. `pnpm --filter @damo/web test` — vitest suite (snapshot diffs would
   surface text changes).
3. `pnpm build` — confirm Next compiles + image optimisation handles
   the new PNG.
4. Manual spot-check via dev server (user can run after merge if not
   already up on :3000).
