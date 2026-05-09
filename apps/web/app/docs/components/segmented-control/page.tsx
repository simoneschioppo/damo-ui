import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SegmentedControl, SegmentedControlItem } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { SegmentedControl, SegmentedControlItem } from 'damo-ui'`

const BASIC_SNIPPET = `<SegmentedControl defaultValue="day" aria-label="Range">
  <SegmentedControlItem value="day">Day</SegmentedControlItem>
  <SegmentedControlItem value="week">Week</SegmentedControlItem>
  <SegmentedControlItem value="month">Month</SegmentedControlItem>
</SegmentedControl>`

const VERTICAL_SNIPPET = `<SegmentedControl orientation="vertical" defaultValue="all">
  <SegmentedControlItem value="all">All</SegmentedControlItem>
  <SegmentedControlItem value="open">Open</SegmentedControlItem>
  <SegmentedControlItem value="closed">Closed</SegmentedControlItem>
</SegmentedControl>`

export const metadata = { title: `SegmentedControl — ${BRAND.libName}` }

export default async function SegmentedControlDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.segmented-control.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.segmented-control.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: t.rich('componentDocs.segmented-control.props.onValueChange', {
        code: codeTag,
      }),
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: t.rich('componentDocs.segmented-control.props.orientation', { code: codeTag }),
    },
    {
      name: 'aria-label',
      type: 'string',
      description: t.rich('componentDocs.segmented-control.props.ariaLabel', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.segmented-control.props.disabled', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">SegmentedControl</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.segmented-control.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Horizontal (default)</h2>
      <Example code={BASIC_SNIPPET}>
        <SegmentedControl defaultValue="day" aria-label="Range">
          <SegmentedControlItem value="day">Day</SegmentedControlItem>
          <SegmentedControlItem value="week">Week</SegmentedControlItem>
          <SegmentedControlItem value="month">Month</SegmentedControlItem>
        </SegmentedControl>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical</h2>
      <Example code={VERTICAL_SNIPPET}>
        <SegmentedControl orientation="vertical" defaultValue="all" aria-label="Status">
          <SegmentedControlItem value="all">All</SegmentedControlItem>
          <SegmentedControlItem value="open">Open</SegmentedControlItem>
          <SegmentedControlItem value="closed">Closed</SegmentedControlItem>
        </SegmentedControl>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="SegmentedControl props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.segmented-control.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.segmented-control.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.segmented-control.a11y.2', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">SegmentedControl vs RadioGroup</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          {t.rich('componentDocs.segmented-control.vsRadio.0', {
            code: codeTag,
            strong: strongTag,
          })}
        </li>
        <li>
          {t.rich('componentDocs.segmented-control.vsRadio.1', {
            code: codeTag,
            link1: linkTag('/docs/components/radio-group'),
          })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/slider" className="text-primary underline">
          ← Slider
        </Link>
        <Link href="/docs/components/select" className="text-primary underline">
          Select →
        </Link>
      </div>
    </article>
  )
}
