# CI / CD

Status: documented · Last scan: 9a573e8 · Sources:
`.github/workflows/ci.yml`, `.github/workflows/publish.yml`, `.npmrc`.

## Summary

Two GitHub Actions workflows govern the repo:

1. **CI** (`ci.yml`) — every push or PR to `main`. Runs format check,
   lint, build, typecheck, unit tests, then E2E. Two jobs in series:
   `lint-and-test` → `e2e`.
2. **Publish** (`publish.yml`) — tag-driven (`damo-ui@*`), builds the lib
   and publishes the unscoped `damo-ui` package to **public npm**
   (`registry.npmjs.org`) with `access: public`. **Currently disabled**
   (`if: false`) until Phase 5 (#82) of the publication roadmap (#77).
   Retargeted from GitHub Packages in gh-79.

Both runners are `ubuntu-latest` with pnpm + Node 20. The repo is
private (until Phase 4, #81); no security scans, no dependency audit,
no automated deploy yet.

## Layout

```
.github/
└── workflows/
    ├── ci.yml       ← every push/PR to main
    └── publish.yml  ← tag push v*, currently disabled
.npmrc               ← pnpm config consumed by both workflows + dev
```

## CI workflow (`ci.yml`)

### Trigger

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

A PR push fires both `push` (on the source branch) and `pull_request`
(on `refs/pull/N/merge`) for the same SHA. Concurrency below de-dupes.

### Concurrency

```yaml
concurrency:
  group: ci-${{ github.workflow }}-${{ github.head_ref || github.ref }}
  cancel-in-progress: true
```

The `head_ref || ref` fallback is **load-bearing**: `github.head_ref`
is populated only on `pull_request` events (source branch name);
`github.ref` differs across `push` (`refs/heads/x`) and `pull_request`
(`refs/pull/N/merge`). Without the fallback, both events resolve to
different group keys and no cancellation happens — defeating the
optimization. (Discovered during PR #90 code review.)

### Job graph

```
lint-and-test  ─────►  e2e
                      (needs: lint-and-test)
```

Sequential, not parallel. If `lint-and-test` fails, `e2e` is skipped
entirely (artifact never consumed → see Notes #4).

### `lint-and-test` job

| Step                    | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `actions/checkout@v4`   | Fetch sources                                                     |
| `pnpm/action-setup@v4`  | Install pnpm                                                      |
| `actions/setup-node@v4` | Node 20, **`cache: 'pnpm'`** restores the pnpm store              |
| Install                 | `pnpm install --frozen-lockfile`                                  |
| Format check            | `pnpm format:check` (prettier)                                    |
| Lint                    | `pnpm lint` — runs all package linters + `check-docs-sync.mjs`    |
| Build lib               | `pnpm build` (builds `damo-ui` only; web is built in `e2e`)       |
| **Upload lib build**    | `actions/upload-artifact@v4` → `damo-ui-dist` (1 day, error-fail) |
| Typecheck               | `tsc --noEmit` for both `damo-ui` and `@damo/web`                 |
| Unit tests              | `pnpm test` (vitest under `damo-ui`)                              |

**Ordering note:** `Upload lib build` runs **before** typecheck and
unit tests. Safe in practice because the downstream `e2e` job needs
the entire `lint-and-test` job to succeed (`needs:`), so a typecheck
or test failure means `e2e` is skipped and the artifact is never
consumed. Still surprising — flagged in PR #90 review.

### `e2e` job

| Step                          | Purpose                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| Checkout, setup-node, install | Same as `lint-and-test`                                       |
| **Download lib build**        | `actions/download-artifact@v4` of `damo-ui-dist`              |
| **Cache Playwright browsers** | `actions/cache@v4` on `~/.cache/ms-playwright`                |
| Install Playwright browsers   | Skipped on cache hit (`if: ... cache-hit != 'true'`)          |
| Install Playwright deps       | `playwright install-deps chromium webkit` — **always runs**   |
| **Build web (production)**    | `pnpm --filter @damo/web build` (output: `apps/web/.next/`)   |
| Run e2e                       | `pnpm test:e2e` — Playwright boots `next start` (see 15-e2e)  |
| Upload Playwright artifacts   | `if: failure()` — HTML report + traces + videos, retention 7d |

The Playwright `webServer` is **CI-aware** (PR #90, see
`30-cross-cutting/15-e2e.md` — Configuration). In CI it boots
`next start` against the freshly-built `.next`; locally it stays on
`next dev`.

### Caching strategy

| Layer            | Mechanism                            | Key                                  | Invalidates on             |
| ---------------- | ------------------------------------ | ------------------------------------ | -------------------------- |
| pnpm store       | `actions/setup-node` `cache: 'pnpm'` | (managed by setup-node)              | `pnpm-lock.yaml` change    |
| Playwright bins  | `actions/cache@v4`                   | `playwright-${{os}}-${{hashFiles}}`  | `pnpm-lock.yaml` change    |
| Lib build output | `actions/upload/download-artifact`   | `damo-ui-dist` (per-run, not cached) | every run rebuilds the lib |

System apt deps for Playwright (`install-deps`) **cannot** be cached
across runs — apt-get state is not portable between runners. ~46s
every run.

The Playwright browser cache key uses `hashFiles('pnpm-lock.yaml')`
rather than the `@playwright/test` version directly. Slight
over-invalidation (a UI dep change also drops the browser cache), but
guaranteed correctness — the lockfile is the ground truth for what
will install. No `restore-keys` fallback: a partial restore from an
older `@playwright/test` version causes the client to refuse the
binaries at startup, so the fallback would actively break the job
without saving any time. (Decision documented in PR #90 spec change
log.)

### Failure artifacts

Only on failure (`if: failure()`):

- `playwright-report` — HTML report + traces + videos + screenshots
  for each failed spec, retention 7 days.

The `damo-ui-dist` artifact has 1-day retention and is intended for
intra-run consumption only; not a release artifact.

## Publish workflow (`publish.yml`)

### Trigger

```yaml
on:
  push:
    tags:
      - 'damo-ui@*'
```

Retargeted from `v*` to `damo-ui@*` in gh-79 so future ecosystem
packages (`@damo-ui/cli`, `@damo-ui/registry`, `@damo-ui/mcp`) can
sit on parallel tag namespaces (`damo-ui-cli@*`, etc.) without
colliding.

### Status: DISABLED

```yaml
jobs:
  publish:
    if: false   # flip to true at Phase 5 (#82); provision NPM_TOKEN first
    ...
```

Tag pushes (e.g. `damo-ui@0.4.0`) do **not** publish today. Re-enabling
requires (in order):

1. Phase 3 (#80) — git history cleaned via `filter-repo`.
2. Phase 4 (#81) — repo flipped to public visibility.
3. Provision `NPM_TOKEN` repo secret (npm automation token,
   "Publish" scope).
4. Phase 5 (#82) — flip `if: false` → `if: true`, bump version to
   `0.4.0`, push the `damo-ui@0.4.0` tag.

### Permissions

```yaml
permissions:
  contents: read
  id-token: write
```

`id-token: write` enables npm provenance attestation (npm 9.5+).
The default `GITHUB_TOKEN` is otherwise sufficient — no PAT
needed for the read-only checkout. `NPM_TOKEN` (provisioned as a
repo secret) carries the publish credential.

### Auth + registry

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
    registry-url: 'https://registry.npmjs.org'
```

`setup-node` writes `~/.npmrc` on the runner with the right registry
URL + auth-token mapping. The job's `pnpm publish` step then sees the
publish credential via `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}`.
No `scope` is set — `damo-ui` is unscoped.

### Publish command

```yaml
- run: pnpm --filter damo-ui publish --access public --no-git-checks
```

- `--access public` — required because npm-classic interprets the
  default `restricted` as "private (paid)"; `damo-ui` is the
  free-tier public package.
- `--no-git-checks` — pnpm normally refuses to publish from a
  non-clean working tree or a tag-mismatched branch; the runner's
  working tree is clean (fresh checkout) so this is safe and shorter
  than configuring git identity.

## Quality gates

| Check                          | Workflow                | Step                                  |
| ------------------------------ | ----------------------- | ------------------------------------- |
| Prettier formatting            | `ci` lint-and-test      | Format check                          |
| ESLint + `check-docs-sync.mjs` | `ci` lint-and-test      | Lint                                  |
| Lib build                      | `ci` lint-and-test      | Build lib                             |
| Typecheck (`damo-ui`)          | `ci` lint-and-test      | Typecheck                             |
| Typecheck (`@damo/web`)        | `ci` lint-and-test      | Typecheck                             |
| Unit tests (vitest)            | `ci` lint-and-test      | Unit tests                            |
| E2E (chromium + webkit)        | `ci` e2e                | Run e2e                               |
| Web prod build                 | `ci` e2e                | Build web (production)                |
| Security / dep audit           | _(none — see OQ #2)_    | _(no pnpm audit, Dependabot, CodeQL)_ |
| Visual regression              | _(none — 15-e2e OQ #2)_ |                                       |

## Performance optimizations (PR #90)

Four changes that cut wall-clock by ~22s on cache hit and reduced
per-run waste considerably:

1. **Concurrency cancel-in-progress** — superseded PR runs are killed.
2. **Playwright browser cache** — `~/.cache/ms-playwright`, ~20s saved
   on cache hit.
3. **Lib build artifact reuse** — `e2e` no longer reruns `pnpm build`,
   ~30–60s saved.
4. **Production webserver in CI** — Playwright runs against
   `next start` instead of `next dev`. Faster first request, no HMR
   overhead.

Detailed step-by-step deltas in `30-cross-cutting/15-e2e.md` →
"Running in CI" section.

## Local config: `.npmrc`

```
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
prefer-workspace-packages=true
```

The runner consumes this `.npmrc` identically to a developer's
machine — all four flags affect `pnpm install --frozen-lockfile`
behavior. Notable:

- `auto-install-peers=true` — peer deps (e.g. `react`, `tailwindcss`)
  are auto-resolved from the workspace's hoisted set. Without this,
  every package would need to declare them as devDependencies.
- `strict-peer-dependencies=false` — peer-dep version mismatches are
  warnings, not errors. Tradeoff for monorepo flexibility.
- `prefer-workspace-packages=true` — `workspace:*` deps resolve to
  the in-repo source, not the published version on the registry.

## Notes & gotchas

1. **Publish is disabled.** `publish.yml` jobs include `if: false`.
   Tag pushes succeed (workflow appears in Actions history) but do
   nothing. Don't rely on tags as a release signal until the flag
   flips.
2. **Concurrency `head_ref || ref` is load-bearing** (PR #90). Don't
   simplify to `${{ github.ref }}` — it silently re-introduces
   double-runs on PR pushes.
3. **`needs: lint-and-test` skips e2e on any upstream failure.** A
   typecheck or unit-test failure means no E2E feedback at all on
   that run. Acceptable trade for the ordering, but worth knowing.
4. **Browser cache invalidates on any pnpm-lock change.** Slight
   over-invalidation accepted as a tradeoff for guaranteed
   correctness (no version-mismatch crashes).
5. **No required-status-check verification yet.** Repo is private;
   branch protection settings have not been audited from this
   chapter (see Open Q #1).
6. **Repo allows merge / squash / rebase merges.** Project preference
   is `--merge` (preserve commit-by-commit history; `--squash` is
   blocked at the harness level for this user).

## How to extend

- **Add a new check that should block merge** — append a step inside
  `lint-and-test` (sequential, blocks the rest of the job) or create
  a new top-level job (parallel to `lint-and-test`, no `needs:`).
- **Add a Playwright browser** — add a `projects:` entry in
  `e2e/playwright.config.ts` AND extend the install steps in
  `ci.yml` (`playwright install <browser>` and
  `playwright install-deps <browser>`).
- **Add a new artifact for debugging** — `actions/upload-artifact@v4`
  inside the relevant job, gated on `if: failure()` to avoid
  uploading on green runs.
- **Enable publish** — flip `if: false` → `if: true` in
  `publish.yml` after Phase 5 (#82) prereqs are met (history clean,
  repo public, `NPM_TOKEN` provisioned). Verify by pushing a
  pre-release tag (e.g. `damo-ui@0.4.0-test`) and checking the npm
  registry.
- **Add a deploy workflow** — currently none. The intended target
  (Vercel? GH Pages? Cloud Run?) is unsettled (Open Q #5).

## Open questions

1. **Required status checks in branch protection** — not yet audited
   here. Recommended: gate `lint-and-test` and `e2e` as required to
   merge into `main`. Run
   `gh api repos/<owner>/<repo>/branches/main/protection` to inspect.
2. **No security / dependency audit** — no `pnpm audit`, no
   Dependabot config, no CodeQL. For a private repo pre-publish
   this is tolerable, but should land before the first public
   release.
3. **No `.next` cross-run cache** — the e2e job rebuilds `apps/web`
   every run (~70s). A cache keyed on `pnpm-lock.yaml` +
   `apps/web/**` hash would help, but cache invalidation gets
   tricky (Next persistent cache vs source-change detection).
4. **E2E sharding** — currently a single runner does both chromium
   - webkit (~6:41 min). Sharding via Playwright's native
     `--shard=N/M` flag would halve wall-clock at the cost of double
     runner consumption. Threshold for the trade: ~10+ min e2e, or
     when total wall-clock matters more than CI minutes.
5. **No web-app deploy workflow** — placeholder OQ. Target is
   undecided (Vercel auto-deploy from main? GH Pages? Cloud Run?).
6. **`.npmrc` for consumers** — when publish is enabled, will
   downstream consumers need a `.npmrc` shipped with the package
   (or instructions in the README) to resolve peer-dep behavior
   consistently? Worth verifying with a real install in a fresh
   project before the first release.
