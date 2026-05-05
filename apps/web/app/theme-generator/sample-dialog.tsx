'use client'

import { useState } from 'react'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@damo/ui'

/**
 * Sample dialog mounted in the theme generator preview pane.
 *
 * Renders a regular-sized {@link Dialog} populated with the surface,
 * border, shadow, typography, intent, and badge tokens so the user can
 * see how the dialog component reacts to live theme edits without
 * having to wire up a separate scene.
 */
export function SampleDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="open-sample-dialog">
          Open sample dialog
        </Button>
      </DialogTrigger>

      <DialogContent data-testid="sample-dialog-content">
        <DialogHeader>
          <DialogTitle>Pubblica nuova release</DialogTitle>
          <DialogDescription>
            Questa è una modale di esempio. Surface, bordo, shadow, tipografia e bottoni seguono i
            token correnti del theme generator.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="featured">PRO</Badge>
            <Badge variant="success">v1.4.2</Badge>
            <Badge variant="default">Stable</Badge>
          </div>
          <Label htmlFor="sample-dialog-version">Tag versione</Label>
          <Input id="sample-dialog-version" defaultValue="v1.4.3-beta" />
          <p className="text-sm text-muted-foreground m-0">
            Puoi cambiare i token nel pannello di sinistra: la modale qui sopra si aggiorna live,
            così verifichi come si presenta con il tema applicato.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid="sample-dialog-cancel"
          >
            Annulla
          </Button>
          <Button
            variant="primary"
            onClick={() => setOpen(false)}
            data-testid="sample-dialog-confirm"
          >
            Pubblica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
