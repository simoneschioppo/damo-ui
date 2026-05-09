---
title: 'CI performance optimization (Playwright cache + concurrency + artifact reuse + prod webserver)'
type: 'chore'
created: '2026-05-09'
status: 'in-progress'
baseline_commit: '5addbb8fc7a336c9010064c453d6e801c831956e'
context:
  - '{project-root}/.github/workflows/ci.yml'
  - '{project-root}/e2e/playwright.config.ts'
  - '{project-root}/apps/web/package.json'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** CI takes ~20+ minutes per run; the "Install Playwright browsers" step alone costs ~3-5 min and runs every time because the browser binaries aren't cached. Additionally `lint-and-test` and `e2e` jobs both run `pnpm install --frozen-lockfile` + `pnpm build`, and `e2e` boots the Next.js dev server (slow first-paint, HMR overhead) instead of a production build.

**Approach:** Apply 4 targeted optimizations to `.github/workflows/ci.yml` and `e2e/playwright.config.ts`:

- **A** — cache `~/.cache/ms-playwright` keyed on `pnpm-lock.yaml` hash;
- **B** — add `concurrency` with `cancel-in-progress: true` to drop superseded PR runs;
- **C1** — share `packages/ui/dist` between jobs via `actions/upload-artifact` / `download-artifact`;
- **E** — switch Playwright `webServer` to `next start` against a prebuilt `.next` when `process.env.CI` is set.

## Boundaries & Constraints

**Always:**

- Local dev workflow (`pnpm test:e2e` from terminal) must keep working unchanged → gate prod-server vs dev-server in `playwright.config.ts` via `process.env.CI`.
- Cache key must invalidate when `@playwright/test` version changes; using `hashFiles('pnpm-lock.yaml')` is sufficient (lockfile hash changes on any dep update).
- Browser install runs only on cache miss; `playwright install-deps` (system apt packages) runs every time (apt-get can't be cached across runs).
- CI must succeed end-to-end on a cold-start (no cache).

**Ask First:**

- If branch protection requires the `e2e` check name to remain identical — assume yes, do NOT rename the job.
- If `apps/web/.next` build needs cross-run caching — out of scope here, defer.

**Never:**

- Don't add `paths-ignore` filters (option F) — out of scope.
- Don't shard E2E across multiple runners (option D) — out of scope.
- Don't cache `node_modules` directly — `setup-node` `cache: 'pnpm'` already handles the pnpm store.
- Don't use `playwright install --with-deps` in the cached path (it would re-pull system deps on every cache hit, defeating the optimization).
- Don't introduce new third-party actions beyond `actions/cache@v4` and the already-present `actions/upload-artifact@v4` / `download-artifact@v4`.

</frozen-after-approval>

## Code Map

- `.github/workflows/ci.yml` — primary file: add concurrency block, cache step, artifact upload/download, web build step, split Playwright install
- `e2e/playwright.config.ts` — `webServer.command` becomes CI-aware (prod start in CI, dev locally)
- `apps/web/package.json` — verified: `build` (`next build`) and `start` (`next start --port 3000`) scripts already present
- `packages/ui/dist/` — uploaded as artifact `damo-ui-dist` from `lint-and-test`, downloaded in `e2e`
- `apps/web/.next/` — built fresh inside `e2e` job (no cross-run caching for now)

## Tasks & Acceptance

**Execution:**

- [x] `.github/workflows/ci.yml` — add top-level `concurrency: { group: ci-${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`
- [x] `.github/workflows/ci.yml` — in `lint-and-test`, after the `Build lib` step: upload `packages/ui/dist` as artifact `damo-ui-dist` (retention 1 day)
- [x] `.github/workflows/ci.yml` — in `e2e`: replace the `Build lib` step with a `download-artifact` step that restores `packages/ui/dist` from `damo-ui-dist`
- [x] `.github/workflows/ci.yml` — in `e2e`: add `actions/cache@v4` step before Playwright install, path `~/.cache/ms-playwright`, key `playwright-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}`, restore-keys `playwright-${{ runner.os }}-`
- [x] `.github/workflows/ci.yml` — in `e2e`: split current single Playwright step into (a) `playwright install chromium webkit` gated by `if: steps.<cache-id>.outputs.cache-hit != 'true'`, and (b) `playwright install-deps chromium webkit` always
- [x] `.github/workflows/ci.yml` — in `e2e`: add a `pnpm --filter @damo/web build` step before `Run e2e`
- [x] `e2e/playwright.config.ts` — change `webServer.command` to `process.env.CI ? 'pnpm --filter @damo/web start' : 'pnpm --filter @damo/web dev'`

**Acceptance Criteria:**

- Given a second CI run on the same branch, when the e2e job starts, then the Playwright cache step reports `cache-hit=true` and the browser install step is skipped.
- Given two consecutive pushes to an open PR, when the second push triggers CI, then the first run is cancelled in-progress (`cancel-in-progress` honored).
- Given the `e2e` job, when it starts, then it downloads `packages/ui/dist` as the `damo-ui-dist` artifact instead of running `pnpm build`.
- Given Playwright's `webServer` boot in CI, when the job runs, then the command is `pnpm --filter @damo/web start` (production server) and HTTP 200 is returned within 10s.
- Given a developer running `pnpm test:e2e` locally without `CI=1`, when Playwright boots `webServer`, then the command remains `pnpm --filter @damo/web dev` (HMR preserved).
- Given a fresh repo with empty caches (cold-start), when CI runs, then both jobs succeed end-to-end without manual intervention.

## Verification

**Commands:**

- `node -e "const yaml=require('js-yaml');yaml.load(require('fs').readFileSync('.github/workflows/ci.yml','utf8'))"` — expected: parses without throwing (YAML well-formed). Fallback: `yamllint .github/workflows/ci.yml` if installed.
- `CI=1 pnpm --filter @damo/web build && CI=1 pnpm --filter @damo/e2e exec playwright test --list` — expected: tests enumerated, no syntax error in playwright.config.ts.
- `pnpm test:e2e` (locally, no CI env) — expected: still uses `next dev`, tests pass.

**Manual checks (post-push):**

- GH Actions UI shows "Cache Playwright browsers" with `Cache restored from key: ...` on the second run for this branch.
- Total `e2e` job wall-clock reduced by 3-5 min on cache hit vs cold-start.
- Push twice quickly to the PR; first run shows status "cancelled" in GH Actions.
