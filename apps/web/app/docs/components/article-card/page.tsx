import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArticleCard } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { ArticleCard } from '@damo/ui'`

const BASIC_SNIPPET = `<ArticleCard label="REGOLA" title="Use semantic tokens, not raw scales">
  <p>Always reach for <code>bg-card</code> rather than <code>bg-paper-100</code> in product code.</p>
  <p>Raw scales are private and can change between releases.</p>
</ArticleCard>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'label',
    type: 'string',
    description: 'Optional mono uppercase eyebrow.',
  },
  {
    name: 'title',
    type: 'string',
    required: true,
    description: 'Display-font headline.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Body content. Multi-paragraph allowed.',
  },
]

export const metadata = { title: `ArticleCard — ${BRAND.libName}` }

export default async function ArticleCardDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('cardsAndDecoration')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">ArticleCard</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Neutral content card capped at 420px wide. Memphis frame, optional eyebrow label,
        display-font title, and a relaxed-leading body.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <Example code={BASIC_SNIPPET}>
        <ArticleCard label="REGOLA" title="Use semantic tokens, not raw scales">
          <p>
            Always reach for <code className="font-mono">bg-card</code> rather than{' '}
            <code className="font-mono">bg-paper-100</code> in product code.
          </p>
          <p>Raw scales are private and can change between releases.</p>
        </ArticleCard>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="ArticleCard props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/feature-card" className="text-primary underline">
          ← FeatureCard
        </Link>
        <Link href="/docs/components/memphis-shape" className="text-primary underline">
          MemphisShape →
        </Link>
      </div>
    </article>
  )
}
