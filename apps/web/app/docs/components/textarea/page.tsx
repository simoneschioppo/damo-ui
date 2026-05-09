import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Textarea, FormField } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Textarea } from 'damo-ui'`

const BASIC_SNIPPET = `<Textarea placeholder="Tell us more…" rows={4} />`
const INVALID_SNIPPET = `<Textarea invalid defaultValue="Too short" />`
const FORMFIELD_SNIPPET = `<FormField label="Notes" description="Markdown is supported.">
  <Textarea rows={4} />
</FormField>`

export const metadata = { title: `Textarea — ${BRAND.libName}` }

export default async function TextareaDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'invalid',
      type: 'boolean',
      description: t.rich('componentDocs.textarea.props.invalid', { code: codeTag }),
    },
    {
      name: 'rows',
      type: 'number',
      defaultValue: '4',
      description: t.rich('componentDocs.textarea.props.rows', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.textarea.props.disabled', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.textarea.props.className', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Textarea</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.textarea.lead', {
          link1: linkTag('/docs/components/input'),
          link2: linkTag('/docs/components/form-field'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md">
          <Textarea placeholder="Tell us more…" rows={4} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('invalidState')}</h2>
      <Example code={INVALID_SNIPPET}>
        <div className="w-full max-w-md">
          <Textarea invalid defaultValue="Too short" rows={3} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('withFormField')}</h2>
      <Example code={FORMFIELD_SNIPPET}>
        <div className="w-full max-w-md">
          <FormField label="Notes" description="Markdown is supported.">
            <Textarea rows={4} />
          </FormField>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Textarea props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.textarea.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.textarea.a11y.1', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/input" className="text-primary underline">
          ← Input
        </Link>
        <Link href="/docs/components/label" className="text-primary underline">
          Label →
        </Link>
      </div>
    </article>
  )
}
