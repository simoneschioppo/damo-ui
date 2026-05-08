import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Container } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Container } from '@damo/ui'`

const BASIC_SNIPPET = `<Container>
  <h1>Page heading</h1>
  <p>Body content lives inside a centred max-width column.</p>
</Container>`

const SIZE_SNIPPET = `<Container size="md">…</Container>
<Container size="lg">…</Container>
<Container size="2xl">…</Container>`

const UNPADDED_SNIPPET = `<Container size="full" padded={false}>
  <FullBleedHero />
</Container>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'",
    defaultValue: "'lg'",
    description:
      'Maximum width breakpoint. `full` removes the max-width entirely (useful for full-bleed banners that still want centred padding).',
  },
  {
    name: 'padded',
    type: 'boolean',
    defaultValue: 'true',
    description: 'When true, applies responsive horizontal padding (`px-4 md:px-6 lg:px-8`).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the defaults.',
  },
]

export const metadata = { title: `Container — ${BRAND.libName}` }

export default async function ContainerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Container</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Centred max-width column with responsive horizontal padding. The default page wrapper for
        Damo UI documents.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full border-2 border-memphis bg-background">
          <Container className="border-x border-dashed border-primary/40 py-6">
            <h3 className="font-display text-xl">Page heading</h3>
            <p className="text-muted-foreground">
              Body content lives inside a centred max-width column.
            </p>
          </Container>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Size variants</h2>
      <p className="text-foreground/80 mb-3">
        Six size steps mirror Tailwind's <code className="font-mono">screen-*</code> breakpoints,
        plus a <code className="font-mono">full</code> option for full-bleed sections.
      </p>
      <Code code={SIZE_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Unpadded</h2>
      <p className="text-foreground/80 mb-3">
        Disable padding when the children already manage their own gutters or for full-bleed hero
        banners.
      </p>
      <Code code={UNPADDED_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Container props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/box" className="text-primary underline">
          ← Box
        </Link>
        <Link href="/docs/components/aspect-ratio" className="text-primary underline">
          AspectRatio →
        </Link>
      </div>
    </article>
  )
}
