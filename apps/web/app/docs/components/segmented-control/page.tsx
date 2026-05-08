import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { SegmentedControl, SegmentedControlItem } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { SegmentedControl, SegmentedControlItem } from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'value',
    type: 'string',
    description: 'Controlled selected value. Pair with `onValueChange`.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Uncontrolled initial selected value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires whenever the selection changes.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: 'Layout axis.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Required when there is no surrounding visible label.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables every item in the group.',
  },
]

export const metadata = { title: `SegmentedControl — ${BRAND.libName}` }

export default async function SegmentedControlDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">SegmentedControl</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Single-select toggle group with a Memphis border seam between items. Built on Radix
        ToggleGroup with <code className="font-mono">type=&quot;single&quot;</code>. Use it for 2-5
        mutually exclusive options where keeping the choices visible adds clarity.
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
        <li>
          The root renders <code className="font-mono">role=&quot;group&quot;</code> with each item
          as <code className="font-mono">role=&quot;radio&quot;</code> +{' '}
          <code className="font-mono">aria-checked</code> (Radix ToggleGroup{' '}
          <code className="font-mono">type=&quot;single&quot;</code> uses the radio pattern under
          the hood).
        </li>
        <li>
          <code className="font-mono">aria-label</code> (or{' '}
          <code className="font-mono">aria-labelledby</code>) on the root is required: without it
          the group has no accessible name, and screen readers will announce the items without
          context.
        </li>
        <li>
          Keyboard: <kbd>Tab</kbd> moves focus into the currently selected item (roving tabindex);
          arrow keys cycle items and move the selection; <kbd>Tab</kbd> again moves focus out of the
          entire group.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">SegmentedControl vs RadioGroup</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Reach for <strong>SegmentedControl</strong> when 2-5 options fit on one line and the
          control acts more like a tab strip than a form input.
        </li>
        <li>
          Reach for{' '}
          <Link href="/docs/components/radio-group" className="text-primary underline">
            RadioGroup
          </Link>{' '}
          when you have many options or want each option on its own line with descriptions.
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
