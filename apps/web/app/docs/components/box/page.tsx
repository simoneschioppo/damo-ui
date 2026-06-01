import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Box } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Box } from '@axologic/ui'`

const ROW_SNIPPET = `<Box gap={3} align="center">
  <span>One</span>
  <span>Two</span>
  <span>Three</span>
</Box>`

const COLUMN_SNIPPET = `<Box direction="column" gap={2}>
  <span>Top</span>
  <span>Middle</span>
  <span>Bottom</span>
</Box>`

const POLYMORPHIC_SNIPPET = `<Box as="section" direction="column" gap={4}>
  <h2>Heading</h2>
  <p>Paragraph</p>
</Box>`

export const metadata = {
  title: `Box — ${BRAND.libName}`,
  description: 'Polymorphic flex primitive with controllable direction, gap, align and justify.',
}

export default async function BoxDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'as',
      type: 'ElementType',
      defaultValue: "'div'",
      description: t.rich('componentDocs.box.props.as', { code: codeTag }),
    },
    {
      name: 'direction',
      type: "'row' | 'row-reverse' | 'column' | 'column-reverse'",
      defaultValue: "'row'",
      description: t.rich('componentDocs.box.props.direction', { code: codeTag }),
    },
    {
      name: 'gap',
      type: '0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20',
      defaultValue: '0',
      description: t.rich('componentDocs.box.props.gap', { code: codeTag }),
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
      defaultValue: "'stretch'",
      description: t.rich('componentDocs.box.props.align', { code: codeTag }),
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      defaultValue: "'start'",
      description: t.rich('componentDocs.box.props.justify', { code: codeTag }),
    },
    {
      name: 'wrap',
      type: "'wrap' | 'nowrap' | 'wrap-reverse'",
      defaultValue: "'nowrap'",
      description: t.rich('componentDocs.box.props.wrap', { code: codeTag }),
    },
    {
      name: 'inline',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.box.props.inline', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.box.props.className'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Box</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.box.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Row layout</h2>
      <Example code={ROW_SNIPPET}>
        <Box gap={3} align="center">
          <span className="px-3 py-1 border-2 border-memphis bg-card">One</span>
          <span className="px-3 py-1 border-2 border-memphis bg-card">Two</span>
          <span className="px-3 py-1 border-2 border-memphis bg-card">Three</span>
        </Box>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Column layout</h2>
      <Example code={COLUMN_SNIPPET}>
        <Box direction="column" gap={2}>
          <span className="px-3 py-1 border-2 border-memphis bg-card w-fit">Top</span>
          <span className="px-3 py-1 border-2 border-memphis bg-card w-fit">Middle</span>
          <span className="px-3 py-1 border-2 border-memphis bg-card w-fit">Bottom</span>
        </Box>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Polymorphic — render as any element</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.box.body.polymorphicIntro', { code: codeTag })}
      </p>
      <Code code={POLYMORPHIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Box props" />

      <h2 className="font-display text-2xl mb-3 mt-10">When to use it</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.box.a11y.0', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.box.a11y.1', {
            link1: linkTag('/docs/components/container'),
          })}
        </li>
        <li>
          {t.rich('componentDocs.box.a11y.2', {
            link1: linkTag('/docs/components/app-shell'),
          })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/foundations/patterns" className="text-primary underline">
          ← Patterns
        </Link>
        <Link href="/docs/components/container" className="text-primary underline">
          Container →
        </Link>
      </div>
    </article>
  )
}
