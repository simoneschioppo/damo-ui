import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'`

const BASIC_SNIPPET = `<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Damo UI?</AccordionTrigger>
    <AccordionContent>
      A Memphis-inspired React + Next.js component library.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes — every interactive component is built on Radix primitives.
    </AccordionContent>
  </AccordionItem>
</Accordion>`

const MULTIPLE_SNIPPET = `<Accordion type="multiple" defaultValue={['a', 'b']}>
  …
</Accordion>`

export const metadata = { title: `Accordion — ${BRAND.libName}` }

export default async function AccordionDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      required: true,
      description: t.rich('componentDocs.accordion.props.type', { code: codeTag }),
    },
    {
      name: 'collapsible',
      type: 'boolean',
      description: t.rich('componentDocs.accordion.props.collapsible', { code: codeTag }),
    },
    {
      name: 'value / defaultValue',
      type: 'string | string[]',
      description: t.rich('componentDocs.accordion.props.value', { code: codeTag }),
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      description: t.rich('componentDocs.accordion.props.onValueChange', { code: codeTag }),
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      defaultValue: "'vertical'",
      description: t.rich('componentDocs.accordion.props.orientation', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Accordion</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.accordion.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Single, collapsible</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-xl">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Damo UI?</AccordionTrigger>
              <AccordionContent>
                A Memphis-inspired React + Next.js component library.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes — every interactive component is built on Radix primitives.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I theme it?</AccordionTrigger>
              <AccordionContent>
                Yes — switch theme, palette and density via the <code>data-*</code> attributes on{' '}
                <code>&lt;html&gt;</code>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Multiple open at once</h2>
      <Code code={MULTIPLE_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props (Accordion root)</h2>
      <PropsTable props={PROPS} caption="Accordion props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.accordion.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.accordion.a11y.1', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/avatar" className="text-primary underline">
          ← Avatar
        </Link>
        <Link href="/docs/components/table" className="text-primary underline">
          Table →
        </Link>
      </div>
    </article>
  )
}
