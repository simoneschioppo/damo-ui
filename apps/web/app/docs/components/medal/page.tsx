import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Medal } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Medal } from '@damo/ui'`

const RANKS_SNIPPET = `<Medal rank="bronze" value={3} label="Bronze" />
<Medal rank="silver" value={2} label="Silver" />
<Medal rank="gold" value={1} label="Gold" />
<Medal rank="master" value="M" label="Master" />
<Medal rank="grandmaster" value="GM" label="Grandmaster" />`

const SIZE_SNIPPET = `<Medal rank="gold" value={1} size={48} />
<Medal rank="gold" value={1} size={96} />
<Medal rank="gold" value={1} size={140} />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'rank',
    type: "'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'",
    required: true,
    description: 'Selects the inner / outer / text token (`--medal-{rank}-{outer|inner|text}`).',
  },
  {
    name: 'value',
    type: 'ReactNode',
    description: 'Optional centred number / letters (e.g. `1`, `"M"`, `"GM"`).',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Mono uppercase caption rendered below the medal.',
  },
  {
    name: 'size',
    type: 'number',
    defaultValue: '96',
    description: 'SVG width and height in pixels.',
  },
]

export const metadata = { title: `Medal — ${BRAND.libName}` }

export default async function MedalDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Medal</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.medal.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">All ranks</h2>
      <Example code={RANKS_SNIPPET}>
        <div className="flex flex-wrap items-end gap-6">
          <Medal rank="bronze" value={3} label="Bronze" />
          <Medal rank="silver" value={2} label="Silver" />
          <Medal rank="gold" value={1} label="Gold" />
          <Medal rank="master" value="M" label="Master" />
          <Medal rank="grandmaster" value="GM" label="Grandmaster" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('sizes')}</h2>
      <Example code={SIZE_SNIPPET}>
        <div className="flex items-end gap-6">
          <Medal rank="gold" value={1} size={48} />
          <Medal rank="gold" value={1} size={96} />
          <Medal rank="gold" value={1} size={140} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Medal props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <p className="text-foreground/85">
        The SVG renders <code className="font-mono">role=&quot;img&quot;</code> with{' '}
        <code className="font-mono">aria-label</code> derived from{' '}
        <code className="font-mono">label</code> (or a default like{' '}
        <code className="font-mono">&quot;gold medal&quot;</code> when no label is provided).
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/stat" className="text-primary underline">
          ← Stat
        </Link>
        <Link href="/docs/components/app-shell" className="text-primary underline">
          AppShell →
        </Link>
      </div>
    </article>
  )
}
