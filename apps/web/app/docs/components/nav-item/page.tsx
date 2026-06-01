import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { NavItem, CogIcon, BoltIcon, HeartIcon } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { NavItem } from '@axologic/ui'`

const BASIC_SNIPPET = `<NavItem href="/dashboard">Dashboard</NavItem>
<NavItem href="/inbox" active>
  Inbox
</NavItem>
<NavItem href="/settings">Settings</NavItem>`

const ICON_SNIPPET = `<NavItem icon={<CogIcon size={16} />} href="/settings">
  Settings
</NavItem>`

const POLY_SNIPPET = `import Link from 'next/link'

<NavItem as={Link} href="/inbox" active>
  Inbox
</NavItem>`

export const metadata = { title: `NavItem — ${BRAND.libName}` }

export default async function NavItemDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'as',
      type: 'ElementType',
      defaultValue: "'a'",
      description: t.rich('componentDocs.nav-item.props.as', { code: codeTag }),
    },
    {
      name: 'active',
      type: 'boolean',
      description: t.rich('componentDocs.nav-item.props.active', { code: codeTag }),
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: t.rich('componentDocs.nav-item.props.icon', { code: codeTag }),
    },
    {
      name: 'endAdornment',
      type: 'ReactNode',
      description: t.rich('componentDocs.nav-item.props.endAdornment', { code: codeTag }),
    },
    {
      name: 'tone',
      type: "'default' | 'onDark'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.nav-item.props.tone', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.nav-item.props.children', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">NavItem</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.nav-item.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic list</h2>
      <Example code={BASIC_SNIPPET}>
        <nav className="w-full max-w-xs flex flex-col gap-px">
          <NavItem as="span" className="px-3 py-1.5 text-[13px]">
            Dashboard
          </NavItem>
          <NavItem as="span" active className="px-3 py-1.5 text-[13px]">
            Inbox
          </NavItem>
          <NavItem as="span" className="px-3 py-1.5 text-[13px]">
            Settings
          </NavItem>
        </nav>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With icons + adornment</h2>
      <Example code={ICON_SNIPPET}>
        <nav className="w-full max-w-xs flex flex-col gap-px">
          <NavItem as="span" icon={<CogIcon size={16} />} className="px-3 py-1.5 text-[13px]">
            Settings
          </NavItem>
          <NavItem
            as="span"
            icon={<BoltIcon size={16} />}
            endAdornment={
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.1em] border border-memphis text-muted-foreground">
                NEW
              </span>
            }
            className="px-3 py-1.5 text-[13px]"
          >
            Quick action
          </NavItem>
          <NavItem
            as="span"
            icon={<HeartIcon size={16} />}
            active
            className="px-3 py-1.5 text-[13px]"
          >
            Favourites
          </NavItem>
        </nav>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Polymorphic — render as Link</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.nav-item.body.polymorphic', { code: codeTag })}
      </p>
      <Code code={POLY_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="NavItem props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.nav-item.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.nav-item.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/context-menu" className="text-primary underline">
          ← ContextMenu
        </Link>
        <Link href="/docs/components/breadcrumbs" className="text-primary underline">
          Breadcrumbs →
        </Link>
      </div>
    </article>
  )
}
