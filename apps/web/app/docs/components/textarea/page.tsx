import Link from 'next/link'
import { Textarea, FormField } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Textarea } from '@damo/ui'`

const BASIC_SNIPPET = `<Textarea placeholder="Tell us more…" rows={4} />`
const INVALID_SNIPPET = `<Textarea invalid defaultValue="Too short" />`
const FORMFIELD_SNIPPET = `<FormField label="Notes" description="Markdown is supported.">
  <Textarea rows={4} />
</FormField>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'invalid',
    type: 'boolean',
    description:
      'When true, sets `aria-invalid` and switches the border + Memphis shadow to the destructive token.',
  },
  {
    name: 'rows',
    type: 'number',
    defaultValue: '4',
    description: 'Visible rows when un-resized.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables the field. The Memphis hover/focus styles also drop.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the defaults.',
  },
]

export const metadata = { title: `Textarea — ${BRAND.libName}` }

export default function TextareaDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FORMS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Textarea</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Multi-line text input with the same Memphis border, hover, and focus chrome as{' '}
        <Link href="/docs/components/input" className="text-primary underline">
          Input
        </Link>
        . Resizable vertically by default; pair with{' '}
        <Link href="/docs/components/form-field" className="text-primary underline">
          FormField
        </Link>{' '}
        for label + description + error wiring.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md">
          <Textarea placeholder="Tell us more…" rows={4} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Invalid state</h2>
      <Example code={INVALID_SNIPPET}>
        <div className="w-full max-w-md">
          <Textarea invalid defaultValue="Too short" rows={3} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With FormField</h2>
      <Example code={FORMFIELD_SNIPPET}>
        <div className="w-full max-w-md">
          <FormField label="Notes" description="Markdown is supported.">
            <Textarea rows={4} />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Textarea props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Renders a native <code className="font-mono">&lt;textarea&gt;</code>; native form
          submission and validation work as expected.
        </li>
        <li>
          Pair with <code className="font-mono">FormField</code> (or supply your own{' '}
          <code className="font-mono">aria-labelledby</code> /{' '}
          <code className="font-mono">aria-describedby</code>) so screen readers announce label,
          description, and error.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/input" className="text-primary underline">
          ← Input
        </Link>
        <Link href="/docs/components/label" className="text-primary underline">
          Label →
        </Link>
      </div>
    </article>
  )
}
