# @damo/ui — Publication Readiness Checklist

Updated 2026-05-05 after the cycle-9 unification + the **token-audit run** (cycles 10-19, PRs #26-34). The library does **not** publish itself; this document is the snapshot you read before pressing the Release button.

## Snapshot

| Metric                                 | Value                                                                |
| -------------------------------------- | -------------------------------------------------------------------- |
| Library version                        | 0.3.0 (see `packages/ui/package.json`) — bump to `1.0.0` to publish  |
| Public components                      | 54                                                                   |
| Documented components                  | 54 (100%) — IconButton co-documented under `/docs/components/button` |
| Library unit tests                     | 345 / 345 ✓ (33 files)                                               |
| Web unit tests (theme generator etc.)  | 82 / 82 ✓ (10 files)                                                 |
| ESLint (root)                          | 0 errors, 0 warnings                                                 |
| `node scripts/check-docs-sync.mjs`     | ✓ 54/54 in sync (ALLOWLIST host-page check active)                   |
| `pnpm --filter @damo/ui build`         | ✓ ESM + DTS + CSS + Tailwind v3 preset                               |
| `pnpm --filter web build`              | ✓ static export, 54 routes, 1 SSG dynamic catch-all                  |
| Playwright e2e (chromium, --workers=1) | 71 / 71 ✓                                                            |
| AgentShield security scan              | A (100/100) — 0 findings                                             |

## Token surface — guarantee

After the audit run, **every token in `packages/ui/src/styles/tokens.css` is consumed by ≥ 1 component**, every Tailwind utility consumers can write resolves to a real token, and every editor in the theme generator visibly drives at least one preview pixel. No silent no-ops.

## What changed in cycle 9 (initial publish-prep)

Round-3 user feedback led to a tighter API and a few targeted fixes.

### U1 — Table row hover removed

- `TableRow` no longer applies `hover:bg-muted` by default. Tables aren't always interactive, and the hover tint was bleeding into header rows. Consumers that render clickable rows can opt in via className.
- `data-state=selected` highlight is preserved.

### U2 — AlertDialog folded into Dialog

- Removed `AlertDialog*` from the public API.
- `DialogContent` now accepts two new orthogonal props:
  - `severity?: 'default' | 'alert'` — `alert` flips `role` to `alertdialog`, blocks overlay-click dismiss, and hides the X close button so the user must use a footer action.
  - `tone?: 'default' | 'danger'` — `danger` swaps the Memphis offset shadow to the destructive token.
- Dropped `@radix-ui/react-alert-dialog` dependency.

### U3 — Memphis Popover + SettingsMenu removed

- `PopoverContent` repainted with the same Memphis chrome as DropdownMenu / Dialog. `forceMount` correctly forwarded to the Radix Portal.
- `SettingsMenu` removed; consumers compose Popover with whatever content they need.

### U4 — Coherence audit

- `getting-started`, `toast`, `tooltip`, badge / table docs all rewritten away from the removed components.
- `scripts/check-docs-sync.mjs` ALLOWLIST reduced to one entry (`icon-button` → `button`).

## What changed across the audit run (cycles 10-19, PRs #26-34)

The user explicitly asked for a per-variable audit of the theme generator: every editable token had to either be consumed by a component or be removed. Each round found another silent bug or dead token.

### Token surface tightened (28 dead tokens removed across the run)

| Token                                                                          | Why dropped                                                                                | Migration                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `--rage` / `--rage-foreground`                                                 | Single Banner variant; no semantic distinction from `destructive`                          | Use `variant="danger"`                                                            |
| `--badge-copper`, `--badge-navy`, `--badge-draw`, `--badge-rank` (×2 fg pairs) | Color-named tokens, not intent-named; the Badge variants they backed were gaming-flavoured | Use `success`, `destructive`, `warning`, `info`, `outline`, `default`, `featured` |
| `--accent` / `--accent-foreground`                                             | Memphis lib uses `hover:bg-muted`, never read `bg-accent`                                  | Use `hover:bg-muted` or `bg-secondary`                                            |
| `--input`                                                                      | Inputs use `border-2 border-memphis`, never `border-input`                                 | Theme `--memphis-border-color`                                                    |
| `--radius-lg`                                                                  | 0 consumers (kept `none/sm/md/selection/pill/full`)                                        | Snap to `rounded-md` or `rounded-pill`                                            |
| `--shadow-sm`, `--shadow-lg`                                                   | 0 consumers (kept `--shadow-md`)                                                           | None — these were unused                                                          |
| `--border-thin/base/thick`                                                     | Lib uses raw Tailwind `border-2`                                                           | None — these were unused                                                          |
| `--space-N` × 12 emission                                                      | Lib uses Tailwind v4 `--spacing` rebind via density-scale-y                                | Use density-aware `mb-2/3/6/etc` utilities                                        |
| `--ease-in-out`                                                                | 0 consumers (Progress uses `ease-out`, others `ease-memphis`)                              | Use `ease-out` or `ease-memphis`                                                  |
| `--z-base`, `--z-sticky`                                                       | 0 consumers (overlay tiers start at `--z-header`)                                          | Use literal `z-0` or `z-10`                                                       |
| `--ease-out-memphis` alias                                                     | Redundant with `--ease-out`                                                                | Use `ease-out`                                                                    |

### Dead tokens wired (so theme-generator edits flow)

- `--popover` / `--popover-foreground` (PR #29): Popover, DropdownMenuContent + SubContent, ContextMenuContent + SubContent, SelectContent now read these instead of `--card` / `--foreground`. Same default appearance, but consumers / theme generator can diverge popover vs card surfaces.
- `--nav-on-dark-foreground` / `--nav-on-dark-foreground-strong` (PR #27): NavItem onDark idle + hover colours now read these (was hardcoded `rgba(255,255,255,0.72)` / `text-white`).

### Tailwind v4 utility silent-bug fixed

- `duration-snap`, `duration-fast`, `duration-base`, `duration-slow` were not generating any CSS in v4 — Tailwind's `--animate-duration-*` namespace targets `animation`, not `transition-duration`. Added explicit `@utility duration-*` blocks in `theme.css` (PR #28).
- `rounded-none` cascade across all 4-edge Memphis-framed components (UserCard, FeatureCard, ArticleCard, Hint, SegmentedControl, AttrToggleGroup, Checkbox, Slider, Table) — without it, `--radius-none` token edits did nothing on those surfaces (PR #28).

### Inline styles snapped to token-aware utilities

- Card typography (UserCard, FeatureCard, ArticleCard) — 9 inline `fontSize: N` props swapped to `text-{xs|sm|base|xl|2xl}` so `--text-*` tokens flow (PR #32).
- Card spacing (ArticleCard, FeatureCard) — 4 inline `marginBottom: N` props swapped to `mb-2/3/6` so the density rebind reaches them (PR #33).
- DatePicker emoji 📅 → real `CalendarIcon` SVG, exported from `@damo/ui` (PR #28).

### ComponentsPreview kitchen-sink

- New `ComponentsPreview` mock (`@damo/ui/mocks`) exposes every public component grouped by category in one scrollable surface — Buttons, Cards, Banners, Overlays, Form inputs, Feedback, Navigation, Data display, Layout primitives. Default scene in the theme generator.
- Charts subgroup (5 bars on `bg-chart-1..5`), App pattern swatch (driven by `--app-pattern-color-1/2/3` + `--app-pattern-size`), Toast trigger, ContextMenu trigger area, DatePicker + Combobox demos all included so every theme dimension reflects somewhere.

### Stale-ref sweep

- Consumer override `apps/web/app/styles/theme.css` had 24 zombie var declarations (rage / accent / input / badge-copper-navy-draw-rank); removed.
- Lib's v3 Tailwind preset (`packages/ui/tailwind.preset.ts`) cleaned to mirror the v4 surface exactly — v3 consumers no longer get utility classes resolving to undefined CSS variables.
- Misc stale refs in `foundations/colors`, `foundations/tokens`, `components-preview` (`var(--accent)` → `var(--info)`), `icons.stories` (`var(--rage)` → `var(--warning)`).

### Test infrastructure

- `display-settings-menu.spec.ts` palette-sanitize test: switched the localStorage assertion to `expect.poll()` so it doesn't race against the html-attribute write on webkit (PR #34).

## Open advisories — not blocking

1. **devDeps audit**: `pnpm audit` still flags moderate CVEs in `esbuild`, `vite`, `postcss` reaching the project transitively through `next@15.5.15`. None are bundled into `packages/ui/dist` — build-time only.
2. **home-hero cold-compile flake**: under unrestricted-worker contention the home page CTA-routing tests can flake on the very first compile of `/docs` and `/theme-generator`. Deterministic on retry. Pinning to `--workers=1` is the workaround.

## Pre-publish checklist (manual — you do this)

Before `pnpm --filter @damo/ui publish`:

- [ ] Bump `packages/ui/package.json` version. **MAJOR (1.0.0)** — the audit run dropped tokens, Banner / Badge variants, AlertDialog and SettingsMenu, and the four theme-preset switchers. Migration callouts:
  - `<AlertDialog ...>` → `<DialogContent severity="alert" tone="danger">`
  - `<SettingsMenu ...>` → Popover + AttrToggleGroup composition (see DocsPreferencesMenu in apps/web for an example)
  - `<ThemeSwitcher>`/`<PaletteSwitcher>`/`<DensitySwitcher>`/`<DisplaySettingsMenu>` → `<AttrToggleGroup>` directly
  - `<Banner variant="rage">` → `<Banner variant="danger">`
  - `<Badge variant="copper|navy|draw|rank">` → `<Badge variant="featured|info|warning|destructive">` per intent
  - `<Badge variant="win|loss">` → `<Badge variant="success|destructive">`
  - `bg-accent` / `text-accent-foreground` → `hover:bg-muted` or `bg-secondary`
  - `border-input` → `border-memphis`
  - `rounded-lg` → `rounded-md` or `rounded-pill`
  - `shadow-sm` / `shadow-lg` → `shadow-md` or one of the Memphis tiers
  - `border-thin` / `border-base` / `border-thick` → literal `border` / `border-2` / `border-[3px]`
  - `var(--space-N)` → density-aware Tailwind spacing utilities (`p-1`, `gap-3`, etc.)
  - `ease-in-out` → `ease-out` or arbitrary `ease-[cubic-bezier(...)]`
  - `z-base` / `z-sticky` → literal `z-0` / `z-10`
- [ ] Update `CHANGELOG.md` with the migration paths above.
- [ ] Verify `packages/ui/package.json#files` includes only `dist`, `README.md`.
- [ ] Run `pnpm --filter @damo/ui build` once more and inspect `dist/`.
- [ ] Tag the commit: `git tag @damo/ui@<version>`.
- [ ] Publish: `pnpm --filter @damo/ui publish` (uses GitHub Packages per the `.npmrc` workspace config).
- [ ] Push tags: `git push --tags`.

## Re-running the readiness checks

```bash
pnpm install
pnpm --filter @damo/ui test       # 345 lib unit tests
pnpm --filter @damo/web test      # 82 web tests
pnpm lint                         # eslint + docs-sync guardrail
pnpm format:check                 # prettier
pnpm --filter @damo/ui build
pnpm --filter web build
pnpm --filter @damo/e2e test -- --project=chromium --workers=1   # 71 e2e
node scripts/check-docs-sync.mjs
```

All green = ship-ready.
