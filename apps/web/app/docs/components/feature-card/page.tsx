import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { FeatureCard, BoltIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { FeatureCard, BoltIcon } from '@damo/ui'`

const BASIC_SNIPPET = `<FeatureCard
  title="Memphis chrome"
  desc="2px borders, primary-colored shadows, gentle hover lift on every action."
  meta="LEVEL 02"
  icon={<BoltIcon size={18} />}
/>`

const PROPS: ReadonlyArray<PropDef> = [
  { name: 'title', type: 'string', required: true, description: 'Display-font title.' },
  { name: 'desc', type: 'string', required: true, description: 'Body description.' },
  { name: 'meta', type: 'string', description: 'Optional mono uppercase footer label.' },
  { name: 'icon', type: 'ReactNode', description: 'Optional icon rendered next to the meta.' },
]

export const metadata = { title: `FeatureCard — ${BRAND.libName}` }

export default async function FeatureCardDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('cardsAndDecoration')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">FeatureCard</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Compact 280px feature/highlight card with a primary-tinted Memphis shadow. Use to surface
        product features on landing pages or in feature grids.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <Example code={BASIC_SNIPPET}>
        <FeatureCard
          title="Memphis chrome"
          desc="2px borders, primary-colored shadows, gentle hover lift on every action."
          meta="LEVEL 02"
          icon={<BoltIcon size={18} />}
        />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="FeatureCard props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/user-card" className="text-primary underline">
          ← UserCard
        </Link>
        <Link href="/docs/components/article-card" className="text-primary underline">
          ArticleCard →
        </Link>
      </div>
    </article>
  )
}
