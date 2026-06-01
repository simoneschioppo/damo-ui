import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Progress } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Progress } from '@/components/ui/progress'`

const BASIC_SNIPPET = `<Progress value={66} />`
const INDETERMINATE_SNIPPET = `<Progress value={null} aria-label="Loading" />`
const CUSTOM_INDICATOR_SNIPPET = `<Progress value={50} indicatorClassName="bg-success" />`

export const metadata = { title: `Progress — ${BRAND.libName}` }

export default async function ProgressDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'number | null',
      description: t.rich('componentDocs.progress.props.value', { code: codeTag }),
    },
    {
      name: 'max',
      type: 'number',
      defaultValue: '100',
      description: t.rich('componentDocs.progress.props.max', { code: codeTag }),
    },
    {
      name: 'indicatorClassName',
      type: 'string',
      description: t.rich('componentDocs.progress.props.indicatorClassName', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.progress.props.className', { code: codeTag }),
    },
    {
      name: 'aria-label',
      type: 'string',
      description: t.rich('componentDocs.progress.props.ariaLabel', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Progress</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.progress.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Determinate</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md flex flex-col gap-3">
          <Progress value={20} aria-label="20%" />
          <Progress value={66} aria-label="66%" />
          <Progress value={92} aria-label="92%" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Custom indicator color</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.progress.body.customIndicator', { code: codeTag })}
      </p>
      <Example code={CUSTOM_INDICATOR_SNIPPET}>
        <div className="w-full max-w-md flex flex-col gap-3">
          <Progress value={50} indicatorClassName="bg-success" aria-label="50% success" />
          <Progress value={50} indicatorClassName="bg-warning" aria-label="50% warning" />
          <Progress value={50} indicatorClassName="bg-destructive" aria-label="50% danger" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Indeterminate</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.progress.body.indeterminate', {
          code: codeTag,
          link1: linkTag('/docs/components/spinner'),
        })}
      </p>
      <Code code={INDETERMINATE_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Progress props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.progress.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.progress.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/toast" className="text-primary underline">
          ← Toast
        </Link>
        <Link href="/docs/components/spinner" className="text-primary underline">
          Spinner →
        </Link>
      </div>
    </article>
  )
}
