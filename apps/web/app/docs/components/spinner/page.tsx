import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Spinner } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Spinner } from '@damo/ui'`

const SIZES_SNIPPET = `<Spinner size={16} />
<Spinner size={20} />
<Spinner size={32} />`

const COLOR_SNIPPET = `<Spinner className="text-secondary" />
<Spinner className="text-success" />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'size',
    type: 'number | string',
    defaultValue: '20',
    description: 'Width and height of the SVG. Pass any number (px) or CSS unit string.',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: "'Caricamento…'",
    description:
      'Accessible name announced by screen readers (`aria-label`). Localize for non-Italian UIs.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the spin animation + primary color.',
  },
]

export const metadata = { title: `Spinner — ${BRAND.libName}` }

export default async function SpinnerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Spinner</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.spinner.lead', {
          code: codeTag,
          link1: linkTag('/docs/components/progress'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('sizes')}</h2>
      <Example code={SIZES_SNIPPET}>
        <div className="flex items-center gap-6">
          <Spinner size={16} />
          <Spinner size={20} />
          <Spinner size={32} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Color override</h2>
      <p className="text-foreground/80 mb-3">
        Spinner uses <code className="font-mono">currentColor</code> — change the wrapper&rsquo;s
        text color to retint.
      </p>
      <Example code={COLOR_SNIPPET}>
        <div className="flex items-center gap-6">
          <Spinner className="text-secondary" />
          <Spinner className="text-success" />
          <Spinner className="text-destructive" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Spinner props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Renders <code className="font-mono">role=&quot;status&quot;</code> with the supplied{' '}
          <code className="font-mono">label</code> as <code className="font-mono">aria-label</code>.
        </li>
        <li>
          For inline use inside a labelled button, set{' '}
          <code className="font-mono">label=&quot;&quot;</code> and rely on the button&rsquo;s own
          text — avoid duplicate announcements.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/progress" className="text-primary underline">
          ← Progress
        </Link>
        <Link href="/docs/components/skeleton" className="text-primary underline">
          Skeleton →
        </Link>
      </div>
    </article>
  )
}
