import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Combobox } from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, kbdTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Combobox } from 'damo-ui'`

const BASIC_SNIPPET = `<Combobox
  options={[
    { value: 'it', label: 'Italy' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'us', label: 'United States' },
    { value: 'br', label: 'Brazil' },
  ]}
  placeholder="Pick a country"
/>`

const CONTROLLED_SNIPPET = `function ControlledExample() {
  const [value, setValue] = useState<string>()
  return (
    <Combobox
      options={LANGUAGES}
      value={value}
      onValueChange={setValue}
      searchPlaceholder="Type to search…"
      emptyMessage="No matches"
    />
  )
}`

const COUNTRIES = [
  { value: 'it', label: 'Italy' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'us', label: 'United States' },
  { value: 'br', label: 'Brazil' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'au', label: 'Australia' },
]

export const metadata = { title: `Combobox — ${BRAND.libName}` }

export default async function ComboboxDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'options',
      type: 'ComboboxOption[]',
      required: true,
      description: t.rich('componentDocs.combobox.props.options', { code: codeTag }),
    },
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.combobox.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.combobox.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: t.rich('componentDocs.combobox.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'placeholder',
      type: 'ReactNode',
      defaultValue: "'Scegli…'",
      description: t.rich('componentDocs.combobox.props.placeholder', { code: codeTag }),
    },
    {
      name: 'searchPlaceholder',
      type: 'string',
      defaultValue: "'Cerca…'",
      description: t.rich('componentDocs.combobox.props.searchPlaceholder', { code: codeTag }),
    },
    {
      name: 'emptyMessage',
      type: 'ReactNode',
      defaultValue: "'Nessun risultato'",
      description: t.rich('componentDocs.combobox.props.emptyMessage', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.combobox.props.disabled', { code: codeTag }),
    },
    {
      name: 'id',
      type: 'string',
      description: t.rich('componentDocs.combobox.props.id', { code: codeTag }),
    },
    {
      name: 'className',
      type: 'string',
      description: t.rich('componentDocs.combobox.props.className', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Combobox</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.combobox.lead', {
          code: codeTag,
          link1: linkTag('/docs/components/select'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-xs">
          <Combobox options={COUNTRIES} placeholder="Pick a country" />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('controlled')}</h2>
      <p className="text-foreground/80 mb-3">{t('componentDocs.combobox.body.controlled')}</p>
      <Code code={CONTROLLED_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Combobox props" />

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.combobox.headings.comboboxVsSelect')}
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.combobox.vsSelect.0', { strong: strongTag })}</li>
        <li>
          {t.rich('componentDocs.combobox.vsSelect.1', {
            link1: linkTag('/docs/components/select'),
          })}
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('nativeFormSubmission')}</h2>
      <p className="text-foreground/85 mb-3">
        {t.rich('componentDocs.combobox.body.nativeFormSubmission', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          {t.rich('componentDocs.combobox.a11y.0', {
            code: codeTag,
            link1: linkTag('/docs/components/select'),
          })}
        </li>
        <li>{t.rich('componentDocs.combobox.a11y.1', { code: codeTag, kbd: kbdTag })}</li>
        <li>{t.rich('componentDocs.combobox.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/date-picker" className="text-primary underline">
          ← DatePicker
        </Link>
        <Link href="/docs/components/popover" className="text-primary underline">
          Popover →
        </Link>
      </div>
    </article>
  )
}
