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
} from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from 'damo-ui'`

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

export const metadata = { title: `Table — ${BRAND.libName}` }

export default async function TableDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PARTS: ReadonlyArray<PropDef> = [
    {
      name: 'Table',
      type: 'wrapper',
      description: t.rich('componentDocs.table.props.Table', { code: codeTag }),
    },
    {
      name: 'TableCaption',
      type: 'caption',
      description: t.rich('componentDocs.table.props.TableCaption', { code: codeTag }),
    },
    {
      name: 'TableHeader',
      type: 'thead',
      description: t.rich('componentDocs.table.props.TableHeader', { code: codeTag }),
    },
    {
      name: 'TableBody',
      type: 'tbody',
      description: t.rich('componentDocs.table.props.TableBody', { code: codeTag }),
    },
    {
      name: 'TableFooter',
      type: 'tfoot',
      description: t.rich('componentDocs.table.props.TableFooter', { code: codeTag }),
    },
    {
      name: 'TableHead',
      type: 'th',
      description: t.rich('componentDocs.table.props.TableHead', { code: codeTag }),
    },
    {
      name: 'TableRow',
      type: 'tr',
      description: t.rich('componentDocs.table.props.TableRow', { code: codeTag }),
    },
    {
      name: 'TableCell',
      type: 'td',
      description: t.rich('componentDocs.table.props.TableCell', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Table</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.table.lead', { code: codeTag })}
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
        <li>{t.rich('componentDocs.table.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.table.a11y.1', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.table.a11y.2', {
            code: codeTag,
            link1: linkTag('/docs/components/pagination'),
          })}
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
