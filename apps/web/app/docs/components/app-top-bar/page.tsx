import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { AppTopBar, AttrToggleGroup, Button } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AppTopBar, AttrToggleGroup } from '@/components/ui/app-top-bar'
import Link from 'next/link'`

const BASIC_SNIPPET = `<AppTopBar
  logo={<Link href="/">Brand</Link>}
  nav={
    <>
      <Link href="/docs">Docs</Link>
      <Link href="/pricing">Pricing</Link>
    </>
  }
  actions={
    <AttrToggleGroup
      label="Theme"
      storageKey="theme"
      attribute="data-theme"
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
      defaultValue="light"
    />
  }
/>`

const NON_STICKY_SNIPPET = `<AppTopBar sticky={false} logo={/* … */} />`

export const metadata = { title: `AppTopBar — ${BRAND.libName}` }

export default async function AppTopBarDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'logo',
      type: 'ReactNode',
      required: true,
      description: t('componentDocs.app-top-bar.props.logo'),
    },
    {
      name: 'nav',
      type: 'ReactNode',
      description: t('componentDocs.app-top-bar.props.nav'),
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description: t.rich('componentDocs.app-top-bar.props.actions', { code: codeTag }),
    },
    {
      name: 'sticky',
      type: 'boolean',
      defaultValue: 'true',
      description: t('componentDocs.app-top-bar.props.sticky'),
    },
    {
      name: 'menuTriggerSize',
      type: "'sm' | 'md' | 'lg'",
      defaultValue: "'md'",
      description: t('componentDocs.app-top-bar.props.menuTriggerSize'),
    },
    {
      name: 'menuTriggerVariant',
      type: "'flat' | 'raised'",
      defaultValue: "'flat'",
      description: t('componentDocs.app-top-bar.props.menuTriggerVariant'),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.app-top-bar.props.className'),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('layout')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AppTopBar</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.app-top-bar.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('livePreview')}</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis">
        <AppTopBar
          sticky={false}
          logo={<span className="font-display text-base tracking-[0.18em]">DEMO</span>}
          nav={
            <>
              <span className="text-foreground/80">Docs</span>
              <span className="text-foreground/80">Pricing</span>
            </>
          }
          actions={
            <>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <AttrToggleGroup
                label="Theme"
                storageKey="docs-app-top-bar-theme"
                attribute="data-app-top-bar-theme"
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                defaultValue="light"
              />
            </>
          }
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Non-sticky variant</h2>
      <Code code={NON_STICKY_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('api')}</h2>
      <PropsTable props={PROPS} caption="AppTopBar props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.app-top-bar.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.app-top-bar.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/app-shell" className="text-primary underline">
          ← AppShell
        </Link>
        <Link href="/docs/components/page-header" className="text-primary underline">
          PageHeader →
        </Link>
      </div>
    </article>
  )
}
