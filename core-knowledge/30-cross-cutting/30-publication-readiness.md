# Publication Readiness

Status: documented · Last scan: 9a573e8 · Sources:
`PUBLICATION_READINESS.md`, `CHANGELOG.md`, `LICENSE`, `README.md`,
`packages/ui/package.json`, `.github/workflows/publish.yml`.

## Summary

The repo carries a live readiness checklist at `PUBLICATION_READINESS.md`
(root). This chapter is the **synthesis** of that file plus `CHANGELOG.md`:
gating criteria for the public release, the current snapshot, and the
decision log behind the roadmap. The roadmap itself lives at epic #77
and is summarized in `00-overview/02-publishing-model.md` (Roadmap section).

Whenever `PUBLICATION_READINESS.md` is updated by a publication-phase PR,
queue this chapter for re-sync.

## Readiness criteria

The library is "ship-ready" when every criterion below holds. Each maps
to one or more rows in the `PUBLICATION_READINESS.md#Snapshot` table.

### Distribution

- Package name finalized (`damo-ui`, since gh-79).
- License declared (MIT, since gh-79); `LICENSE` file at repo root.
- `packages/ui/package.json` not `private`; `publishConfig.access: public`;
  no registry override (defaults to `registry.npmjs.org`).
- `repository.url`, `author` populated.
- `files: ["dist", "README.md"]` and `exports` map intact, every entry
  resolving in `dist/`.

### Quality gates (must all be green)

- `pnpm test` (lib + web vitest): 523 + 194 today.
- `pnpm test:e2e` (chromium, `--workers=1`): 174 today.
- `pnpm lint` (eslint + `scripts/check-docs-sync.mjs`): 54/54 components
  documented.
- `pnpm format:check` (prettier).
- `pnpm typecheck` for both `damo-ui` and `@damo/web`.
- `pnpm build` for both `damo-ui` and `@damo/web`.
- `pnpm audit`: 0 high, 0 critical (3 moderate currently — all build-time
  devDeps via `next`, never bundled into `packages/ui/dist/`).

### Documentation

- Root `README.md` is consumer-facing (install snippet, Tailwind v4
  wiring, "0.x preview" disclaimer).
- `packages/ui/README.md` mirrors the consumer narrative (this README
  ships in the npm tarball).
- `CONTRIBUTING.md` reflects the current naming.
- `CHANGELOG.md` carries an `[Unreleased]` entry describing migration
  paths.
- Every public component has a docs page at
  `apps/web/app/docs/components/<name>/page.tsx` (enforced by
  `scripts/check-docs-sync.mjs`).

### CI/CD

- `.github/workflows/publish.yml` exists, targets the right registry,
  uses the right filter and access flags, and is wired to the right
  tag pattern (`damo-ui@*`). See `30-cross-cutting/10-ci-cd.md` →
  Publish workflow for the full definition.

## Roadmap milestone status (post gh-79)

Tracking the seven phases of epic #77. Detail in
`00-overview/02-publishing-model.md` (Roadmap section).

| Phase                               | Issue | State (2026-05-09) | Notes                                                                                                  |
| ----------------------------------- | ----- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| 1 — Naming + scope                  | (n/a) | ✅ done            | `damo-ui` + `@damo-ui/*` reserved.                                                                     |
| 2 — Pre-publication audit           | #79   | ✅ done            | LICENSE, rename, GH Packages retired, `private: true` removed, public-consumer docs rewritten. PR #97. |
| 3 — `git filter-repo` history clean | #80   | open               | Removes `_bmad/`, `_bmad-output/`, `core-knowledge/`, `user-data/` from history.                       |
| 4 — Public visibility               | #81   | open               | Repo flips public.                                                                                     |
| 5 — Soft launch                     | #82   | open               | `damo-ui@0.4.0` on public npm. Bumps version, flips `publish.yml` gate, provisions `NPM_TOKEN`.        |
| 6.1 — Registry generator            | #83   | open               | shadcn JSON schema.                                                                                    |
| 6.2 — CLI fork                      | #84   | open               | `@damo-ui/cli` (forked + rebranded shadcn CLI).                                                        |
| 6.3 — Registry endpoint             | #85   | open               | Vercel + custom domain.                                                                                |
| 6.4 — Codemod                       | #86   | open               | Migrates consumers from npm-classic to copy-paste.                                                     |
| 6.5 — MCP server (optional)         | #87   | open               | `@damo-ui/mcp`.                                                                                        |
| 7 — Cutover                         | #88   | open               | `damo-ui@1.0.0`, codemod, deprecate 0.x.                                                               |

## Open blockers / parked work

These are explicitly **deferred to post-1.0** per the gh-79 issue scope:

- `CONTRIBUTING.md` polish (current version is functional but bare-bones).
- `SECURITY.md`.
- `CODE_OF_CONDUCT.md`.
- Issue / PR templates.
- Bundle size deep audit.
- Accessibility deep audit.
- `sideEffects: ["**/*.css"]` declaration on `packages/ui/package.json`
  (waits for the CSS import surface to stabilise — see
  `10-library/30-build-and-publish/README.md` Open Q #1).

These are blockers for **maturity / community-ready**, not for the
soft launch (#82).

## Decision log highlights (from `CHANGELOG.md`)

In reverse chronological order:

- **gh-79 (Phase 2, 2026-05-09):** Package renamed `@damo/ui` → `damo-ui`
  (unscoped, MIT, public npm). GH Packages retired. `@damo-ui/*` scope
  reserved for ecosystem packages.
- **gh-95 (palette r2.5):** Cyberpunk and Forest light identities
  rebalanced (cyan/teal + sage cream) so all four built-in palettes
  read as visually distinct in light mode.
- **gh-93 (palette refresh r2):** Cyberpunk and Forest preset
  introduction.
- **Cycle 9 (theme architecture refactor):** AlertDialog folded into
  Dialog (`severity` + `tone` props); SettingsMenu and the four
  theme-preset switchers removed in favour of generic `AttrToggleGroup`;
  `ShowcaseCard`, `SubPanel`, `SectionHeader`, `TypeSpecimen`,
  `ColorScale`, `TokenSwatch`, `PatternSwatch`, `TooltipCard` removed
  from the public API (still live as showcase utilities under
  `apps/web/app/_components/showcase/`).
- **Audit run (cycles 10-19, PRs #26-34):** 28 dead tokens removed;
  silent Tailwind v4 utility bugs fixed (`duration-*`, `--radius-none`
  cascade); inline styles snapped to `text-*` / `mb-*` so theme
  generator edits flow.
- **Banner / Badge variant cleanup:** `rage` → `danger`; gaming-flavoured
  badge variants (`copper / navy / draw / rank / win / loss`) collapsed
  to intent-named variants (`success / warning / info / destructive /
featured`).

## Link map to upstream sources

| Concept                        | Upstream source                                                     |
| ------------------------------ | ------------------------------------------------------------------- |
| Live readiness snapshot        | `PUBLICATION_READINESS.md` (root)                                   |
| Migration paths                | `CHANGELOG.md` (root) — `[Unreleased]` block                        |
| License text                   | `LICENSE` (root)                                                    |
| Consumer-facing install/usage  | `README.md` (root)                                                  |
| npm-tarball README             | `packages/ui/README.md`                                             |
| Publish workflow               | `.github/workflows/publish.yml`                                     |
| Naming / publishConfig pinning | `packages/ui/package.json`                                          |
| Build pipeline + invariants    | `core-knowledge/10-library/30-build-and-publish/README.md`          |
| Distribution model + roadmap   | `core-knowledge/00-overview/02-publishing-model.md`                 |
| CI workflow definition         | `core-knowledge/30-cross-cutting/10-ci-cd.md`                       |
| Epic / phase tracking          | GitHub issues #77, #79, #80, #81, #82, #83, #84, #85, #86, #87, #88 |
