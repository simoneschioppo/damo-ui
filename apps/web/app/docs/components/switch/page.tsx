import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Switch, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Switch, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<div className="flex items-center gap-3">
  <Switch id="notify" />
  <Label htmlFor="notify">Email notifications</Label>
</div>`

const STATES_SNIPPET = `<Switch defaultChecked />
<Switch defaultChecked={false} />
<Switch disabled />
<Switch defaultChecked disabled />`

export const metadata = { title: `Switch — ${BRAND.libName}` }

export default async function SwitchDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'checked',
      type: 'boolean',
      description: t.rich('componentDocs.switch.props.checked', { code: codeTag }),
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: t.rich('componentDocs.switch.props.defaultChecked', { code: codeTag }),
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      description: t.rich('componentDocs.switch.props.onCheckedChange', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.switch.props.disabled', { code: codeTag }),
    },
    {
      name: 'name',
      type: 'string',
      description: t.rich('componentDocs.switch.props.name', { code: codeTag }),
    },
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.switch.props.value', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Switch</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.switch.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Switch + label</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="flex items-center gap-3">
          <Switch id="docs-switch-notify" />
          <Label htmlFor="docs-switch-notify">Email notifications</Label>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('states')}</h2>
      <Example code={STATES_SNIPPET}>
        <div className="flex flex-wrap items-center gap-4">
          <Switch defaultChecked aria-label="On" />
          <Switch defaultChecked={false} aria-label="Off" />
          <Switch disabled aria-label="Disabled off" />
          <Switch defaultChecked disabled aria-label="Disabled on" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Switch props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Switch vs Checkbox</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.switch.body.vsCheckbox0', { strong: strongTag })}</li>
        <li>
          {t.rich('componentDocs.switch.body.vsCheckbox1', {
            link1: linkTag('/docs/components/checkbox'),
          })}
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.switch.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.switch.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.switch.a11y.2', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/radio-group" className="text-primary underline">
          ← RadioGroup
        </Link>
        <Link href="/docs/components/slider" className="text-primary underline">
          Slider →
        </Link>
      </div>
    </article>
  )
}
