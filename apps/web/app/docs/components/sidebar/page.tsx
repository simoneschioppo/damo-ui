import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  NavItem,
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from '@axologic/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from '@/components/ui/sidebar'`

const BASIC_SNIPPET = `<Sidebar aria-label="Main navigation">
  <SidebarHeader>
    <SidebarBrand>Damo UI</SidebarBrand>
    <SidebarSubtitle>DOCS</SidebarSubtitle>
  </SidebarHeader>
  <SidebarBody>
    <nav>
      <a href="/docs/getting-started">Getting Started</a>
      <a href="/docs/components/button">Button</a>
    </nav>
  </SidebarBody>
  <SidebarFooter>v0.3.0</SidebarFooter>
</Sidebar>`

export const metadata = { title: `Sidebar — ${BRAND.libName}` }

export default async function SidebarDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.sidebar.props.children', { code: codeTag }),
    },
    {
      name: 'aria-label',
      type: 'string',
      description: t.rich('componentDocs.sidebar.props.ariaLabel', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.sidebar.props.className', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Sidebar</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.sidebar.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis">
        <div className="grid grid-cols-[260px_1fr] min-h-[280px]">
          <Sidebar aria-label="Sidebar preview">
            <SidebarHeader>
              <SidebarBrand>Damo UI</SidebarBrand>
              <SidebarSubtitle>DOCS</SidebarSubtitle>
            </SidebarHeader>
            <SidebarBody>
              {/* Use the library NavItem so the live preview always reflects
                  the current selection chrome (gradient + outline + bar +
                  rounded-selection) instead of drifting from a static replica. */}
              <NavItem as="span" className="px-3 py-1.5 text-[13px]">
                Getting Started
              </NavItem>
              <NavItem as="span" active className="px-3 py-1.5 text-[13px]">
                Button
              </NavItem>
              <NavItem as="span" className="px-3 py-1.5 text-[13px]">
                Card
              </NavItem>
            </SidebarBody>
            <SidebarFooter>v0.3.0</SidebarFooter>
          </Sidebar>
          <div className="px-6 py-4 text-muted-foreground text-sm">Page content area.</div>
        </div>
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('api')}</h2>
      <PropsTable props={PROPS} caption="Sidebar props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/page-header" className="text-primary underline">
          ← PageHeader
        </Link>
        <Link href="/docs/components/color-picker" className="text-primary underline">
          ColorPicker →
        </Link>
      </div>
    </article>
  )
}
