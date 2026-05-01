import Link from 'next/link'
import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from '@damo/ui'`

const BASIC_SNIPPET = `<Sidebar aria-label="Main navigation">
  <SidebarHeader>
    <SidebarBrand>Axolab</SidebarBrand>
    <SidebarSubtitle>Damo UI · Docs</SidebarSubtitle>
  </SidebarHeader>
  <SidebarBody>
    <nav>
      <a href="/docs/getting-started">Getting Started</a>
      <a href="/docs/components/button">Button</a>
    </nav>
  </SidebarBody>
  <SidebarFooter>v0.3.0</SidebarFooter>
</Sidebar>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Compose with SidebarHeader, SidebarBody, SidebarFooter.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Required when the sidebar is the only nav landmark on the page.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the defaults.',
  },
]

export const metadata = { title: `Sidebar — ${BRAND.name}` }

export default function SidebarDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Sidebar</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Composable side panel with header, body, and footer slots. Used here on the docs site for
        the navigation rail you see to the left.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Live preview</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis">
        <div className="grid grid-cols-[260px_1fr] min-h-[280px]">
          <Sidebar aria-label="Sidebar preview">
            <SidebarHeader>
              <SidebarBrand>Axolab</SidebarBrand>
              <SidebarSubtitle>Damo UI · Docs</SidebarSubtitle>
            </SidebarHeader>
            <SidebarBody>
              <div className="px-3 py-2 text-[13px] text-foreground/80">Getting Started</div>
              <div className="px-3 py-2 text-[13px] text-foreground/80 border-l-2 border-primary bg-muted/40 font-semibold">
                Button
              </div>
              <div className="px-3 py-2 text-[13px] text-foreground/80">Card</div>
            </SidebarBody>
            <SidebarFooter>v0.3.0</SidebarFooter>
          </Sidebar>
          <div className="px-6 py-4 text-muted-foreground text-sm">Page content area.</div>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">API</h2>
      <PropsTable props={PROPS} caption="Sidebar props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          ← AppTopBar
        </Link>
        <Link href="/docs/components/theme-switcher" className="text-primary underline">
          Theme Switchers →
        </Link>
      </div>
    </article>
  )
}
