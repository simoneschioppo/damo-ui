import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@damo/ui'`

const BASIC_SNIPPET = `<Select defaultValue="medium">
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Pick a size" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="small">Small</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="large">Large</SelectItem>
  </SelectContent>
</Select>`

const GROUPED_SNIPPET = `<Select>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Pick a country" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="it">Italy</SelectItem>
      <SelectItem value="fr">France</SelectItem>
      <SelectItem value="de">Germany</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Americas</SelectLabel>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="br">Brazil</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`

export const metadata = { title: `Select — ${BRAND.libName}` }

export default async function SelectDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'value',
      type: 'string',
      description: t.rich('componentDocs.select.props.value', { code: codeTag }),
    },
    {
      name: 'defaultValue',
      type: 'string',
      description: t.rich('componentDocs.select.props.defaultValue', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      description: t.rich('componentDocs.select.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'disabled',
      type: 'boolean',
      description: t.rich('componentDocs.select.props.disabled', { code: codeTag }),
    },
    {
      name: 'name',
      type: 'string',
      description: t.rich('componentDocs.select.props.name', { code: codeTag }),
    },
    {
      name: 'open',
      type: 'boolean',
      description: t.rich('componentDocs.select.props.open', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.select.props.onOpenChange', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Select</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.select.lead', {
          link1: linkTag('/docs/components/input'),
          link2: linkTag('/docs/components/combobox'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <Select defaultValue="medium">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pick a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('groupedOptions')}</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.select.body.grouped', { code: codeTag })}
      </p>
      <Example code={GROUPED_SNIPPET}>
        <Select>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Pick a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="it">Italy</SelectItem>
              <SelectItem value="fr">France</SelectItem>
              <SelectItem value="de">Germany</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="br">Brazil</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props (Select root)</h2>
      <PropsTable props={PROPS} caption="Select props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.select.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.select.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.select.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/segmented-control" className="text-primary underline">
          ← SegmentedControl
        </Link>
        <Link href="/docs/components/date-picker" className="text-primary underline">
          DatePicker →
        </Link>
      </div>
    </article>
  )
}
