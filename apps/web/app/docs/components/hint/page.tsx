import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Hint } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Hint } from 'damo-ui'`

const BASIC_SNIPPET = `<Hint num={1} title="Numbered insight">
  Pair the numbered tile with a short paragraph. The tile is a
  Memphis-bordered slab — keep titles short.
</Hint>
<Hint num={2} title="Pair with surrounding copy">
  Use Hints inside long-form docs or how-to flows.
</Hint>`

export const metadata = { title: `Hint — ${BRAND.libName}` }

export default async function HintDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'num',
      type: 'number',
      required: true,
      description: t.rich('componentDocs.hint.props.num', { code: codeTag }),
    },
    {
      name: 'title',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.hint.props.title', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.hint.props.children', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.hint.props.className', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Hint</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.hint.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <Hint num={1} title="Numbered insight">
            Pair the numbered tile with a short paragraph. The tile is a Memphis-bordered slab —
            keep titles short.
          </Hint>
          <Hint num={2} title="Pair with surrounding copy">
            Use Hints inside long-form docs or how-to flows.
          </Hint>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Hint props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <p className="text-foreground/85">
        {t.rich('componentDocs.hint.body.accessibility', { code: codeTag })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/chip" className="text-primary underline">
          ← Chip
        </Link>
        <Link href="/docs/components/tabs" className="text-primary underline">
          Tabs →
        </Link>
      </div>
    </article>
  )
}
