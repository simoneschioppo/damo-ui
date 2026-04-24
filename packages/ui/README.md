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

## License

Private — see repo.
