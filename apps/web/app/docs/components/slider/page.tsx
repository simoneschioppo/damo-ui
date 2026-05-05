import Link from 'next/link'
import { Slider } from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'value',
    type: 'number[]',
    description: 'Controlled value(s). Pair with `onValueChange`.',
  },
  {
    name: 'defaultValue',
    type: 'number[]',
    description: 'Uncontrolled initial value(s).',
  },
  {
    name: 'onValueChange',
    type: '(values: number[]) => void',
    description: 'Fires while dragging or with keyboard arrows.',
  },
  {
    name: 'min',
    type: 'number',
    defaultValue: '0',
    description: 'Minimum value.',
  },
  {
    name: 'max',
    type: 'number',
    defaultValue: '100',
    description: 'Maximum value.',
  },
  {
    name: 'step',
    type: 'number',
    defaultValue: '1',
    description: 'Increment for arrow-key changes.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'",
    description: 'Drag axis. Vertical sliders need an explicit height on the wrapper.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Disables interaction.',
  },
  {
    name: 'inverted',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Reverse the visual direction (right-to-left or top-to-bottom).',
  },
]

export const metadata = { title: `Slider — ${BRAND.libName}` }

export default function SliderDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        FORMS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Slider</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Memphis-bordered slider with one or more thumbs. Built on Radix Slider — full keyboard
        support, drag handling, and ARIA semantics come from the primitive.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Single thumb</h2>
      <Example code={BASIC_SNIPPET}>
        <div className="w-full max-w-md">
          <Slider defaultValue={[40]} max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Range slider</h2>
      <p className="text-foreground/80 mb-3">
        Pass two values to render a range with a primary fill between them.
      </p>
      <Example code={RANGE_SNIPPET}>
        <div className="w-full max-w-md">
          <Slider defaultValue={[20, 80]} max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Vertical</h2>
      <p className="text-foreground/80 mb-3">
        Wrap the Slider in a container with an explicit height — the vertical orientation makes the
        Slider fill its parent's <code className="font-mono">height</code>.
      </p>
      <Example code={VERTICAL_SNIPPET}>
        <div className="h-40">
          <Slider defaultValue={[60]} orientation="vertical" max={100} step={1} />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Slider props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Each thumb is a <code className="font-mono">role=&quot;slider&quot;</code> with{' '}
          <code className="font-mono">aria-valuemin</code>,{' '}
          <code className="font-mono">aria-valuemax</code>, and{' '}
          <code className="font-mono">aria-valuenow</code>.
        </li>
        <li>
          Provide context with <code className="font-mono">aria-label</code> or{' '}
          <code className="font-mono">aria-labelledby</code> — what does the value represent?
        </li>
        <li>
          Keyboard: arrows step by <code className="font-mono">step</code>, Home/End jump to
          min/max, PageUp/PageDown move by 10× step.
        </li>
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
