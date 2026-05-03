import Link from 'next/link'
import { DisplaySettingsMenu } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { DisplaySettingsMenu } from '@damo/ui'`

const BASIC_SNIPPET = `<DisplaySettingsMenu
  paletteOptions={[
    { value: 'default', label: 'Plum+Gold' },
    { value: 'neon', label: 'Neon' },
    { value: 'sunset', label: 'Sunset' },
  ]}
  paletteDefaultValue="default"
/>`

const CUSTOM_LABELS_SNIPPET = `<DisplaySettingsMenu
  paletteOptions={paletteOptions}
  paletteDefaultValue="default"
  triggerLabel="Impostazioni"
  themeLabel="Modalità"
  paletteLabel="Schema colore"
  densityLabel="Spaziatura"
/>`

const CUSTOM_KEYS_SNIPPET = `<DisplaySettingsMenu
  paletteOptions={paletteOptions}
  // Defaults match the legacy ThemeSwitcher / PaletteSwitcher /
  // DensitySwitcher so persisted values carry over without migration.
  themeStorageKey="theme"      // default
  paletteStorageKey="palette"  // default
  densityStorageKey="density"  // default
  themeAttribute="data-theme"  // default
  paletteAttribute="data-palette"
  densityAttribute="data-density"
/>`

const PALETTE_OPTIONS = [
  { value: 'default', label: 'Plum+Gold' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
]

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'paletteOptions',
    type: 'DisplaySettingsOption[]',
    required: true,
    description:
      'List of palettes the consumer wants to expose. Required — there is no implicit default set, mirroring PaletteSwitcher.',
  },
  {
    name: 'paletteDefaultValue',
    type: 'string',
    description: 'Initial palette when nothing is persisted. Defaults to the first option.',
  },
  {
    name: 'paletteStorageKey',
    type: 'string',
    defaultValue: "'palette'",
    description: 'localStorage key for the palette selection.',
  },
  {
    name: 'paletteAttribute',
    type: 'string',
    defaultValue: "'data-palette'",
    description: 'Attribute mirrored on <html>.',
  },
  {
    name: 'themeOptions',
    type: 'DisplaySettingsOption[]',
    defaultValue: '[Light, Dark]',
    description: 'Items in the Theme radio group.',
  },
  {
    name: 'themeDefaultValue',
    type: 'string',
    defaultValue: "'light'",
    description: 'Initial theme when nothing is persisted.',
  },
  {
    name: 'themeStorageKey',
    type: 'string',
    defaultValue: "'theme'",
    description: 'localStorage key for the theme selection.',
  },
  {
    name: 'themeAttribute',
    type: 'string',
    defaultValue: "'data-theme'",
    description: 'Attribute mirrored on <html>.',
  },
  {
    name: 'densityOptions',
    type: 'DisplaySettingsOption[]',
    defaultValue: '[Compatta, Normale, Ampia]',
    description: 'Items in the Density radio group.',
  },
  {
    name: 'densityDefaultValue',
    type: 'string',
    defaultValue: "'normal'",
    description: 'Initial density when nothing is persisted.',
  },
  {
    name: 'densityStorageKey',
    type: 'string',
    defaultValue: "'density'",
    description: 'localStorage key for the density selection.',
  },
  {
    name: 'densityAttribute',
    type: 'string',
    defaultValue: "'data-density'",
    description: 'Attribute mirrored on <html>.',
  },
  {
    name: 'triggerLabel',
    type: 'string',
    defaultValue: "'Display settings'",
    description: 'Accessible label on the cog icon trigger.',
  },
  {
    name: 'themeLabel',
    type: 'string',
    defaultValue: "'Theme'",
    description: 'Header label above the Theme radio group.',
  },
  {
    name: 'paletteLabel',
    type: 'string',
    defaultValue: "'Palette'",
    description: 'Header label above the Palette radio group.',
  },
  {
    name: 'densityLabel',
    type: 'string',
    defaultValue: "'Density'",
    description: 'Header label above the Density radio group.',
  },
]

export const metadata = { title: `DisplaySettingsMenu — ${BRAND.libName}` }

export default function DisplaySettingsMenuDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">DisplaySettingsMenu</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        A single icon-button trigger that opens a dropdown menu containing three labelled radio
        groups for theme, palette, and density. Internally re-uses the same persistence wiring as
        the standalone switchers, so user preferences carry over without migration.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage</h2>
      <p className="text-foreground/80 mb-3">
        Drop it into the <code className="font-mono">actions</code> slot of the{' '}
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          AppTopBar
        </Link>
        . Default storage keys (<code className="font-mono">theme</code>,{' '}
        <code className="font-mono">palette</code>, <code className="font-mono">density</code>) and
        HTML attributes (<code className="font-mono">data-theme</code>, …) match the legacy sibling
        switchers, so existing localStorage selections keep working.
      </p>
      <Example code={BASIC_SNIPPET}>
        <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} paletteDefaultValue="default" />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Custom labels</h2>
      <p className="text-foreground/80 mb-3">
        Localize the trigger and group labels for non-English UIs.
      </p>
      <Code code={CUSTOM_LABELS_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Custom storage keys</h2>
      <p className="text-foreground/80 mb-3">
        Override the persistence keys when running multiple instances on the same origin (e.g. a
        preview frame inside the design system).
      </p>
      <Code code={CUSTOM_KEYS_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="DisplaySettingsMenu props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-1 text-foreground/85">
        <li>
          The trigger is a button with a configurable <code className="font-mono">aria-label</code>{' '}
          (default: &ldquo;Display settings&rdquo;).
        </li>
        <li>
          The popover is a Radix <code className="font-mono">DropdownMenu</code>; full keyboard
          interaction (Enter / Space to open, Arrow keys to traverse, Escape to close) and focus
          management are inherited.
        </li>
        <li>
          Radio items expose <code className="font-mono">role=&quot;menuitemradio&quot;</code> with{' '}
          <code className="font-mono">aria-checked</code> and are grouped under non-interactive
          labels.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">When to use</h2>
      <p className="text-foreground/80 mb-3">
        Reach for <code className="font-mono">DisplaySettingsMenu</code> when the topbar is
        space-constrained or hosts other primary actions. If the surface is dedicated to display
        controls (e.g. the Theme Generator&apos;s sidebar), the standalone{' '}
        <Link href="/docs/components/theme-switcher" className="text-primary underline">
          Theme Switchers
        </Link>{' '}
        keep choices visible without an extra click.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/theme-switcher" className="text-primary underline">
          ← Theme Switchers
        </Link>
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          AppTopBar →
        </Link>
      </div>
    </article>
  )
}
