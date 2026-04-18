import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog'
import { Button } from '../button/button'

export const Basic = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>Apri dialog</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Conferma la partita</DialogTitle>
        <DialogDescription>
          Stai per iniziare una nuova partita di Damacchi in modalità classic 8×8.
        </DialogDescription>
      </DialogHeader>
      <div style={{ fontSize: 14 }}>
        La partita verrà salvata automaticamente. Puoi abbandonare in qualsiasi momento.
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Annulla</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="accent">Inizia</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export const NoCloseButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost">Dialog senza X</Button>
    </DialogTrigger>
    <DialogContent hideClose>
      <DialogHeader>
        <DialogTitle>Scelta obbligatoria</DialogTitle>
        <DialogDescription>Non puoi chiudere questo dialog senza decidere.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="danger">Rinuncia</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button>Continua</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export const LongContent = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>Termini di gioco</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Termini di gioco</DialogTitle>
        <DialogDescription>Leggi attentamente prima di iniziare.</DialogDescription>
      </DialogHeader>
      <div style={{ fontSize: 14, lineHeight: 1.6, maxHeight: 300, overflow: 'auto' }}>
        <p>
          Damacchi è un ibrido tra dama e scacchi. Le regole base prevedono cattura obbligatoria,
          promozione a esclusione sequenziale, cooldown di 1 turno sui pezzi scacchistici, e
          condizioni di vittoria per eliminazione o stallo.
        </p>
        <p>
          La pedina reale, se catturata, fa perdere la partita immediatamente. Nelle modalità
          avanzate esiste il Final Round, attivo quando il numero di pezzi scende sotto una certa
          soglia.
        </p>
        <p>
          La modalità Rage disattiva la promozione sequenziale e sostituisce la promozione con
          sacrificio: il giocatore sceglie quale pezzo evocare pagando in pedine proprie.
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Ho capito</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
