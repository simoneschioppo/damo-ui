import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import { AttrToggleGroup } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { AttrToggleGroup } from '@axologic/ui'`

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
    { value: 'cyberpunk', label: 'Cyberpunk' },
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

export const metadata = { title: `AttrToggleGroup — ${BRAND.libName}` }

export default async function AttrToggleGroupDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'options',
      type: 'AttrToggleOption[]',
      required: true,
      description: t.rich('componentDocs.attr-toggle-group.props.options', { code: codeTag }),
    },
    {
      name: 'storageKey',
      type: 'string',
      required: true,
      description: t('componentDocs.attr-toggle-group.props.storageKey'),
    },
    {
      name: 'attribute',
      type: 'string',
      required: true,
      description: t.rich('componentDocs.attr-toggle-group.props.attribute', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.attr-toggle-group.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'label',
      type: 'string',
      description: t.rich('componentDocs.attr-toggle-group.props.label', { code: codeTag }),
    },
    {
      name: 'variant',
      type: "'segmented' | 'select'",
      defaultValue: "'segmented'",
      description: t.rich('componentDocs.attr-toggle-group.props.variant', { code: codeTag }),
    },
    {
      name: 'labelId',
      type: 'string',
      description: t('componentDocs.attr-toggle-group.props.labelId'),
    },
    {
      name: 'className',
      type: 'string',
      description: t('componentDocs.attr-toggle-group.props.className'),
    },
  ]
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
        {t.rich('componentDocs.attr-toggle-group.body.segmentedIntro', { code: codeTag })}
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
        {t('componentDocs.attr-toggle-group.body.selectIntro')}
      </p>
      <Example code={SELECT_SNIPPET}>
        <AttrToggleGroup
          label="Palette"
          variant="select"
          options={[
            { value: 'plum', label: 'Plum' },
            { value: 'cyberpunk', label: 'Cyberpunk' },
            { value: 'sunset', label: 'Sunset' },
          ]}
          storageKey="docs-palette"
          attribute="data-docs-palette"
          defaultValue="plum"
        />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Without an eyebrow label</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.attr-toggle-group.body.headlessIntro', { code: codeTag })}
      </p>
      <Code code={HEADLESS_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Sanitisation</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.attr-toggle-group.body.sanitisationIntro', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="AttrToggleGroup props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.attr-toggle-group.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.attr-toggle-group.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.attr-toggle-group.a11y.2', { code: codeTag })}</li>
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
