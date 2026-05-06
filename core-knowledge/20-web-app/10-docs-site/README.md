# Docs Site

Status: documented · Last scan: d63afaf · Sources:
`apps/web/app/docs/{layout.tsx,page.tsx,getting-started/,foundations/,components/,_components/,_lib/}`.

## Summary

The documentation surface for `@damo/ui`, served at `/docs/*`. Two-
column responsive layout (sidebar + content), with grouped navigation
defined in a single source-of-truth file. Per-component pages render
real component examples via a `<Example>` server component that pairs
a live preview with a syntax-highlighted code block. Foundations
chapters cover tokens, theming, colors, typography, and patterns.

## Public surface (URL paths)

| Path                                  | Renders                                  |
|---------------------------------------|------------------------------------------|
| `/docs/getting-started`               | static intro page                        |
| `/docs/foundations/tokens`            | tokens reference                         |
| `/docs/foundations/theming`           | theming guide (light/dark/palette)       |
| `/docs/foundations/colors`            | color visualization                      |
| `/docs/foundations/typography`        | font + scale showcase                    |
| `/docs/foundations/patterns`          | Memphis pattern catalog                  |
| `/docs/components/<slug>` (real)      | per-component documentation page         |
| `/docs/components/[component]` (stub) | dynamic stub for nav entries without a real page yet |

The `[component]` dynamic route uses Next's `generateStaticParams`
to pre-render every "stub-status" entry from `DOCS_NAV` so static
export covers the full inventory.

## Internal architecture

### Layout (`docs/layout.tsx`)

```jsx
<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] min-h-screen
                bg-background text-foreground">
  <div className="hidden lg:block"><DocsSidebar /></div>
  <main className="px-6 sm:px-10 lg:px-12 py-10 lg:py-12 max-w-[920px] w-full">
    {children}
  </main>
</div>
```

Two-column on `lg+`, sidebar hidden on smaller viewports — content
takes the full width below `lg`. Content max-width is 920px for
readability.

This is **not** the lib's `AppShell` component — the docs layout
predates AppShell or chose not to use it. See Open questions.

### Navigation source of truth — `docs-nav.ts`

```ts
export interface DocsNavEntry {
  readonly slug: string
  readonly label: string
  readonly status?: 'beta' | 'stub'
}

export interface DocsNavGroup {
  readonly title: string
  readonly entries: ReadonlyArray<DocsNavEntry>
}

export const DOCS_NAV: ReadonlyArray<DocsNavGroup> = [...]
```

Single readonly module exporting the nav structure. Groups:

- **Getting Started** — Introduction
- **Foundations** — Tokens, Theming, Colors, Typography, Patterns
- **Primitives** — Box, Container, AspectRatio, ScrollArea,
  Separator, Ornament, FormField
- **Actions & Surfaces** — Button & IconButton, Card, Dialog,
  Drawer, Banner
- **Forms** — 12 form-related components
- **Feedback** — 8 feedback/status components
- **Navigation** — (Tabs, Breadcrumbs, Pagination, NavItem,
  Accordion — visible in the next group block)
- and more…

Each entry can carry `status: 'beta' | 'stub'` — used by:
- `DocsSidebar` to render a small status badge next to the label.
- The `[component]` dynamic route to know which slugs to
  pre-render as stubs.

**Don't add a doc page without adding to `DOCS_NAV` first** — the
sidebar and the dynamic stub route both read it.

### Internal helpers (`_components/`, `_lib/`)

The docs site has its own private helper layer (the underscore
prefix is Next's convention for non-routable folders):

| Helper                             | Purpose |
|------------------------------------|---------|
| `_components/Code.tsx`             | Server-side syntax-highlighted code block |
| `_components/CopyButton.tsx`       | Copy-to-clipboard button |
| `_components/Example.tsx`          | Server component that pairs preview + code |
| `_components/PropsTable.tsx`       | Tabular props reference |
| `_components/DocsSidebar.tsx`      | Sidebar nav, reads `DOCS_NAV` |
| `_components/docs-nav.ts`          | The nav source of truth (above) |
| `_components/highlight.ts`         | Server-only syntax highlighter |
| `_lib/active-section.ts`           | "Currently visible heading" tracking for sidebar TOC |
| `_lib/patterns.tsx`                | Memphis-pattern preview helpers used by foundations/patterns |

#### `<Example>` component (server)

```tsx
<Example title="Variants" code={SNIPPET}>
  <Button variant="primary">Primary</Button>
  <Button variant="ghost">Ghost</Button>
</Example>
```

Renders a Memphis-bordered preview frame with the live children,
then a syntax-highlighted code block below. **Server component** —
the source comment is explicit:

> Server Component. Imports Code, which transitively imports
> `server-only`, so this file must NOT be marked `'use client'` —
> doing so triggers a runtime error inside Next.js's RSC boundary
> check.

This boundary discipline is a load-bearing invariant. If a future
change adds client-only behavior, it needs to live in a child
component, not in `<Example>` itself.

### Per-component page pattern

A typical real component page (e.g.
`docs/components/button/page.tsx`):

```ts
import Link from 'next/link'
import { Button, IconButton } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Button } from '@damo/ui'`
const BASIC_SNIPPET = `…`
const SIZES_SNIPPET = `…`

export default function ButtonPage() {
  return (
    <article>
      <h1>Button</h1>
      <Code code={IMPORT_SNIPPET} />
      <Example code={BASIC_SNIPPET}>…</Example>
      <Example code={SIZES_SNIPPET}>…</Example>
      <PropsTable rows={...} />
    </article>
  )
}
```

Conventions:
- Code snippets are top-level `const` strings — **not** rendered
  by re-stringifying JSX. The user-facing code may differ slightly
  from the rendered preview's source.
- Each page imports `BRAND` for metadata strings.
- Pages export `generateMetadata` to set the `<title>` per page.

### Foundations pages

Custom layouts per chapter (no shared template). Each combines:
- Showcase primitives from `app/_components/showcase/*` (color
  scales, type specimens, token swatches, pattern swatches).
- The lib's components used inline as live demos.

`patterns.tsx` (`docs/_lib/`) is the heaviest — generates the
Memphis pattern showcase (the `--shadow-memphis-*`,
`--memphis-shape-*` decorative renders) plus their CSS sources.

## Notes & gotchas

1. **`DOCS_NAV` is the contract.** New components must be added
   here for the sidebar to surface them and the stub route to
   pre-render them.

2. **`<Example>` is a server component.** Don't mark with
   `'use client'`. Client-only previews must wrap their interactive
   bits in a child client component.

3. **`max-w-[920px]`** on the content column is the reading
   line-length cap. Wider monitors don't get more text width.

4. **Sidebar is hidden below `lg`** — no mobile drawer pattern.
   Mobile users navigate by Back / typing URLs / homepage. See
   Open questions.

5. **The docs site doesn't use the lib's `AppShell`.** The grid
   layout is hand-rolled. Migrating would simplify but currently
   isn't done.

6. **`generateStaticParams` only stub-pre-renders `status: 'stub'`
   entries.** Real `page.tsx` files take precedence at build time
   per Next App Router rules.

## How to consume (lessons / patterns to lift)

For external docs consumers building on `@damo/ui`:

- The `<Example>` pattern (server-rendered preview + syntax
  highlight) is portable: pull the Code/Example/CopyButton trio
  + a syntax highlighter (the lib uses `shiki` indirectly via the
  `_components/highlight.ts` server helper).
- The `DOCS_NAV` single-source pattern works well for consumer-
  authored docs sites — readonly module + dynamic route + sidebar
  reads from it.

## Open questions

1. **No mobile sidebar / drawer.** Below `lg`, the sidebar
   disappears. A `<Drawer>` trigger in the AppTopBar's actions
   would be the natural mobile pattern.
2. **Docs layout doesn't use AppShell.** Inconsistency with the
   lib's own positioning of AppShell as the canonical shell.
   Migration is plausible.
3. **`max-w-[920px]`** is opinionated and sometimes wasted on wide
   monitors. A "wide / narrow" toggle for code-heavy pages could
   help.
4. **No search.** The docs have no command palette or fuzzy search.
   Common docs-site feature; consumers needing it add `cmdk`-based
   search externally (the lib already depends on `cmdk` via Combobox).
5. **`[component]` dynamic stub route** could expose a "this
   component exists in the lib but isn't documented yet" meta-
   message; today it just 404s if no entry matches.
