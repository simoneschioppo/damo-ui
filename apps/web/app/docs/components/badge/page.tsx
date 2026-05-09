import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Badge } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Badge } from 'damo-ui'`

const VARIANTS_SNIPPET = `<Badge>Default</Badge>
<Badge variant="featured">Featured</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`

export const metadata = { title: `Badge — ${BRAND.libName}` }

export default async function BadgeDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'default' | 'featured' | 'success' | 'warning' | 'info' | 'destructive' | 'outline'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.badge.props.variant', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t('componentDocs.badge.props.children'),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.badge.props.className'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Badge</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.badge.lead', { link1: linkTag('/docs/components/chip') })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">All variants</h2>
      <Example code={VARIANTS_SNIPPET}>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="featured">Featured</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Badge props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.badge.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.badge.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/skeleton" className="text-primary underline">
          ← Skeleton
        </Link>
        <Link href="/docs/components/chip" className="text-primary underline">
          Chip →
        </Link>
      </div>
    </article>
  )
}
