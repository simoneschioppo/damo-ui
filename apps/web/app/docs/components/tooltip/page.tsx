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
} from 'damo-ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from 'damo-ui'`

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

export const metadata = { title: `Tooltip — ${BRAND.libName}` }

export default async function TooltipDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'delayDuration',
      type: 'number',
      defaultValue: '700',
      description: t.rich('componentDocs.tooltip.props.delayDuration', { code: codeTag }),
    },
    {
      name: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      defaultValue: "'top'",
      description: t.rich('componentDocs.tooltip.props.side', { code: codeTag }),
    },
    {
      name: 'sideOffset',
      type: 'number',
      defaultValue: '4',
      description: t.rich('componentDocs.tooltip.props.sideOffset', { code: codeTag }),
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      defaultValue: "'center'",
      description: t.rich('componentDocs.tooltip.props.align', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Tooltip</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.tooltip.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Provider — once per app</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.tooltip.body.providerIntro', { code: codeTag })}
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
        {t.rich('componentDocs.tooltip.body.iconButtonIntro', {
          code: codeTag,
          link1: linkTag('/docs/components/button'),
        })}
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
        <li>{t.rich('componentDocs.tooltip.a11y.0', { code: codeTag, kbd: kbdTag })}</li>
        <li>{t.rich('componentDocs.tooltip.a11y.1', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.tooltip.a11y.2', {
            code: codeTag,
            link1: linkTag('/docs/components/popover'),
          })}
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
