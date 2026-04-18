import { PageHeader } from './page-header'
import { Button } from '../button/button'
import { PlusIcon, SearchIcon, CogIcon } from '../../icons'

export const Basic = () => (
  <div style={{ width: 720 }}>
    <PageHeader title="Classifica" description="Top players del mese con ELO più alto." />
  </div>
)

export const WithEyebrow = () => (
  <div style={{ width: 720 }}>
    <PageHeader
      eyebrow="Dashboard"
      title="Panoramica"
      description="Riepilogo delle tue ultime partite e statistiche."
    />
  </div>
)

export const WithActions = () => (
  <div style={{ width: 720 }}>
    <PageHeader
      eyebrow="Shop"
      title="Set di pezzi"
      description="Sblocca nuovi set per personalizzare la tua scacchiera."
      actions={
        <>
          <Button variant="ghost" size="sm">
            <SearchIcon size={16} /> Cerca
          </Button>
          <Button size="sm">
            <PlusIcon size={16} /> Nuovo
          </Button>
        </>
      }
    />
  </div>
)

export const FullStack = () => (
  <div style={{ width: 720 }}>
    <PageHeader
      eyebrow="Partite recenti"
      title="Damacchi · Classic 8×8"
      description="Le tue ultime 10 partite classiche ordinate per data."
      actions={
        <Button variant="ghost" size="icon" aria-label="Settings">
          <CogIcon size={18} />
        </Button>
      }
    />
  </div>
)
