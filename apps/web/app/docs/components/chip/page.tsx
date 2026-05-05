import Link from 'next/link'
import { Chip } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Chip } from '@damo/ui'`

const VARIANTS_SNIPPET = `<Chip>Default</Chip>
<Chip variant="accent">Accent</Chip>
<Chip variant="brand">Brand</Chip>
<Chip variant="success">Success</Chip>
<Chip variant="warning">Warning</Chip>
<Chip variant="danger">Danger</Chip>`

const SIZES_SNIPPET = `<Chip size="sm">Small</Chip>
<Chip size="md">Medium</Chip>
<Chip size="lg">Large</Chip>`

const DOT_SNIPPET = `<Chip dotColor="var(--success)">Active</Chip>
<Chip dotColor="var(--destructive)">Offline</Chip>
<Chip active dotColor="var(--primary)">Selected</Chip>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'default' | 'accent' | 'brand' | 'success' | 'warning' | 'danger'",
    defaultValue: "'default'",
    description: 'Background tint and border color. All variants share the rounded pill shape.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    defaultValue: "'md'",
    description: 'Padding + text size step.',
  },
  {
    name: 'dotColor',
    type: 'string',
    description:
      'When set, prepends an 8×8 dot before children. Accepts any CSS color string (`var(--success)`, `#16a34a`, etc.).',
  },
  {
    name: 'active',
    type: 'boolean',
    description:
      'Swap the surface to the primary token (selected look). With `dotColor` the dot border flips to white for contrast.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Chip label — supports text or icon + text.',
  },
]

export const metadata = { title: `Chip — ${BRAND.libName}` }

export default function ChipDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FEEDBACK
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Chip</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Pill-shaped tag with optional status dot and active state. Use chips for filters, tags, and
        soft status labels. For uppercase Memphis-shadowed badges (status / outcome), reach for{' '}
        <Link href="/docs/components/badge" className="text-primary underline">
          Badge
        </Link>
        .
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Variants</h2>
      <Example code={VARIANTS_SNIPPET}>
        <div className="flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip variant="accent">Accent</Chip>
          <Chip variant="brand">Brand</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="danger">Danger</Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Sizes</h2>
      <Example code={SIZES_SNIPPET}>
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm">Small</Chip>
          <Chip size="md">Medium</Chip>
          <Chip size="lg">Large</Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Status dot + active</h2>
      <Example code={DOT_SNIPPET}>
        <div className="flex flex-wrap gap-2">
          <Chip dotColor="var(--success)">Active</Chip>
          <Chip dotColor="var(--destructive)">Offline</Chip>
          <Chip active dotColor="var(--primary)">
            Selected
          </Chip>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Chip props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Chip renders a <code className="font-mono">&lt;span&gt;</code> — when used inside a
          clickable filter, wrap it in a <code className="font-mono">&lt;button&gt;</code> with{' '}
          <code className="font-mono">aria-pressed</code> reflecting the{' '}
          <code className="font-mono">active</code> state.
        </li>
        <li>
          The status dot is purely decorative; the label text must convey the same status (do not
          rely on color alone).
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/badge" className="text-primary underline">
          ← Badge
        </Link>
        <Link href="/docs/components/hint" className="text-primary underline">
          Hint →
        </Link>
      </div>
    </article>
  )
}
