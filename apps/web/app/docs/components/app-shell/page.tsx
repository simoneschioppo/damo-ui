import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AppShell } from '@/components/ui/app-shell'`

const BASIC_SNIPPET = `<AppShell sidebar={<Nav />} sidebarWidth={260}>
  <PageHeader title="Dashboard" />
  <main>{children}</main>
</AppShell>`

const ON_DARK_SNIPPET = `<AppShell sidebar={<Nav />} sidebarTone="onDark">
  …
</AppShell>`

export const metadata = { title: `AppShell — ${BRAND.libName}` }

export default async function AppShellDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'sidebar',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.app-shell.props.sidebar', { code: codeTag }),
    },
    {
      name: 'sidebarWidth',
      type: 'number',
      defaultValue: '240',
      description: t.rich('componentDocs.app-shell.props.sidebarWidth', { code: codeTag }),
    },
    {
      name: 'sidebarTone',
      type: "'default' | 'onDark'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.app-shell.props.sidebarTone', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: t.rich('componentDocs.app-shell.props.children', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('layout')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AppShell</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.app-shell.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic shape</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.app-shell.body.basicShape', {
          link1: linkTag('/docs/components/page-header'),
        })}
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis overflow-hidden">
        <div className="grid grid-cols-[180px_1fr] min-h-[260px]">
          <aside className="bg-card border-r-2 border-memphis p-4 flex flex-col gap-2">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Sidebar
            </div>
            <div className="px-2 py-1 text-[13px] bg-muted">Dashboard</div>
            <div className="px-2 py-1 text-[13px]">Inbox</div>
            <div className="px-2 py-1 text-[13px]">Settings</div>
          </aside>
          <main className="p-6">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Main
            </div>
            <p className="text-sm text-muted-foreground">
              {t('componentDocs.app-shell.body.sidebarPlaceholder')}
            </p>
          </main>
        </div>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">On-dark sidebar</h2>
      <Code code={ON_DARK_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="AppShell props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Pairs well with</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          {t.rich('componentDocs.app-shell.a11y.0', {
            link1: linkTag('/docs/components/sidebar'),
          })}
        </li>
        <li>
          {t.rich('componentDocs.app-shell.a11y.1', {
            link1: linkTag('/docs/components/page-header'),
          })}
        </li>
        <li>
          {t.rich('componentDocs.app-shell.a11y.2', {
            link1: linkTag('/docs/components/app-top-bar'),
          })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/medal" className="text-primary underline">
          ← Medal
        </Link>
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          AppTopBar →
        </Link>
      </div>
    </article>
  )
}
