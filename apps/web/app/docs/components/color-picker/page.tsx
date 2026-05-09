import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import {
  ColorPickerBasicExample,
  ColorPickerNoInputExample,
  ColorPickerNoLabelExample,
} from './_examples'

const IMPORT_SNIPPET = `import { ColorPicker } from 'damo-ui'`

const BASIC_SNIPPET = `function Example() {
  const [color, setColor] = useState('#7a3980')
  return <ColorPicker label="Accent" value={color} onChange={setColor} />
}`

const NO_INPUT_SNIPPET = `<ColorPicker
  label="Accent"
  value={color}
  onChange={setColor}
  showInput={false}
/>`

const NO_LABEL_SNIPPET = `<ColorPicker
  label="Background"
  value={color}
  onChange={setColor}
  showLabel={false}
/>`

export const metadata = { title: `ColorPicker — ${BRAND.libName}` }

export default async function ColorPickerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: t.rich('componentDocs.color-picker.props.label', { code: codeTag }),
    },
    {
      name: 'value',
      type: 'string',
      required: true,
      description: t.rich('componentDocs.color-picker.props.value', { code: codeTag }),
    },
    {
      name: 'onChange',
      type: '(next: string) => void',
      required: true,
      description: t.rich('componentDocs.color-picker.props.onChange', { code: codeTag }),
    },
    {
      name: 'showInput',
      type: 'boolean',
      defaultValue: 'true',
      description: t.rich('componentDocs.color-picker.props.showInput', { code: codeTag }),
    },
    {
      name: 'showLabel',
      type: 'boolean',
      defaultValue: 'true',
      description: t.rich('componentDocs.color-picker.props.showLabel', { code: codeTag }),
    },
    {
      name: 'id',
      type: 'string',
      description: t.rich('componentDocs.color-picker.props.id', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('cardsAndDecoration')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">ColorPicker</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.color-picker.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic — swatch + hex input</h2>
      <Example code={BASIC_SNIPPET}>
        <ColorPickerBasicExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Hide the hex input</h2>
      <Example code={NO_INPUT_SNIPPET}>
        <ColorPickerNoInputExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Hide the visible label</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.color-picker.body.hideVisibleLabel', { code: codeTag })}
      </p>
      <Example code={NO_LABEL_SNIPPET}>
        <ColorPickerNoLabelExample />
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="ColorPicker props" />

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/sidebar" className="text-primary underline">
          ← Sidebar
        </Link>
        <Link href="/docs/components/user-card" className="text-primary underline">
          UserCard →
        </Link>
      </div>
    </article>
  )
}
