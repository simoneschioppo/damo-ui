import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  Button,
  IconButton,
  CogIcon,
} from 'damo-ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from 'damo-ui'`

const BASIC_SNIPPET = `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <h3 className="font-display text-lg mb-2">Quick settings</h3>
    <p className="text-sm text-muted-foreground mb-3">
      A non-modal floating panel anchored to the trigger.
    </p>
    <PopoverClose asChild>
      <Button size="sm" variant="ghost">Close</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>`

const ALIGN_SNIPPET = `<PopoverContent align="start" sideOffset={8}>…</PopoverContent>`

export const metadata = { title: `Popover — ${BRAND.libName}` }

export default async function PopoverDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()
  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'open',
      type: 'boolean',
      description: t.rich('componentDocs.popover.props.open', { code: codeTag }),
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      description: t.rich('componentDocs.popover.props.defaultOpen', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.popover.props.onOpenChange', { code: codeTag }),
    },
    {
      name: 'modal',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.popover.props.modal', { code: codeTag }),
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      defaultValue: "'center'",
      description: t.rich('componentDocs.popover.props.align', { code: codeTag }),
    },
    {
      name: 'side',
      type: "'top' | 'right' | 'bottom' | 'left'",
      defaultValue: "'bottom'",
      description: t.rich('componentDocs.popover.props.side', { code: codeTag }),
    },
    {
      name: 'sideOffset',
      type: 'number',
      defaultValue: '6',
      description: t.rich('componentDocs.popover.props.sideOffset', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('forms')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Popover</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.popover.lead', {
          code: codeTag,
          em: emTag,
          link1: linkTag('/docs/components/dropdown-menu'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('live')}</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <h3 className="font-display text-lg mb-2">Quick settings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              A non-modal floating panel anchored to the trigger.
            </p>
            <PopoverClose asChild>
              <Button size="sm" variant="ghost">
                Close
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <IconButton aria-label="Quick settings" variant="ghost">
              <CogIcon size={18} />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <p className="text-sm text-muted-foreground">
              IconButton triggers work too — pair them with{' '}
              <code className="font-mono">aria-label</code>.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Alignment</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.popover.body.alignment', { code: codeTag })}
      </p>
      <Code code={ALIGN_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Popover props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Popover vs DropdownMenu vs Dialog</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          {t.rich('componentDocs.popover.vsList.0', {
            code: codeTag,
            strong: strongTag,
            em: emTag,
          })}
        </li>
        <li>
          {t.rich('componentDocs.popover.vsList.1', {
            code: codeTag,
            em: emTag,
            link1: linkTag('/docs/components/dropdown-menu'),
          })}
        </li>
        <li>
          {t.rich('componentDocs.popover.vsList.2', {
            code: codeTag,
            em: emTag,
            link1: linkTag('/docs/components/dialog'),
          })}
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.popover.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.popover.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.popover.a11y.2', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/combobox" className="text-primary underline">
          ← Combobox
        </Link>
        <Link href="/docs/components/tooltip" className="text-primary underline">
          Tooltip →
        </Link>
      </div>
    </article>
  )
}
