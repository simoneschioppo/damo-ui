import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Ornament } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Ornament } from '@damo/ui'`

const DEFAULT_SNIPPET = `<Ornament />`

const CUSTOM_SNIPPET = `<Ornament>
  <span aria-hidden>✦</span>
</Ornament>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'Optional glyph rendered between the two gradient hairlines. Defaults to a Memphis diamond.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the wrapper.',
  },
]

export const metadata = { title: `Ornament — ${BRAND.libName}` }

export default async function OrnamentDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Ornament</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.ornament.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Default</h2>
      <Example code={DEFAULT_SNIPPET}>
        <div className="w-full px-6">
          <Ornament />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Custom glyph</h2>
      <p className="text-foreground/80 mb-3">
        Pass a child node to replace the default diamond — emojis, icons, or short text accents work
        well.
      </p>
      <Example code={CUSTOM_SNIPPET}>
        <div className="w-full px-6">
          <Ornament>
            <span aria-hidden className="text-xl">
              ✦
            </span>
          </Ornament>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Ornament props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <p className="text-foreground/85">
        The wrapper carries <code className="font-mono">aria-hidden=&quot;true&quot;</code>, which
        removes Ornament from the accessibility tree entirely — assistive technology skips it. The
        DOM <code className="font-mono">role=&quot;separator&quot;</code> attribute is present for
        styling consistency but has no AT effect because of the surrounding{' '}
        <code className="font-mono">aria-hidden</code>. For semantic section breaks that should be
        announced, use{' '}
        <Link href="/docs/components/separator" className="text-primary underline">
          Separator
        </Link>{' '}
        with <code className="font-mono">decorative=false</code>.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/separator" className="text-primary underline">
          ← Separator
        </Link>
        <Link href="/docs/components/form-field" className="text-primary underline">
          FormField →
        </Link>
      </div>
    </article>
  )
}
