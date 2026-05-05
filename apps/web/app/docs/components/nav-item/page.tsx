import Link from 'next/link'
import { NavItem, CogIcon, BoltIcon, HeartIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { NavItem } from '@damo/ui'`

const BASIC_SNIPPET = `<NavItem href="/dashboard">Dashboard</NavItem>
<NavItem href="/inbox" active>
  Inbox
</NavItem>
<NavItem href="/settings">Settings</NavItem>`

const ICON_SNIPPET = `<NavItem icon={<CogIcon size={16} />} href="/settings">
  Settings
</NavItem>`

const POLY_SNIPPET = `import Link from 'next/link'

<NavItem as={Link} href="/inbox" active>
  Inbox
</NavItem>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'as',
    type: 'ElementType',
    defaultValue: "'a'",
    description:
      'Polymorphic element. Pass `Link`, `button`, or any component to control routing semantics.',
  },
  {
    name: 'active',
    type: 'boolean',
    description:
      'When true, applies the selection chrome (gradient + outline + accent bar) and sets `aria-current="page"`.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    description: 'Optional leading icon rendered inside a 20×20 slot.',
  },
  {
    name: 'endAdornment',
    type: 'ReactNode',
    description: 'Optional trailing element — typically a Badge marking new / beta / count.',
  },
  {
    name: 'tone',
    type: "'default' | 'onDark'",
    defaultValue: "'default'",
    description:
      '`default` is the standard light/dark sidebar tone; `onDark` swaps the muted text and selection colors to the on-dark navbar palette (used inside `AppTopBar`).',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Item label.',
  },
]

export const metadata = { title: `NavItem — ${BRAND.libName}` }

export default function NavItemDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        NAVIGATION
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">NavItem</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Sidebar-row primitive used by the Damo UI docs nav and any sidebar that needs the unified
        selection chrome (gradient + 1px inset outline + 3px accent bar). Polymorphic by default via{' '}
        <code className="font-mono">as</code>.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic list</h2>
      <Example code={BASIC_SNIPPET}>
        <nav className="w-full max-w-xs flex flex-col gap-px">
          <NavItem as="span" className="px-3 py-1.5 text-[13px]">
            Dashboard
          </NavItem>
          <NavItem as="span" active className="px-3 py-1.5 text-[13px]">
            Inbox
          </NavItem>
          <NavItem as="span" className="px-3 py-1.5 text-[13px]">
            Settings
          </NavItem>
        </nav>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With icons + adornment</h2>
      <Example code={ICON_SNIPPET}>
        <nav className="w-full max-w-xs flex flex-col gap-px">
          <NavItem as="span" icon={<CogIcon size={16} />} className="px-3 py-1.5 text-[13px]">
            Settings
          </NavItem>
          <NavItem
            as="span"
            icon={<BoltIcon size={16} />}
            endAdornment={
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.1em] border border-memphis text-muted-foreground">
                NEW
              </span>
            }
            className="px-3 py-1.5 text-[13px]"
          >
            Quick action
          </NavItem>
          <NavItem
            as="span"
            icon={<HeartIcon size={16} />}
            active
            className="px-3 py-1.5 text-[13px]"
          >
            Favourites
          </NavItem>
        </nav>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Polymorphic — render as Link</h2>
      <p className="text-foreground/80 mb-3">
        Pass any element via <code className="font-mono">as</code>. NavItem forwards{' '}
        <code className="font-mono">aria-current</code> when{' '}
        <code className="font-mono">active</code> is true regardless of the rendered tag.
      </p>
      <Code code={POLY_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="NavItem props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          When <code className="font-mono">active</code> is set, NavItem applies{' '}
          <code className="font-mono">aria-current=&quot;page&quot;</code> — the canonical signal
          for &quot;you are here&quot; in a navigation list.
        </li>
        <li>
          Default render is <code className="font-mono">&lt;a&gt;</code>; for client-side routing
          pass <code className="font-mono">as={`{Link}`}</code> (Next) or your router&rsquo;s link
          component. The selection chrome and class merging are preserved.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/context-menu" className="text-primary underline">
          ← ContextMenu
        </Link>
        <Link href="/docs/components/breadcrumbs" className="text-primary underline">
          Breadcrumbs →
        </Link>
      </div>
    </article>
  )
}
