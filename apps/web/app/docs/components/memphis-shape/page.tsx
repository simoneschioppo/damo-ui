import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { MemphisShape } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { MemphisShape } from 'damo-ui'`

const ALL_VARIANTS_SNIPPET = `<MemphisShape variant="diamond" />
<MemphisShape variant="circle" />
<MemphisShape variant="triangle" />
<MemphisShape variant="zigzag" />
<MemphisShape variant="blob" />
<MemphisShape variant="wave" />
<MemphisShape variant="star" />
<MemphisShape variant="lbar" />`

const COLOR_SNIPPET = `<MemphisShape variant="diamond" color="var(--primary)" />
<MemphisShape variant="star" color="var(--success)" size={48} />`

const VARIANTS = [
  'diamond',
  'circle',
  'triangle',
  'zigzag',
  'blob',
  'wave',
  'star',
  'lbar',
] as const

export const metadata = { title: `MemphisShape — ${BRAND.libName}` }

export default async function MemphisShapeDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'diamond' | 'circle' | 'triangle' | 'zigzag' | 'blob' | 'wave' | 'star' | 'lbar'",
      required: true,
      description: t.rich('componentDocs.memphis-shape.props.variant', { code: codeTag }),
    },
    {
      name: 'size',
      type: 'number',
      defaultValue: '64',
      description: t.rich('componentDocs.memphis-shape.props.size', { code: codeTag }),
    },
    {
      name: 'color',
      type: 'string',
      defaultValue: "'var(--secondary)'",
      description: t.rich('componentDocs.memphis-shape.props.color', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('cardsAndDecoration')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">MemphisShape</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.memphis-shape.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">All variants</h2>
      <Example code={ALL_VARIANTS_SNIPPET}>
        <div className="flex flex-wrap items-center gap-4">
          {VARIANTS.map((v) => (
            <div key={v} className="flex flex-col items-center gap-2">
              <MemphisShape variant={v} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {v}
              </span>
            </div>
          ))}
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Color + size override</h2>
      <Example code={COLOR_SNIPPET}>
        <div className="flex items-center gap-6">
          <MemphisShape variant="diamond" color="var(--primary)" />
          <MemphisShape variant="star" color="var(--success)" size={48} />
          <MemphisShape variant="zigzag" color="var(--destructive)" size={80} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="MemphisShape props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <p className="text-foreground/85">
        {t.rich('componentDocs.memphis-shape.body.accessibility', { code: codeTag })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/article-card" className="text-primary underline">
          ← ArticleCard
        </Link>
        <Link href="/docs/getting-started" className="text-primary underline">
          Back to docs home →
        </Link>
      </div>
    </article>
  )
}
