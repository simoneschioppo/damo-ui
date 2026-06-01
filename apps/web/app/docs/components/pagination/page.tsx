import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'
import {
  PaginationBasicExample,
  PaginationLargeExample,
  PaginationLocalisedExample,
} from './_examples'

const IMPORT_SNIPPET = `import { Pagination } from '@/components/ui/pagination'`

const BASIC_SNIPPET = `function Example() {
  const [page, setPage] = useState(1)
  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
    />
  )
}`

const LOCALISED_SNIPPET = `<Pagination
  currentPage={page}
  totalPages={5}
  onPageChange={setPage}
  labels={{
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    pageOf: (p, t) => \`Page \${p} of \${t}\`,
  }}
/>`

export const metadata = { title: `Pagination — ${BRAND.libName}` }

export default async function PaginationDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'currentPage',
      type: 'number',
      required: true,
      description: t.rich('componentDocs.pagination.props.currentPage', { code: codeTag }),
    },
    {
      name: 'totalPages',
      type: 'number',
      required: true,
      description: t.rich('componentDocs.pagination.props.totalPages', { code: codeTag }),
    },
    {
      name: 'maxVisible',
      type: 'number',
      description: t.rich('componentDocs.pagination.props.maxVisible', { code: codeTag }),
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      required: true,
      description: t.rich('componentDocs.pagination.props.onPageChange', { code: codeTag }),
    },
    {
      name: 'labels',
      type: 'Partial<PaginationLabels>',
      description: t.rich('componentDocs.pagination.props.labels', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.pagination.props.disabled', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Pagination</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.pagination.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <PaginationBasicExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Long range — ellipsis collapsing</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.pagination.body.longRange', { code: codeTag })}
      </p>
      <Example code="<Pagination currentPage={7} totalPages={42} … />">
        <PaginationLargeExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Localised labels</h2>
      <Example code={LOCALISED_SNIPPET}>
        <PaginationLocalisedExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Pagination props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.pagination.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.pagination.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.pagination.a11y.2', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.pagination.a11y.3', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/breadcrumbs" className="text-primary underline">
          ← Breadcrumbs
        </Link>
        <Link href="/docs/components/attr-toggle-group" className="text-primary underline">
          AttrToggleGroup →
        </Link>
      </div>
    </article>
  )
}
