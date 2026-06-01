import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Checkbox, Label } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Checkbox, Label } from '@/components/ui/checkbox'`

const BASIC_SNIPPET = `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept the terms</Label>
</div>`

const STATES_SNIPPET = `<Checkbox defaultChecked />
<Checkbox checked={false} />
<Checkbox checked="indeterminate" />
<Checkbox disabled />
<Checkbox defaultChecked disabled />`

export const metadata = { title: `Checkbox — ${BRAND.libName}` }

export default async function CheckboxDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'checked',
      type: "boolean | 'indeterminate'",
      description: t.rich('componentDocs.checkbox.props.checked', { code: codeTag }),
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      description: t.rich('componentDocs.checkbox.props.defaultChecked', { code: codeTag }),
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean | "indeterminate") => void',
      description: t.rich('componentDocs.checkbox.props.onCheckedChange', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.checkbox.props.disabled', { code: codeTag }),
    },
    {
      name: 'required',
      type: 'boolean',
      description: t.rich('componentDocs.checkbox.props.required', { code: codeTag }),
    },
    {
      name: 'name',
      type: 'string',
      description: t.rich('componentDocs.checkbox.props.name', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Checkbox</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.checkbox.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('withLabel')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="flex items-center gap-2">
          <Checkbox id="docs-cb-terms" />
          <Label htmlFor="docs-cb-terms">Accept the terms</Label>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('states')}</h2>
      <Example code={STATES_SNIPPET}>
        <div className="flex flex-wrap items-center gap-4">
          <Checkbox defaultChecked aria-label="Checked" />
          <Checkbox checked={false} aria-label="Unchecked" />
          <Checkbox checked="indeterminate" aria-label="Indeterminate" />
          <Checkbox disabled aria-label="Disabled" />
          <Checkbox defaultChecked disabled aria-label="Disabled checked" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Checkbox props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.checkbox.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.checkbox.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.checkbox.a11y.2', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/label" className="text-primary underline">
          ← Label
        </Link>
        <Link href="/docs/components/radio-group" className="text-primary underline">
          RadioGroup →
        </Link>
      </div>
    </article>
  )
}
