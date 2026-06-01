import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Skeleton } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Skeleton } from '@/components/ui/skeleton'`

const BASIC_SNIPPET = `<Skeleton className="h-4 w-48" />
<Skeleton className="h-4 w-64" />
<Skeleton className="h-4 w-32" />`

const COMPOSITE_SNIPPET = `<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10 rounded-full" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-3 w-3/4" />
  </div>
</div>`

export const metadata = { title: `Skeleton — ${BRAND.libName}` }

export default async function SkeletonDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.skeleton.props.className', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Skeleton</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.skeleton.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic shapes</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Composite — avatar + lines</h2>
      <Example code={COMPOSITE_SNIPPET}>
        <div className="flex items-center gap-3 w-full max-w-md">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Skeleton props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.skeleton.a11y.0', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.skeleton.a11y.1', {
            code: codeTag,
            link1: linkTag('/docs/components/spinner'),
          })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/spinner" className="text-primary underline">
          ← Spinner
        </Link>
        <Link href="/docs/components/badge" className="text-primary underline">
          Badge →
        </Link>
      </div>
    </article>
  )
}
