# spec-gh-78 — Add favicon + icon set to docs site

**Issue:** [#78](https://github.com/simoneschioppo/damo-ui/issues/78)
**Branch:** `feat/gh-78-favicon-icon-set`
**Status:** FROZEN-AFTER-APPROVAL — no body edits during implementation
**Closes:** #78

---

## Intent

Ship a complete favicon + manifest suite so the `apps/web` docs site renders proper browser-tab branding on every platform (Chrome, Safari, Firefox, mobile Safari, Android Chrome) and passes Lighthouse's "favicon" PWA check. Wire the assets into Next.js' `metadata.icons` and `metadata.manifest` (no hand-rolled `<link>` tags), and ship a deterministic local generation pipeline (`sharp`) so the source SVG is the single editable artefact.

## Why a Memphis-style "D"

Two options were on the table per #78: (a) Memphis-style "D" letterform, (b) a mascot crop. Verdict: **(a)**.

1. **Legibility at 16×16.** The mascot is a purple axolotl with glasses on a paper-cream backdrop. Downsampled to 16 px, the eyes/glasses muddle into a single dark blob and the silhouette reads as "round dark thing" — not as the brand. A bold geometric "D" with a 2 px Memphis frame still resolves at 16 px because every stroke is ≥ 2 px wide.
2. **Brand consistency.** The docs site already uses the mascot for the in-page brand mark (`BrandMark` → 40 px high). The favicon's job is the _tab strip_, where pixel density and visual weight differ. A separate, simpler mark for the favicon is the standard split (cf. GitHub's octocat → black square).

## Boundaries

### In-scope

- Source SVG at `apps/web/public/icons/source/favicon-source.svg`. Memphis-style "D":
  - 32×32 viewBox
  - 2 px black frame (matches lib's `border-memphis` aesthetic)
  - "D" letterform filled in brand purple `#7a3980` (matches `--ink-500`, the docs palette's secondary)
  - Single Memphis accent: a tilted gold square in the negative space (uses `#c4942a`, brand-500)
  - White background (`#ffffff`) for tab-strip contrast on both light and dark Chrome themes
- Generation script at `apps/web/scripts/generate-icons.ts`. Reads the source SVG with `sharp`, emits to `apps/web/public/`:
  - `favicon-16x16.png`
  - `favicon-32x32.png`
  - `favicon.ico` (multi-resolution: 16, 32, 48 — written via `to-ico`)
  - `apple-touch-icon.png` (180×180, white pad)
  - `android-chrome-192x192.png`
  - `android-chrome-512x512.png`
- `apps/web/public/site.webmanifest` with: `name`, `short_name`, `icons` (192 + 512), `theme_color: "#7a3980"`, `background_color: "#ffffff"`, `display: "standalone"`, `start_url: "/"`.
- Wire `metadata.icons` + `metadata.manifest` in `apps/web/app/layout.tsx` (no `<link>` tags).
- Add `dev` script `icons:generate` in `apps/web/package.json`. Runs via `pnpm --filter @damo/web run icons:generate` and is invoked manually when the source SVG changes (not on every build — generated assets are committed for fast cold-start serve and stable hashes).
- Vitest source-contract tests asserting (a) `metadata.icons` shape in `layout.tsx`, (b) every required icon file exists in `apps/web/public/`, (c) `site.webmanifest` parses to a valid manifest object.
- Playwright e2e on `/`: assert that the rendered HTML emits a `<link rel="icon">`, a `<link rel="apple-touch-icon">`, and a `<link rel="manifest">`, and that each linked URL resolves with HTTP 200 and the correct Content-Type.

### Out-of-scope

- Maskable icons (Android adaptive). Deferred — the issue's acceptance criteria don't list them, and adding them would require a second source SVG with safe-area padding. Add only if Lighthouse PWA flags it.
- Dark-mode-specific favicon (`<link rel="icon" media="(prefers-color-scheme: dark)">`). The chosen design uses a high-contrast dark frame on white, which reads on both light and dark tab strips; Chromium and WebKit both render the same icon for both schemes by default. Add only if visual smoke shows poor contrast.
- A favicon CI check that re-runs the generator and verifies the committed PNGs match (deterministic-build guard). Sharp's resampling is not bit-stable across versions, so a strict equality check would flap on dependency updates. Documented as a follow-up.
- Updating any other app/page. The library `packages/ui` ships components only; favicons live at the consumer (`apps/web`) level.

## I/O matrix

| Artefact                                   | Source             | Method                                       | Format    | Used by                            |
| ------------------------------------------ | ------------------ | -------------------------------------------- | --------- | ---------------------------------- |
| `public/icons/source/favicon-source.svg`   | hand-authored      | n/a                                          | SVG       | Generation script (input)          |
| `public/favicon-16x16.png`                 | generation script  | `sharp(svg).resize(16,16).png()`             | PNG       | `<link rel="icon" sizes="16x16">`  |
| `public/favicon-32x32.png`                 | generation script  | `sharp(svg).resize(32,32).png()`             | PNG       | `<link rel="icon" sizes="32x32">`  |
| `public/favicon.ico`                       | generation script  | `to-ico([buf16, buf32, buf48])`              | ICO       | Legacy fallback (`/favicon.ico`)   |
| `public/apple-touch-icon.png`              | generation script  | `sharp(svg).resize(180,180).flatten().png()` | PNG       | `<link rel="apple-touch-icon">`    |
| `public/android-chrome-192x192.png`        | generation script  | `sharp(svg).resize(192,192).png()`           | PNG       | `site.webmanifest` icons[]         |
| `public/android-chrome-512x512.png`        | generation script  | `sharp(svg).resize(512,512).png()`           | PNG       | `site.webmanifest` icons[]         |
| `public/site.webmanifest`                  | hand-authored JSON | n/a                                          | JSON      | `<link rel="manifest">`            |
| `apps/web/app/layout.tsx` `metadata.icons` | hand-authored TS   | n/a                                          | TS object | Next.js metadata API → emits links |

## Code map

### New files

- `apps/web/public/icons/source/favicon-source.svg` — single editable artefact; 32×32 viewBox, Memphis "D".
- `apps/web/scripts/generate-icons.ts` — Node/tsx script. Reads source SVG, fans out to PNG + ICO via `sharp` and `to-ico`. Idempotent.
- `apps/web/public/site.webmanifest` — JSON manifest (committed, not generated).
- `apps/web/public/favicon-{16x16,32x32}.png` — generated, committed.
- `apps/web/public/favicon.ico` — generated, committed.
- `apps/web/public/apple-touch-icon.png` — generated, committed.
- `apps/web/public/android-chrome-{192x192,512x512}.png` — generated, committed.
- `apps/web/scripts/__tests__/icons-output.test.ts` — vitest source-contract: every public/icon file exists; manifest is valid JSON with required fields.
- `e2e/tests/scenarios/favicon-suite.spec.ts` — Playwright: `/` emits the expected `<link>` tags and each URL is HTTP 200.

### Modified files

- `apps/web/app/layout.tsx` — add `metadata.icons` and `metadata.manifest`.
- `apps/web/app/__tests__/layout-metadata.test.tsx` (new or extended) — vitest assertion of `metadata.icons` shape.
- `apps/web/package.json` — add `"icons:generate": "tsx scripts/generate-icons.ts"` script and `sharp`, `to-ico`, `tsx` dev deps.

### Dependencies

Add to `apps/web/devDependencies`:

- `sharp` — already an implicit Next.js peer at runtime, but pinned here for explicit script use.
- `to-ico` — small (≈ 8 KB) lib with no transitive deps; only thing in the JS ecosystem that writes valid multi-res ICOs without a native ImageMagick install.
- `tsx` — for running the TS script without a build step.

## Tasks

1. **Author source SVG** — draw Memphis "D" at 32×32 viewBox, commit as `apps/web/public/icons/source/favicon-source.svg`.
2. **Build generation script** — `scripts/generate-icons.ts` reads the SVG, writes the 6 PNG sizes + ICO + (no manifest, that's hand-authored). Idempotent: same SVG → byte-stable outputs within a sharp version.
3. **TDD: write failing tests** —
   - `apps/web/scripts/__tests__/icons-output.test.ts`: each output file exists; `site.webmanifest` is valid JSON with `name`, `theme_color: "#7a3980"`, `icons[]` with the two required sizes.
   - `apps/web/app/__tests__/layout-metadata.test.tsx`: importing `metadata` from `app/layout.tsx` exposes `icons` with `icon`, `apple`, `shortcut` entries pointing to existing files, and `manifest: "/site.webmanifest"`.
   - `e2e/tests/scenarios/favicon-suite.spec.ts`: `goto('/')` → page contains `link[rel="icon"]`, `link[rel="apple-touch-icon"]`, `link[rel="manifest"]`; fetch each `href` → 200 + correct Content-Type.
4. **Implement to GREEN** —
   - Run `pnpm --filter @damo/web run icons:generate` to produce the PNGs + ICO.
   - Hand-author `site.webmanifest`.
   - Wire `metadata.icons` + `metadata.manifest` in `app/layout.tsx`.
5. **Run quality gates** — `pnpm --filter @damo/web test`, `pnpm --filter @damo/web run lint`, `pnpm --filter @damo/web run typecheck`, `pnpm --filter @damo/web build`.
6. **Multi-agent review** — three rounds (code-reviewer, security-reviewer, edge-case-hunter) on the diff. Fix HIGH/CRITICAL findings even if out-of-scope.
7. **Run e2e** — `cd e2e && pnpm exec playwright test favicon-suite --project=chromium`. Then full suite to confirm no regressions.
8. **Visual smoke** — open `http://localhost:3000` in Chrome, Safari, Firefox; confirm tab icon is the Memphis D and not Next.js' default. Run Lighthouse PWA audit; confirm "Has a favicon" passes.
9. **Kipi handshake** — append paths to `_bmad/agents/kipi/workflow-state.json` `workflows.update.queued[]`.
10. **Open PR**, stop before merge for the user's final approval.

## Acceptance criteria

- AC-1 (source SVG): `apps/web/public/icons/source/favicon-source.svg` exists, valid SVG, 32×32 viewBox.
- AC-2 (generated set): all six output files exist in `apps/web/public/` with the exact names from the I/O matrix; each PNG validates as a non-empty image of the specified dimensions.
- AC-3 (manifest): `apps/web/public/site.webmanifest` parses as JSON; has required keys (`name`, `short_name`, `icons` with 192 + 512, `theme_color`, `background_color`, `display`, `start_url`); `theme_color` is `"#7a3980"`.
- AC-4 (Next.js metadata wiring): `apps/web/app/layout.tsx` exports `metadata.icons` (with `icon`, `apple`, `shortcut`) and `metadata.manifest`; no manual `<link rel="icon">` / `<link rel="manifest">` tags anywhere in `apps/web/app/`.
- AC-5 (runtime emission): `/` HTML response includes `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="manifest">` (verified by Playwright via `page.locator`).
- AC-6 (asset reachability): each linked icon URL responds 200 with the right Content-Type (image/png, image/x-icon, application/manifest+json).
- AC-7 (Lighthouse): "Has a favicon" PWA check passes (manual run on localhost; documented in PR notes — not in CI).
- AC-8 (regeneration determinism): re-running `pnpm --filter @damo/web run icons:generate` from the same source SVG and `sharp` version produces identical output bytes (verified via `git diff` after re-run; not asserted in CI to avoid flapping on `sharp` version bumps).
- AC-9 (typecheck/build/test/lint clean): all gates green.

## Design notes

### Why commit generated PNGs

Three options were considered: (a) commit generated artefacts, (b) regenerate on `next build`, (c) regenerate in CI and upload as build artefact.

- (b) ties the docs build to a successful `sharp` install on Vercel. Sharp ships native binaries; cold-start install can flap on minor toolchain drift.
- (c) requires a CI job that runs before deploy, adding ~30 s to every deploy.
- (a) is simplest, gives byte-stable URLs (good for browser caching), and the inputs only change when the SVG does — which is rare.

Path (a) is the project convention for fonts, mascot art, and other generated-once assets.

### Why a separate `to-ico` dep instead of asking `sharp` to write ICO

`sharp` does not write ICO format (verified against `sharp@0.33.x`'s supported output formats list — only WebP / AVIF / JPEG / PNG / TIFF / GIF / HEIF / JP2 / JXL / raw). The ecosystem alternatives:

- **`to-ico`**: ~8 KB, zero transitive runtime deps, accepts an array of PNG buffers and emits a multi-res ICO. Battle-tested (~5 M weekly downloads).
- **`png-to-ico`**: similar surface, but stale (last release > 4 years).
- **ImageMagick CLI**: works, but requires native install on every dev machine and CI runner.

`to-ico` wins on minimal-dep, no-native-install, and currency.

### Why theme_color = `#7a3980` (purple) instead of `#c4942a` (gold)

The docs palette uses `--brand-500: #c4942a` (gold) for `--primary` and `--ink-500: #7a3980` (purple) for `--secondary`. The mascot's signature feature (the axolotl coloring) is purple, and most users will pattern-match the brand to that color. The favicon's `theme_color` (Android Chrome address bar tint) is a single value with no light/dark fork, so we pick the more memorable of the two.

### Why hand-authored manifest instead of generated

The manifest contains stable strings (`name`, `short_name`, `theme_color`) that change rarely and are best version-controlled directly. Generating it from JS would add complexity without benefit; a 30-line JSON file is the minimum viable artefact.

### Failure modes intentionally not handled

- **`sharp` install fails locally**: the script exits with the install error. The user sees the failure and runs `pnpm install`. We don't attempt a fallback (e.g. shelling out to ImageMagick) — sharp is a Next.js peer dep that's expected to install successfully in any working Next.js dev environment.
- **`favicon-source.svg` is malformed**: `sharp` throws. Same logic — fail loud.
- **`/site.webmanifest` Content-Type mismatch in production**: Next.js serves files from `public/` based on extension; `.webmanifest` maps to `application/manifest+json` by default in Next 15. Verified by AC-6.

## Verification

- Vitest source-contract suite (`pnpm --filter @damo/web test`): all `icons-output.test.ts` and `layout-metadata.test.tsx` cases pass.
- Playwright e2e (`cd e2e && pnpm exec playwright test favicon-suite --project=chromium`): the new spec passes; the full suite shows no regressions.
- Manual verification: open `http://localhost:3000` in Chrome and Safari, confirm tab icon is the Memphis D. Lighthouse PWA audit on the same URL — "Has a favicon" passes.
- Build verification: `pnpm --filter @damo/web build` completes; `.next/server/app/layout.js` references `/favicon.ico`, `/site.webmanifest`, etc.
