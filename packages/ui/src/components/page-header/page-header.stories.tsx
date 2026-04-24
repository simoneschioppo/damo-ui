import { PageHeader } from './page-header'
import { Button } from '../button/button'
import { PlusIcon, SearchIcon, CogIcon } from '../../icons'

export const Basic = () => (
  <div style={{ width: 720 }}>
    <PageHeader title="Team" description="Membri attivi ordinati per contributi recenti." />
  </div>
)

export const WithEyebrow = () => (
  <div style={{ width: 720 }}>
    <PageHeader
      eyebrow="Dashboard"
      title="Panoramica"
      description="Riepilogo degli eventi recenti e delle metriche chiave."
    />
  </div>
)

export const WithActions = () => (
  <div style={{ width: 720 }}>
    <PageHeader
      eyebrow="Library"
      title="Componenti"
      description="Esplora i 47 componenti Damo UI, raggruppati per categoria."
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
      eyebrow="Attività recenti"
      title="Damo UI · Componenti"
      description="Le ultime 10 modifiche alla libreria, ordinate per data."
      actions={
        <Button variant="ghost" size="icon" aria-label="Settings">
          <CogIcon size={18} />
        </Button>
      }
    />
  </div>
)
