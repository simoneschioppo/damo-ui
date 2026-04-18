import { Banner } from './banner'

export const Info = () => (
  <Banner title="Nuova versione disponibile">Aggiorna per ottenere le ultime feature.</Banner>
)

export const Success = () => (
  <Banner variant="success" title="Partita salvata">
    Puoi riprenderla dalla tua dashboard.
  </Banner>
)

export const Warning = () => (
  <Banner variant="warning" title="Connessione instabile">
    La partita potrebbe essere interrotta.
  </Banner>
)

export const Danger = () => (
  <Banner variant="danger" title="Errore">
    Impossibile contattare il server di gioco.
  </Banner>
)

export const Rage = () => (
  <Banner variant="rage" title="Rage attivo!">
    I tuoi pezzi non hanno più cooldown.
  </Banner>
)

export const Dismissible = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Banner variant="info" title="Chiudibile" dismissible>
      Clicca la X per farmi sparire.
    </Banner>
    <Banner variant="success" title="Anche io" dismissible>
      Mi chiudo.
    </Banner>
  </div>
)

export const CustomIcon = () => (
  <Banner variant="info" title="Icona custom" icon={<span style={{ fontSize: 20 }}>★</span>}>
    Puoi passare qualsiasi ReactNode come icona.
  </Banner>
)

export const NoIcon = () => (
  <Banner variant="info" title="Nessuna icona" icon={false}>
    Icona rimossa passando icon={`{false}`}.
  </Banner>
)

export const TitleOnly = () => <Banner variant="warning" title="Solo titolo" />

export const ContentOnly = () => <Banner variant="info">Solo contenuto, senza title.</Banner>
