import Link from 'next/link'
import { ThemeSwitcher, PaletteSwitcher, DensitySwitcher } from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  ThemeSwitcher,
  PaletteSwitcher,
  DensitySwitcher,
} from '@damo/ui'`

const THEME_SNIPPET = `<ThemeSwitcher />`

const PALETTE_SNIPPET = `<PaletteSwitcher
  options={[
    { value: 'default', label: 'Plum+Gold' },
    { value: 'neon', label: 'Neon' },
    { value: 'sunset', label: 'Sunset' },
  ]}
  defaultValue="default"
/>`

const DENSITY_SNIPPET = `<DensitySwitcher />`

const SHARED_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'storageKey',
    type: 'string',
    description: 'localStorage key used to persist the choice.',
  },
  { name: 'attribute', type: 'string', description: 'data-attribute mirrored on <html>.' },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initial value when nothing is persisted yet.',
  },
]

const THEME_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'options',
    type: 'ThemeOption[]',
    defaultValue: '[{ light }, { dark }]',
    description: 'Buttons rendered in the toggle group.',
  },
  ...SHARED_PROPS,
]

const PALETTE_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'options',
    type: 'PaletteOption[]',
    required: true,
    description:
      'List of palettes the consumer wants to expose. No implicit default — caller decides.',
  },
  ...SHARED_PROPS,
]

export const metadata = { title: `Theme Switchers — ${BRAND.libName}` }

export default function ThemeSwitchersDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Theme Switchers</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Three sibling switchers that flip a <code className="font-mono">data-*</code> attribute on{' '}
        <code className="font-mono">&lt;html&gt;</code> and persist the choice in localStorage. They
        are independent and orthogonal — switching one never resets the others.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">ThemeSwitcher</h2>
      <p className="text-foreground/80 mb-3">
        Toggles <code className="font-mono">data-theme=&quot;light|dark&quot;</code>. Defaults to a
        Light/Dark pair; pass <code className="font-mono">options</code> to customize.
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-8 flex justify-center">
        <ThemeSwitcher />
      </div>
      <Code code={THEME_SNIPPET} lang="tsx" />
      <PropsTable props={THEME_PROPS} caption="ThemeSwitcher props" />

      <h2 className="font-display text-2xl mb-3 mt-10">PaletteSwitcher</h2>
      <p className="text-foreground/80 mb-3">
        Toggles <code className="font-mono">data-palette</code>. Renders as a Select (more options
        than the binary theme toggle). The consumer always supplies the option list.
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-8 flex justify-center">
        <PaletteSwitcher
          options={[
            { value: 'default', label: 'Plum+Gold' },
            { value: 'neon', label: 'Neon' },
            { value: 'sunset', label: 'Sunset' },
          ]}
          defaultValue="default"
        />
      </div>
      <Code code={PALETTE_SNIPPET} lang="tsx" />
      <PropsTable props={PALETTE_PROPS} caption="PaletteSwitcher props" />

      <h2 className="font-display text-2xl mb-3 mt-10">DensitySwitcher</h2>
      <p className="text-foreground/80 mb-3">
        Toggles{' '}
        <code className="font-mono">data-density=&quot;compact|normal|comfortable&quot;</code>.
        Drives <code className="font-mono">--density-scale-y</code>, which is multiplied into every
        component's vertical spacing.
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-8 flex justify-center">
        <DensitySwitcher />
      </div>
      <Code code={DENSITY_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Where to put them</h2>
      <p className="text-foreground/80">
        The natural home is the right-most <code className="font-mono">actions</code> slot of{' '}
        <Link href="/docs/components/app-top-bar" className="text-primary underline">
          AppTopBar
        </Link>
        . They can also live in a settings drawer if the navbar is space-constrained.
      </p>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/sidebar" className="text-primary underline">
          ← Sidebar
        </Link>
        <Link href="/theme-generator" className="text-primary underline">
          Open Theme Generator →
        </Link>
      </div>
    </article>
  )
}
