import Link from 'next/link'
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
} from '@damo/ui'
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
} from '@damo/ui'`

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

const PROPS: ReadonlyArray<PropDef> = [
  {
    name: 'open',
    type: 'boolean',
    description: 'Controlled open state on the root.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Uncontrolled initial open state on the root.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Fires whenever the open state changes.',
  },
  {
    name: 'side',
    type: "'left' | 'right' | 'top' | 'bottom'",
    defaultValue: "'right'",
    description: 'Prop on `DrawerContent`. Sets the slide-in edge of the panel.',
  },
  {
    name: 'hideClose',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Prop on `DrawerContent`. Hides the built-in close button (rendered as an X in the upper right). Useful when the consumer renders their own close affordance.',
  },
]

export const metadata = { title: `Drawer — ${BRAND.libName}` }

export default function DrawerDocsPage() {
  return (
    <article>
      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary mb-3">
        ACTIONS &amp; SURFACES
      </div>
      <h1 className="font-display text-5xl leading-[0.95] mb-4">Drawer</h1>
      <p className="text-lg text-muted-foreground max-w-[60ch] mb-10">
        Sliding side panel built on the Radix Dialog primitive. Comes in four sides (left, right,
        top, bottom), with a close button baked in and the same Memphis shadow chrome as Dialog.
      </p>

      <h2 className="font-display text-2xl mb-3">Import</h2>
      <Code code={IMPORT_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Live example</h2>
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

      <h2 className="font-display text-2xl mb-3 mt-10">Sides</h2>
      <p className="text-foreground/80 mb-3">
        Right is the default — typical for filters and detail panels. Bottom works well on mobile.
      </p>
      <Code code={SIDES_SNIPPET} lang="tsx" />

      <h2 className="font-display text-2xl mb-3 mt-10">Props</h2>
      <PropsTable props={PROPS} caption="Drawer props" />

      <h2 className="font-display text-2xl mb-3 mt-10">Accessibility</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Built on Radix Dialog: focus is trapped inside the panel while open and returned to the
          trigger on close. Esc closes the drawer; clicks on the overlay close it too.
        </li>
        <li>
          Always pair <code className="font-mono">DrawerTitle</code> and{' '}
          <code className="font-mono">DrawerDescription</code> with the content — Radix wires them
          as the dialog's accessible name and description.
        </li>
        <li>
          The built-in close button uses an Italian label{' '}
          <code className="font-mono">aria-label=&quot;Chiudi&quot;</code>. There is currently no
          prop to override it; if you need a different language, set{' '}
          <code className="font-mono">hideClose</code> and render your own close affordance with{' '}
          <code className="font-mono">DrawerClose</code> as{' '}
          <code className="font-mono">asChild</code>.
        </li>
      </ul>

      <h2 className="font-display text-2xl mb-3 mt-10">Drawer vs Dialog</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground/85">
        <li>
          Reach for Drawer when the panel hosts a flow of related controls (filters, settings, side
          editor) — the panel can stay tall and dominate one edge of the screen.
        </li>
        <li>
          Reach for{' '}
          <Link href="/docs/components/dialog" className="text-primary underline">
            Dialog
          </Link>{' '}
          for a centred modal — confirmations, single-step forms, or focused tasks.
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
