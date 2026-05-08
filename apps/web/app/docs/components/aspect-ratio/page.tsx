import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { AspectRatio } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AspectRatio } from '@damo/ui'`

const BASIC_SNIPPET = `<AspectRatio ratio={16 / 9}>
  <img src="/cover.jpg" alt="" className="h-full w-full object-cover" />
</AspectRatio>`

const SQUARE_SNIPPET = `<AspectRatio ratio={1}>
  <Avatar size="full" />
</AspectRatio>`

export const metadata = { title: `AspectRatio — ${BRAND.libName}` }

export default async function AspectRatioDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'ratio',
      type: 'number',
      defaultValue: '1',
      description: t.rich('componentDocs.aspect-ratio.props.ratio', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t('componentDocs.aspect-ratio.props.children'),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.aspect-ratio.props.className'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AspectRatio</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.aspect-ratio.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">16:9 image</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-[420px]">
          <AspectRatio ratio={16 / 9}>
            <div className="h-full w-full border-2 border-memphis bg-card flex items-center justify-center text-muted-foreground font-mono text-sm">
              16 : 9
            </div>
          </AspectRatio>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Square (1:1)</h2>
      <Example code={SQUARE_SNIPPET}>
        <div className="w-[200px]">
          <AspectRatio ratio={1}>
            <div className="h-full w-full border-2 border-memphis bg-card flex items-center justify-center text-muted-foreground font-mono text-sm">
              1 : 1
            </div>
          </AspectRatio>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="AspectRatio props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Common ratios</h2>
      <ul className="list-disc pl-6 space-y-1 text-foreground/85">
        <li>{t.rich('componentDocs.aspect-ratio.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.aspect-ratio.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.aspect-ratio.a11y.2', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.aspect-ratio.a11y.3', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.aspect-ratio.a11y.4', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/container" className="text-primary underline">
          ← Container
        </Link>
        <Link href="/docs/components/scroll-area" className="text-primary underline">
          ScrollArea →
        </Link>
      </div>
    </article>
  )
}
