import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@damo/ui'`

const BASIC_SNIPPET = `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
  <TabsContent value="billing">…</TabsContent>
</Tabs>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'value',
    type: 'string',
    description: 'Controlled active tab value.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Uncontrolled initial active tab value.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Fires when the active tab changes.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: 'Layout direction for keyboard navigation (arrow key axis).',
  },
  {
    name: 'activationMode',
    type: "'automatic' | 'manual'",
    defaultValue: "'automatic'",
    description:
      '`automatic` activates a tab on focus; `manual` requires Enter/Space — useful when switching tabs is expensive.',
  },
]

export const metadata = { title: `Tabs — ${BRAND.libName}` }

export default function TabsDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        NAVIGATION
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tabs</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Inline tab strip + matching content panels. Built on Radix Tabs — full keyboard wiring, ARIA
        semantics, and roving tabindex come from the primitive. Active tab is marked with a
        primary-colored 3px underline.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-xl">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <p className="text-sm text-muted-foreground">
                Overview panel. Place primary metrics, hero copy or a dashboard header here.
              </p>
            </TabsContent>
            <TabsContent value="settings">
              <p className="text-sm text-muted-foreground">
                Settings panel. Forms, preferences, integrations — all live here.
              </p>
            </TabsContent>
            <TabsContent value="billing">
              <p className="text-sm text-muted-foreground">
                Billing panel. Plan, payment method and invoice history.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props (Tabs root)</h2>
      <PropsTable props={PROPS} caption="Tabs props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Radix wires the ARIA Tabs pattern:{' '}
          <code className="font-mono">role=&quot;tablist&quot;</code>,{' '}
          <code className="font-mono">role=&quot;tab&quot;</code>, and{' '}
          <code className="font-mono">role=&quot;tabpanel&quot;</code> with{' '}
          <code className="font-mono">aria-controls</code> /{' '}
          <code className="font-mono">aria-labelledby</code> linking them.
        </li>
        <li>
          Keyboard: <kbd>Tab</kbd> moves into the tab strip; arrow keys cycle tabs; Home/End jump to
          the first/last tab. With{' '}
          <code className="font-mono">activationMode=&quot;manual&quot;</code> the focused tab is
          activated only on Enter/Space.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">Tabs vs SegmentedControl</h2>
      <p className="text-foreground/85">
        Reach for{' '}
        <Link href="/docs/components/segmented-control" className="text-primary underline">
          SegmentedControl
        </Link>{' '}
        when the user is filtering or toggling visibility within the same panel; reach for Tabs when
        each value owns a meaningfully distinct content region with its own ARIA tab panel.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/hint" className="text-primary underline">
          ← Hint
        </Link>
        <Link href="/docs/components/dropdown-menu" className="text-primary underline">
          DropdownMenu →
        </Link>
      </div>
    </article>
  )
}
