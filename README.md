<p align="center">
  <img src="./.github/assets/damo-ui-banner.jpg" alt="damo-ui banner — purple axolotl mascot at a desk with laptop, books and plant" width="100%" style="max-width: 100%; height: auto;" />
</p>

<h1 align="center">damo-ui</h1>

<p align="center">
  Memphis-inspired React component library for Next.js — tokens, components, and patterns ready to use.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/damo-ui"><img alt="npm" src="https://img.shields.io/npm/v/damo-ui?color=plum&label=damo-ui" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="React 18+" src="https://img.shields.io/badge/React-%E2%89%A518-61dafb?logo=react&logoColor=white" />
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white" />
</p>

> ⚠️ **0.x preview.** The public API is stabilising. Expect breaking changes between minor versions until `1.0.0`. The migration paths are documented in [`CHANGELOG.md`](./CHANGELOG.md).

## Why damo-ui?

- **Memphis-design primitives, palette-agnostic** — geometric shape decorations, chunky offset shadows, and four ready-to-opt-in palettes (`default`, `sunset`, `cyberpunk`, `forest`). Ships neutral grayscale by default.
- **Accessible by default** — Dialog, Dropdown, Tooltip, Popover, Select, Tabs, and other interactive components inherit keyboard navigation, focus management, and ARIA semantics from Radix UI primitives.
- **Theme × palette × density, orthogonal** — flip light/dark, swap palette, and pick density (`compact`, `normal`, `comfortable`) live, all driven from `<html>` data attributes.
- **Tailwind v4-first, v3 preset shipped** — CSS-first configuration on the latest Tailwind, with a legacy preset preserved for migration.
- **54 components, one entry point** — Foundations, Forms, Feedback, Navigation, Data, Cards, and Layout. Single-import library today; `@damo-ui/cli` and registry post-1.0 (see Reserved scope below).

## Install

```bash
pnpm add damo-ui
# or
npm install damo-ui
# or
yarn add damo-ui
```

Peer dependencies (must be installed in the consumer app):

```bash
pnpm add react react-dom tailwindcss tailwindcss-animate
```

Supported versions: React **≥ 18**, Tailwind **≥ 4**.

## Quickstart (Next.js + Tailwind v4)

1. Wire Tailwind v4 in your global stylesheet:

```css
/* app/globals.css */
@import 'damo-ui/styles/tokens.css';
@import 'damo-ui/styles/globals.css';

@import 'tailwindcss';
@import 'damo-ui/styles/theme.css';

/* Tailwind v4 needs to scan the lib's compiled JS for class names.
 * The path is relative to THIS CSS file. For a stock `create-next-app`
 * (globals.css at `app/globals.css`), node_modules sits one level up: */
@source '../node_modules/damo-ui/dist/**/*.js';
```

2. Use components:

```tsx
import { Button, Card, Dialog } from 'damo-ui'

export default function Page() {
  return (
    <Card variant="featured">
      <Button variant="primary">Click me</Button>
    </Card>
  )
}
```

3. (Optional) Drive theme/palette/density from `<html>`:

```html
<html data-theme="light" data-palette="default" data-density="normal"></html>
```

| Attribute      | Values                                           |
| -------------- | ------------------------------------------------ |
| `data-theme`   | `light` \| `dark`                                |
| `data-palette` | `default` \| `sunset` \| `cyberpunk` \| `forest` |
| `data-density` | `compact` \| `normal` \| `comfortable`           |

All combinations are orthogonal and switch live without remount.

## Tailwind v3 (legacy preset)

If you are still on Tailwind v3, import the preset:

```ts
// tailwind.config.ts
import preset from 'damo-ui/tailwind.preset'

export default {
  presets: [preset],
  content: ['./app/**/*.{ts,tsx}', './node_modules/damo-ui/dist/**/*.js'],
}
```

The v3 preset mirrors the v4 surface exactly — same colours, radii, shadows, spacing.

## Component inventory (54)

- **Foundations:** Icon (+31 atomic), Box, Container, AspectRatio, ScrollArea, Separator, Ornament, MemphisShape (8 shape variants), FormField
- **Core actions & surfaces:** Button, IconButton, Card (5 variants: `default | elevated | featured | interactive | inverse`), Dialog (`severity` + `tone`), Drawer, Banner
- **Forms:** Input, Textarea, Label, Checkbox, RadioGroup, Switch, Slider, SegmentedControl, Select, DatePicker, Combobox, Popover, ColorPicker, AttrToggleGroup
- **Feedback:** Tooltip, Toast, Progress, Spinner, Skeleton, Badge (7 variants), Chip, Hint
- **Navigation:** Tabs, DropdownMenu, ContextMenu, NavItem (default + onDark tones), Breadcrumbs, Pagination
- **Data:** Avatar, AvatarGroup, Accordion, Table, Stat, Medal (5 ranks)
- **Cards:** UserCard, FeatureCard, ArticleCard
- **Layout:** AppShell, AppTopBar, PageHeader, Sidebar — compose to scaffold a full app shell:

```tsx
import { AppShell, AppTopBar, Sidebar, PageHeader } from 'damo-ui'

export default function DashboardLayout({ children }) {
  return (
    <AppShell topBar={<AppTopBar>…</AppTopBar>} sidebar={<Sidebar>…</Sidebar>}>
      <PageHeader title="Dashboard" />
      {children}
    </AppShell>
  )
}
```

The full live reference is the docs site at `apps/web` — see "Local dev" below to run it.

## Reserved scope `@damo-ui/*`

The `@damo-ui/*` npm scope is reserved for ecosystem packages that complement the core library:

- `@damo-ui/cli` — copy-paste installer (post-1.0)
- `@damo-ui/registry` — registry endpoint (post-1.0)
- `@damo-ui/mcp` — MCP server for agentic workflows (post-1.0)

Until those ship, only the unscoped `damo-ui` package is published.

## Tech stack

- React 19 (peer ≥ 18)
- Tailwind v4 (CSS-first); v3 preset shipped for legacy consumers
- Radix UI primitives
- TypeScript strict, pnpm workspace, tsup build
- Vitest unit + Playwright e2e

## Repo structure

- `packages/ui` — the library (`damo-ui`)
- `apps/web` — Next 15 docs + showcase site (private; not published)
- `e2e` — Playwright end-to-end tests (private)

## Local dev

```bash
pnpm install
pnpm dev           # runs Ladle (port 61000) + Next web app (port 3000) in parallel
```

- Web app → http://localhost:3000
- Ladle → http://localhost:61000

### Scripts

- `pnpm build` — build the library (tsup + CSS + Tailwind preset)
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright against the running web app
- `pnpm lint` — ESLint across all workspaces + docs-sync guardrail
- `pnpm format` — Prettier autofix
- `pnpm format:check` — Prettier check

## Theming

The design system uses a three-layer architecture:

1. **Raw palette** (`--plum-*`, `--gold-*`, `--paper-*`) — private scale defined in `tokens.css`. Not exposed as Tailwind utilities; used only to compute semantic values.
2. **Semantic tokens** — public, paired bg+fg utilities (`bg-background` / `text-foreground`, `bg-primary` / `text-primary-foreground`, etc.). These are the correct layer to use in product code.
3. **Identity tokens** — component-specific overrides (`--nav-on-dark-*`, `--badge-*`, `--chart-*`).

For the **current** token surface, see the docs site at `apps/web/app/docs/foundations/tokens` — that's the live, post-audit reference. See [`CHANGELOG.md`](./CHANGELOG.md) for the migration history (0.1 → 0.2 theme refactor and the 1.0.0-candidate audit).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). Short version: every public component must have a `/docs/components/<name>/page.tsx` page, and the docs site mounts the **real** library — no hand-rolled JSX.

## License

[MIT](./LICENSE) © 2026 Simone Schioppo.
