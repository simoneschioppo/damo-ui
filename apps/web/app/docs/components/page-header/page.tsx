import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { PageHeader, Button } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { PageHeader } from '@/components/ui/page-header'`

const BASIC_SNIPPET = `<PageHeader
  eyebrow="WORKSPACE"
  title="Damacchi UI"
  description="Memphis-inspired component library, ready to ship."
  actions={<Button variant="primary">Invite</Button>}
/>`

export const metadata = { title: `PageHeader — ${BRAND.libName}` }

export default async function PageHeaderDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'eyebrow',
      type: 'ReactNode',
      description: t.rich('componentDocs.page-header.props.eyebrow', { code: codeTag }),
    },
    {
      name: 'title',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.page-header.props.title', { code: codeTag }),
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: t.rich('componentDocs.page-header.props.description', { code: codeTag }),
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: t.rich('componentDocs.page-header.props.actions', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('layout')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">PageHeader</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.page-header.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full">
          <PageHeader
            eyebrow="WORKSPACE"
            title="Damacchi UI"
            description="Memphis-inspired component library, ready to ship."
            actions={<Button variant="primary">Invite</Button>}
          />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="PageHeader props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.page-header.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.page-header.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          ← AppTopBar
        </Link>
        <Link href="/docs/components/sidebar" className="text-primary underline">
          Sidebar →
        </Link>
      </div>
    </article>
  )
}
