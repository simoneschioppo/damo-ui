import Link from 'next/link'
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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state. Pair with `onOpenChange`.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Uncontrolled initial open state.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires whenever the open state changes.',
  },
  {
    name: 'modal',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'When true (default), focus is trapped inside the dialog and outside content is inert.',
  },
]

const CONTENT_PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'severity',
    type: "'default' | 'alert'",
    defaultValue: "'default'",
    description:
      '`default` is `role="dialog"`; clicks on the overlay close it. `alert` flips to `role="alertdialog"`, blocks overlay-click dismissal and hides the X button — the user must click an explicit footer action. Use for destructive or otherwise irreversible flows.',
  },
  {
    name: 'tone',
    type: "'default' | 'danger'",
    defaultValue: "'default'",
    description:
      'Visual override. `danger` swaps the Memphis offset shadow to the destructive token, telegraphing high-stakes actions. Orthogonal to `severity` — combine freely.',
  },
  {
    name: 'hideClose',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Hide the built-in X close button. Already implicit when `severity="alert"` — alert mode never renders the X.',
  },
]

export default function DialogDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        ACTIONS &amp; SURFACES
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Dialog</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Modal dialog wrapping Radix Dialog. Two semantic modes via{' '}
        <code className="font-mono">severity</code>: <code className="font-mono">default</code>{' '}
        (informational, overlay closes) and <code className="font-mono">alert</code> (destructive
        confirmation, overlay does NOT close). A separate <code className="font-mono">tone</code>{' '}
        prop flips the offset shadow to the destructive token.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Default — informational</h2>
      <p className="text-foreground/80 mb-3">
        Standard modal. Click on the overlay or press <kbd>Esc</kbd> to dismiss.
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
        <code className="font-mono">severity=&quot;alert&quot;</code> — destructive confirmation
      </h2>
      <p className="text-foreground/80 mb-3">
        Flip the role to <code className="font-mono">alertdialog</code>, block overlay-click
        dismissal, and remove the X button — the user must explicitly choose an action. Pair with{' '}
        <code className="font-mono">tone=&quot;danger&quot;</code> to recolour the Memphis shadow.
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

      <h2 className="font-display text-2xl mb-3 mt-10">When to switch to alert mode</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          The action is destructive (delete, archive, sign out) and must NOT be cancelled
          accidentally by clicking outside.
        </li>
        <li>
          You want screen readers to announce the dialog as{' '}
          <code className="font-mono">alertdialog</code> (more interruptive than the regular{' '}
          <code className="font-mono">dialog</code> role).
        </li>
        <li>
          Otherwise leave <code className="font-mono">severity</code> at{' '}
          <code className="font-mono">default</code>.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">Dialog (root) API</h2>
      <PropsTable props={PROPS} caption="Dialog props" />

      <h2 className="font-display text-2xl mb-3 mt-10">DialogContent props</h2>
      <PropsTable props={CONTENT_PROPS} caption="DialogContent severity/tone" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Always pair <code className="font-mono">DialogTitle</code> with the content; screen
          readers announce it as the dialog name.
        </li>
        <li>
          Add <code className="font-mono">DialogDescription</code> for non-obvious actions; it is
          wired as <code className="font-mono">aria-describedby</code>.
        </li>
        <li>
          Use <code className="font-mono">DialogClose</code> on close buttons so they close the
          dialog and return focus to the trigger.
        </li>
        <li>
          In <code className="font-mono">severity=&quot;alert&quot;</code>, place Cancel first in
          the footer DOM order so Radix gives it default focus — the layout enforces column-reverse
          on small viewports so Cancel sits on top there.
        </li>
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
