import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  Button,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '@damo/ui'`

const BASIC_SNIPPET = `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost">Open menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Account</DropdownMenuLabel>
    <DropdownMenuItem>
      Profile
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state on the root.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    description: 'Uncontrolled initial open state.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires when the menu opens or closes.',
  },
  {
    name: 'modal',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Prop on the root. Default modal traps focus. Set false to allow interaction with the rest of the page while open.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'center'",
    description: 'Prop on `DropdownMenuContent`. Inline alignment relative to the trigger.',
  },
  {
    name: 'side',
    type: "'top' | 'right' | 'bottom' | 'left'",
    defaultValue: "'bottom'",
    description: 'Prop on `DropdownMenuContent`. Preferred edge to anchor against.',
  },
]

export const metadata = { title: `DropdownMenu — ${BRAND.libName}` }

export default async function DropdownMenuDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">DropdownMenu</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.dropdown-menu.lead', {
          link1: linkTag('/docs/components/nav-item'),
          link2: linkTag('/docs/components/popover'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic actions</h2>
      <Example code={BASIC_SNIPPET}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Mixed item types</h2>
      <p className="text-foreground/80 mb-3">
        DropdownMenu also exposes <code className="font-mono">DropdownMenuCheckboxItem</code> and{' '}
        <code className="font-mono">DropdownMenuRadioGroup</code> +{' '}
        <code className="font-mono">DropdownMenuRadioItem</code> when the menu drives state instead
        of firing actions.
      </p>
      <Example code={`<DropdownMenuCheckboxItem checked={…}>…</DropdownMenuCheckboxItem>`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">View options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Display</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked>Show grid</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Show statusbar</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuRadioGroup value="recent">
              <DropdownMenuRadioItem value="recent">Most recent</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="alpha">A → Z</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="DropdownMenu props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Radix wires the ARIA Menu pattern: trigger gets{' '}
          <code className="font-mono">aria-haspopup</code> +{' '}
          <code className="font-mono">aria-expanded</code>; items get{' '}
          <code className="font-mono">role=&quot;menuitem&quot;</code> /{' '}
          <code className="font-mono">menuitemcheckbox</code> /{' '}
          <code className="font-mono">menuitemradio</code>.
        </li>
        <li>
          Keyboard: <kbd>Enter</kbd> / <kbd>Space</kbd> open the menu and activate items, arrows
          cycle, <kbd>Esc</kbd> closes, type-ahead jumps to the first item starting with the typed
          string.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">DropdownMenu vs ContextMenu vs Popover</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          <strong>DropdownMenu</strong> opens on click and is the standard "more actions"
          affordance.
        </li>
        <li>
          <Link href="/docs/components/context-menu" className="text-primary underline">
            ContextMenu
          </Link>{' '}
          opens on right-click of an arbitrary surface (table rows, canvas, file lists).
        </li>
        <li>
          <Link href="/docs/components/popover" className="text-primary underline">
            Popover
          </Link>{' '}
          is for free-form floating content (forms, search, help) — not a menu.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/tabs" className="text-primary underline">
          ← Tabs
        </Link>
        <Link href="/docs/components/context-menu" className="text-primary underline">
          ContextMenu →
        </Link>
      </div>
    </article>
  )
}
