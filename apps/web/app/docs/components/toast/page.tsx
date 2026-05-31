import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { codeTag, monoTag, strongTag, emTag, linkTag, kbdTag } from '../../../../lib/i18n-tags'
import { ToastVariantPreview } from './_examples'

const IMPORT_SNIPPET = `import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from '@axologic/ui'`

const PROVIDER_SNIPPET = `// In your root layout — exactly one provider + viewport per app:
<ToastProvider>
  {children}
  <ToastViewport />
</ToastProvider>`

const EMIT_SNIPPET = `function ExampleToaster() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open} onOpenChange={setOpen} variant="success">
        <div className="flex-1 min-w-0">
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes were committed.</ToastDescription>
        </div>
        <ToastAction altText="Undo">Undo</ToastAction>
        <ToastClose />
      </Toast>
    </>
  )
}`

export const metadata = { title: `Toast — ${BRAND.libName}` }

export default async function ToastDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  const t = await getTranslations()

  const PROPS: ReadonlyArray<PropDef> = [
    {
      name: 'variant',
      type: "'default' | 'success' | 'warning' | 'danger'",
      defaultValue: "'default'",
      description: t.rich('componentDocs.toast.props.variant', { code: codeTag }),
    },
    {
      name: 'open',
      type: 'boolean',
      description: t.rich('componentDocs.toast.props.open', { code: codeTag }),
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      description: t.rich('componentDocs.toast.props.onOpenChange', { code: codeTag }),
    },
    {
      name: 'duration',
      type: 'number',
      defaultValue: '5000',
      description: t.rich('componentDocs.toast.props.duration', { code: codeTag }),
    },
    {
      name: 'altText',
      type: 'string',
      description: t.rich('componentDocs.toast.props.altText', { code: codeTag }),
    },
  ]
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Toast</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        {t.rich('componentDocs.toast.lead', {
          link1: linkTag('/docs/components/dialog'),
        })}
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Provider + viewport — once per app</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.toast.body.providerIntro', { code: codeTag })}
      </p>
      <Code code={PROVIDER_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Variants — try the preview</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.toast.body.variantsIntro', { code: codeTag })}
      </p>
      <Example code={`<Toast variant="success">…</Toast>`}>
        <div className="grid gap-4 sm:grid-cols-2 w-full">
          <ToastVariantPreview
            variant="default"
            title="Saved"
            description="Default toast tone."
            triggerLabel="Default"
          />
          <ToastVariantPreview
            variant="success"
            title="Published"
            description="Live in 30 seconds."
            triggerLabel="Success"
          />
          <ToastVariantPreview
            variant="warning"
            title="Approaching limit"
            description="80% of quota."
            triggerLabel="Warning"
          />
          <ToastVariantPreview
            variant="danger"
            title="Failed"
            description="Retry to recover."
            triggerLabel="Danger"
          />
        </div>
      </Example>

      <h2 className="font-display text-2xl mb-3 mt-10">Emitting a toast</h2>
      <p className="text-foreground/80 mb-3">
        {t.rich('componentDocs.toast.body.emittingIntro', { code: codeTag })}
      </p>
      <Code code={EMIT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Toast props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>{t.rich('componentDocs.toast.a11y.0', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.toast.a11y.1', { code: codeTag })}</li>
        <li>{t.rich('componentDocs.toast.a11y.2', { code: codeTag, kbd: kbdTag })}</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/tooltip" className="text-primary underline">
          ← Tooltip
        </Link>
        <Link href="/docs/components/progress" className="text-primary underline">
          Progress →
        </Link>
      </div>
    </article>
  )
}
