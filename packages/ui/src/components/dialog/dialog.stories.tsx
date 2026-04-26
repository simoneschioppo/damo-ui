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
        <DialogTitle>Conferma azione</DialogTitle>
        <DialogDescription>
          Stai per salvare le modifiche correnti al tema. Puoi sempre ripristinare il preset
          iniziale con Reset.
        </DialogDescription>
      </DialogHeader>
      <div style={{ fontSize: 14 }}>
        Il tema verrà esportato come CSS variables e Tailwind preset.
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Annulla</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="secondary">Conferma</Button>
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
          <Button variant="destructive">Annulla</Button>
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
      <Button>Leggi la documentazione</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Guida introduttiva</DialogTitle>
        <DialogDescription>Panoramica della libreria Damo UI.</DialogDescription>
      </DialogHeader>
      <div style={{ fontSize: 14, lineHeight: 1.6, maxHeight: 300, overflow: 'auto' }}>
        <p>
          Damo UI è una libreria React e Next.js di ispirazione Memphis. Include 47 componenti,
          30+ icone, un sistema di token CSS-first e tre switcher runtime per tema, palette e
          densità.
        </p>
        <p>
          Ogni componente è tipizzato con TypeScript strict, testato con Vitest per le unit e con
          Playwright per i flussi end-to-end. Gli stili viaggiano come CSS variables, quindi il
          tema cambia live senza rebuild.
        </p>
        <p>
          Il Theme Generator in questa playground permette di comporre palette, tipografia,
          radius, shadow, spacing e motion, e di esportare il risultato come CSS, Tailwind preset
          o JSON flat.
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
