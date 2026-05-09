'use client'

import { useState } from 'react'
import {
  Button,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from 'damo-ui'

interface VariantPreviewProps {
  variant: 'default' | 'success' | 'warning' | 'danger'
  title: string
  description: string
  triggerLabel: string
}

/**
 * Each preview owns its own `ToastProvider` + `ToastViewport` so the toast is
 * fully wired by Radix (live region, swipe, auto-dismiss) inside the docs
 * frame instead of being rendered as a static visual mockup. The viewport is
 * pinned to the parent container via the className override so the toast does
 * not escape to the global page corner.
 *
 * Caveat — DOCS USE ONLY: rendering four ToastProviders on the same page
 * yields four ARIA live regions sharing Radix's hard-coded
 * `aria-label="Notifications"`. Screen-reader landmark rotors will list the
 * same name four times. Acceptable on a documentation surface; in production
 * mount exactly one ToastProvider + ToastViewport at the app root.
 */
export function ToastVariantPreview({
  variant,
  title,
  description,
  triggerLabel,
}: VariantPreviewProps) {
  const [open, setOpen] = useState(false)

  return (
    <ToastProvider swipeDirection="right" duration={4000}>
      <div className="relative flex w-full min-h-[140px] items-center justify-center">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          {triggerLabel}
        </Button>
        <Toast open={open} onOpenChange={setOpen} variant={variant}>
          <div className="flex-1 min-w-0">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </div>
          <ToastAction altText="Acknowledge">OK</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport className="absolute inset-0 m-0 flex items-end justify-end p-4 sm:items-end sm:right-0 sm:top-auto sm:bottom-0 sm:max-w-full" />
      </div>
    </ToastProvider>
  )
}
