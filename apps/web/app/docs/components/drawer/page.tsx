import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, linkTag } from '../../../../lib/i18n-tags'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  Button,
} from 'damo-ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

const IMPORT_SNIPPET = `import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from 'damo-ui'`

const BASIC_SNIPPET = `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="primary">Open drawer</Button>
  </DrawerTrigger>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>Filtri</DrawerTitle>
      <DrawerDescription>Affina la lista applicando i filtri qui sotto.</DrawerDescription>
    </DrawerHeader>
    <DrawerBody>
      {/* form fields, lists, …  */}
    </DrawerBody>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="ghost">Annulla</Button>
      </DrawerClose>
      <DrawerClose asChild>
        <Button variant="primary">Applica</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`

const SIDES_SNIPPET = `<DrawerContent side="left">…</DrawerContent>
<DrawerContent side="right">…</DrawerContent>
<DrawerContent side="top">…</DrawerContent>
<DrawerContent side="bottom">…</DrawerContent>`

export const metadata = { title: `Drawer — ${BRAND.libName}` }

export default async function DrawerDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'open',
      type: 'boolean',
      description: t.rich('componentDocs.drawer.props.open', { code: codeTag }),
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.drawer.props.defaultOpen', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.drawer.props.onOpenChange', { code: codeTag }),
    },
    {
      name: 'side',
      type: "'left' | 'right' | 'top' | 'bottom'",
      defaultValue: "'right'",
      description: t.rich('componentDocs.drawer.props.side', { code: codeTag }),
    },
    {
      name: 'hideClose',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.drawer.props.hideClose', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Drawer</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t('componentDocs.drawer.lead')}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('live')}</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="primary">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <DrawerHeader>
              <DrawerTitle>Filtri</DrawerTitle>
              <DrawerDescription>Affina la lista applicando i filtri qui sotto.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <p className="text-sm text-muted-foreground">
                Inserisci qui i form, le checkbox o qualsiasi controllo dei filtri.
              </p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="ghost">Annulla</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="primary">Applica</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('sides')}</h2>
      <p className="text-foreground/80 mb-3">{t('componentDocs.drawer.body.sides')}</p>
      <Code code={SIDES_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Drawer props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.drawer.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.drawer.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.drawer.a11y.2', { code: codeTag })}</li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.drawer.headings.drawerVsDialog')}
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.drawer.vsDialog.0', { code: codeTag })}</li>
        <li>
          {t.rich('componentDocs.drawer.vsDialog.1', {
            code: codeTag,
            link1: linkTag('/docs/components/dialog'),
          })}
        </li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/dialog" className="text-primary underline">
          ← Dialog
        </Link>
        <Link href="/docs/components/banner" className="text-primary underline">
          Banner →
        </Link>
      </div>
    </article>
  )
}
