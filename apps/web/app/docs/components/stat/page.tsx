import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Stat, BoltIcon, HeartIcon } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Stat } from '@axologic/ui'`

const BASIC_SNIPPET = `<Stat label="MRR" value="€42,800" delta="+12% vs last month" deltaTone="positive" />`

const GROUP_SNIPPET = `<Stat label="Active users" value="1,284" delta="-3%" deltaTone="negative" />
<Stat label="Conversion" value="6.4%" delta="±0%" deltaTone="neutral" />
<Stat label="Tickets open" value="12" icon={<BoltIcon size={14} />} />`

export const metadata = { title: `Stat — ${BRAND.libName}` }

export default async function StatDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.stat.props.label', { code: codeTag }),
    },
    {
      name: 'value',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.stat.props.value', { code: codeTag }),
    },
    {
      name: 'delta',
      type: 'ReactNode',
      description: t.rich('componentDocs.stat.props.delta', { code: codeTag }),
    },
    {
      name: 'deltaTone',
      type: "'positive' | 'negative' | 'neutral'",
      defaultValue: "'neutral'",
      description: t.rich('componentDocs.stat.props.deltaTone', { code: codeTag }),
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: t.rich('componentDocs.stat.props.icon', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Stat</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.stat.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
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

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Stat props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.stat.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.stat.a11y.1', { code: codeTag })}</li>
      </ul>

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
