import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs, BreadcrumbItem } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Breadcrumbs, BreadcrumbItem } from 'damo-ui'`

const BASIC_SNIPPET = `<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem href="/docs/components">Components</BreadcrumbItem>
  <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
</Breadcrumbs>`

const SEPARATOR_SNIPPET = `<Breadcrumbs separator={<span aria-hidden>/</span>}>
  …
</Breadcrumbs>`

export const metadata = { title: `Breadcrumbs — ${BRAND.libName}` }

export default async function BreadcrumbsDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'separator',
      type: 'ReactNode',
      description: t('componentDocs.breadcrumbs.props.separator'),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.breadcrumbs.props.children', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.breadcrumbs.props.className', { code: codeTag }),
    },
  ]
  const ITEM_PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'href',
      type: 'string',
      description: t('componentDocs.breadcrumbs.props.href'),
    },
    {
      name: 'current',
      type: 'boolean',
      description: t.rich('componentDocs.breadcrumbs.props.current', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t('componentDocs.breadcrumbs.props.itemChildren'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Breadcrumbs</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.breadcrumbs.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <Breadcrumbs>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
          <BreadcrumbItem href="/docs/components">Components</BreadcrumbItem>
          <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Custom separator</h2>
      <Example code={SEPARATOR_SNIPPET}>
        <Breadcrumbs separator={<span aria-hidden>/</span>}>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/blog">Blog</BreadcrumbItem>
          <BreadcrumbItem current>Welcome to Damo</BreadcrumbItem>
        </Breadcrumbs>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Breadcrumbs props" />

      <h2 className="font-display text-2xl mb-3 mt-10">BreadcrumbItem props</h2>
      <PropsTable props={ITEM_PROPS} caption="BreadcrumbItem props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.breadcrumbs.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.breadcrumbs.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.breadcrumbs.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/nav-item" className="text-primary underline">
          ← NavItem
        </Link>
        <Link href="/docs/components/pagination" className="text-primary underline">
          Pagination →
        </Link>
      </div>
    </article>
  )
}
