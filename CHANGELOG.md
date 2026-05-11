# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] — Phase 2 pre-publication audit (gh-79)

Pre-publication housekeeping ahead of the public-npm soft-launch (#82). No runtime behaviour changes — only naming, licensing, and consumer-facing docs.

### Breaking — package surface

- **Package renamed `@damo/ui` → `damo-ui`.** The library now publishes as the unscoped `damo-ui` package on public npm. Consumers must update imports from `@damo/ui` and `@damo/ui/<sub>` to `damo-ui` and `damo-ui/<sub>` respectively. The `exports` map keys themselves are unchanged — only the consumer-facing import specifier moves.
- **GitHub Packages registry retired.** `publishConfig.registry` removed from `packages/ui/package.json`; the future `pnpm publish` defaults to npmjs.org with `access: public`. Consumers no longer need an `@damo:registry=https://npm.pkg.github.com` `.npmrc` block.
- **`@damo-ui/*` scope reserved** for ecosystem packages introduced post-1.0 (`@damo-ui/cli`, `@damo-ui/registry`, `@damo-ui/mcp`).

### Added

- **`LICENSE`** at repo root (MIT, © 2026 Simone Schioppo). Library is now MIT-licensed; `packages/ui/package.json` declares `license: "MIT"`.
- README rewritten for public consumers: install snippet (`pnpm add damo-ui`), Tailwind v4 setup, basic usage example, "0.x preview, breaking changes possible at 1.0" disclaimer.
- **DatePicker `disabledDays` prop** — exposes the underlying react-day-picker `disabled` Matcher (`Date | Date[] | DateRange | ((d: Date) => boolean) | …`) so consumers can disable specific calendar days. Separated from the existing trigger-level `disabled?: boolean` so the two intents are unambiguous (trigger-button vs calendar-day).

### Internal

- `apps/web` and `e2e` workspaces (`@damo/web`, `@damo/e2e`) are unchanged — they remain private monorepo workspaces and are never published.
- `PUBLICATION_READINESS.md` refreshed with the post-rename audit snapshot and re-run checklist using the new filter names.
- `packages/ui/src/mocks/components-preview/components-preview.tsx` split into focused sub-files (audit H-19). The `Data display` and `Layout primitives` sections moved into `sections-data-layout.tsx`; the shared `Section` / `Subgroup` / `TABLE_ROWS` helpers moved into `_helpers.tsx`. The orchestrator file drops from 931 → 644 lines (under the 800-line coding-style cap). No public-API surface change — `components-preview` is mocks-only and not exported.
- **Deep behavior-test coverage for the 8 components that previously had render-only smoke tests** (audit H-2 + M-17): popover, context-menu, select, tabs, slider, dropdown-menu, combobox, banner. New tests assert open/close lifecycle, keyboard navigation, controlled vs uncontrolled state, onSelect / onValueChange / onDismiss / onOpenChange wiring, and disabled-item handling. The date-picker test file gained selection-flow, controlled-mode, disabled-trigger, and `disabledDays` Matcher coverage (Date array + functional matchers). Unit-test count: 559 → 621 (+62 new tests).

## [0.3.0] — 1.0.0 candidate (theme architecture refactor)

This is the v1 publish-prep run. Cycle 9 unified AlertDialog into Dialog and replaced the bespoke SettingsMenu / theme-preset switchers with generic primitives; the audit run that followed (cycles 10–19, PRs #26–34) hardened the token surface so every editable variable in the theme generator drives at least one preview pixel, and removed every var that no component consumed.

### Breaking — components

- **`AlertDialog*` removed.** `<DialogContent>` now accepts `severity?: 'default' | 'alert'` and `tone?: 'default' | 'danger'` instead. `severity="alert"` flips `role` to `alertdialog`, blocks overlay-click dismiss, and hides the X close button. The two props are orthogonal — `<DialogContent severity="alert" tone="danger">` reproduces the old AlertDialog destructive surface.
- **`SettingsMenu*` removed.** Compose `<Popover>` with whatever content (typically `<AttrToggleGroup>` instances) the surface needs. See `apps/web/app/_components/DocsPreferencesMenu.tsx` for an example.
- **`ThemeSwitcher` / `PaletteSwitcher` / `DensitySwitcher` / `DisplaySettingsMenu` removed.** Use `<AttrToggleGroup>` directly with `storageKey`, `attribute`, and `options`.
- **Banner: `variant="rage"` removed.** Use `variant="danger"`.
- **Badge: `variant="copper" | "navy" | "draw" | "rank" | "win" | "loss"` removed.** New aligned variant set: `default | featured | success | warning | info | destructive | outline`. Migration: `win → success`, `loss → destructive`, `copper / navy / featured-decorative → featured`, `draw → warning`, `rank → info` or `default`.
- **Showcase widgets removed from public API:** `ShowcaseCard`, `SubPanel`, `SectionHeader`, `TypeSpecimen`, `ColorScale`, `TokenSwatch`, `PatternSwatch`, `TooltipCard`. They were doc-site-only utilities; the source still lives at `apps/web/app/_components/showcase/` and consumers can copy them.

### Breaking — tokens (audit run)

Every token below had **zero component consumers** and was emitting either dead CSS variables or Tailwind utilities that resolved to undefined values.

- `--rage` / `--rage-foreground` → use `--destructive` / `--destructive-foreground`
- `--accent` / `--accent-foreground` → use `hover:bg-muted` or `bg-secondary`
- `--input` → theme `--memphis-border-color` (lib uses Memphis border idiom on every input)
- `--badge-copper`, `--badge-navy`, `--badge-draw`, `--badge-rank` (×2 paired fg) → use the standard intent badges (success/warning/info/destructive) or `--badge-featured`
- `--radius-lg` → use `--radius-md` or `--radius-pill`
- `--shadow-sm` / `--shadow-lg` → only `--shadow-md` remains in the soft tier (Memphis is the canonical elevation language)
- `--border-thin` / `--border-base` / `--border-thick` → use literal Tailwind `border` / `border-2` / `border-[3px]`
- `--space-N` (× 12) emission → no replacement needed; Tailwind v4's `--spacing` rebind via `--density-scale-y` already drives every spacing utility responsively
- `--ease-in-out` → use `--ease-out` or `--ease-memphis`
- `--z-base` / `--z-sticky` → use literal `z-0` / `z-10`
- `--ease-out-memphis` alias → use `--ease-out`

### Breaking — Tailwind v3 preset (`damo-ui/tailwind.preset`)

The v3-style preset was scrubbed to mirror the v4 surface exactly. v3 consumers no longer get utility classes that resolve to undefined CSS variables. Removed: `accent`, `input`, `rage` color extensions; `radius-lg`; the entire `borderWidth` extension; the `spacing.1..20` mapping; `shadow.sm`, `shadow.lg`; `transitionTimingFunction['in-out']`; `zIndex.base`, `zIndex.sticky`; the `m-*` legacy shadow aliases. Added missing colour extensions present in the v4 bridge: `success-foreground`, `warning-foreground`, `info-foreground`, `badge-featured-foreground`, `chart-1..5`.

### Fixed (silent-bug fixes the audit surfaced)

- **`duration-*` Tailwind utilities now actually apply.** The v4 bridge declared `--animate-duration-snap/fast/base/slow`, but that namespace targets the `animation` shorthand, not `transition-duration`. The named duration classes (`duration-fast`, `duration-snap`, etc.) used in 22 spots across the lib were silently emitting no CSS. Fixed via explicit `@utility duration-*` blocks in `theme.css`.
- **`--radius-none` token edits now cascade.** UserCard, FeatureCard, ArticleCard, Hint, SegmentedControl, AttrToggleGroup, Checkbox, Slider, Table all gained `rounded-none` so the radius token reaches their 4-edge Memphis frame (browser default border-radius is 0 and never reads any var).
- **`--popover` / `--popover-foreground` now drive floating surfaces.** Popover, DropdownMenuContent + SubContent, ContextMenuContent + SubContent, SelectContent switched from `bg-card text-foreground` to `bg-popover text-popover-foreground`. DatePicker and Combobox inherit via the underlying Popover.
- **`--nav-on-dark-foreground` / `-strong` now wire NavItem onDark idle + hover.** Was hardcoded `text-[rgba(255,255,255,0.72)]` / `hover:text-white`.
- **Card typography snaps to `text-*` tokens.** UserCard, FeatureCard, ArticleCard had nine inline `fontSize: N` values bypassing the lib's `--text-{xs|sm|base|xl|2xl}` bridge. Editing typography sizes in the theme generator had no effect on these cards before; it does now.
- **Card spacing snaps to `mb-*` tokens.** ArticleCard + FeatureCard had inline `marginBottom: 8/12/24` values that bypassed the v4 `--spacing` density rebind. Density edits now propagate.
- **DatePicker trigger icon swapped from 📅 emoji → real `CalendarIcon` SVG** (also exported from `damo-ui` for consumer reuse).

### New

- **`ComponentsPreview`** mock (`damo-ui/mocks`) — kitchen-sink scene that renders every public component grouped by category (Buttons, Cards, Banners, Overlays, Form inputs, Feedback, Navigation, Data display, Layout primitives). Default scene in the theme generator preview pane. Includes a Charts mini-bar visualization wired to `--chart-1..5`, an App pattern swatch driven by `--app-pattern-color-1/2/3` + `--app-pattern-size`, a Toast trigger, a ContextMenu trigger area, and DatePicker + Combobox demos so every theme dimension reflects somewhere in the preview.
- **`CalendarIcon`** added to the icon set.

### Infrastructure

- Unit + e2e test counts move quickly during pre-publication; see `CONTRIBUTING.md` for the current numbers
- AgentShield security scan: A (100/100), 0 findings
- `apps/web/app/styles/theme.css` (consumer override) cleaned of zombie var declarations
- `tokens.css` reduced from ~150 lines to ~125, with explainer comments on every removed-token slot for migration

## 0.2.5 — 2026-04-26 (theme reset)

> Originally tagged `0.3.0` during a brief window before the pre-publication audit. Renumbered to `0.2.5` so the live `0.3.0` (above) is the single source of truth for the public-npm soft-launch. All breaking changes from this section landed BEFORE the audit and are included in the live `0.3.0`.

### Breaking

- **Lib no longer ships opinionated themes.** The plum/gold raw palette, the plum-gold light/dark semantic mapping, the neon and sunset palette variants, and the Memphis pattern have been removed from the published lib. The lib now ships only neutral grayscale LIGHT defaults for every semantic token (zinc-style: white background, near-black foreground, gray muted, blue ring).
- **No dark mode in the lib.** Consumers are responsible for declaring `[data-theme='dark']` (or any selector they prefer) with their own override values. The lib no longer ships a built-in dark mode.
- `themes.css` and `patterns.css` deleted from the lib. `tokens.css` rewritten with neutral defaults only.
- Internal `__tests__/contrast.test.ts` removed. Per-theme contrast assertion now belongs in the consumer (the playground continues to test its own theme).
- **Raw palette variables renamed:** `--plum-*` → `--ink-*`, `--gold-*` → `--brand-*`. The names are now functional/role-based ("ink" = dark scale for foreground/text; "brand" = primary CTA/highlight) rather than color-specific (which was confusing under neon/sunset palettes where "plum-500" was magenta and "gold-500" was orange). The `--paper-*` scale is unchanged.

### Migration

- If you were relying on `<html data-theme="dark">` rendering correctly, you must now ship your own dark theme CSS in your app:

```css
:root[data-theme='dark'] {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #18181b;
  --card-foreground: #fafafa;
  /* ... declare every semantic token's dark value ... */
}
```

- If you were using `data-palette="neon"` or `data-palette="sunset"`, use the `/theme-generator` page in the playground to generate your own palette CSS, drop it into your app.

### Internal

- Total lib CSS surface area reduced significantly: ~400 lines of token/theme CSS down to ~100 lines (tokens.css only).
- Lib bundle size unchanged (CSS variables don't ship, only the bridge does).

## 0.2.0 — 2026-04-24

### Breaking

- **Theme architecture rewrite.** Raw palette classes (`bg-plum-*`, `text-gold-*`, `bg-paper-*`) are no longer exposed as Tailwind utilities — consumers must use semantic tokens (`bg-primary`, `text-foreground`, etc.). The full rename mapping is in the next bullet.
- Semantic tokens renamed: `bg-bg → bg-background`, `bg-surface → bg-card`, `bg-surface-2 → bg-muted`, `text-ink → text-foreground` (or `text-card-foreground` when on a card surface), `text-ink-muted → text-muted-foreground`, `bg-accent → bg-primary` (the old "accent" was the gold primary CTA color), `bg-danger → bg-destructive`, `border-border-memphis → border-memphis`.
- `Button.variant="accent"` renamed to `variant="secondary"`. `Button.variant="danger"` renamed to `variant="destructive"`.
- `Card.variant="dark"` renamed to `variant="inverse"`.
- New `--accent` token now means "subtle highlight" (pale gold in light, plum-700 in dark). This replaces the old `--accent` which was the primary CTA color.
- All semantic tokens have a paired foreground — `bg-primary` ships with `text-primary-foreground`, etc. Components should use paired classes rather than hand-picking a contrast color.
- Status tokens gained paired foregrounds: `--success-foreground`, `--warning-foreground`, `--info-foreground`, `--rage-foreground`, `--destructive-foreground`.

### New

- Badge-specific tokens: `--badge-featured`, `--badge-copper`, `--badge-navy`, `--badge-draw`, `--badge-rank` (all paired with foregrounds).
- Chart tokens: `--chart-1` through `--chart-5`.
- Nav-on-dark identity tokens: `--nav-on-dark-accent`, `--nav-on-dark-accent-strong`, `--nav-on-dark-foreground`, `--nav-on-dark-foreground-strong`.
- WCAG contrast CI test for body-text pairs across all 6 theme × palette combinations.
- Theme generator rebuilt for the three-layer architecture with paired bg+fg pickers, dual-mode preview, and live contrast badges.

### Internal

- Raw palette (`--plum-*`, `--gold-*`, `--paper-*`) still defined in `tokens.css` — used internally to compute semantic values, not exposed as utilities. (later renamed to `--ink-*` / `--brand-*` in 0.3.0)
- Palette presets (`default`, `neon`, `sunset`) now override only the raw palette and are orthogonal to `[data-theme]`, so all six palette × theme combinations work automatically.

## [0.1.0] — 2026-04-18

### Added

- Monorepo scaffold with pnpm workspace: `packages/ui`, `apps/playground`, `e2e`.
- Design token system: `--plum-*`, `--gold-*`, `--paper-*` + semantic aliases, typography, radius, shadow, spacing, motion, z-index, density.
- Dark mode via `[data-theme="dark"]`, multi-palette (`plum-gold`/`frost`/`circuit`) via `[data-palette]`, density (`compact`/`normal`/`comfortable`) via `[data-density]`.
- Tailwind v4 `@theme` bridge for custom utility generation.
- 47 React components across 7 categories:
  - **Foundations:** Icon (+30 atomic), Box, Container, AspectRatio, ScrollArea, Separator, Ornament, FormField.
  - **Tier 1 signature:** Button (5 variants × 4 sizes), IconButton, Card (5 variants), Dialog, AlertDialog, Drawer, Banner.
  - **Forms:** Input, Textarea, Label, Checkbox, RadioGroup, Switch, Slider, SegmentedControl, Select, DatePicker, Combobox, Popover.
  - **Feedback:** Tooltip, Toast, Progress, Spinner, Skeleton, Badge, Chip.
  - **Navigation:** Tabs, DropdownMenu, ContextMenu, NavItem, Breadcrumbs, Pagination.
  - **Data:** Avatar, AvatarGroup, Accordion, Table, Stat.
  - **Layout:** AppShell, PageHeader.
- Ladle stories for every component.
- Playwright e2e: 62 tests across Chromium + WebKit.
- Vitest unit: 22 tests (cn utility, FormField, usePersistedAttr hook, Pagination math).
- GitHub Actions CI: lint, format:check, typecheck, unit tests, build, e2e.

### Infrastructure

- Published on GitHub Packages (`@damo` scope).
- TypeScript strict, ESLint flat config, Prettier.
- tsup build (ESM + .d.ts + sourcemaps).
