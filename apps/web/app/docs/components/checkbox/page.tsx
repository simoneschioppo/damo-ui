import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Checkbox, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Checkbox, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept the terms</Label>
</div>`

const STATES_SNIPPET = `<Checkbox defaultChecked />
<Checkbox checked={false} />
<Checkbox checked="indeterminate" />
<Checkbox disabled />
<Checkbox defaultChecked disabled />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'checked',
    type: "boolean | 'indeterminate'",
    description: 'Controlled checked state. Pair with `onCheckedChange`.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    description: 'Uncontrolled initial checked state.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean | "indeterminate") => void',
    description: 'Fires whenever the checked state changes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables the input.',
  },
  {
    name: 'required',
    type: 'boolean',
    description: 'Marks the input as required for native form submission.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Name attribute for native form submission.',
  },
]

export const metadata = { title: `Checkbox — ${BRAND.libName}` }

export default async function CheckboxDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Checkbox</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Memphis-bordered checkbox built on Radix Checkbox. Supports tri-state checked / unchecked /
        indeterminate, plus all native form semantics (name, value, required).
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
        <li>
          Radix Checkbox renders <code className="font-mono">role=&quot;checkbox&quot;</code> with{' '}
          <code className="font-mono">aria-checked</code> reflecting the checked state, including{' '}
          <code className="font-mono">&quot;mixed&quot;</code> for the indeterminate case.
        </li>
        <li>
          Always pair with a <code className="font-mono">Label</code> wired via{' '}
          <code className="font-mono">htmlFor</code>, or supply{' '}
          <code className="font-mono">aria-label</code> when there is no visible text.
        </li>
        <li>
          Native keyboard support inherited: <kbd>Space</kbd> toggles the checked state.
        </li>
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
