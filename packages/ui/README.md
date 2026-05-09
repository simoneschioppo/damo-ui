# @damo/ui

Memphis-inspired React and Next.js component library.

## Install

```bash
pnpm add @damo/ui
```

Requires `@damo` scope in `.npmrc`:

```
@damo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Peer dependencies

- react >=18
- react-dom >=18
- tailwindcss >=4

## Setup

Import styles in your root layout and wire Tailwind v4 (see repo README for full example).

## Usage

```tsx
import { Button, Card, Dialog } from '@damo/ui'
;<Button variant="primary">Click me</Button>
```

## Tokens

Use these Tailwind classes (sourced from semantic CSS variables):

**Surfaces:** `bg-background`, `bg-card`, `bg-popover`, `bg-muted`, paired with `text-foreground`, `text-card-foreground`, `text-popover-foreground`, `text-muted-foreground`.

**Intent:** `bg-primary` / `text-primary-foreground`, `bg-secondary` / `text-secondary-foreground`, `bg-destructive` / `text-destructive-foreground`.

**Status:** `bg-success` / `text-success-foreground`, `bg-warning` / `text-warning-foreground`, `bg-info` / `text-info-foreground`.

**Chrome:** `border-border`, `border-border-strong`, `border-memphis`, `ring-ring`.

**Badge:** `bg-badge-featured` / `text-badge-featured-foreground` (the only badge-specific token; every other Badge variant maps to standard intents — `success`, `warning`, `info`, `destructive`, `outline`).

**Memphis:** `shadow-memphis` (reads `--memphis-shadow-color`), variants: `shadow-memphis-sm`, `shadow-memphis-card`, `shadow-memphis-lg`, `shadow-memphis-hover`, `shadow-memphis-active`.

**Charts:** `bg-chart-1` through `bg-chart-5`.

Raw palette variables are NOT exposed as utilities. Use semantic tokens exclusively. The lib ships only neutral grayscale defaults; bring your own palette via CSS overrides.

Palette presets (default / sunset / cyberpunk / forest) and theme (light / dark) are orthogonal — set both as data attributes on `<html>`:

`<html data-theme="dark" data-palette="cyberpunk">`

For the current token surface (post-1.0 audit), see the playground's `/docs/foundations/tokens` page — `tokens.css` itself is the source of truth, with one explainer comment per token group. The architecture spec at `docs/specs/2026-04-24-theme-architecture-refactor-design.md` is a historical 0.1 → 0.2 reference.

## License

Private — see repo.
