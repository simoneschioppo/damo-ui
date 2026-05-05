import Link from 'next/link'
import { ScrollArea } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { ScrollArea } from '@damo/ui'`

const BASIC_SNIPPET = `<ScrollArea className="h-72 w-full border-2 border-memphis">
  <ul className="p-4 space-y-2">
    {Array.from({ length: 50 }, (_, i) => (
      <li key={i}>Row {i + 1}</li>
    ))}
  </ul>
</ScrollArea>`

const HORIZONTAL_SNIPPET = `<ScrollArea className="w-full border-2 border-memphis">
  <div className="flex gap-3 p-4">
    {tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
  </div>
</ScrollArea>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Scrollable content — wrapped in a Radix viewport that handles overflow.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Tailwind classes for the outer wrapper. Apply height / width here so overflow is bounded.',
  },
  {
    name: 'type',
    type: "'auto' | 'always' | 'scroll' | 'hover'",
    defaultValue: "'hover'",
    description:
      'Forwarded to Radix Root. Controls when scrollbars are visible — `hover` reveals them on pointer hover, `always` keeps them in place.',
  },
]

export const metadata = { title: `ScrollArea — ${BRAND.libName}` }

export default function ScrollAreaDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        PRIMITIVES
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">ScrollArea</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Custom-styled scroll container that replaces native scrollbars with a Memphis-themed track
        and thumb. Composes <code className="font-mono">@radix-ui/react-scroll-area</code>; both
        vertical and horizontal scrollbars are wired automatically.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical scroll</h2>
      <Example code={BASIC_SNIPPET}>
        <ScrollArea className="h-60 w-full border-2 border-memphis bg-card">
          <ul className="p-4 space-y-2">
            {Array.from({ length: 30 }, (_, i) => (
              <li key={i} className="font-mono text-[13px]">
                Row {i + 1}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Horizontal scroll</h2>
      <p className="text-foreground/80 mb-3">
        ScrollArea wires both vertical and horizontal scrollbars; let the inner content overflow
        horizontally to surface the horizontal bar.
      </p>
      <Code code={HORIZONTAL_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="ScrollArea props" />

      <h2 className="font-display text-2xl mb-3 mt-10">When to use</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>Bounded panels with overflowing children (file lists, chat threads, tag carousels).</li>
        <li>
          When you need consistent scrollbar styling across browsers — native bars vary heavily on
          Safari / Windows / Linux.
        </li>
        <li>
          Skip ScrollArea for the document scroll itself — let the browser handle the page-level
          scroll for accessibility.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/aspect-ratio" className="text-primary underline">
          ← AspectRatio
        </Link>
        <Link href="/docs/components/separator" className="text-primary underline">
          Separator →
        </Link>
      </div>
    </article>
  )
}
