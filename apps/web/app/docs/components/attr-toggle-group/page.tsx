import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { AttrToggleGroup } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AttrToggleGroup } from '@damo/ui'`

const SEGMENTED_SNIPPET = `<AttrToggleGroup
  label="Tone"
  variant="segmented"
  options={[
    { value: 'soft', label: 'Soft' },
    { value: 'bold', label: 'Bold' },
    { value: 'mono', label: 'Mono' },
  ]}
  storageKey="docs-tone"
  attribute="data-docs-tone"
  defaultValue="soft"
/>`

const SELECT_SNIPPET = `<AttrToggleGroup
  label="Palette"
  variant="select"
  options={[
    { value: 'plum', label: 'Plum' },
    { value: 'neon', label: 'Neon' },
    { value: 'sunset', label: 'Sunset' },
  ]}
  storageKey="docs-palette"
  attribute="data-docs-palette"
  defaultValue="plum"
/>`

const HEADLESS_SNIPPET = `<AttrToggleGroup
  // Omit \`label\` to render just the control — useful when the
  // surrounding UI already provides a heading.
  options={DENSITY_OPTIONS}
  storageKey="density"
  attribute="data-density"
  defaultValue="normal"
/>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'options',
    type: 'AttrToggleOption[]',
    required: true,
    description: 'List of `{ value, label }` pairs the user can pick from.',
  },
  {
    name: 'storageKey',
    type: 'string',
    required: true,
    description: 'localStorage key that persists the active value across sessions.',
  },
  {
    name: 'attribute',
    type: 'string',
    required: true,
    description:
      'data-* attribute mirrored on `<html>`. Must match `^data-[a-z][a-z0-9-]*$` — non-data attributes are rejected.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    description: 'Initial value when nothing is persisted. Falls back to `options[0].value`.',
  },
  {
    name: 'label',
    type: 'string',
    description:
      'Optional eyebrow label rendered before the control. When provided, the inner group is wired with `aria-labelledby` to the eyebrow id.',
  },
  {
    name: 'variant',
    type: "'segmented' | 'select'",
    defaultValue: "'segmented'",
    description:
      '`segmented` is a Memphis-bordered button row; `select` swaps to the design-system Select dropdown.',
  },
  {
    name: 'labelId',
    type: 'string',
    description:
      'Override the auto-generated id for the eyebrow label. Use when you need to wire your own external label.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Tailwind classes merged on top of the wrapper defaults.',
  },
]

export const metadata = { title: `AttrToggleGroup — ${BRAND.libName}` }

export default async function AttrToggleGroupDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">AttrToggleGroup</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.attr-toggle-group.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Segmented variant</h2>
      <p className="text-foreground/80 mb-3">
        Default visual: a Memphis-bordered button row with{' '}
        <code className="font-mono">aria-pressed</code> on each option and a{' '}
        <code className="font-mono">role=&quot;group&quot;</code> wrapper labelled by the eyebrow.
      </p>
      <Example code={SEGMENTED_SNIPPET}>
        <AttrToggleGroup
          label="Tone"
          variant="segmented"
          options={[
            { value: 'soft', label: 'Soft' },
            { value: 'bold', label: 'Bold' },
            { value: 'mono', label: 'Mono' },
          ]}
          storageKey="docs-tone"
          attribute="data-docs-tone"
          defaultValue="soft"
        />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Select variant</h2>
      <p className="text-foreground/80 mb-3">
        Use when the option list is too long for a button row, or when the surface is
        space-constrained.
      </p>
      <Example code={SELECT_SNIPPET}>
        <AttrToggleGroup
          label="Palette"
          variant="select"
          options={[
            { value: 'plum', label: 'Plum' },
            { value: 'neon', label: 'Neon' },
            { value: 'sunset', label: 'Sunset' },
          ]}
          storageKey="docs-palette"
          attribute="data-docs-palette"
          defaultValue="plum"
        />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Without an eyebrow label</h2>
      <p className="text-foreground/80 mb-3">
        Drop the <code className="font-mono">label</code> prop when the surrounding UI already
        provides a heading.
      </p>
      <Code code={HEADLESS_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Sanitisation</h2>
      <p className="text-foreground/80 mb-3">
        If a previously persisted value is no longer in <code className="font-mono">options</code>{' '}
        (e.g. you renamed a palette), the hook resets it to{' '}
        <code className="font-mono">defaultValue</code> on mount, then writes the corrected value
        back to <code className="font-mono">localStorage</code> and to the{' '}
        <code className="font-mono">data-*</code> attribute. The user never sees a flash of stale
        state.
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="AttrToggleGroup props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The segmented variant wraps options in{' '}
          <code className="font-mono">role=&quot;group&quot;</code>; when{' '}
          <code className="font-mono">label</code> is set, the group is labelled via{' '}
          <code className="font-mono">aria-labelledby</code> pointing to the eyebrow id.
        </li>
        <li>
          Each segmented button is a native <code className="font-mono">&lt;button&gt;</code> with{' '}
          <code className="font-mono">aria-pressed</code> reflecting the active state.
        </li>
        <li>
          The select variant exposes <code className="font-mono">role=&quot;combobox&quot;</code>{' '}
          via the design-system <code className="font-mono">Select</code> primitive — full keyboard
          interaction is inherited.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/pagination" className="text-primary underline">
          ← Pagination
        </Link>
        <Link href="/docs/components/avatar" className="text-primary underline">
          Avatar →
        </Link>
      </div>
    </article>
  )
}
