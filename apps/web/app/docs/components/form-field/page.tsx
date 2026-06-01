import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { FormField, Input, Textarea } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { FormField, Input } from '@/components/ui/form-field'`

const BASIC_SNIPPET = `<FormField label="Email" description="We'll never share it.">
  <Input type="email" />
</FormField>`

const ERROR_SNIPPET = `<FormField label="Username" error="Username is already taken.">
  <Input defaultValue="damo" />
</FormField>`

const TEXTAREA_SNIPPET = `<FormField label="Notes" description="Markdown is supported.">
  <Textarea rows={4} />
</FormField>`

export const metadata = { title: `FormField — ${BRAND.libName}` }

export default async function FormFieldDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description: t.rich('componentDocs.form-field.props.label', { code: codeTag }),
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: t.rich('componentDocs.form-field.props.description', { code: codeTag }),
    },
    {
      name: 'error',
      type: 'ReactNode',
      description: t.rich('componentDocs.form-field.props.error', { code: codeTag }),
    },
    {
      name: 'id',
      type: 'string',
      description: t.rich('componentDocs.form-field.props.id', { code: codeTag }),
    },
    {
      name: 'children',
      type: 'ReactElement',
      required: true,
      description: t.rich('componentDocs.form-field.props.children', { code: codeTag }),
    },
    {
      name: 'labelClassName',
      type: 'string',
      description: t.rich('componentDocs.form-field.props.labelClassName', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('primitives')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">FormField</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.form-field.lead', {
          code: codeTag,
          link1: linkTag('/docs/components/box'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Label + description</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Email" description="We'll never share it.">
            <Input type="email" placeholder="you@example.com" />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('errorState')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.form-field.body.errorState', { code: codeTag })}
      </p>
      <Example code={ERROR_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Username" error="Username is already taken.">
            <Input defaultValue="damo" />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('withTextarea')}</h2>
      <Example code={TEXTAREA_SNIPPET}>
        <div className="w-full max-w-sm">
          <FormField label="Notes" description="Markdown is supported.">
            <Textarea rows={4} />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="FormField props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.form-field.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.form-field.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.form-field.a11y.2', { code: codeTag })}</li>
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
