# Changelog

All notable changes to this project will be documented in this file.

## 0.3.0 — 2026-04-26

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

- **Theme architecture rewrite.** Raw palette classes (`bg-plum-*`, `text-gold-*`, `bg-paper-*`) are no longer exposed as Tailwind utilities — consumers must use semantic tokens (`bg-primary`, `text-foreground`, etc.). See `docs/specs/2026-04-24-theme-architecture-refactor-design.md` for full mapping.
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
