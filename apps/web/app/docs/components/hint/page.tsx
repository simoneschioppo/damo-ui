import Link from 'next/link'
import { Hint } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Hint } from '@damo/ui'`

const BASIC_SNIPPET = `<Hint num={1} title="Numbered insight">
  Pair the numbered tile with a short paragraph. The tile is a
  Memphis-bordered slab — keep titles short.
</Hint>
<Hint num={2} title="Pair with surrounding copy">
  Use Hints inside long-form docs or how-to flows.
</Hint>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'num',
    type: 'number',
    required: true,
    description: 'Number rendered inside the leading 40×40 tile.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    required: true,
    description: 'Short heading rendered in display font.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Body paragraph below the title.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the wrapper.',
  },
]

export const metadata = { title: `Hint — ${BRAND.libName}` }

export default function HintDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FEEDBACK
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Hint</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Numbered Memphis callout. Use to highlight steps in a how-to, key insights inside long-form
        docs, or numbered captions on a marketing page.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Live preview</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <Hint num={1} title="Numbered insight">
            Pair the numbered tile with a short paragraph. The tile is a Memphis-bordered slab —
            keep titles short.
          </Hint>
          <Hint num={2} title="Pair with surrounding copy">
            Use Hints inside long-form docs or how-to flows.
          </Hint>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Hint props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <p className="text-foreground/85">
        Hint renders a vanilla <code className="font-mono">div</code> with semantic{' '}
        <code className="font-mono">h4</code> + <code className="font-mono">p</code> children. The
        number tile carries no <code className="font-mono">aria-hidden</code>, so screen readers
        will announce it before the title — this is intentional, since the number is part of the
        callout&rsquo;s meaning.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/chip" className="text-primary underline">
          ← Chip
        </Link>
        <Link href="/docs/components/tabs" className="text-primary underline">
          Tabs →
        </Link>
      </div>
    </article>
  )
}
