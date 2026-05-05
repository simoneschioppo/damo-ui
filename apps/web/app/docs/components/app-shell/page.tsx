import Link from 'next/link'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AppShell } from '@damo/ui'`

const BASIC_SNIPPET = `<AppShell sidebar={<Nav />} sidebarWidth={260}>
  <PageHeader title="Dashboard" />
  <main>{children}</main>
</AppShell>`

const ON_DARK_SNIPPET = `<AppShell sidebar={<Nav />} sidebarTone="onDark">
  …
</AppShell>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'sidebar',
    type: 'ReactNode',
    required: true,
    description:
      'Content rendered inside the sticky `<aside>` column. Pair with a Sidebar / Nav component.',
  },
  {
    name: 'sidebarWidth',
    type: 'number',
    defaultValue: '240',
    description: 'Pixel width of the sidebar column.',
  },
  {
    name: 'sidebarTone',
    type: "'default' | 'onDark'",
    defaultValue: "'default'",
    description:
      '`default` paints the sidebar with the card surface; `onDark` flips it to ink with light text — pair with NavItem `tone="onDark"`.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Main content rendered in the right column.',
  },
]

export const metadata = { title: `AppShell — ${BRAND.libName}` }

export default function AppShellDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        LAYOUT
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AppShell</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Two-column app layout: sticky sidebar (configurable width and tone) + scrollable main area.
        The shell takes the full viewport height and keeps the sidebar pinned while the main column
        scrolls.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic shape</h2>
      <p className="text-foreground/80 mb-3">
        AppShell occupies the full viewport. The example below shows a static visual scaled into a
        framed preview — wire your own Sidebar (and{' '}
        <Link href="/docs/components/page-header" className="text-primary underline">
          PageHeader
        </Link>
        ) inside the slots.
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis overflow-hidden">
        <div className="grid grid-cols-[180px_1fr] min-h-[260px]">
          <aside className="bg-card border-r-2 border-memphis p-4 flex flex-col gap-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Sidebar
            </div>
            <div className="px-2 py-1 text-[13px] bg-muted">Dashboard</div>
            <div className="px-2 py-1 text-[13px]">Inbox</div>
            <div className="px-2 py-1 text-[13px]">Settings</div>
          </aside>
          <main className="p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Main
            </div>
            <p className="text-sm text-muted-foreground">
              Page content scrolls here. The sidebar stays pinned at the top.
            </p>
          </main>
        </div>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">On-dark sidebar</h2>
      <Code code={ON_DARK_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="AppShell props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Pairs well with</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          <Link href="/docs/components/sidebar" className="text-primary underline">
            Sidebar
          </Link>{' '}
          — composable side panel with header, body, footer slots.
        </li>
        <li>
          <Link href="/docs/components/page-header" className="text-primary underline">
            PageHeader
          </Link>{' '}
          — eyebrow + title + actions strip for the top of the main column.
        </li>
        <li>
          <Link href="/docs/components/app-top-bar" className="text-primary underline">
            AppTopBar
          </Link>{' '}
          — alternative chrome for non-sidebar layouts (also can render inside the main column).
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/medal" className="text-primary underline">
          ← Medal
        </Link>
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          AppTopBar →
        </Link>
      </div>
    </article>
  )
}
