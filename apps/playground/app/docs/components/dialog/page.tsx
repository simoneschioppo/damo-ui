import Link from 'next/link'
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@damo/ui'
import { Code } from '../../_components/Code'
import { PropsTable, type PropDef } from '../../_components/PropsTable'

const IMPORT_SNIPPET = `import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state. Pair with onOpenChange.',
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
    description: 'When true (default) clicks outside close the dialog and the page is inert.',
  },
]

export default function DialogDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        COMPONENTS
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Dialog</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Modal dialog wrapping Radix Dialog. Keyboard navigation, focus trap, and Esc-to-close
        come from the primitive; the Memphis-styled chrome is added on top.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Live example</h2>
      <div className="my-6 border-2 border-memphis bg-background shadow-memphis px-6 py-10 flex items-center justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                This dialog is built on Radix Primitives, so focus is trapped while open and
                Esc closes it.
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

      <h2 className="font-display text-2xl mb-3 mt-10">API</h2>
      <PropsTable props={PROPS} caption="Dialog (root) props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>Always pair <code className="font-mono">DialogTitle</code> with the content; screen readers announce it as the dialog name.</li>
        <li>Add <code className="font-mono">DialogDescription</code> for non-obvious actions; it is wired as <code className="font-mono">aria-describedby</code>.</li>
        <li>Use <code className="font-mono">DialogClose</code> on the cancel button so it closes the dialog and returns focus to the trigger.</li>
      </ul>

      <div className="mt-16 pt-8 border-t-2 border-memphis flex flex-wrap gap-4 items-center justify-between">
        <Link href="/docs/components/card" className="text-primary underline">
          ← Card
        </Link>
        <Link href="/docs/components/input" className="text-primary underline">
          Input →
        </Link>
      </div>
    </article>
  )
}
