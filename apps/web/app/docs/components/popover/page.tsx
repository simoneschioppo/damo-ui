import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  Button,
  IconButton,
  CogIcon,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '@damo/ui'`

const BASIC_SNIPPET = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <h3 className="font-display text-lg mb-2">Quick settings</h3>
    <p className="text-sm text-muted-foreground mb-3">
      A non-modal floating panel anchored to the trigger.
    </p>
    <PopoverClose asChild>
      <Button size="sm" variant="ghost">Close</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>`

const ALIGN_SNIPPET = `<PopoverContent align="start" sideOffset={8}>…</PopoverContent>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state on the root.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    description: 'Uncontrolled initial open state on the root.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires when the open state changes.',
  },
  {
    name: 'modal',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, focus is trapped while open and outside content is inert. Default is false (non-modal).',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'center'",
    description: 'Prop on `PopoverContent`. Alignment of the content relative to the trigger.',
  },
  {
    name: 'side',
    type: "'top' | 'right' | 'bottom' | 'left'",
    defaultValue: "'bottom'",
    description:
      'Prop on `PopoverContent`. Preferred edge to anchor against. Radix flips automatically when there is no room.',
  },
  {
    name: 'sideOffset',
    type: 'number',
    defaultValue: '6',
    description: 'Gap between trigger and content.',
  },
]

export const metadata = { title: `Popover — ${BRAND.libName}` }

export default async function PopoverDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Popover</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Non-modal floating panel anchored to a trigger. Built on Radix Popover, painted with the
        same Memphis chrome as <code className="font-mono">DropdownMenu</code> and{' '}
        <code className="font-mono">Dialog</code> so floating surfaces feel consistent. Use it as
        the generic container for preferences, mini-editors, search results, or any{' '}
        <em>non-menu</em> floating content. For an action-list with the full ARIA menu pattern reach
        for{' '}
        <Link href="/docs/components/dropdown-menu" className="text-primary underline">
          DropdownMenu
        </Link>
        .
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('live')}</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <h3 className="font-display text-lg mb-2">Quick settings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A non-modal floating panel anchored to the trigger.
            </p>
            <PopoverClose asChild>
              <Button size="sm" variant="ghost">
                Close
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <IconButton aria-label="Quick settings" variant="ghost">
              <CogIcon size={18} />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <p className="text-sm text-muted-foreground">
              IconButton triggers work too — pair them with{' '}
              <code className="font-mono">aria-label</code>.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Alignment</h2>
      <p className="text-foreground/80 mb-3">
        Use <code className="font-mono">align</code> for inline alignment and{' '}
        <code className="font-mono">side</code> / <code className="font-mono">sideOffset</code> for
        the anchor edge.
      </p>
      <Code code={ALIGN_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Popover props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Popover vs DropdownMenu vs Dialog</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          <strong>Popover</strong> — a free-form floating panel. Use it for forms, search results,
          help text, mini-editors.
        </li>
        <li>
          <Link href="/docs/components/dropdown-menu" className="text-primary underline">
            DropdownMenu
          </Link>{' '}
          — a list of <em>actions</em> with full keyboard wiring (arrow keys cycle items). Reach for
          it whenever the content is a menu.
        </li>
        <li>
          <Link href="/docs/components/dialog" className="text-primary underline">
            Dialog
          </Link>{' '}
          — a modal centred on the screen. Reach for it when the user must finish a task before
          continuing.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Trigger inherits Radix <code className="font-mono">aria-expanded</code> /{' '}
          <code className="font-mono">aria-controls</code>.
        </li>
        <li>
          Default <code className="font-mono">modal=false</code> — focus is not trapped, and clicks
          outside dismiss the panel. Set <code className="font-mono">modal=true</code> when the
          popover hosts a complete task that should block other interactions.
        </li>
        <li>
          Use <code className="font-mono">PopoverClose</code> on close affordances inside the
          content so focus returns to the trigger.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/combobox" className="text-primary underline">
          ← Combobox
        </Link>
        <Link href="/docs/components/tooltip" className="text-primary underline">
          Tooltip →
        </Link>
      </div>
    </article>
  )
}
