# Damo UI

Memphis-inspired React and Next.js component library — token, componenti e pattern pronti all'uso.

**Current version:** 0.2.0 — theme architecture refactor

## Monorepo structure

- `packages/ui` — the library, published as `@damo/ui` on GitHub Packages
- `apps/playground` — Next 15 showcase app (private)
- `e2e` — Playwright end-to-end tests (private)
- `docs/specs/` — design spec
- `docs/plans/` — implementation plans

## Local dev

```bash
pnpm install
pnpm dev           # runs Ladle (port 61000) + Next playground (port 3000) in parallel
```

- Playground → http://localhost:3000
- Ladle → http://localhost:61000

### Scripts

- `pnpm build` — build the library (tsup + CSS + Tailwind preset)
- `pnpm test` — Vitest unit tests
- `pnpm test:e2e` — Playwright against running playground
- `pnpm lint` — ESLint across all workspaces
- `pnpm format` — Prettier autofix

## Using in a Next.js app

1. Configure `.npmrc` at the consumer repo root:

```
@damo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. Install:

```bash
pnpm add @damo/ui
```

3. Import styles once in your root layout:

```tsx
// app/layout.tsx
import '@damo/ui/styles/tokens.css'
import '@damo/ui/styles/themes.css'
import '@damo/ui/styles/globals.css'
import '@damo/ui/styles/patterns.css'
```

4. Wire Tailwind v4:

```css
/* app/globals.css */
@import '@damo/ui/styles/tokens.css';
@import '@damo/ui/styles/themes.css';
@import '@damo/ui/styles/globals.css';
@import '@damo/ui/styles/patterns.css';

@import 'tailwindcss';
@import '@damo/ui/styles/theme.css';

@source '../../node_modules/@damo/ui/dist/**/*.js';
```

5. Use components:

```tsx
import { Button, Card, Dialog } from '@damo/ui'

export default function Page() {
  return (
    <Card variant="featured">
      <Button variant="primary">Clicca</Button>
    </Card>
  )
}
```

## Theming

Three switchers via html data-attributes:

- `<html data-theme="light|dark">` — light/dark mode
- `<html data-palette="default|neon|sunset">` — palette alt
- `<html data-density="compact|normal|comfortable">` — spacing density

### Token architecture

The design system uses a three-layer architecture:

1. **Raw palette** (`--plum-*`, `--gold-*`, `--paper-*`) — private scale defined in `tokens.css`. Not exposed as Tailwind utilities; used only to compute semantic values.
2. **Semantic tokens** — public, paired bg+fg utilities (`bg-background` / `text-foreground`, `bg-primary` / `text-primary-foreground`, etc.). These are the correct layer to use in product code.
3. **Identity tokens** — component-specific overrides (`--nav-on-dark-*`, `--badge-*`, `--chart-*`).

Switching theme and palette are fully orthogonal — all six combinations work automatically:

```html
<html data-theme="dark" data-palette="neon">
```

See `docs/specs/2026-04-24-theme-architecture-refactor-design.md` for the full token taxonomy and migration guide from 0.1.0 names.

## Component inventory (~47)

**Foundations:** Icon (+30 atomic), Box, Container, AspectRatio, ScrollArea, Separator, Ornament, FormField

**Tier 1 signature:** Button, IconButton, Card (5 variants), Dialog, AlertDialog, Drawer, Banner

**Forms:** Input, Textarea, Label, Checkbox, RadioGroup, Switch, Slider, SegmentedControl, Select, DatePicker, Combobox, Popover

**Feedback:** Tooltip, Toast, Progress, Spinner, Skeleton, Badge, Chip

**Navigation:** Tabs, DropdownMenu, ContextMenu, NavItem, Breadcrumbs, Pagination

**Data:** Avatar, AvatarGroup, Accordion, Table, Stat

**Layout:** AppShell, PageHeader

## Tech stack

- React 19 (peer ≥18)
- Tailwind v4 (CSS-first)
- Radix UI primitives
- TypeScript strict, pnpm workspace, tsup build
- Vitest unit + Playwright e2e

## Design Spec

- `docs/specs/2026-04-18-damo-ui-design.md` — original design spec
- `docs/specs/2026-04-24-theme-architecture-refactor-design.md` — token taxonomy and 0.1→0.2 migration guide

## License

Private — copyright Simone Schioppo.
