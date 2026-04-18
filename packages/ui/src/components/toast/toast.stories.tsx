import { useState } from 'react'
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
} from './toast'
import { Button } from '../button/button'

export const Basic = () => {
  const [open, setOpen] = useState(false)
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Mostra toast</Button>
      <Toast open={open} onOpenChange={setOpen}>
        <div style={{ flex: 1 }}>
          <ToastTitle>Partita salvata</ToastTitle>
          <ToastDescription>Puoi riprenderla dalla dashboard.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}

export const Variants = () => {
  const [openV, setOpenV] = useState<string | null>(null)
  return (
    <ToastProvider>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['default', 'success', 'warning', 'danger'] as const).map((v) => (
          <Button key={v} variant="ghost" size="sm" onClick={() => setOpenV(v)}>
            {v}
          </Button>
        ))}
      </div>
      {(['default', 'success', 'warning', 'danger'] as const).map((v) => (
        <Toast
          key={v}
          variant={v}
          open={openV === v}
          onOpenChange={(open) => !open && setOpenV(null)}
        >
          <div style={{ flex: 1 }}>
            <ToastTitle>Variant: {v}</ToastTitle>
            <ToastDescription>Questo è un toast di tipo {v}.</ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export const WithAction = () => {
  const [open, setOpen] = useState(false)
  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Toast con azione</Button>
      <Toast variant="warning" open={open} onOpenChange={setOpen}>
        <div style={{ flex: 1 }}>
          <ToastTitle>Connessione persa</ToastTitle>
          <ToastDescription>Vuoi riconnetterti ora?</ToastDescription>
        </div>
        <ToastAction altText="Riconnetti">Riconnetti</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}
