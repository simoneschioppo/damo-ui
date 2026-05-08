import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs, BreadcrumbItem } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Breadcrumbs, BreadcrumbItem } from '@damo/ui'`

const BASIC_SNIPPET = `<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem href="/docs/components">Components</BreadcrumbItem>
  <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
</Breadcrumbs>`

const SEPARATOR_SNIPPET = `<Breadcrumbs separator={<span aria-hidden>/</span>}>
  …
</Breadcrumbs>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'separator',
    type: 'ReactNode',
    description:
      'Custom node rendered between items. Defaults to a Memphis ChevronRightIcon. Override for a slash, dot, or any glyph.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'A list of `BreadcrumbItem` children.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on the wrapping `<nav>`.',
  },
]

const ITEM_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'href',
    type: 'string',
    description: 'Link target. Omit on the last (current) item.',
  },
  {
    name: 'current',
    type: 'boolean',
    description:
      'Mark the item as the current page — renders a non-link `<span>` with `aria-current="page"`.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Item label.',
  },
]

export const metadata = { title: `Breadcrumbs — ${BRAND.libName}` }

export default async function BreadcrumbsDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Breadcrumbs</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Hierarchy trail rendered as a labelled <code className="font-mono">&lt;nav&gt;</code>{' '}
        landmark. The last item should be marked <code className="font-mono">current</code> so it
        renders as plain text with <code className="font-mono">aria-current=&quot;page&quot;</code>.
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
        <li>
          The wrapper renders{' '}
          <code className="font-mono">&lt;nav aria-label=&quot;Breadcrumb&quot;&gt;</code>{' '}
          containing an ordered list — the canonical pattern for breadcrumb landmarks.
        </li>
        <li>
          Separators are rendered as{' '}
          <code className="font-mono">role=&quot;presentation&quot;</code> +{' '}
          <code className="font-mono">aria-hidden</code>, so screen readers announce only the item
          labels.
        </li>
        <li>
          The current page should be the last item with <code className="font-mono">current</code>{' '}
          set — Radix renders it as a non-link <code className="font-mono">&lt;span&gt;</code> with{' '}
          <code className="font-mono">aria-current=&quot;page&quot;</code>.
        </li>
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
