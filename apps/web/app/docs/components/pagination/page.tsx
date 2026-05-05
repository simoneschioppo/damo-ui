import Link from 'next/link'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import {
  PaginationBasicExample,
  PaginationLargeExample,
  PaginationLocalisedExample,
} from './_examples'

const IMPORT_SNIPPET = `import { Pagination } from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'currentPage',
    type: 'number',
    required: true,
    description: 'Active page (1-indexed). Drives `aria-current` on the matching button.',
  },
  {
    name: 'totalPages',
    type: 'number',
    required: true,
    description: 'Total number of pages.',
  },
  {
    name: 'maxVisible',
    type: 'number',
    description:
      'Maximum number of page buttons rendered between the ellipses. Defaults to a sensible window via `computePageWindow` (also exported).',
  },
  {
    name: 'onPageChange',
    type: '(page: number) => void',
    required: true,
    description: 'Fires when the user clicks a page number or the prev/next chevrons.',
  },
  {
    name: 'labels',
    type: 'Partial<PaginationLabels>',
    description:
      'Override accessible labels — `{ previous, next, page, pageOf(page, total) }`. Defaults are Italian.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables every button (useful while a parent fetch is in flight).',
  },
]

export const metadata = { title: `Pagination — ${BRAND.libName}` }

export default function PaginationDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        NAVIGATION
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Pagination</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Numbered page navigator with prev / next chevrons, ellipsis collapsing on long ranges, and
        localizable labels. The page-window math is exposed as{' '}
        <code className="font-mono">computePageWindow</code> if you need to compose your own UI.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <Example code={BASIC_SNIPPET}>
        <PaginationBasicExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Long range — ellipsis collapsing</h2>
      <p className="text-foreground/80 mb-3">
        With many pages, Pagination shows the first / last / current window and inserts ellipsis
        between gaps.
      </p>
      <Example code="<Pagination currentPage={7} totalPages={42} … />">
        <PaginationLargeExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Localised labels</h2>
      <Example code={LOCALISED_SNIPPET}>
        <PaginationLocalisedExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Pagination props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Wrapper is{' '}
          <code className="font-mono">&lt;nav aria-label=&quot;Pagination&quot;&gt;</code>.
        </li>
        <li>
          The current page button gets{' '}
          <code className="font-mono">aria-current=&quot;page&quot;</code>; all other page buttons
          get an <code className="font-mono">aria-label</code> like{' '}
          <code className="font-mono">Pagina 3</code> (localised via{' '}
          <code className="font-mono">labels.page</code>).
        </li>
        <li>
          Ellipses render <code className="font-mono">aria-hidden</code> — they are not announced.
        </li>
        <li>
          Keyboard: page numbers and the prev/next chevrons are native{' '}
          <code className="font-mono">&lt;button&gt;</code> elements — <kbd>Tab</kbd> moves focus
          across them, <kbd>Enter</kbd> / <kbd>Space</kbd> activate them. Disabled buttons (prev at
          page 1, next at the last page) are skipped from the focus order automatically.
        </li>
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
