import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RadioGroup, RadioGroupItem, Label } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { RadioGroup, RadioGroupItem, Label } from '@damo/ui'`

const BASIC_SNIPPET = `<RadioGroup defaultValue="medium">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="small" id="size-s" />
    <Label htmlFor="size-s">Small</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="medium" id="size-m" />
    <Label htmlFor="size-m">Medium</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="large" id="size-l" />
    <Label htmlFor="size-l">Large</Label>
  </div>
</RadioGroup>`

export const metadata = { title: `RadioGroup — ${BRAND.libName}` }

export default async function RadioGroupDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.radio-group.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.radio-group.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: t.rich('componentDocs.radio-group.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'name',
      type: 'string',
      description: t.rich('componentDocs.radio-group.props.name', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.radio-group.props.disabled', { code: codeTag }),
    },
    {
      name: 'required',
      type: 'boolean',
      description: t.rich('componentDocs.radio-group.props.required', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">RadioGroup</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.radio-group.lead', {
          link1: linkTag('/docs/components/segmented-control'),
          link2: linkTag('/docs/components/switch'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <RadioGroup defaultValue="medium">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="small" id="docs-rg-s" />
            <Label htmlFor="docs-rg-s">Small</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="medium" id="docs-rg-m" />
            <Label htmlFor="docs-rg-m">Medium</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="large" id="docs-rg-l" />
            <Label htmlFor="docs-rg-l">Large</Label>
          </div>
        </RadioGroup>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable
        props={PROPS}
        caption="RadioGroup props (props on RadioGroupItem follow the same Radix shape)"
      />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.radio-group.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.radio-group.a11y.1', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.radio-group.a11y.2', { code: codeTag, em: emTag, kbd: kbdTag })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/checkbox" className="text-primary underline">
          ← Checkbox
        </Link>
        <Link href="/docs/components/switch" className="text-primary underline">
          Switch →
        </Link>
      </div>
    </article>
  )
}
