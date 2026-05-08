import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Combobox } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Combobox } from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'options',
    type: 'ComboboxOption[]',
    required: true,
    description: 'Items to render — `{ value, label, disabled? }`.',
  },
  {
    name: 'value',
    type: 'string',
    description: 'Controlled selected value. Pair with `onValueChange`.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Uncontrolled initial selected value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires when an option is picked.',
  },
  {
    name: 'placeholder',
    type: 'ReactNode',
    defaultValue: "'Scegli…'",
    description: 'Trigger text shown when nothing is selected.',
  },
  {
    name: 'searchPlaceholder',
    type: 'string',
    defaultValue: "'Cerca…'",
    description: 'Placeholder inside the search input.',
  },
  {
    name: 'emptyMessage',
    type: 'ReactNode',
    defaultValue: "'Nessun risultato'",
    description: 'Shown when the search yields no results.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables the trigger.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'id forwarded to the trigger button (label association).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes merged onto the trigger.',
  },
]

export const metadata = { title: `Combobox — ${BRAND.libName}` }

export default async function ComboboxDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
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
      <p className="text-foreground/80 mb-3">
        Manage the selection externally for validation or persistence.
      </p>
      <Code code={CONTROLLED_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Combobox props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Combobox vs Select</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Reach for <strong>Combobox</strong> when the option list is long enough that scrolling
          alone is friction (≥ ~10 options) or when users will search by typed input.
        </li>
        <li>
          Reach for{' '}
          <Link href="/docs/components/select" className="text-primary underline">
            Select
          </Link>{' '}
          for short lists (2-9 items) where keyboard arrow navigation is sufficient.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('nativeFormSubmission')}</h2>
      <p className="text-foreground/85 mb-3">
        Combobox renders a <code className="font-mono">&lt;button&gt;</code> + popover with no
        hidden form input and no <code className="font-mono">name</code> prop. To submit through a
        traditional <code className="font-mono">&lt;form&gt;</code>, manage the value with React
        state and either render your own hidden input or read it from the submit handler.
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The trigger is a plain <code className="font-mono">&lt;button&gt;</code> (no{' '}
          <code className="font-mono">role=&quot;combobox&quot;</code>) with{' '}
          <code className="font-mono">aria-expanded</code> reflecting the popover state. This is a
          button-plus-popover pattern, not the full WAI-ARIA combobox pattern that{' '}
          <Link href="/docs/components/select" className="text-primary underline">
            Select
          </Link>{' '}
          provides.
        </li>
        <li>
          The dropdown list is rendered by <code className="font-mono">cmdk</code>: type to filter,
          arrows to move, <kbd>Enter</kbd> to select, <kbd>Esc</kbd> to close.
        </li>
        <li>
          Use <code className="font-mono">FormField</code> or pair{' '}
          <code className="font-mono">id</code> with a sibling{' '}
          <code className="font-mono">Label</code> so screen readers announce the field name.
        </li>
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
