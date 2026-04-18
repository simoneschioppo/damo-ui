# Damacchi UI

Memphis-inspired React component library for the Damacchi app.

**Status:** pre-alpha (v0.0.0) — under active development.

## Monorepo structure

- `packages/ui` — the library, published as `@damacchi/ui` to GitHub Packages
- `apps/playground` — Next 15 showcase app (private, not published)
- `e2e` — Playwright end-to-end tests (private)

## Setup

```bash
pnpm install
pnpm dev
```

- Playground → http://localhost:3000
- Ladle → http://localhost:61000

## Scripts

- `pnpm dev` — both Ladle and Playground in parallel
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright E2E tests (requires playground running)
- `pnpm build` — build the library

## Design Spec

See `docs/specs/2026-04-18-damacchi-ui-design.md`.
