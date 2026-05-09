# Monorepo Layout

Status: pending

## Intended scope

Describe the pnpm monorepo structure: workspaces, package boundaries,
where code lives, where shared config lives, and how the two
deliverables (library and web app) relate.

## TOC (stub)

- pnpm workspaces and `pnpm-workspace.yaml`
- `packages/ui` — the library
- `apps/web` — docs + theme generator
- Root-level config (`tsconfig.base.json`, eslint, prettier)
- `e2e/` at the root
- `_bmad/`, `core-knowledge/`, `user-data/` — agent infrastructure
