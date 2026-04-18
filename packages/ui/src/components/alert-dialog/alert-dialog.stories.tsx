import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './alert-dialog'
import { Button } from '../button/button'

export const Default = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button>Termina partita</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Terminare la partita?</AlertDialogTitle>
        <AlertDialogDescription>
          La partita in corso verrà abbandonata e contata come sconfitta.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="ghost">Annulla</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button>Conferma</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

export const Danger = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="danger">Elimina profilo</Button>
    </AlertDialogTrigger>
    <AlertDialogContent tone="danger">
      <AlertDialogHeader>
        <AlertDialogTitle>Eliminare il profilo?</AlertDialogTitle>
        <AlertDialogDescription>
          Questa azione è irreversibile. Perderai ELO, classifica, partite salvate e set sbloccati.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="ghost">Tieni il profilo</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="danger">Elimina</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
