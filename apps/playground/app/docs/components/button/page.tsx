import Link from 'next/link'
import { Button, IconButton, ArrowRightIcon, CogIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'

const IMPORT_SNIPPET = `import { Button } from '@damo/ui'`

const BASIC_SNIPPET = `<Button variant="primary">Save</Button>
<Button variant="ghost">Cancel</Button>`

const SIZES_SNIPPET = `<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`

const ICON_SNIPPET = `import { Button, IconButton, ArrowRightIcon, CogIcon } from '@damo/ui'

<Button variant="ghost">
  <ArrowRightIcon size={14} /> Continue
</Button>
<IconButton aria-label="Settings" variant="ghost">
  <CogIcon size={18} />
</IconButton>`

const DISABLED_SNIPPET = `<Button variant="primary" disabled>
  Save
</Button>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'primary' | 'ghost'",
    defaultValue: "'primary'",
    description: 'Primary uses the gold accent. Ghost is a neutral outline.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Adjusts vertical padding and font size.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Greys out the button and prevents pointer / keyboard activation.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: (
      <>
        Renders the underlying element passed as <code className="font-mono">children</code>{' '}
        instead of a <code className="font-mono">&lt;button&gt;</code>. Useful for{' '}
        <code className="font-mono">&lt;a&gt;</code> or framework <code className="font-mono">Link</code> wrappers.
      </>
    ),
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the variant defaults.',
  },
]

export const metadata = {
  title: 'Button — Axolab',
  description: 'Memphis-styled button component with primary and ghost variants.',
}

export default function ButtonDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Button</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Bordered, shadowed action surface. Two variants, three sizes, full keyboard access via
        a native <code className="font-mono">&lt;button&gt;</code>.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Usage</h2>
      <Example code={BASIC_SNIPPET}>
        <Button variant="primary">Save</Button>
        <Button variant="ghost">Cancel</Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Sizes</h2>
      <Example code={SIZES_SNIPPET}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With icons</h2>
      <Example code={ICON_SNIPPET}>
        <Button variant="ghost">
          <ArrowRightIcon size={14} /> Continue
        </Button>
        <IconButton aria-label="Settings" variant="ghost">
          <CogIcon size={18} />
        </IconButton>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Disabled</h2>
      <Example code={DISABLED_SNIPPET}>
        <Button variant="primary" disabled>
          Save
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">API</h2>
      <PropsTable props={PROPS} caption="Button props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>Renders a native <code className="font-mono">&lt;button type=&quot;button&quot;&gt;</code>; pass <code className="font-mono">type=&quot;submit&quot;</code> when used inside a form.</li>
        <li>Always provide a non-empty label. For icon-only triggers use <code className="font-mono">IconButton</code> with an <code className="font-mono">aria-label</code>.</li>
        <li><code className="font-mono">disabled</code> blocks both pointer and keyboard activation. Avoid disabling submit buttons silently — surface validation errors instead.</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/getting-started" className="text-primary underline">
          ← Getting Started
        </Link>
        <Link href="/docs/components/card" className="text-primary underline">
          Card →
        </Link>
      </div>
    </article>
  )
}
