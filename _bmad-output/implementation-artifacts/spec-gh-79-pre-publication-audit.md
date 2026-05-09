# Spec gh-79 — [Phase 2] Minimum-viable pre-publication audit

> **Status:** READY-FOR-DEV.
> **Issue:** #79 (part of Epic #77).

## 1. Intent

Bring the repo to "minimum viable launch" state for npm public — focused on **blocking items only**. Polish (CONTRIBUTING/SECURITY/issue templates) is deferred to post-1.0.

This phase finalises the package surface so Phase 3 (#80, history clean) and Phase 5 (#82, soft launch on public npm) can run mechanically without further surprises.

## 2. Boundaries

### In scope (the blocking checklist from #79)

- [ ] `LICENSE` (MIT) added to repo root
- [ ] `npm audit` passes (no high/critical) — recheck and document residue
- [ ] `pnpm test` all green (lib + web)
- [ ] `pnpm test:e2e` all green
- [ ] `pnpm build` produces consistent dist with correct exports map
- [ ] `tsc --noEmit` (typecheck) green at workspace level
- [ ] `pnpm lint` green
- [ ] `pnpm format:check` green
- [ ] README.md reworked for public consumers — install snippet, basic usage example, "0.x preview, breaking changes possible at 1.0" disclaimer
- [ ] `PUBLICATION_READINESS.md` refreshed and used as the working checklist
- [ ] Naming finalized everywhere: `damo-ui` package name, `@damo-ui/*` reserved scope

### Out of scope (deferred to later phases or post-1.0)

- CONTRIBUTING.md polish (post-1.0)
- SECURITY.md (post-1.0)
- CODE_OF_CONDUCT.md (post-1.0)
- Issue / PR templates (post-1.0)
- Bundle size / accessibility deep-audit (post-1.0)
- Actual `npm publish` to public registry — that is Phase 5 (#82)
- Repo public-visibility flip — that is Phase 4 (#81)
- Git history filter-repo — that is Phase 3 (#80)

## 3. Naming decision (canonical)

**Old surface:** `@damo/ui` (scoped, restricted on GitHub Packages).
**New canonical surface:** `damo-ui` (unscoped, MIT, public npm).
**Reserved scope:** `@damo-ui/*` for ecosystem packages (`@damo-ui/cli`, `@damo-ui/mcp`, `@damo-ui/registry`, …) introduced from Phase 6 onward.

Rationale:

- shadcn-style ecosystems prefer a short root name with scoped satellites (`shadcn-ui` + `@shadcn/ui` plugins, etc.). Same blueprint here.
- The unscoped `damo-ui` name is install-friendly (`pnpm add damo-ui`) and matches the GitHub repo slug.
- `@damo/*` (the current scope) is a generic two-letter scope that we cannot guarantee is free on public npm; renaming now avoids a forced rename mid-1.0.

### Rename mechanics

- `packages/ui/package.json`: `@damo/ui` → `damo-ui`. Drop `publishConfig.registry` (GitHub Packages) so the future `pnpm publish` defaults to npmjs.org. Switch `access` to `public`. Bump nothing yet — version stays `0.3.0`; the `0.4.0` bump and `1.0.0` cutover live in #82 and #88.
- `apps/web/package.json`: dependency entry renamed `@damo/ui` → `damo-ui`. Workspace protocol unchanged (`workspace:*`).
- `pnpm-workspace.yaml`: no change (globs only).
- `.npmrc` (root): no change. The consumer-side `.npmrc` snippet in README that pinned `@damo:registry=https://npm.pkg.github.com` gets removed.
- All `import … from '@damo/ui'` and `'@damo/ui/...'` subpath imports across `apps/web/`, `e2e/`, `packages/ui/src/`, and `scripts/` flip to `damo-ui` / `damo-ui/...`.
- Stories / tests inside `packages/ui/` that self-reference (`@damo/ui` for showcase imports) flip to `damo-ui` to match the published surface.

### Artefacts that stay frozen

- `_bmad-output/**` historical specs (gh-60/61/64/66/78/91/93/95) — historical record, leave references to `@damo/ui` intact.
- `docs/plans/`, `docs/specs/` — historical planning docs; leave as-is.
- `CHANGELOG.md` — historical entries describing what shipped under `@damo/ui` stay; the new "Unreleased" entry for the rename gets added on top.
- `core-knowledge/**` — never edited directly; queued via Kipi handshake at the end.

## 4. Code map

| File                                                                        | Change                                                                                                                                                                      |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LICENSE`                                                                   | NEW — MIT, copyright "(c) 2026 Simone Schioppo"                                                                                                                             |
| `packages/ui/package.json`                                                  | rename `@damo/ui` → `damo-ui`; drop GH Packages `publishConfig`; set `access: public`; widen `repository.directory` if needed                                               |
| `packages/ui/README.md`                                                     | rename references; align with public-consumer narrative                                                                                                                     |
| `packages/ui/src/components/accordion/accordion.stories.tsx`                | `'@damo/ui'` → `'damo-ui'` self-import                                                                                                                                      |
| `packages/ui/src/styles/globals.css`                                        | comment refs `@damo/ui` → `damo-ui`                                                                                                                                         |
| `packages/ui/tailwind.preset.ts`                                            | comment refs (no behaviour change)                                                                                                                                          |
| `apps/web/package.json`                                                     | dependency `@damo/ui` → `damo-ui`                                                                                                                                           |
| `apps/web/**/*.{ts,tsx}` (~75 files)                                        | imports `'@damo/ui'` and `'@damo/ui/<sub>'` → `'damo-ui'` / `'damo-ui/<sub>'`                                                                                               |
| `e2e/tests/scenarios/docs-shell.spec.ts`                                    | string refs to `@damo/ui` → `damo-ui`                                                                                                                                       |
| `scripts/check-docs-sync.mjs`                                               | rename docstring/string refs (logic uncoupled)                                                                                                                              |
| `README.md` (root)                                                          | rewrite as public-consumer landing — install snippet (`pnpm add damo-ui`), Tailwind v4 wiring, basic usage, "0.x preview" disclaimer; drop GH Packages `.npmrc` block       |
| `CONTRIBUTING.md`                                                           | s/`@damo/ui`/`damo-ui`/g without changing rule wording                                                                                                                      |
| `CHANGELOG.md`                                                              | new "Unreleased" entry: "Renamed package `@damo/ui` → `damo-ui`. GH Packages registry retired in favour of public npm. Reserved scope `@damo-ui/*` for ecosystem packages." |
| `PUBLICATION_READINESS.md`                                                  | refresh: new package name, updated re-run checklist, post-rename audit results, blocking-list status table                                                                  |
| `_bmad-output/implementation-artifacts/spec-gh-79-pre-publication-audit.md` | this file (NEW)                                                                                                                                                             |

## 5. Tasks (execution order)

1. **Snapshot baseline** — record current `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm build`, `tsc --noEmit`, `npm audit` output before any change. Confirms the audit is starting from green.
2. **LICENSE** — drop in MIT text at repo root.
3. **Coordinated rename** in one commit:
   - `packages/ui/package.json` — name + publishConfig.
   - `apps/web/package.json` — dependency entry.
   - `pnpm install` to refresh the lockfile.
   - Bulk find/replace of `@damo/ui` → `damo-ui` across `apps/web/`, `e2e/`, `packages/ui/src/`, `packages/ui/__tests__/`, `packages/ui/tailwind.preset.ts`, `packages/ui/README.md`, `scripts/check-docs-sync.mjs`.
   - Verify: `grep -r "@damo/ui" apps packages e2e scripts` returns 0 hits.
4. **README rewrite** — public-consumer install + usage; drop GH Packages snippet; add "0.x preview" disclaimer.
5. **CONTRIBUTING + CHANGELOG** — s/g rename + new "Unreleased" rename entry on top.
6. **PUBLICATION_READINESS refresh** — recompute the snapshot table; flip the blocking checklist to live status; add a "Post-rename audit (gh-79)" section noting the rename, lockfile refresh, and zero-grep verification.
7. **Verification loop** (must all pass before PR):
   - `pnpm install` clean.
   - `pnpm --filter damo-ui test` (lib unit).
   - `pnpm --filter @damo/web test` (web unit).
   - `pnpm lint`.
   - `pnpm format:check`.
   - `pnpm --filter damo-ui build` — inspect `dist/`.
   - `pnpm --filter @damo/web build`.
   - `pnpm --filter damo-ui exec tsc --noEmit`.
   - `pnpm --filter @damo/web exec tsc --noEmit`.
   - `pnpm --filter @damo/e2e test -- --project=chromium --workers=1`.
   - `pnpm audit` — record any high/critical (must be empty for AC).
8. **Multi-agent review** — code-reviewer + security-reviewer (focus on rename completeness + LICENSE attribution + README accuracy).
9. **Kipi `*4 Update Knowledge` handshake** — queue the touched paths so the user can later sync `core-knowledge/30-cross-cutting/10-ci-cd.md`, `core-knowledge/10-library/00-architecture.md`, `core-knowledge/10-library/30-build-and-publish/README.md`.
10. **PR** — open against `main`, wait for CI, **STOP**. The user explicitly merges after live verification (per persistent feedback memory: PR merge requires explicit user consent, never auto-merge on green CI).

## 6. Acceptance criteria

- **AC-1 (LICENSE):** `LICENSE` exists at repo root, MIT, attributed to Simone Schioppo, year 2026.
- **AC-2 (npm audit):** `pnpm audit --prod` reports 0 high and 0 critical (devDeps moderate findings allowed and noted in PUBLICATION_READINESS).
- **AC-3 (tests green):** `pnpm test` (lib 345/345 + web 82/82) and `pnpm --filter @damo/e2e test --workers=1` (71/71 chromium) both green after rename.
- **AC-4 (build green):** `pnpm --filter damo-ui build` emits `dist/` with all `exports` paths resolving (ESM + DTS + CSS + Tailwind preset). `pnpm --filter @damo/web build` static-exports without error.
- **AC-5 (typecheck green):** `tsc --noEmit` green in both `packages/ui` and `apps/web`.
- **AC-6 (lint + format green):** `pnpm lint` (eslint + docs-sync) and `pnpm format:check` both green.
- **AC-7 (README):** Root README contains an unscoped install snippet (`pnpm add damo-ui`), Tailwind v4 setup, basic usage example, "0.x preview, breaking changes possible at 1.0" disclaimer, and **no** GH Packages `.npmrc` block.
- **AC-8 (PUBLICATION_READINESS):** `PUBLICATION_READINESS.md` is refreshed with a post-rename snapshot table, the blocking checklist mirrors AC-1–AC-7 with PASS/FAIL, and the re-run section uses `damo-ui` filter names.
- **AC-9 (rename completeness):** `grep -r "@damo/ui" apps packages e2e scripts` returns 0 hits. The `_bmad-output/`, `docs/specs/`, `docs/plans/`, and `core-knowledge/` directories are intentionally excluded (historical / Kipi-owned).
- **AC-10 (package surface):** `packages/ui/package.json` declares `name: "damo-ui"`, `publishConfig.access: "public"`, **no** `publishConfig.registry`, and the same `exports` map as before (paths unchanged, only the consumer-facing import specifier changes).

## 7. Risk register

| Risk                                                                                   | Mitigation                                                                                                                          |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Stale lockfile after rename → `pnpm install` complains                                 | Always run `pnpm install` immediately after the package.json edits in step 3                                                        |
| A subpath import (`@damo/ui/mocks`, `@damo/ui/styles/...`) gets missed by find/replace | Final `grep -r "@damo/ui"` over `apps packages e2e scripts` is the AC-9 safety net                                                  |
| `tailwind.preset` consumer path changes break v3 consumers                             | Comment-only edits inside the preset; subpath `damo-ui/tailwind.preset` already matches the `exports` key                           |
| README disclaimer omitted, sets wrong expectations on first install                    | Explicit AC-7 listing the disclaimer string                                                                                         |
| Auto-merge on CI green                                                                 | Persistent memory rule: never merge without explicit user consent. Step 10 explicitly stops at "PR open + CI green"                 |
| Rename happens here but Phase 5 (#82) re-renames                                       | Spec section 3 freezes the canonical name as `damo-ui` for all subsequent phases; #82 will only flip the version + actually publish |

## 8. Dev notes

- The `@damo/web` workspace name **stays `@damo/web`** — that is the private docs/showcase app, never published. Only the library and its future ecosystem siblings move under the `damo-ui` / `@damo-ui/*` umbrella.
- The lib's published API (`exports` map keys) does **not** change. Only the consumer's import specifier changes from `@damo/ui` to `damo-ui`.
- After this PR merges, Phase 3 (#80, history scrub) can run on a clean naming surface; before it, the filter-repo would have to rewrite mixed-name history.
