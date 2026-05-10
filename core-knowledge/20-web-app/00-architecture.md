# Web App Architecture

Status: documented · Last scan: f49fab2 · Sources:
`apps/web/app/{layout.tsx,page.tsx,not-found.tsx,globals.css,styles/}`
(includes `styles/theme.css`, `styles/patterns.css`,
`styles/code-blocks.css`),
`apps/web/{next.config.ts,tailwind.config.ts,package.json,components/,lib/}`,
`apps/web/app/_components/`,
`apps/web/i18n/{locales.ts,request.ts}`,
`apps/web/messages/{en,it}.json`,
`apps/web/lib/{i18n-tags.tsx,usePersistedLocale.ts}`,
`apps/web/public/{icons/source/favicon-source.svg,site.webmanifest,favicon*,apple-touch-icon.png,android-chrome-*.png}`,
`apps/web/scripts/generate-icons.ts`.

## Summary

`apps/web` is a **Next.js 15 App Router** project that doubles as
**(a) the documentation site** for `damo-ui` and **(b) the live
theme generator** that produces consumable tokens. Workspace-wired
to the lib via path aliases (zero-build dev — Next imports
`packages/ui/src` directly), with a custom Tailwind v4 + lib-tokens

- playground-theme stylesheet pipeline.

Two concrete deliverables, one Next app:

- **`/docs/*`** — component documentation surface (per-component
  pages, foundations chapters, sidebar nav). See docs site chapter.
- **`/theme-generator`** — three-layer token editor that exports
  CSS / Tailwind / JSON. See theme generator chapter.

## Top-level layout

```
apps/web/
├── i18n/
│   ├── locales.ts            ← shared constants (LOCALE_COOKIE, SUPPORTED_LOCALES, isSupportedLocale, DEFAULT_LOCALE)
│   └── request.ts            ← next-intl getRequestConfig — server-side cookie → locale + messages
├── messages/
│   ├── en.json               ← EN catalog (default) — ~600 keys
│   └── it.json               ← IT catalog — full parity with EN
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
├── lib/
│   ├── brand.ts              ← brand strings (lib name, tagline, mascot dimensions, repo URL)
│   ├── i18n-tags.tsx         ← reusable t.rich() formatter tags (codeTag, monoTag, linkTag, …) + entity decoder
│   └── usePersistedLocale.ts ← client hook: locale ↔ localStorage + cookie + <html lang> + data-locale
├── public/
│   ├── mascot.png             ← header brand mark
│   ├── mascot-hero.png        ← landing-page hero
│   ├── favicon.ico            ← multi-res ICO (16/32/48 PNG-embedded)
│   ├── favicon-{16x16,32x32}.png
│   ├── apple-touch-icon.png   ← 180×180, white-flattened
│   ├── android-chrome-{192x192,512x512}.png
│   ├── site.webmanifest       ← hand-authored PWA manifest
│   └── icons/source/favicon-source.svg ← single editable artefact
├── scripts/
│   ├── generate-icons.ts      ← sharp pipeline → PNG set + inline ICO encoder
│   ├── to-ico.d.ts (removed; obsolete after inline-encoder switch)
│   └── __tests__/icons-output.test.ts
├── test-utils/                ← Vitest helpers
├── next.config.ts             ← path aliases for damo-ui resolution
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
@import 'damo-ui/styles/tokens.css';
@import 'damo-ui/styles/globals.css';

/* 2. Tailwind v4 entry */
@import 'tailwindcss';

/* 3. Tailwind v4 bridge — exposes lib tokens as utility classes */
@import 'damo-ui/styles/theme.css';

/* 4. Playground's own theme — overrides lib's neutral defaults */
@import './styles/theme.css';
@import './styles/patterns.css';
@import './styles/code-blocks.css';

/* 5. Tailwind sources — both lib output and source */
@source '../../../packages/ui/dist/**/*.js';
@source '../../../packages/ui/src/**/*.{ts,tsx}';
```

Cascade order is critical:

1. **Lib tokens** declare neutral grayscale defaults on `:root`.
2. **Tailwind v4** picks up tokens via `@theme inline` from
   `damo-ui/styles/theme.css`.
3. **Playground theme** (`apps/web/app/styles/theme.css`)
   re-declares every semantic var with the Memphis "ink + plum +
   gold + paper" identity. This is the demonstration theme, not
   the lib's default.
4. **Patterns** (`apps/web/app/styles/patterns.css`) — decorative
   Memphis backgrounds for showcase tiles.
5. **`code-blocks.css`** (gh-100, PR #101 + #103 follow-up) owns
   the docs-site code-block chrome: the editor-style header
   (filename tab, language badge, copy button), the line-numbers
   gutter, the Shiki dual-theme light/dark switch
   (`var(--shiki-light)` vs `var(--shiki-dark)` under
   `[data-theme='dark']`), and the wired-but-unused notation
   transformer styles (diff add/remove, highlighted line). Carries
   its own intentional `--code-*` palette (light defaults + dark
   override) — by design distinct from the page palette so the
   editor reads as a coherent IDE surface rather than echoing
   palette swaps. `display: grid` on `.shiki code` is load-bearing
   for tight line stacking. See
   [`10-docs-site/README.md`](10-docs-site/README.md) note 10 for
   the full contract.
6. **`@source` directives** tell Tailwind v4 to scan both the lib's
   compiled `dist/` and the lib's `src/` for utility classes —
   ensures classes added to lib components are emitted in the app's
   bundle.

### Where the missing `--ink-*` lives

The `--ink-100/300/500/700/800/900` palette tokens that the lib's
overlay components (Dialog, Drawer, ScrollArea) reference but don't
define are declared in **this app's** `app/styles/theme.css`. So the
overlays render correctly inside the playground but would be broken
for an external consumer of `damo-ui` who didn't ship a similar
ink palette. (Recorded as Open question in the build-and-publish
chapter.)

## i18n wiring

Application-wide internationalisation runs on **`next-intl` in
no-routing mode** — locale is decided per-request from the
`NEXT_LOCALE` cookie, not from a URL prefix. This keeps existing
internal links unchanged and matches the localStorage-based UX of
the existing theme/palette/density switchers.

### Files

- **`apps/web/i18n/locales.ts`** — shared constants imported by both
  the server (`request.ts`) and the client (`usePersistedLocale.ts`):
  `SUPPORTED_LOCALES = ['en', 'it']`, `DEFAULT_LOCALE = 'en'`,
  `LOCALE_COOKIE = 'NEXT_LOCALE'`, `isSupportedLocale()` guard. Lives
  in its own file because `request.ts` imports `next/headers`
  (server-only) and a `'use client'` consumer cannot transitively
  pull it in.
- **`apps/web/i18n/request.ts`** — `next-intl` `getRequestConfig`
  callback. Reads `NEXT_LOCALE` from cookies, validates against the
  allowlist (preventing path-traversal in the dynamic
  `import('../messages/<locale>.json')`), defaults to `'en'`. In
  dev, `onError` logs missing-key errors via `console.warn`; in
  production it's silent so stragglers don't crash the page.
- **`apps/web/messages/{en,it}.json`** — message catalogs, key
  parity 1:1, ~600 keys each.
- **`apps/web/lib/usePersistedLocale.ts`** — client hook that
  bridges `next-intl`'s server-resolved locale with the persisted
  client state. On switch: sets `localStorage.locale` (try/catch
  for Safari private mode), the `NEXT_LOCALE` cookie (with
  `Secure; SameSite=Lax`), `<html lang>`, and `data-locale`.
- **`apps/web/lib/i18n-tags.tsx`** — reusable formatter tags for
  `t.rich(...)`: `codeTag`, `monoTag`, `strongTag`, `emTag`,
  `kbdTag`, `linkTag(href)`. Each decodes HTML entities (`&lt;`,
  `&gt;`, `&amp;`, `&quot;`, `&apos;`) on its text chunks before
  rendering, so the message catalog can carry literal `<` and `>`
  inside `<code>` chunks without triggering ICU's tag-parser.

### Provider boundary — `<DocsProviders>`

The root layout colocates `next-intl`'s `<NextIntlClientProvider>`
with the lib's `<I18nProvider>` (see
[10-library/16-i18n.md](../10-library/16-i18n.md)) inside
`apps/web/app/_components/DocsProviders.tsx`:

```tsx
'use client'
export function DocsProviders({ locale, messages, children }) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </NextIntlClientProvider>
  )
}
```

Locale flows once: server resolves it from the cookie, layout
forwards it to `<DocsProviders>`, both providers see the same
value. Lib components (Spinner, Combobox, DatePicker, Pagination,
Banner, Dialog, Drawer, Toast) read their default labels from
`useI18n()`, while docs-site code reads from `useTranslations()`.

### Catalog structure (top-level namespaces)

| Namespace          | Owner                  | Notes                                                                      |
| ------------------ | ---------------------- | -------------------------------------------------------------------------- |
| `nav`              | root layout AppTopBar  | "Docs" / "Theme Generator"                                                 |
| `preferences`      | DocsPreferencesMenu    | theme/palette/density/language axes                                        |
| `docsSidebar`      | DocsSidebar            | group titles + entries.introduction                                        |
| `docsChrome`       | shared docs primitives | PropsTable headers, CopyButton, category eyebrows, common section headings |
| `home`, `notFound` | landing + 404          | hero copy, CTAs, brand alt-text                                            |
| `gettingStarted`   | /docs/getting-started  | step bullets + body                                                        |
| `foundations.*`    | /docs/foundations/\*   | one sub-namespace per foundation page                                      |
| `componentDocs.*`  | /docs/components/\*    | per-slug `lead`, `body.*`, `a11y.*`, `props.*`                             |
| `themeGenerator.*` | /theme-generator       | sidebar tabs, scenes, export, identity sections                            |
| `sampleDialog`     | sample-dialog.tsx      | published-release modal copy                                               |
| `brand`            | landing + 404          | mascot alt-text                                                            |

### ICU escaping gotchas (learned)

`next-intl`'s message parser is ICU-based. Three traps surfaced
during PR #69 and are documented here for future contributors:

1. **Bare `{X}` placeholders inside `<code>` chunks.** ICU treats
   `{anything}` as a placeholder name; if there's no matching
   formatter, the parser strips the chunk and the whole message
   falls back to its key. Fix: escape with ICU literal quotes —
   `<code>'{' value, label '}'</code>` renders as
   `<code>{ value, label }</code>`. Same for `{false}`, `{null}`,
   `{rank}` etc.
2. **Apostrophe followed by syntax char.** ICU enters quote-mode
   when `'` precedes `{`, `}`, `#`, or `<`. The Italian apostrophe
   in `sull'<code>` would consume the `<code>` boundary. Fix:
   double the apostrophe (`sull''<code>`) — `''` is the ICU
   literal apostrophe escape and renders unchanged.
3. **Bare angle brackets inside `<code>` chunks.** Patterns like
   `<code><html></code>` get re-parsed by next-intl as nested tags;
   `<html>` isn't a registered formatter so the parser bails.
   Fix: store `&lt;`/`&gt;` in the catalog and let `i18n-tags.tsx`
   formatters decode them at render time. Catalog-walk script in
   the PR enforces this by re-encoding any non-registered `<X>`.

The `i18n-tags.tsx` formatters and the catalog encoding rules above
are the canonical contract — when adding new translatable messages,
prefer entity-encoded angle brackets and ICU-escaped braces for any
content inside `<code>` chunks.

### Switcher UX

`DocsPreferencesMenu` exposes a Language axis (English / Italiano)
above the existing Theme / Palette / Density axes. Selecting a
language calls `setLocale(next)` (writes localStorage + cookie +
`<html lang>` + `data-locale`) then `window.location.reload()` so
RSC chrome (nav, sidebar group titles, eyebrows, section headings,
component leads) re-renders under the new locale.

## Library wiring (`next.config.ts`)

The web app **imports `damo-ui` source directly**, not the built
`dist/`:

```ts
const uiSrc = path.resolve(__dirname, '../../packages/ui/src')

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['damo-ui'],
  webpack: (config) => {
    config.resolve.alias = {
      'damo-ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      'damo-ui': path.join(uiSrc, 'index.ts'),
    }
    return config
  },
  turbopack: {
    resolveAlias: {
      'damo-ui/mocks': path.join(uiSrc, 'mocks/index.ts'),
      'damo-ui': path.join(uiSrc, 'index.ts'),
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

`transpilePackages: ['damo-ui']` ensures Next compiles the lib's
TS source (rather than expecting pre-built JS).

## Tailwind config (`tailwind.config.ts`)

```ts
import damo from 'damo-ui/tailwind.preset'

const config: Config = {
  presets: [damo as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/dist/**/*.js'],
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

The layout exports two metadata objects consumed by Next 15's metadata
API in addition to the JSX tree:

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND.libName} — Memphis-inspired component library`,
  description: BRAND.tagline,
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#7a3980',
}
```

Next 14 split `themeColor` out of `metadata` into a separate `viewport`
export so the address-bar tint can change per route. The layout
emits no manual `<link rel="icon">` / `<link rel="manifest">` or
`<meta name="theme-color">` tags — Next renders them from these two
exports.

```jsx
const PREFERENCES_INIT_SCRIPT = `(function(){try{
  var d = document.documentElement
  var t = localStorage.getItem('theme')
  if (t==='light'||t==='dark') d.setAttribute('data-theme', t)
  var p = localStorage.getItem('palette')
  if (p==='default'||p==='sunset'||p==='cyberpunk'||p==='forest')
    d.setAttribute('data-palette', p)
  var n = localStorage.getItem('density')
  if (n==='compact'||n==='normal'||n==='comfortable')
    d.setAttribute('data-density', n)
}catch(e){}})();`

export default async function RootLayout({ children }) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()
  const t = await getTranslations('nav')
  return (
    <html lang={locale}
          data-locale={locale}
          data-theme="light"
          data-palette="default"
          data-density="normal"
          suppressHydrationWarning>
      <head>
        {/* FOUC prevention — synchronous, before any stylesheet link. */}
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700;800&display=swap"
              rel="stylesheet"/>
      </head>
      <body suppressHydrationWarning>
        <DocsProviders locale={locale} messages={messages}>
          <AppTopBar
            logo={<BrandMark />}
            nav={<><Link href="/docs">{t('docs')}</Link><Link href="/theme-generator">{t('themeGenerator')}</Link></>}
            actions={<DocsPreferencesMenu />}
          />
          {children}
        </DocsProviders>
      </body>
    </html>
  )
}
```

Five things load-bearing:

1. **`data-theme` / `data-palette` / `data-density`** on `<html>`
   are the three attributes the lib's `AttrToggleGroup` (and its
   wrappers ThemeSwitcher, PaletteSwitcher, DensitySwitcher) flip.
   The defaults set here are what the lib renders before any user
   interaction.

2. **The inline `PREFERENCES_INIT_SCRIPT` is FOUC prevention.**
   Server can't read localStorage, so the SSR'd HTML always carries
   the safe defaults above. Without this script, a user who persisted
   dark mode would see a one-frame light flash on every cold reload —
   most painfully on locale switch, which calls `window.location.reload()`
   to refresh RSC chrome. The script runs synchronously before
   `<body>` parses, validates each value against the same allow-lists
   used by `DocsPreferencesMenu` (theme ∈ light/dark; palette ∈
   default/sunset/cyberpunk/forest; density ∈ compact/normal/comfortable),
   and writes the matching `data-*` attribute on `document.documentElement`
   so the very first paint has the user's preferences applied. Hard
   constraints: must be synchronous (no `defer`/`async`/`type="module"`),
   must precede the stylesheet links, and the body must be a hard-coded
   string literal (no interpolation of any user-controlled value) so
   `dangerouslySetInnerHTML` carries no XSS risk. Allow-list values
   are duplicated between this script and `DocsPreferencesMenu` —
   adding a new palette requires updating both. CSP note: the inline
   script requires `'unsafe-inline'` in `script-src` or a matching
   `sha256-…` hash; no CSP is configured today.

3. **`suppressHydrationWarning`** on both `<html>` and `<body>` is
   required because the FOUC script writes `data-*` attributes that
   diverge from the SSR defaults — those mutations on the
   `documentElement` happen before React hydration and are otherwise
   reported as a mismatch. The lib's `usePersistedAttr` hook
   (see [`../10-library/15-hooks.md`](../10-library/15-hooks.md))
   complements the script via lazy-init `useState`: its first commit
   value reads localStorage synchronously, so the post-paint DOM-write
   effect agrees with what the script already wrote and never undoes it.
   Together: script ensures the first paint is correct; lazy-init
   ensures React doesn't clobber it post-hydration.

4. **Google Fonts preconnects + the `Audiowide` + `Exo 2` link** —
   the playground theme's typography (`--font-display: 'Audiowide'`,
   `--font-body: 'Exo 2'`). External consumers swapping the theme
   need to load their own fonts.

5. **`<html lang>` and `<html data-locale>` are server-resolved**
   from the `NEXT_LOCALE` cookie via `next-intl/server`'s
   `getLocale()`. The `<DocsProviders>` wrapper colocates
   `<NextIntlClientProvider>` with the lib's `<I18nProvider>` so
   docs-site translations and lib component defaults share the
   active locale. See the i18n wiring section above.

`<AppTopBar>` is the lib's component — same Memphis-bordered
header used in any consumer app. The `actions` slot hosts the
playground's combined preferences menu (language / theme / palette
/ density switchers in a popover).

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

## Branding assets — favicon pipeline

Source-of-truth artefact: **`public/icons/source/favicon-source.svg`**.
A 32×32 viewBox Memphis "D" — purple body
(`#7a3980` = `--ink-500` = the docs palette's secondary brand color)
on a white background, with a tilted gold square accent
(`#c4942a` = `--brand-500`) and a 2 px black Memphis frame. Hand-authored;
the only file a designer edits.

A deterministic local pipeline at **`scripts/generate-icons.ts`** reads
the SVG via `sharp` and emits the full set into `public/`:

| Output                       | Use                                           | Method                                                            |
| ---------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| `favicon-16x16.png`          | `<link rel="icon" sizes="16x16">`             | `sharp(svg, { density }).resize(16,16).png()`                     |
| `favicon-32x32.png`          | `<link rel="icon" sizes="32x32">`             | same, 32 px                                                       |
| `apple-touch-icon.png`       | `<link rel="apple-touch-icon">`               | 180 px, white-flattened (iOS rejects transparent backgrounds)     |
| `android-chrome-192x192.png` | `site.webmanifest` icons[]                    | 192 px                                                            |
| `android-chrome-512x512.png` | `site.webmanifest` icons[]                    | 512 px                                                            |
| `favicon.ico`                | `<link rel="shortcut icon">` + `/favicon.ico` | inline ICO encoder embedding 16/32/48 PNG buffers (Vista+ format) |

`density` is per-target capped at 1440 dpi (`Math.min(1440, Math.max(384, size * 5))`)
to give sharp comfortable downsampling margin without blowing up
intermediate raster size for the 512-px target.

The ICO encoder is **inline** (~30 LOC) rather than via the `to-ico`
package. Originally the spec used `to-ico`, but its transitive
chain (`resize-img → jimp@0.2 → minimist/form-data/jpeg-js/url-regex`)
carried four CRITICAL/HIGH CVEs that `pnpm audit --audit-level=high`
flagged. Inlining the encoder eliminates the chain entirely; sharp
itself doesn't write ICO so the alternative was either accept the
CVEs (dev-time-only blast radius) or hand-roll. The hand-rolled
encoder follows MSDN's PNG-in-ICO ICONDIRENTRY rules
(`wPlanes` = 0, `wBitCount` = 0 for PNG entries; only width/height bytes
and the 4-byte size + 4-byte offset are non-zero).

The script is invoked manually via `pnpm --filter @damo/web run icons:generate`
when the source SVG changes — generated assets are **committed**, not
regenerated on every `next build`. Rationale:

- Sharp ships native binaries; cold-start install on Vercel is
  occasionally flappy on minor toolchain drift. Committing the bytes
  keeps the deploy path independent of `sharp` install.
- Sharp's resampling is not bit-stable across versions, so a strict
  CI re-generate-and-diff guard would flap on dependency bumps.
  Treating the SVG as input and the PNGs as committed output mirrors
  how the lib treats fonts and the mascot art.

`public/site.webmanifest` is hand-authored (not generated): a 30-line
JSON file with `name`, `short_name`, two-icon `icons` array
(192 + 512, both `purpose: "any"`), `theme_color: "#7a3980"`,
`background_color: "#ffffff"`, `display: "standalone"`, `start_url: "/"`,
`id: "/"`. The `id` field is required for stable Chrome PWA
identity — without it, changing `start_url` would re-prompt users to
reinstall.

Wiring is via Next 15's `metadata.icons` + `metadata.manifest` +
`metadataBase` + the separate `viewport.themeColor` export (see Root
layout above). No manual `<link>` or `<meta>` tags anywhere in the
app. The mascot art (`mascot.png` / `mascot-hero.png`) is unrelated to
the favicon pipeline — the in-page brand mark is the mascot, the
favicon is the simpler "D" letterform that resolves at 16×16 where
the mascot's silhouette would muddle.

## Notes & gotchas

1. **The web app is the canonical consumer of `damo-ui`.** Bugs
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

4. **`transpilePackages: ['damo-ui']`** is required because Next 13+
   doesn't compile workspace TS by default.

5. **`tailwind.config.ts` is a shim**, not the source of truth.

## How to consume (reference architecture for an external app)

A consumer wiring `damo-ui` into a fresh Next 15 + Tailwind v4 app
should mirror this stylesheet pipeline:

```css
@import 'damo-ui/styles/tokens.css';
@import 'damo-ui/styles/globals.css';
@import 'tailwindcss';
@import 'damo-ui/styles/theme.css';
/* Optional: consumer's own brand override */
@import './styles/my-theme.css';
@source '../node_modules/damo-ui/dist/**/*.js';
```

For workspace setups, the alias trick in `next.config.ts` is the
fastest dev loop. For external consumers, install `damo-ui` from
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
