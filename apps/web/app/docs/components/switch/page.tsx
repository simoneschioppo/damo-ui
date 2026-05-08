import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Switch, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Switch, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<div className="flex items-center gap-3">
  <Switch id="notify" />
  <Label htmlFor="notify">Email notifications</Label>
</div>`

const STATES_SNIPPET = `<Switch defaultChecked />
<Switch defaultChecked={false} />
<Switch disabled />
<Switch defaultChecked disabled />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'checked',
    type: 'boolean',
    description: 'Controlled checked state. Pair with `onCheckedChange`.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    description: 'Uncontrolled initial checked state.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    description: 'Fires whenever the checked state changes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables the input.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Name attribute for native form submission.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Submitted form value when checked. Defaults to "on".',
  },
]

export const metadata = { title: `Switch — ${BRAND.libName}` }

export default async function SwitchDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
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
        <li>
          Use <strong>Switch</strong> when toggling a setting takes effect immediately (push
          notifications, dark mode).
        </li>
        <li>
          Use{' '}
          <Link href="/docs/components/checkbox" className="text-primary underline">
            Checkbox
          </Link>{' '}
          when the value is part of a form that gets submitted (accept terms, select preferences).
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Renders <code className="font-mono">role=&quot;switch&quot;</code> with{' '}
          <code className="font-mono">aria-checked</code> reflecting on/off state.
        </li>
        <li>
          Always associate a visible label or pass <code className="font-mono">aria-label</code>.
        </li>
        <li>
          Keyboard: <kbd>Space</kbd> toggles.
        </li>
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
