import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { DatePicker } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { DatePicker } from '@damo/ui'`

const BASIC_SNIPPET = `<DatePicker placeholder="Seleziona una data" />`

const CONTROLLED_SNIPPET = `function ControlledExample() {
  const [date, setDate] = useState<Date | undefined>()
  return <DatePicker value={date} onValueChange={setDate} />
}`

const FORMAT_SNIPPET = `<DatePicker formatStr="dd/MM/yyyy" />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'value',
    type: 'Date',
    description: 'Controlled selected date. Pair with `onValueChange`.',
  },
  {
    name: 'onValueChange',
    type: '(date: Date | undefined) => void',
    description: 'Fires when the user picks a day. Receives `undefined` when the date is cleared.',
  },
  {
    name: 'placeholder',
    type: 'ReactNode',
    defaultValue: "'Seleziona una data'",
    description: 'Trigger text shown when no date is selected.',
  },
  {
    name: 'formatStr',
    type: 'string',
    defaultValue: "'PPP'",
    description: 'date-fns format string used for the trigger label.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables the trigger.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'Forwarded to the trigger button (useful for label association).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Class name on the wrapper div.',
  },
  {
    name: 'triggerClassName',
    type: 'string',
    description: 'Class name on the trigger button itself.',
  },
]

export const metadata = { title: `DatePicker — ${BRAND.libName}` }

export default async function DatePickerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">DatePicker</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Single-date picker that pairs a Memphis-styled trigger with the{' '}
        <code className="font-mono">react-day-picker</code> calendar inside a{' '}
        <Link href="/docs/components/popover" className="text-primary underline">
          Popover
        </Link>
        . Locale defaults to Italian; pass any DayPicker prop through to override.
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
        Manage the selection externally to react to changes (validation, persistence, syncing across
        fields).
      </p>
      <Code code={CONTROLLED_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('customFormat')}</h2>
      <p className="text-foreground/80 mb-3">
        Pass any <code className="font-mono">date-fns</code> format string to{' '}
        <code className="font-mono">formatStr</code>.
      </p>
      <Code code={FORMAT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="DatePicker props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('nativeFormSubmission')}</h2>
      <p className="text-foreground/85 mb-3">
        DatePicker renders a <code className="font-mono">&lt;button&gt;</code> + popover, not a
        native <code className="font-mono">&lt;input type=&quot;date&quot;&gt;</code>, and ships no
        hidden form input. To submit the value through a traditional{' '}
        <code className="font-mono">&lt;form&gt;</code>, manage the date with React state and either
        render your own hidden input or post the value via{' '}
        <code className="font-mono">FormData</code> in the submit handler.
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The calendar inherits <code className="font-mono">react-day-picker</code>&rsquo;s ARIA
          wiring (grid + day cells with <code className="font-mono">aria-selected</code>).
        </li>
        <li>
          Wrap with <code className="font-mono">FormField</code> (or supply your own label) so the
          field is announced to screen readers.
        </li>
        <li>
          Keyboard: <kbd>Space</kbd>/<kbd>Enter</kbd> opens the popover, arrow keys navigate days,{' '}
          <kbd>Esc</kbd> closes it.
        </li>
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
