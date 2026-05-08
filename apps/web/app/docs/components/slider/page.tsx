import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Slider } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import { Slider } from '@damo/ui'`

const BASIC_SNIPPET = `<Slider defaultValue={[40]} max={100} step={1} />`
const RANGE_SNIPPET = `<Slider defaultValue={[20, 80]} max={100} step={1} />`
const VERTICAL_SNIPPET = `<div className="h-40">
  <Slider
    defaultValue={[60]}
    orientation="vertical"
    max={100}
    step={1}
  />
</div>`

export const metadata = { title: `Slider — ${BRAND.libName}` }

export default async function SliderDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'number[]',
      description: t.rich('componentDocs.slider.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'number[]',
      description: t.rich('componentDocs.slider.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(values: number[]) => void',
      description: t.rich('componentDocs.slider.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'min',
      type: 'number',
      defaultValue: '0',
      description: t.rich('componentDocs.slider.props.min', { code: codeTag }),
    },
    {
      name: 'max',
      type: 'number',
      defaultValue: '100',
      description: t.rich('componentDocs.slider.props.max', { code: codeTag }),
    },
    {
      name: 'step',
      type: 'number',
      defaultValue: '1',
      description: t.rich('componentDocs.slider.props.step', { code: codeTag }),
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'horizontal'",
      description: t.rich('componentDocs.slider.props.orientation', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.slider.props.disabled', { code: codeTag }),
    },
    {
      name: 'inverted',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.slider.props.inverted', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Slider</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.slider.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Single thumb</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md">
          <Slider defaultValue={[40]} max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Range slider</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.slider.body.rangeIntro', { code: codeTag })}
      </p>
      <Example code={RANGE_SNIPPET}>
        <div className="w-full max-w-md">
          <Slider defaultValue={[20, 80]} max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.slider.body.verticalIntro', { code: codeTag })}
      </p>
      <Example code={VERTICAL_SNIPPET}>
        <div className="h-40">
          <Slider defaultValue={[60]} orientation="vertical" max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Slider props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.slider.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.slider.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.slider.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/switch" className="text-primary underline">
          ← Switch
        </Link>
        <Link href="/docs/components/segmented-control" className="text-primary underline">
          SegmentedControl →
        </Link>
      </div>
    </article>
  )
}
