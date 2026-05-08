import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Badge,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@damo/ui'`

const BASIC_SNIPPET = `<Table>
  <TableCaption>Recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Number</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell><Badge variant="success">Paid</Badge></TableCell>
      <TableCell>Card</TableCell>
      <TableCell className="text-right">€250</TableCell>
    </TableRow>
    …
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">€1,000</TableCell>
    </TableRow>
  </TableFooter>
</Table>`

const PARTS: ReadonlyArray<PropDef> = [
  { name: 'Table', type: 'wrapper', description: 'Outer scrolling container + Memphis border.' },
  {
    name: 'TableCaption',
    type: 'caption',
    description: 'Optional caption rendered below the table.',
  },
  { name: 'TableHeader', type: 'thead', description: 'Sticky-by-default header section.' },
  { name: 'TableBody', type: 'tbody', description: 'Main data rows.' },
  { name: 'TableFooter', type: 'tfoot', description: 'Bordered totals row.' },
  { name: 'TableHead', type: 'th', description: 'Column header cell — uppercase mono text.' },
  { name: 'TableRow', type: 'tr', description: 'Row with hover + selection states.' },
  { name: 'TableCell', type: 'td', description: 'Body cell — pad px-4 py-3 by default.' },
]

export const metadata = { title: `Table — ${BRAND.libName}` }

export default async function TableDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Table</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Memphis-bordered table primitives. Wrap rows in semantic{' '}
        <code className="font-mono">&lt;thead&gt;</code> /{' '}
        <code className="font-mono">&lt;tbody&gt;</code> /{' '}
        <code className="font-mono">&lt;tfoot&gt;</code> sections via the matching components — the
        outer container handles overflow + borders.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full">
          <Table>
            <TableCaption>Recent invoices</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV001</TableCell>
                <TableCell>
                  <Badge variant="success">Paid</Badge>
                </TableCell>
                <TableCell>Card</TableCell>
                <TableCell className="text-right">€250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV002</TableCell>
                <TableCell>
                  <Badge variant="warning">Pending</Badge>
                </TableCell>
                <TableCell>Bank transfer</TableCell>
                <TableCell className="text-right">€350</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV003</TableCell>
                <TableCell>
                  <Badge variant="destructive">Failed</Badge>
                </TableCell>
                <TableCell>Card</TableCell>
                <TableCell className="text-right">€400</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">€1,000</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('parts')}</h2>
      <PropsTable props={PARTS} caption="Table sub-components" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Always include <code className="font-mono">TableCaption</code> when the table conveys data
          — screen readers announce the caption as the table&rsquo;s name.
        </li>
        <li>
          Each <code className="font-mono">TableHead</code> renders a real{' '}
          <code className="font-mono">&lt;th&gt;</code>; for row-headers add{' '}
          <code className="font-mono">scope=&quot;row&quot;</code>.
        </li>
        <li>
          For very large tables consider pairing with{' '}
          <Link href="/docs/components/pagination" className="text-primary underline">
            Pagination
          </Link>{' '}
          and a virtualised body.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/accordion" className="text-primary underline">
          ← Accordion
        </Link>
        <Link href="/docs/components/stat" className="text-primary underline">
          Stat →
        </Link>
      </div>
    </article>
  )
}
