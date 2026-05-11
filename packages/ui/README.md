<p align="center">
  <img src="https://raw.githubusercontent.com/simoneschioppo/damo-ui/main/.github/assets/damo-ui-banner.jpg" alt="damo-ui banner — purple axolotl mascot at a desk with laptop, books and plant" width="100%" style="max-width: 100%; height: auto;" />
</p>

<h1 align="center">damo-ui</h1>

<p align="center">
  Memphis-inspired React and Next.js component library.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/damo-ui"><img alt="npm" src="https://img.shields.io/npm/v/damo-ui?color=plum&label=damo-ui" /></a>
  <a href="https://github.com/simoneschioppo/damo-ui/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="React 18+" src="https://img.shields.io/badge/React-%E2%89%A518-61dafb?logo=react&logoColor=white" />
  <img alt="Tailwind v4" src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white" />
</p>

> ⚠️ **0.x preview.** Public API is stabilising. Expect breaking changes between minor versions until `1.0.0`.

## Install

```bash
pnpm add damo-ui
# or: npm install damo-ui  /  yarn add damo-ui
```

## Peer dependencies

- react >=18
- react-dom >=18
- tailwindcss >=4
- tailwindcss-animate >=1.0.7

## Setup (Next.js + Tailwind v4)

Wire Tailwind v4 in your global stylesheet:

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

(Optional) Drive theme / palette / density from `<html>`:

```html
<html data-theme="light" data-palette="default" data-density="normal"></html>
```

| Attribute      | Values                                           |
| -------------- | ------------------------------------------------ |
| `data-theme`   | `light` \| `dark`                                |
| `data-palette` | `default` \| `sunset` \| `cyberpunk` \| `forest` |
| `data-density` | `compact` \| `normal` \| `comfortable`           |

For the **Tailwind v3** preset, see the repo README.

## Usage

```tsx
import { Button, Card, Dialog } from 'damo-ui'
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

For the current token surface, see the docs site `/docs/foundations/tokens` page — `tokens.css` itself is the source of truth, with one explainer comment per token group.

## License

[MIT](https://github.com/simoneschioppo/damo-ui/blob/main/LICENSE) © 2026 Simone Schioppo.
