import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Separator } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Separator } from '@damo/ui'`

const SOLID_SNIPPET = `<Separator />`
const VARIANT_SNIPPET = `<Separator variant="dashed" />
<Separator variant="memphis-double" />`
const VERTICAL_SNIPPET = `<div className="flex h-8 items-center gap-3">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</div>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: 'Direction of the divider.',
  },
  {
    name: 'variant',
    type: "'solid' | 'dashed' | 'memphis-double'",
    defaultValue: "'solid'",
    description:
      '`solid` is a single hairline; `dashed` switches to a dashed border; `memphis-double` is a double-bordered slab matching the Memphis aesthetic.',
  },
  {
    name: 'decorative',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'When true (default), the separator is purely decorative and hidden from screen readers. Pass false when the divider conveys meaningful structure that should be announced.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the variant defaults.',
  },
]

export const metadata = { title: `Separator — ${BRAND.libName}` }

export default async function SeparatorDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Separator</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Horizontal or vertical divider with three Memphis-aware variants. Composes the Radix
        Separator primitive, so its semantics flip between decorative and meaningful via{' '}
        <code className="font-mono">decorative</code>.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Solid (default)</h2>
      <Example code={SOLID_SNIPPET}>
        <div className="w-full px-6">
          <Separator />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('variants')}</h2>
      <Example code={VARIANT_SNIPPET}>
        <div className="flex flex-col gap-6 w-full px-6">
          <Separator variant="dashed" />
          <Separator variant="memphis-double" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical</h2>
      <Example code={VERTICAL_SNIPPET}>
        <div className="flex h-8 items-center gap-3 px-6 font-mono text-sm">
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Separator props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Defaults to <code className="font-mono">decorative=true</code> — no role is announced. Use
          this for purely visual separation.
        </li>
        <li>
          Set <code className="font-mono">decorative=false</code> when the divider represents
          meaningful structure (e.g. between thematic page sections); Radix exposes{' '}
          <code className="font-mono">role=&quot;separator&quot;</code> with the right{' '}
          <code className="font-mono">aria-orientation</code>.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/scroll-area" className="text-primary underline">
          ← ScrollArea
        </Link>
        <Link href="/docs/components/ornament" className="text-primary underline">
          Ornament →
        </Link>
      </div>
    </article>
  )
}
