import Link from 'next/link'
import { FormField, Input, Textarea } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { FormField, Input } from '@damo/ui'`

const BASIC_SNIPPET = `<FormField label="Email" description="We'll never share it.">
  <Input type="email" />
</FormField>`

const ERROR_SNIPPET = `<FormField label="Username" error="Username is already taken.">
  <Input defaultValue="damo" />
</FormField>`

const TEXTAREA_SNIPPET = `<FormField label="Notes" description="Markdown is supported.">
  <Textarea rows={4} />
</FormField>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'label',
    type: 'ReactNode',
    required: true,
    description: 'Visible label rendered as a `<label>` and wired to the child via `htmlFor`.',
  },
  {
    name: 'description',
    type: 'ReactNode',
    description: 'Optional helper text. The id is added to the child via `aria-describedby`.',
  },
  {
    name: 'error',
    type: 'ReactNode',
    description:
      'Optional validation message. When present, it is added to `aria-describedby` and the child also receives `aria-invalid=true`.',
  },
  {
    name: 'id',
    type: 'string',
    description:
      'Override the auto-generated id. Useful when you need to reference the field from outside the form.',
  },
  {
    name: 'children',
    type: 'ReactElement',
    required: true,
    description:
      'Exactly one child element. The wrapper clones it and injects `id`, `aria-describedby`, and `aria-invalid`.',
  },
  {
    name: 'labelClassName',
    type: 'string',
    description: 'Customise the label classes (e.g. to hide for visually-hidden labels).',
  },
]

export const metadata = { title: `FormField — ${BRAND.libName}` }

export default function FormFieldDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        PRIMITIVES
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">FormField</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Accessible wrapper that wires a label, description, and error message to a single input
        child via <code className="font-mono">aria-describedby</code> and{' '}
        <code className="font-mono">aria-invalid</code>. Ships zero opinions about layout — pair it
        with{' '}
        <Link href="/docs/components/box" className="text-primary underline">
          Box
        </Link>{' '}
        for stacks.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Label + description</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Email" description="We'll never share it.">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Error state</h2>
      <p className="text-foreground/80 mb-3">
        Pass an <code className="font-mono">error</code> string to surface a validation message. The
        wrapper sets <code className="font-mono">aria-invalid</code> on the child and links the
        error to <code className="font-mono">aria-describedby</code>.
      </p>
      <Example code={ERROR_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Username" error="Username is already taken.">
            <Input defaultValue="damo" />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With Textarea</h2>
      <Example code={TEXTAREA_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Notes" description="Markdown is supported.">
            <Textarea rows={4} />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="FormField props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The label is a real <code className="font-mono">&lt;label htmlFor=&quot;…&quot;&gt;</code>
          ; clicking it focuses the input.
        </li>
        <li>
          Description and error ids are merged into the child's{' '}
          <code className="font-mono">aria-describedby</code>; existing ids passed by the caller are
          preserved.
        </li>
        <li>
          When <code className="font-mono">error</code> is set, the child receives{' '}
          <code className="font-mono">aria-invalid=true</code> automatically.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/ornament" className="text-primary underline">
          ← Ornament
        </Link>
        <Link href="/docs/components/button" className="text-primary underline">
          Button →
        </Link>
      </div>
    </article>
  )
}
