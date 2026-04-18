import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion'

export const Single = () => (
  <div style={{ width: 480 }}>
    <Accordion type="single" collapsible defaultValue="rules">
      <AccordionItem value="rules">
        <AccordionTrigger>Regole base</AccordionTrigger>
        <AccordionContent>
          Damacchi è una dama ibrida che diventa scacchi. Ogni pedina che raggiunge l&apos;ultima
          riga promuove in un pezzo scacchistico.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="modes">
        <AccordionTrigger>Modalità di gioco</AccordionTrigger>
        <AccordionContent>
          Classic 8×8, Classic 10×10, Rage. Ognuna con regole specifiche.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="pieces">
        <AccordionTrigger>Pezzi e promozione</AccordionTrigger>
        <AccordionContent>
          Cavallo, Alfiere, Torre, Regina. Promozione a esclusione sequenziale.
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
