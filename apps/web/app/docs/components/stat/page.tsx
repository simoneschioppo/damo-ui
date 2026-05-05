import Link from 'next/link'
import { Stat, BoltIcon, HeartIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Stat } from '@damo/ui'`

const BASIC_SNIPPET = `<Stat label="MRR" value="€42,800" delta="+12% vs last month" deltaTone="positive" />`

const GROUP_SNIPPET = `<Stat label="Active users" value="1,284" delta="-3%" deltaTone="negative" />
<Stat label="Conversion" value="6.4%" delta="±0%" deltaTone="neutral" />
<Stat label="Tickets open" value="12" icon={<BoltIcon size={14} />} />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'label',
    type: 'ReactNode',
    required: true,
    description: 'Mono uppercase label rendered above the value.',
  },
  {
    name: 'value',
    type: 'ReactNode',
    required: true,
    description: 'Headline number rendered in the display font.',
  },
  {
    name: 'delta',
    type: 'ReactNode',
    description: 'Optional sub-line showing the change vs a baseline.',
  },
  {
    name: 'deltaTone',
    type: "'positive' | 'negative' | 'neutral'",
    defaultValue: "'neutral'",
    description: 'Color of the delta line — success / destructive / muted.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Optional icon rendered beside the label.',
  },
]

export const metadata = { title: `Stat — ${BRAND.libName}` }

export default function StatDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        DATA DISPLAY
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Stat</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        KPI block: mono uppercase label, big display-font value, optional delta line. Use to surface
        key metrics in dashboards and overview pages.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Single Stat</h2>
      <Example code={BASIC_SNIPPET}>
        <Stat label="MRR" value="€42,800" delta="+12% vs last month" deltaTone="positive" />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Stat group</h2>
      <Example code={GROUP_SNIPPET}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          <Stat label="Active users" value="1,284" delta="-3%" deltaTone="negative" />
          <Stat
            label="Conversion"
            value="6.4%"
            delta="±0%"
            deltaTone="neutral"
            icon={<HeartIcon size={14} />}
          />
          <Stat
            label="Tickets open"
            value="12"
            icon={<BoltIcon size={14} />}
            delta="2 since yesterday"
          />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Stat props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/table" className="text-primary underline">
          ← Table
        </Link>
        <Link href="/docs/components/medal" className="text-primary underline">
          Medal →
        </Link>
      </div>
    </article>
  )
}
