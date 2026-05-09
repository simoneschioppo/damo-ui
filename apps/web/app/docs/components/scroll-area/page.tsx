import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ScrollArea } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { ScrollArea } from 'damo-ui'`

const BASIC_SNIPPET = `<ScrollArea className="h-72 w-full border-2 border-memphis">
  <ul className="p-4 space-y-2">
    {Array.from({ length: 50 }, (_, i) => (
      <li key={i}>Row {i + 1}</li>
    ))}
  </ul>
</ScrollArea>`

const HORIZONTAL_SNIPPET = `<ScrollArea className="w-full border-2 border-memphis">
  <div className="flex gap-3 p-4">
    {tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
  </div>
</ScrollArea>`

export const metadata = { title: `ScrollArea — ${BRAND.libName}` }

export default async function ScrollAreaDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.scroll-area.props.children', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.scroll-area.props.className', { code: codeTag }),
    },
    {
      name: 'type',
      type: "'auto' | 'always' | 'scroll' | 'hover'",
      defaultValue: "'hover'",
      description: t.rich('componentDocs.scroll-area.props.type', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">ScrollArea</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.scroll-area.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical scroll</h2>
      <Example code={BASIC_SNIPPET}>
        <ScrollArea className="h-60 w-full border-2 border-memphis bg-card">
          <ul className="p-4 space-y-2">
            {Array.from({ length: 30 }, (_, i) => (
              <li key={i} className="font-mono text-[13px]">
                Row {i + 1}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Horizontal scroll</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.scroll-area.body.horizontal', { code: codeTag })}
      </p>
      <Code code={HORIZONTAL_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="ScrollArea props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('whenToUse')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.scroll-area.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.scroll-area.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.scroll-area.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/aspect-ratio" className="text-primary underline">
          ← AspectRatio
        </Link>
        <Link href="/docs/components/separator" className="text-primary underline">
          Separator →
        </Link>
      </div>
    </article>
  )
}
