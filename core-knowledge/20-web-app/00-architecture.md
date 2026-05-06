# Web App Architecture

Status: documented · Last scan: d63afaf · Sources:
`apps/web/app/{layout.tsx,page.tsx,not-found.tsx,globals.css,styles/}`,
`apps/web/{next.config.ts,tailwind.config.ts,package.json,components/,lib/}`,
`apps/web/app/_components/`.

## Summary

`apps/web` is a **Next.js 15 App Router** project that doubles as
**(a) the documentation site** for `@damo/ui` and **(b) the live
theme generator** that produces consumable tokens. Workspace-wired
to the lib via path aliases (zero-build dev — Next imports
`packages/ui/src` directly), with a custom Tailwind v4 + lib-tokens
+ playground-theme stylesheet pipeline.

Two concrete deliverables, one Next app:
- **`/docs/*`** — component documentation surface (per-component
  pages, foundations chapters, sidebar nav). See docs site chapter.
- **`/theme-generator`** — three-layer token editor that exports
  CSS / Tailwind / JSON. See theme generator chapter.

## Top-level layout

```
apps/web/
├── app/                      ← Next App Router root
│   ├── layout.tsx            ← root layout: AppTopBar + theme html attributes
│   ├── page.tsx              ← landing page
│   ├── not-found.tsx         ← 404
│   ├── globals.css           ← stylesheet pipeline (see Stylesheet pipeline)
│   ├── styles/
│   │   ├── theme.css         ← Plum+Gold playground theme (Memphis identity)
│   │   └── patterns.css      ← decorative Memphis patterns (background-image scenes)
│   ├── _components/          ← root-app-shared (DocsPreferencesMenu + showcase/*)
│   ├── docs/                 ← doc site root (own layout.tsx with sidebar)
│   │   ├── _components/      ← Code, CopyButton, Example, PropsTable, DocsSidebar, …
│   │   ├── _lib/             ← active-section, patterns helpers
│   │   ├── getting-started/page.tsx
│   │   ├── foundations/{tokens,theming,colors,typography,patterns}/page.tsx
│   │   ├── components/<slug>/page.tsx     ← one page per real component
│   │   └── components/[component]/page.tsx ← dynamic stub for components in DOCS_NAV without a real page yet
│   └── theme-generator/
│       ├── page.tsx          ← 1200-line editor UI
│       ├── theme-state.ts    ← three-layer Theme types + DEFAULT_THEME
│       ├── use-theme-state.ts ← reducer + persistence + DOM sync
│       ├── presets.ts        ← raw-palette presets (default / neon / sunset)
│       ├── exporters.ts      ← Theme → CSS | Tailwind | JSON
│       ├── contrast.ts       ← WCAG ratio + AA badges
│       └── sample-dialog.tsx ← preview canvas
├── components/                ← top-level non-routed components (BrandMark)
├── lib/                       ← top-level app utilities (brand.ts)
├── public/                    ← static assets (mascot images)
├── test-utils/                ← Vitest helpers
├── next.config.ts             ← path aliases for @damo/ui resolution
├── tailwind.config.ts         ← v3-compat preset for legacy paths
├── postcss.config.js
└── package.json
```

## Stylesheet pipeline (`globals.css`)

The single most important file in the app — orchestrates the
Tailwind v4 layer with the lib's tokens and the playground's own
theme override:

```css
/* 1. Lib base — token contract + reset */
@import '@damo/ui/styles/tokens.css';
@import '@damo/ui/styles/globals.css';

/* 2. Tailwind v4 entry */
@import 'tailwindcss';

/* 3. Tailwind v4 bridge — exposes lib tokens as utility classes */
@import '@damo/ui/styles/theme.css';

/* 4. Playground's own theme — overrides lib's neutral defaults */
@import './styles/theme.css';
@import './styles/patterns.css';

/* 5. Tailwind sources — both lib output and source */
@source '../../../packages/ui/dist/**/*.js';
@source '../../../packages/ui/src/**/*.{ts,tsx}';
```

Cascade order is critical:

1. **Lib tokens** declare neutral grayscale defaults on `:root`.
2. **Tailwind v4** picks up tokens via `@theme inline` from
   `@damo/ui/styles/theme.css`.
3. **Playground theme** (`apps/web/app/styles/theme.css`)
   re-declares every semantic var with the Memphis "ink + plum +
   gold + paper" identity. This is the demonstration theme, not
   the lib's default.
4. **Patterns** (`apps/web/app/styles/patterns.css`) — decorative
   Memphis backgrounds for showcase tiles.
5. **`@source` directives** tell Tailwind v4 to scan both the lib's
   compiled `dist/` and the lib's `src/` for utility classes —
   ensures classes added to lib components are emitted in the app's
   bundle.

### Where the missing `--ink-*` lives

The `--ink-100/300/500/700/800/900` palette tokens that the lib's
overlay components (Dialog, Drawer, ScrollArea) reference but don't
define are declared in **this app's** `app/styles/theme.css`. So the
overlays render correctly inside the playground but would be broken
for an external consumer of `@damo/ui` who didn't ship a similar
ink palette. (Recorded as Open question in the build-and-publish
chapter.)

## Library wiring (`next.config.ts`)

The web app **imports `@damo/ui` source directly**, not the built
`dist/`:

```ts
const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@damo/ui'],
  webpack: (config) => {
    config.resolve.alias = {
      '@damo/ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      '@damo/ui':       path.join(uiSrc, 'index.ts'),
    }
    return config
  },
  turbopack: {
    resolveAlias: {
      '@damo/ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      '@damo/ui':       path.join(uiSrc, 'index.ts'),
    },
  },
}
```

Both webpack and Turbopack are aliased — Next can use either. Two
implications:

1. **No build step needed for lib changes.** Editing
   `packages/ui/src/components/button/button.tsx` is reflected in
   `apps/web` on the next page reload.
2. **External consumers will see the built `dist/`**, not the
   source. Differences (e.g. the `"use client"` prepend done by
   `tsup`'s `onSuccess`) only apply to the dist build — the web app
   bypasses them. This is intentional but worth knowing for
   debugging.

`transpilePackages: ['@damo/ui']` ensures Next compiles the lib's
TS source (rather than expecting pre-built JS).

## Tailwind config (`tailwind.config.ts`)

```ts
import damo from '@damo/ui/tailwind.preset'

const config: Config = {
  presets: [damo as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/dist/**/*.js',
  ],
}
```

This file is a **v3-compat shim**. The actual Tailwind v4
configuration lives in `globals.css` via `@theme inline` and
`@source` directives. The v3-style config exists because some
tooling (older IDE plugins, lint integrations) still scan
`tailwind.config.ts`. Don't rely on this file as the source of truth
for v4 builds.

The `content` array points to `dist/`, not `src/` — this is a
**second** content scan, complementing the v4 `@source` directives
which scan both. Result: utility classes from any of three
locations (app source, lib source, lib dist) are emitted in the
final CSS.

## Root layout (`app/layout.tsx`)

```jsx
<html lang="en"
      data-theme="light"
      data-palette="default"
      data-density="normal"
      suppressHydrationWarning>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
    <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"/>
  </head>
  <body suppressHydrationWarning>
    <AppTopBar
      logo={<BrandMark />}
      nav={<><Link href="/docs">Docs</Link><Link href="/theme-generator">Theme Generator</Link></>}
      actions={<DocsPreferencesMenu />}
    />
    {children}
  </body>
</html>
```

Three things load-bearing:

1. **`data-theme` / `data-palette` / `data-density`** on `<html>`
   are the three attributes the lib's `AttrToggleGroup` (and its
   wrappers ThemeSwitcher, PaletteSwitcher, DensitySwitcher) flip.
   The defaults set here are what the lib renders before any user
   interaction.

2. **`suppressHydrationWarning`** on both `<html>` and `<body>`
   prevents Next's hydration mismatch warnings when the
   `usePersistedAttr` hook reads localStorage on first paint and
   may flip the attribute (see AttrToggleGroup chapter).

3. **Google Fonts preconnects + the `Audiowide` + `Exo 2` link** —
   the playground theme's typography (`--font-display: 'Audiowide'`,
   `--font-body: 'Exo 2'`). External consumers swapping the theme
   need to load their own fonts.

`<AppTopBar>` is the lib's component — same Memphis-bordered
header used in any consumer app. The `actions` slot hosts the
playground's combined preferences menu (theme/palette/density
switchers in a popover).

## Top-level shared components

### `apps/web/components/BrandMark.tsx`

Renders the Damo UI logo + mascot in the header. Read by the layout.

### `apps/web/lib/brand.ts`

Single source of truth for all brand strings (lib name, tagline,
mascot dimensions, repo URL). Replaces a previously-separate
"Axolab" branding (a former secondary identity that was retired —
see the file's JSDoc for the migration note).

### `apps/web/app/_components/DocsPreferencesMenu.tsx`

The header-actions popover that exposes the three switchers. Used
in the root layout.

### `apps/web/app/_components/showcase/`

Small set of presentational primitives used across the docs site:
`color-scale`, `pattern-swatch`, `section-header`, `showcase-card`,
`sub-panel`, `token-swatch`, `tooltip-card`, `type-specimen`. Not
re-exported from the lib; they exist purely for the docs/landing
visual.

## Notes & gotchas

1. **The web app is the canonical consumer of `@damo/ui`.** Bugs
   in the lib's components surface here first. The development
   loop is "edit lib source → reload `apps/web`".

2. **`apps/web` ships consumer tokens the lib doesn't ship.** The
   raw `--ink-*`, `--brand-*`, `--paper-*` palette and the playground
   theme overrides live in `apps/web/app/styles/theme.css`. The lib
   sees them at runtime but doesn't depend on them in source.

3. **Workspace alias bypasses the lib's build.** Useful for fast dev,
   but means `dist/`-only behaviors (the `"use client"` prepend) are
   not exercised. To validate a release shape, build the lib and
   temporarily remove the alias.

4. **`transpilePackages: ['@damo/ui']`** is required because Next 13+
   doesn't compile workspace TS by default.

5. **`tailwind.config.ts` is a shim**, not the source of truth.

## How to consume (reference architecture for an external app)

A consumer wiring `@damo/ui` into a fresh Next 15 + Tailwind v4 app
should mirror this stylesheet pipeline:

```css
@import '@damo/ui/styles/tokens.css';
@import '@damo/ui/styles/globals.css';
@import 'tailwindcss';
@import '@damo/ui/styles/theme.css';
/* Optional: consumer's own brand override */
@import './styles/my-theme.css';
@source '../node_modules/@damo/ui/dist/**/*.js';
```

For workspace setups, the alias trick in `next.config.ts` is the
fastest dev loop. For external consumers, install `@damo/ui` from
the registry (once published) and use `dist/` directly — no alias.

## Open questions

1. The web app's `--ink-*` palette covers a gap in the lib's token
   surface. Either the lib should ship a default ink palette, or
   the docs should make it loud that consumers must define one
   (see Dialog Open question 1).
2. The `tailwind.config.ts` shim duplicates the v4 directive setup.
   When v4 tooling is universally adopted, drop the shim.
3. Workspace aliasing means `apps/web` cannot exercise the lib's
   `dist/` pipeline. Worth a CI step that swaps to `dist/` and
   verifies the build for release-shape parity.
4. **`apps/web` is the only consumer in the monorepo.** A second
   consumer (e.g. an example app or a Storybook-equivalent) would
   stress-test the contract assumptions earlier.
