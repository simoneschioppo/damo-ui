import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@axologic/ui'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'

const IMPORT_SNIPPET = `import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@axologic/ui'`

const BASIC_SNIPPET = `<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="px-6 py-12 border-2 border-dashed border-memphis text-center">
      Right-click on me
    </div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuLabel>Item</ContextMenuLabel>
    <ContextMenuItem>
      Open
      <ContextMenuShortcut>⌘O</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`

export const metadata = { title: `ContextMenu — ${BRAND.libName}` }

export default async function ContextMenuDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'modal',
      type: 'boolean',
      defaultValue: 'true',
      description: t.rich('componentDocs.context-menu.props.modal', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.context-menu.props.onOpenChange', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('navigation')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">ContextMenu</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.context-menu.lead', {
          em: emTag,
          link1: linkTag('/docs/components/dropdown-menu'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Basic usage — right-click the area below</h2>
      <Example code={BASIC_SNIPPET}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="px-6 py-12 border-2 border-dashed border-memphis text-center w-full max-w-md text-muted-foreground font-mono text-sm">
              Right-click on me
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Item</ContextMenuLabel>
            <ContextMenuItem>
              Open
              <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="ContextMenu props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('whenToUse')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t('componentDocs.context-menu.whenToUse.0')}</li>
        <li>{t('componentDocs.context-menu.whenToUse.1')}</li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.context-menu.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.context-menu.a11y.1', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/dropdown-menu" className="text-primary underline">
          ← DropdownMenu
        </Link>
        <Link href="/docs/components/nav-item" className="text-primary underline">
          NavItem →
        </Link>
      </div>
    </article>
  )
}
