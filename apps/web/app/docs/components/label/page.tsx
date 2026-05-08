import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { Label, Input } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Label, Input } from '@damo/ui'`

const BASIC_SNIPPET = `<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'htmlFor',
    type: 'string',
    description:
      'Standard `<label>` association — when set, clicking the label focuses the field with the matching id.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Visible label text.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the typography defaults.',
  },
]

export const metadata = { title: `Label — ${BRAND.libName}` }

export default async function LabelDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Label</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.label.lead', {
          code: codeTag,
          link1: linkTag('/docs/components/form-field'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Label + input pair</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-sm flex flex-col gap-1">
          <Label htmlFor="docs-label-demo">Email</Label>
          <Input id="docs-label-demo" type="email" placeholder="you@example.com" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Label props" />

      <h2 className="font-display text-2xl mb-3 mt-10">When to reach for FormField</h2>
      <p className="text-foreground/85">
        For most product forms,{' '}
        <Link href="/docs/components/form-field" className="text-primary underline">
          FormField
        </Link>{' '}
        is preferable: it auto-wires <code className="font-mono">htmlFor</code>,{' '}
        <code className="font-mono">aria-describedby</code>, and{' '}
        <code className="font-mono">aria-invalid</code> based on description / error props. Reach
        for the standalone Label only when you have a one-off layout that needs custom positioning.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/textarea" className="text-primary underline">
          ← Textarea
        </Link>
        <Link href="/docs/components/checkbox" className="text-primary underline">
          Checkbox →
        </Link>
      </div>
    </article>
  )
}
