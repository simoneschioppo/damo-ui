import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Input, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Input, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="hello@example.com" />`

const INVALID_SNIPPET = `<Label htmlFor="invalid-email">Email</Label>
<Input id="invalid-email" type="email" defaultValue="not-an-email" invalid />`

const DISABLED_SNIPPET = `<Input defaultValue="readonly@example.com" disabled />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'invalid',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Marks the input as invalid (sets aria-invalid + applies the destructive shadow).',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disables the input and applies the muted background.',
  },
  {
    name: '...rest',
    type: 'InputHTMLAttributes<HTMLInputElement>',
    description: 'All native input attributes are forwarded.',
  },
]

export const metadata = { title: `Input — ${BRAND.libName}` }

export default async function InputDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Input</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Single-line text field. Native <code className="font-mono">&lt;input&gt;</code> with the
        Memphis 2-px border and focus shadow. Pairs with <code className="font-mono">Label</code>
        for accessibility.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET} previewClassName="px-6 py-10">
        <div className="w-full max-w-sm flex flex-col gap-2">
          <Label htmlFor="email-doc">Email</Label>
          <Input id="email-doc" type="email" placeholder="hello@example.com" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('invalidState')}</h2>
      <Example code={INVALID_SNIPPET} previewClassName="px-6 py-10">
        <div className="w-full max-w-sm flex flex-col gap-2">
          <Label htmlFor="invalid-email-doc">Email</Label>
          <Input id="invalid-email-doc" type="email" defaultValue="not-an-email" invalid />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('disabled')}</h2>
      <Example code={DISABLED_SNIPPET} previewClassName="px-6 py-10">
        <div className="w-full max-w-sm">
          <Input defaultValue="readonly@example.com" disabled />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('api')}</h2>
      <PropsTable props={PROPS} caption="Input props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Always associate a <code className="font-mono">Label</code> via matching{' '}
          <code className="font-mono">htmlFor</code> / <code className="font-mono">id</code> —
          placeholders are not labels.
        </li>
        <li>
          Use <code className="font-mono">invalid</code> together with{' '}
          <code className="font-mono">aria-describedby</code> pointing at an error message for
          screen readers.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/banner" className="text-primary underline">
          ← Banner
        </Link>
        <Link href="/docs/components/textarea" className="text-primary underline">
          Textarea →
        </Link>
      </div>
    </article>
  )
}
