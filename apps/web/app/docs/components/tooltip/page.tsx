import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Button,
  IconButton,
  CogIcon,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@damo/ui'`

const PROVIDER_SNIPPET = `// In your root layout:
<TooltipProvider delayDuration={150}>
  {children}
</TooltipProvider>`

const BASIC_SNIPPET = `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>Helpful hint</TooltipContent>
</Tooltip>`

const ICON_SNIPPET = `<Tooltip>
  <TooltipTrigger asChild>
    <IconButton aria-label="Settings" variant="ghost">
      <CogIcon size={18} />
    </IconButton>
  </TooltipTrigger>
  <TooltipContent>Open settings</TooltipContent>
</Tooltip>`

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'delayDuration',
    type: 'number',
    defaultValue: '700',
    description:
      'Prop on `TooltipProvider` (and per-`Tooltip`). Milliseconds before the tooltip opens on hover.',
  },
  {
    name: 'side',
    type: "'top' | 'right' | 'bottom' | 'left'",
    defaultValue: "'top'",
    description: 'Prop on `TooltipContent`. Preferred edge to anchor against; flips automatically.',
  },
  {
    name: 'sideOffset',
    type: 'number',
    defaultValue: '4',
    description: 'Gap between trigger and tooltip.',
  },
  {
    name: 'align',
    type: "'start' | 'center' | 'end'",
    defaultValue: "'center'",
    description: 'Inline alignment relative to the trigger.',
  },
]

export const metadata = { title: `Tooltip — ${BRAND.libName}` }

export default async function TooltipDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tooltip</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Small floating label revealed on hover or focus. Built on Radix Tooltip — full keyboard
        support, smart edge flipping, and ARIA wiring come from the primitive. Wrap your app once in{' '}
        <code className="font-mono">TooltipProvider</code> to share a single delay timer across all
        tooltips.
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Provider — once per app</h2>
      <p className="text-foreground/80 mb-3">
        Wrap your root layout in a single <code className="font-mono">TooltipProvider</code>. All
        nested tooltips share its delay. Without the provider, individual tooltips still work but
        don&rsquo;t coordinate timing.
      </p>
      <Code code={PROVIDER_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('basicUsage')}</h2>
      <Example code={BASIC_SNIPPET}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Helpful hint</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">On an icon button</h2>
      <p className="text-foreground/80 mb-3">
        Pair Tooltip with{' '}
        <Link href="/docs/components/button" className="text-primary underline">
          IconButton
        </Link>{' '}
        to surface the action&rsquo;s name on hover. <code className="font-mono">aria-label</code>{' '}
        on the IconButton stays the canonical accessible name; the tooltip is supplementary.
      </p>
      <Example code={ICON_SNIPPET}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Settings" variant="ghost">
                <CogIcon size={18} />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Open settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Tooltip props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The trigger receives Radix focus management; pressing <kbd>Tab</kbd> opens the tooltip,{' '}
          <kbd>Esc</kbd> closes it.
        </li>
        <li>
          Tooltips don&rsquo;t replace labels. For icon-only triggers, always set{' '}
          <code className="font-mono">aria-label</code> on the trigger — the tooltip text alone is
          not announced as the accessible name.
        </li>
        <li>
          Tooltip content is not focusable. Use{' '}
          <Link href="/docs/components/popover" className="text-primary underline">
            Popover
          </Link>{' '}
          when the user must interact with the floating panel.
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/popover" className="text-primary underline">
          ← Popover
        </Link>
        <Link href="/docs/components/toast" className="text-primary underline">
          Toast →
        </Link>
      </div>
    </article>
  )
}
