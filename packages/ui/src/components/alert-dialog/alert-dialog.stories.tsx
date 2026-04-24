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
      <Button>Ripristina default</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Ripristinare i default?</AlertDialogTitle>
        <AlertDialogDescription>
          Tutte le modifiche al tema corrente andranno perse e verrà ricaricato il preset iniziale.
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
          Questa azione è irreversibile. Perderai preferenze, cronologia e temi salvati.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="ghost">Annulla</Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="danger">Elimina</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
