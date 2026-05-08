import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Code } from '../../_components/Code'
import { Example } from '../../_components/Example'
import { PropsTable, type PropDef } from '../../_components/PropsTable'
import { BRAND } from '../../../../lib/brand'
import { ToastVariantPreview } from './_examples'

const IMPORT_SNIPPET = `import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'variant',
    type: "'default' | 'success' | 'warning' | 'danger'",
    defaultValue: "'default'",
    description:
      'Sets the background tint and Memphis shadow color. Mirrors the variant tokens used by Banner.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state. Pair with `onOpenChange`.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires when the toast opens or closes.',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '5000',
    description: 'Auto-dismiss timeout in milliseconds. Pass `Infinity` to disable.',
  },
  {
    name: 'altText',
    type: 'string',
    description:
      'Prop on `ToastAction`. Required by Radix when the trigger has no text — used as the accessible action name.',
  },
]

export const metadata = { title: `Toast — ${BRAND.libName}` }

export default async function ToastDocsPage() {
  const tCat = await getTranslations('docsChrome.categories')
  const tSec = await getTranslations('docsChrome.sections')
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        {tCat('feedback')}
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Toast</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Transient notification that slides in from the screen edge. Built on Radix Toast — full ARIA
        live-region wiring, swipe-to-dismiss, and pause-on-hover come from the primitive. Use for
        non-blocking feedback (saved, copied, sent); for critical errors that need acknowledgement
        use{' '}
        <Link href="/docs/components/dialog" className="text-primary underline">
          Dialog with severity=&quot;alert&quot;
        </Link>
        .
      </p>

      <h2 className="font-display text-2xl mb-3">{tSec('import')}</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Provider + viewport — once per app</h2>
      <p className="text-foreground/80 mb-3">
        Mount one <code className="font-mono">ToastProvider</code> +{' '}
        <code className="font-mono">ToastViewport</code> at the root of your app. All toasts emitted
        anywhere in the tree render inside the viewport.
      </p>
      <Code code={PROVIDER_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Variants — try the preview</h2>
      <p className="text-foreground/80 mb-3">
        Click each button to slide the matching toast into the bottom-right of its preview frame.
        Real <code className="font-mono">Toast</code> instances mounted inside a scoped{' '}
        <code className="font-mono">ToastProvider</code> +{' '}
        <code className="font-mono">ToastViewport</code> — same wiring you&rsquo;d ship in
        production.
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
        Toasts in Radix are state-driven: render a{' '}
        <code className="font-mono">&lt;Toast /&gt;</code> with controlled{' '}
        <code className="font-mono">open</code> and toggle it from your event handlers. For app-wide
        toast emission, build a thin context that owns the queue.
      </p>
      <Code code={EMIT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('props')}</h2>
      <PropsTable props={PROPS} caption="Toast props" />

      <h2 className="font-display text-2xl mb-3 mt-10">{tSec('accessibility')}</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The viewport sets <code className="font-mono">role=&quot;region&quot;</code> with{' '}
          <code className="font-mono">aria-label=&quot;Notifications&quot;</code>. Toasts inside
          render with appropriate <code className="font-mono">role</code> +{' '}
          <code className="font-mono">aria-live</code> per Radix.
        </li>
        <li>
          When using <code className="font-mono">ToastAction</code>, supply{' '}
          <code className="font-mono">altText</code> — the accessibility name read aloud when the
          toast appears. Without it Radix throws.
        </li>
        <li>
          Hovering or focusing the viewport pauses the auto-dismiss timer; <kbd>F6</kbd> jumps focus
          into the viewport from anywhere on the page.
        </li>
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
