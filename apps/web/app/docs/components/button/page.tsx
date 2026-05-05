import Link from 'next/link'
import { Button, IconButton, ArrowRightIcon, BoltIcon, CogIcon } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Button, IconButton } from '@damo/ui'`

const BASIC_SNIPPET = `<Button variant="primary">Save</Button>
<Button variant="ghost">Cancel</Button>`

const SIZES_SNIPPET = `<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`

const DISABLED_SNIPPET = `<Button variant="primary" disabled>
  Save
</Button>`

const FULL_WIDTH_SNIPPET = `<Button variant="primary" fullWidth>
  Continue
</Button>`

const AS_LINK_SNIPPET = `import Link from 'next/link'
import { Button } from '@damo/ui'

// Render the Link as a Button. All variant, size, and animation
// classes — including the Memphis press effect on :active — are
// merged onto the underlying <a>.
<Button asChild variant="primary" size="lg">
  <Link href="/docs">Browse docs</Link>
</Button>`

const ICON_INLINE_SNIPPET = `<Button variant="ghost">
  <ArrowRightIcon size={14} /> Continue
</Button>`

const ICON_BUTTON_SNIPPET = `<IconButton aria-label="Settings" variant="ghost">
  <CogIcon size={18} />
</IconButton>`

const ICON_BUTTON_VARIANTS_SNIPPET = `<IconButton aria-label="Continue" variant="primary">
  <ArrowRightIcon size={18} />
</IconButton>
<IconButton aria-label="Quick action" variant="outline">
  <BoltIcon size={18} />
</IconButton>
<IconButton aria-label="Settings" variant="ghost">
  <CogIcon size={18} />
</IconButton>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'",
    defaultValue: "'primary'",
    description:
      'Visual style. Primary/secondary use the brand accents; outline and ghost are neutral; destructive surfaces destructive intent; link reduces to an inline anchor.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg' | 'icon'",
    defaultValue: "'md'",
    description:
      'Adjusts vertical padding and font size. `icon` is a 40×40 square — used internally by `IconButton`.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'On a real <button>, blocks pointer / keyboard activation. With asChild on a non-button child, only the disabled CSS utilities apply — set aria-disabled and remove href on the child for full inertness.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Stretches the button to the full width of its container.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'When true, render the child element with all Button styles applied (Radix Slot pattern). The child must be a single React element such as a <Link> or <a>.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes are merged on top of the variant defaults.',
  },
]

const ICON_BUTTON_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'aria-label',
    type: 'string',
    required: true,
    description:
      'IconButtons have no visible text, so every instance MUST carry a non-empty `aria-label` for screen readers. The TypeScript signature enforces this.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'A single icon node — typically one of the icons exported from `@damo/ui`.',
  },
  {
    name: 'variant',
    type: "'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'link'",
    defaultValue: "'primary'",
    description: 'Same six variants as Button. The size is locked to the 40×40 `icon` preset.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Blocks pointer and keyboard activation.',
  },
]

export const metadata = {
  title: `Button & IconButton — ${BRAND.libName}`,
  description: 'Memphis-styled button + icon-only variant.',
}

export default function ButtonDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        ACTIONS &amp; SURFACES
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Button</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Bordered, shadowed action surface. Six variants, three sizes plus the dedicated icon size,
        full keyboard access via a native <code className="font-mono">&lt;button&gt;</code>. Pair
        with <code className="font-mono">IconButton</code> (documented below) for icon-only triggers
        — same chrome, locked to a 40×40 square.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Usage</h2>
      <Example code={BASIC_SNIPPET}>
        <Button variant="primary">Save</Button>
        <Button variant="ghost">Cancel</Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Sizes</h2>
      <Example code={SIZES_SNIPPET}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="md">
          Medium
        </Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">With inline icons</h2>
      <p className="text-foreground/80 mb-3">
        Place an icon inside the Button alongside text. Keep the visible label so the action stays
        announce-able.
      </p>
      <Example code={ICON_INLINE_SNIPPET}>
        <Button variant="ghost">
          <ArrowRightIcon size={14} /> Continue
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Disabled</h2>
      <Example code={DISABLED_SNIPPET}>
        <Button variant="primary" disabled>
          Save
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Full width</h2>
      <p className="text-foreground/80 mb-3">
        Stretch the button to the container — useful inside narrow forms or mobile sheets.
      </p>
      <Example code={FULL_WIDTH_SNIPPET} previewClassName="px-6 py-10">
        <div className="w-full max-w-sm">
          <Button variant="primary" fullWidth>
            Continue
          </Button>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Use as a link</h2>
      <p className="text-foreground/80 mb-3">
        Pass <code className="font-mono">asChild</code> to render a single child element with all
        Button styles applied (Radix <code className="font-mono">Slot</code> pattern). Useful for
        navigation CTAs that need both the Memphis press animation and routing — the variant
        classes, hover lift, and active-press collapse are all merged onto the underlying{' '}
        <code className="font-mono">&lt;a&gt;</code>.
      </p>
      <Example code={AS_LINK_SNIPPET}>
        <Button asChild variant="primary" size="lg">
          <Link href="/docs">Browse docs</Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/theme-generator">Open theme generator</Link>
        </Button>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Button API</h2>
      <PropsTable props={PROPS} caption="Button props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Renders a native <code className="font-mono">&lt;button type=&quot;button&quot;&gt;</code>
          ; pass <code className="font-mono">type=&quot;submit&quot;</code> when used inside a form.
        </li>
        <li>
          Always provide a non-empty label. For icon-only triggers use{' '}
          <code className="font-mono">IconButton</code> (documented below) with an{' '}
          <code className="font-mono">aria-label</code>.
        </li>
        <li>
          <code className="font-mono">disabled</code> blocks both pointer and keyboard activation on
          a real <code className="font-mono">&lt;button&gt;</code>. With{' '}
          <code className="font-mono">asChild</code>, only the disabled CSS utilities apply — for a
          fully inactive link also remove <code className="font-mono">href</code> or set{' '}
          <code className="font-mono">aria-disabled=&quot;true&quot;</code> on the child.
        </li>
      </ul>

      {/* ────────────────────────────────────────────────────────────
           IconButton (same family — documented on this page)
           ──────────────────────────────────────────────────────── */}
      <hr className="my-16 border-t-2 border-memphis" />

      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        SAME FAMILY
      </div>
      <h2 className="font-display text-4xl leading-[0.95] mb-4">IconButton</h2>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-8">
        A square 40×40 button for icon-only actions. Composes{' '}
        <code className="font-mono">Button</code> with{' '}
        <code className="font-mono">size=&quot;icon&quot;</code> and the same Memphis press effect;{' '}
        <code className="font-mono">aria-label</code> is required so the action is announced.
      </p>

      <h3 className="font-display text-xl mb-3">Basic usage</h3>
      <Example code={ICON_BUTTON_SNIPPET}>
        <IconButton aria-label="Settings" variant="ghost">
          <CogIcon size={18} />
        </IconButton>
      </Example>

      <h3 className="font-display text-xl mb-3 mt-10">Variants</h3>
      <p className="text-foreground/80 mb-3">
        Same six variants as Button. The icon-only version of{' '}
        <code className="font-mono">link</code> is rarely useful; reach for{' '}
        <code className="font-mono">ghost</code> instead.
      </p>
      <Example code={ICON_BUTTON_VARIANTS_SNIPPET}>
        <IconButton aria-label="Continue" variant="primary">
          <ArrowRightIcon size={18} />
        </IconButton>
        <IconButton aria-label="Quick action" variant="outline">
          <BoltIcon size={18} />
        </IconButton>
        <IconButton aria-label="Settings" variant="ghost">
          <CogIcon size={18} />
        </IconButton>
      </Example>

      <h3 className="font-display text-xl mb-3 mt-10">IconButton API</h3>
      <PropsTable props={ICON_BUTTON_PROPS} caption="IconButton props" />

      <h3 className="font-display text-xl mb-3 mt-10">Accessibility</h3>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          <code className="font-mono">aria-label</code> is required and must be non-empty. The
          TypeScript signature enforces this — passing{' '}
          <code className="font-mono">aria-label=&quot;&quot;</code> is a type error.
        </li>
        <li>
          The icon child is rendered visually only; ensure the surrounding context doesn&rsquo;t
          rely on the icon being announced (it is not).
        </li>
        <li>
          The 40×40 square satisfies WCAG 2.5.8 (Level AA, WCAG 2.2), which requires a 24×24 CSS
          pixel minimum. To reach the 44×44 threshold of WCAG 2.5.5 (Level AAA), wrap the button
          with a 4px margin or add hit-slop on the parent.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/form-field" className="text-primary underline">
          ← FormField
        </Link>
        <Link href="/docs/components/card" className="text-primary underline">
          Card →
        </Link>
      </div>
    </article>
  )
}
