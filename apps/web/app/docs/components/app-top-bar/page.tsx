import Link from 'next/link'
import { AppTopBar, AttrToggleGroup, Button } from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AppTopBar, AttrToggleGroup } from '@damo/ui'
import Link from 'next/link'`

const BASIC_SNIPPET = `<AppTopBar
  logo={<Link href="/">Brand</Link>}
  nav={
    <>
      <Link href="/docs">Docs</Link>
      <Link href="/pricing">Pricing</Link>
    </>
  }
  actions={
    <AttrToggleGroup
      label="Theme"
      storageKey="theme"
      attribute="data-theme"
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
      defaultValue="light"
    />
  }
/>`

const NON_STICKY_SNIPPET = `<AppTopBar sticky={false} logo={/* … */} />`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'logo',
    type: 'ReactNode',
    required: true,
    description: 'Branding slot. Wrap a Next link or anchor that points to home.',
  },
  {
    name: 'nav',
    type: 'ReactNode',
    description: 'Inline navigation. Renders inside a <nav> element.',
  },
  {
    name: 'actions',
    type: 'ReactNode',
    description: 'Right-aligned controls. Compose with `AttrToggleGroup`, `Popover`, etc.',
  },
  {
    name: 'sticky',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Stick the bar to the viewport top with z-index header.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the defaults.',
  },
]

export const metadata = { title: `AppTopBar — ${BRAND.libName}` }

export default function AppTopBarDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        LAYOUT
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AppTopBar</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Site header with three slots: brand, navigation, and actions. Defaults to sticky top
        placement; opt out via <code className="font-mono">sticky=&#123;false&#125;</code>.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Live preview</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis">
        <AppTopBar
          sticky={false}
          logo={<span className="font-display text-base tracking-[0.18em]">DEMO</span>}
          nav={
            <>
              <span className="text-foreground/80">Docs</span>
              <span className="text-foreground/80">Pricing</span>
            </>
          }
          actions={
            <>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <AttrToggleGroup
                label="Theme"
                storageKey="docs-app-top-bar-theme"
                attribute="data-app-top-bar-theme"
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
                defaultValue="light"
              />
            </>
          }
        />
      </div>

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Non-sticky variant</h2>
      <Code code={NON_STICKY_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">API</h2>
      <PropsTable props={PROPS} caption="AppTopBar props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The header renders as a <code className="font-mono">&lt;header&gt;</code> (banner role).
        </li>
        <li>
          Wrap the brand mark in a link with an <code className="font-mono">aria-label</code> when
          the label is decorative (icon-only).
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/app-shell" className="text-primary underline">
          ← AppShell
        </Link>
        <Link href="/docs/components/page-header" className="text-primary underline">
          PageHeader →
        </Link>
      </div>
    </article>
  )
}
