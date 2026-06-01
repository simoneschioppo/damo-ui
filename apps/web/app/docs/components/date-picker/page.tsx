import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { DatePicker } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { DatePicker } from '@/components/ui/date-picker'`

const BASIC_SNIPPET = `<DatePicker placeholder="Seleziona una data" />`

const CONTROLLED_SNIPPET = `function ControlledExample() {
  const [date, setDate] = useState<Date | undefined>()
  return <DatePicker value={date} onValueChange={setDate} />
}`

const FORMAT_SNIPPET = `<DatePicker formatStr="dd/MM/yyyy" />`

export const metadata = { title: `DatePicker — ${BRAND.libName}` }

export default async function DatePickerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'Date',
      description: t.rich('componentDocs.date-picker.props.value', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(date: Date | undefined) => void',
      description: t.rich('componentDocs.date-picker.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'placeholder',
      type: 'ReactNode',
      defaultValue: "'Seleziona una data'",
      description: t.rich('componentDocs.date-picker.props.placeholder', { code: codeTag }),
    },
    {
      name: 'formatStr',
      type: 'string',
      defaultValue: "'PPP'",
      description: t.rich('componentDocs.date-picker.props.formatStr', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.date-picker.props.disabled', { code: codeTag }),
    },
    {
      name: 'id',
      type: 'string',
      description: t.rich('componentDocs.date-picker.props.id', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.date-picker.props.className', { code: codeTag }),
    },
    {
      name: 'triggerClassName',
      type: 'string',
      description: t.rich('componentDocs.date-picker.props.triggerClassName', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">DatePicker</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.date-picker.lead', {
          code: codeTag,
          link1: linkTag('/docs/components/popover'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage (uncontrolled)</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-xs">
          <DatePicker placeholder="Seleziona una data" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('controlled')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.date-picker.body.controlled', { code: codeTag })}
      </p>
      <Code code={CONTROLLED_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('customFormat')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.date-picker.body.customFormat', { code: codeTag })}
      </p>
      <Code code={FORMAT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="DatePicker props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('nativeFormSubmission')}</h2>
      <p className="text-foreground/85 mb-3">
        {t.rich('componentDocs.date-picker.body.nativeFormSubmission', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.date-picker.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.date-picker.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.date-picker.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/select" className="text-primary underline">
          ← Select
        </Link>
        <Link href="/docs/components/combobox" className="text-primary underline">
          Combobox →
        </Link>
      </div>
    </article>
  )
}
