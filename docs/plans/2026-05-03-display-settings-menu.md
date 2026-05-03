# Plan: DisplaySettingsMenu

Date: 2026-05-03
Branch: `feat/display-settings-menu`
Spec: [docs/specs/2026-05-03-display-settings-menu.md](../specs/2026-05-03-display-settings-menu.md)

## Objective

Collapse the three topbar switchers (Theme / Palette / Density) into a single
icon-button trigger that opens a dropdown menu containing labelled radio
groups for the same three concerns. Ship a new exported component
`DisplaySettingsMenu` plus docs, tests, and E2E coverage.

## Phases

### Phase 1 — Library

- Add unit tests (RED) at
  `packages/ui/src/components/display-settings-menu/display-settings-menu.test.tsx`.
- Implement `DisplaySettingsMenu` (GREEN) at
  `packages/ui/src/components/display-settings-menu/display-settings-menu.tsx`.
- Add `index.ts` and ladle stories.
- Re-export from `packages/ui/src/index.ts`.
- `pnpm --filter @damo/ui test display-settings-menu --coverage` ≥ 80%.

### Phase 2 — Web migration

- Replace the three switchers in `apps/web/app/layout.tsx` with a single
  `<DisplaySettingsMenu paletteOptions={…} paletteDefaultValue="default" />`.
- Drop unused imports.
- `pnpm lint && pnpm --filter @damo/web build`.

### Phase 3 — Documentation

- Internal docs page at
  `apps/web/app/docs/components/display-settings-menu/page.tsx`.
- Sidebar nav entry in `apps/web/app/docs/_components/DocsSidebar.tsx`.
- Cross-link from the existing
  `apps/web/app/docs/components/theme-switcher/page.tsx` ("Where to put
  them" section).

### Phase 4 — E2E

- New spec `e2e/tests/scenarios/display-settings-menu.spec.ts` covering open
  / select / persist / sanitize / keyboard flow.
- Update `e2e/tests/scenarios/density-effect.spec.ts` to open the menu before
  selecting density radios.
- Update `e2e/tests/scenarios/smoke.spec.ts` to assert the trigger is
  present.
- `pnpm test:e2e` green.

### Phase 5 — Quality + Git

- `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm test:e2e` all green.
- Run code review.
- Commit, push, open PR, merge with `gh pr merge <N> --merge --delete-branch`.

## Risks

- Radix `asChild` + `IconButton` ref forwarding — verified pattern in
  `dropdown-menu.stories.tsx`, no fix expected.
- Density E2E timing — wait for `data-density` attribute mutation before
  measuring layout.

## Done when

- [ ] Cog button replaces the three switchers in topbar.
- [ ] Selections persist in localStorage and survive reload.
- [ ] Palette sanitization preserved.
- [ ] Component documented and discoverable from sidebar.
- [ ] All unit + E2E tests green.
- [ ] PR merged into main with `--merge` (no squash).
