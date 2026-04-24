import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

export const Single = () => (
  <div style={{ width: 480 }}>
    <Accordion type="single" collapsible defaultValue="install">
      <AccordionItem value="install">
        <AccordionTrigger>Installazione</AccordionTrigger>
        <AccordionContent>
          Installa la libreria con <code>pnpm add @damo/ui</code> e importa i fogli di stile nella
          root del tuo layout Next.js.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="theming">
        <AccordionTrigger>Theming</AccordionTrigger>
        <AccordionContent>
          Tre switcher via <code>data-*</code>: <code>data-theme</code>, <code>data-palette</code> e{' '}
          <code>data-density</code>. Ogni token è una CSS variable.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="components">
        <AccordionTrigger>Componenti</AccordionTrigger>
        <AccordionContent>
          47 componenti divisi in Foundations, Tier 1, Forms, Feedback, Navigation, Data e Layout.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
)

export const Multiple = () => (
  <div style={{ width: 480 }}>
    <Accordion type="multiple" defaultValue={['a', 'c']}>
      <AccordionItem value="a">
        <AccordionTrigger>Prima sezione</AccordionTrigger>
        <AccordionContent>Contenuto A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Seconda sezione</AccordionTrigger>
        <AccordionContent>Contenuto B</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Terza sezione</AccordionTrigger>
        <AccordionContent>Contenuto C</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
)
