# Changelog

All notable changes to this project will be documented in this file.

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
