# @simoneschioppo/damo-ui

Memphis-inspired React component library for Damacchi app.

## Install

```bash
pnpm add @simoneschioppo/damo-ui
```

Requires `@damacchi` scope in `.npmrc`:

```
@damacchi:registry=https://npm.pkg.github.com
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
import { Button, Card, Dialog } from '@simoneschioppo/damo-ui'
;<Button variant="primary">Click me</Button>
```

## License

Private — see repo.
