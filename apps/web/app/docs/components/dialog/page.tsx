import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { codeTag, monoTag, strongTag, emTag, kbdTag, linkTag } from '../../../../lib/i18n-tags'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'

export const metadata = {
  title: `Dialog — ${BRAND.libName}`,
  description: 'Modal dialog primitive — informational + alert (destructive-confirm) modes.',
}

const IMPORT_SNIPPET = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@damo/ui'`

const BASIC_SNIPPET = `<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary">Open dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogDescription>
        This dialog is built on Radix Primitives, so focus is trapped while open
        and Esc closes it.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button variant="primary">Confirm</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`

const ALERT_SNIPPET = `<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete account</Button>
  </DialogTrigger>
  <DialogContent severity="alert" tone="danger">
    <DialogHeader>
      <DialogTitle>Delete account?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Your data will be permanently removed.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      {/* Place Cancel first in DOM order so it gets default focus. */}
      <DialogClose asChild>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <DialogClose asChild>
        <Button variant="destructive">Delete</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`

export default async function DialogDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'open',
      type: 'boolean',
      description: t.rich('componentDocs.dialog.props.open', { code: codeTag }),
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.dialog.props.defaultOpen', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.dialog.props.onOpenChange', { code: codeTag }),
    },
    {
      name: 'modal',
      type: 'boolean',
      defaultValue: 'true',
      description: t.rich('componentDocs.dialog.props.modal', { code: codeTag }),
    },
  ]

  const CONTENT_PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'severity',
      type: "'default' | 'alert'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.dialog.contentProps.severity', { code: codeTag }),
    },
    {
      name: 'tone',
      type: "'default' | 'danger'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.dialog.contentProps.tone', { code: codeTag }),
    },
    {
      name: 'hideClose',
      type: 'boolean',
      defaultValue: 'false',
      description: t.rich('componentDocs.dialog.contentProps.hideClose', { code: codeTag }),
    },
  ]

  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('actionsAndSurfaces')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Dialog</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.dialog.lead', { code: codeTag })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.dialog.headings.defaultInformational')}
      </h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.dialog.body.defaultInformational', { code: codeTag, kbd: kbdTag })}
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                This dialog is built on Radix Primitives, so focus is trapped while open and Esc
                closes it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="primary">Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Code code={BASIC_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t.rich('componentDocs.dialog.headings.alertSeverity', { code: codeTag })}
      </h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.dialog.body.alertSeverity', { code: codeTag })}
      </p>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>
          <DialogContent severity="alert" tone="danger">
            <DialogHeader>
              <DialogTitle>Delete account?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Your data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive">Delete</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Code code={ALERT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.dialog.headings.whenToSwitchToAlert')}
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.dialog.whenToAlert.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.dialog.whenToAlert.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.dialog.whenToAlert.2', { code: codeTag })}</li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.dialog.headings.rootApi')}
      </h2>
      <PropsTable props={PROPS} caption="Dialog props" />

      <h2 className="font-display text-2xl mb-3 mt-10">
        {t('componentDocs.dialog.headings.contentProps')}
      </h2>
      <PropsTable props={CONTENT_PROPS} caption="DialogContent severity/tone" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.dialog.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.dialog.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.dialog.a11y.2', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.dialog.a11y.3', { code: codeTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/card" className="text-primary underline">
          ← Card
        </Link>
        <Link href="/docs/components/drawer" className="text-primary underline">
          Drawer →
        </Link>
      </div>
    </article>
  )
}
