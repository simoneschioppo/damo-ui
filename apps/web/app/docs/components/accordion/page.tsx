import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'type',
    type: "'single' | 'multiple'",
    required: true,
    description: '`single` allows one item open at a time; `multiple` allows several.',
  },
  {
    name: 'collapsible',
    type: 'boolean',
    description:
      'Only valid for `type="single"`. When true the active item can be closed by clicking it again.',
  },
  {
    name: 'value / defaultValue',
    type: 'string | string[]',
    description: 'Controlled / uncontrolled active value(s).',
  },
  {
    name: 'onValueChange',
    type: '(value: string | string[]) => void',
    description: 'Fires whenever the active item(s) change.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'vertical'",
    description: 'Layout direction for keyboard navigation.',
  },
]

export const metadata = { title: `Accordion — ${BRAND.libName}` }

export default async function AccordionDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('dataDisplay')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Accordion</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Stacked, expandable sections. Built on Radix Accordion — full keyboard wiring, controlled
        and uncontrolled modes, and the ARIA disclosure pattern come from the primitive.
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
        <li>
          Radix wraps each <code className="font-mono">AccordionTrigger</code> in an{' '}
          <code className="font-mono">&lt;h3&gt;</code> with a real{' '}
          <code className="font-mono">&lt;button&gt;</code> inside —{' '}
          <code className="font-mono">aria-expanded</code> tracks the open state and{' '}
          <code className="font-mono">aria-controls</code> wires it to the content panel.
        </li>
        <li>
          Keyboard: <kbd>Tab</kbd> moves between triggers; <kbd>Enter</kbd> / <kbd>Space</kbd>{' '}
          toggle the focused panel; <kbd>Home</kbd> / <kbd>End</kbd> jump to the first / last
          trigger.
        </li>
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
