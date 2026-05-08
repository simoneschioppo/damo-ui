import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RadioGroup, RadioGroupItem, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { RadioGroup, RadioGroupItem, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<RadioGroup defaultValue="medium">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="small" id="size-s" />
    <Label htmlFor="size-s">Small</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="medium" id="size-m" />
    <Label htmlFor="size-m">Medium</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="large" id="size-l" />
    <Label htmlFor="size-l">Large</Label>
  </div>
</RadioGroup>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'value',
    type: 'string',
    description: 'Controlled selected value. Pair with `onValueChange`.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Uncontrolled initial selected value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires whenever the selection changes.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Name attribute for native form submission.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables every item in the group.',
  },
  {
    name: 'required',
    type: 'boolean',
    description: 'Marks the group as required for native form submission.',
  },
]

export const metadata = { title: `RadioGroup — ${BRAND.libName}` }

export default async function RadioGroupDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">RadioGroup</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.radio-group.lead', {
          link1: linkTag('/docs/components/segmented-control'),
          link2: linkTag('/docs/components/switch'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <RadioGroup defaultValue="medium">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="small" id="docs-rg-s" />
            <Label htmlFor="docs-rg-s">Small</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="medium" id="docs-rg-m" />
            <Label htmlFor="docs-rg-m">Medium</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="large" id="docs-rg-l" />
            <Label htmlFor="docs-rg-l">Large</Label>
          </div>
        </RadioGroup>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable
        props={PROPS}
        caption="RadioGroup props (props on RadioGroupItem follow the same Radix shape)"
      />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Radix wires <code className="font-mono">role=&quot;radiogroup&quot;</code> on the root and{' '}
          <code className="font-mono">role=&quot;radio&quot;</code> on each item with proper{' '}
          <code className="font-mono">aria-checked</code>.
        </li>
        <li>
          Pair each <code className="font-mono">RadioGroupItem</code> with a{' '}
          <code className="font-mono">Label</code> wired via{' '}
          <code className="font-mono">htmlFor</code> so the click area extends to the label.
        </li>
        <li>
          Keyboard: <kbd>Tab</kbd> moves focus to the currently selected item (roving tabindex);
          arrow keys cycle items <em>and</em> change the selection; <kbd>Tab</kbd> again moves focus
          out of the group.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/checkbox" className="text-primary underline">
          ← Checkbox
        </Link>
        <Link href="/docs/components/switch" className="text-primary underline">
          Switch →
        </Link>
      </div>
    </article>
  )
}
