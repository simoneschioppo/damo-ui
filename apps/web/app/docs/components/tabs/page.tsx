import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@axologic/ui'`

const BASIC_SNIPPET = `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
  <TabsContent value="billing">…</TabsContent>
</Tabs>`

export const metadata = { title: `Tabs — ${BRAND.libName}` }

export default async function TabsDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.tabs.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.tabs.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: t.rich('componentDocs.tabs.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: t.rich('componentDocs.tabs.props.orientation', { code: codeTag }),
    },
    {
      name: 'activationMode',
      type: "'automatic' | 'manual'",
      defaultValue: "'automatic'",
      description: t.rich('componentDocs.tabs.props.activationMode', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tabs</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.tabs.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-xl">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted-foreground">
                Overview panel. Place primary metrics, hero copy or a dashboard header here.
              </p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-sm text-muted-foreground">
                Settings panel. Forms, preferences, integrations — all live here.
              </p>
            </TabsContent>
            <TabsContent value="billing">
              <p className="text-sm text-muted-foreground">
                Billing panel. Plan, payment method and invoice history.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props (Tabs root)</h2>
      <PropsTable props={PROPS} caption="Tabs props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.tabs.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.tabs.a11y.1', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">Tabs vs SegmentedControl</h2>
      <p className="text-foreground/85">
        {t.rich('componentDocs.tabs.body.vsSegmented', {
          link1: linkTag('/docs/components/segmented-control'),
        })}
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/hint" className="text-primary underline">
          ← Hint
        </Link>
        <Link href="/docs/components/dropdown-menu" className="text-primary underline">
          DropdownMenu →
        </Link>
      </div>
    </article>
  )
}
