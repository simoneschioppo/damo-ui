'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { CloseIcon } from '../../icons'

/**
 * Dialog — modal dialog built on Radix primitives with Memphis framing.
 * Use DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader><DialogTitle>Confirm</DialogTitle></DialogHeader>
 *     <DialogFooter><Button>OK</Button></DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-overlay bg-foreground/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
})

export interface DialogContentProps extends ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  hideClose?: boolean
  /**
   * Semantic mode.
   * - `default`: standard modal dialog (`role="dialog"`); overlay click and Esc close.
   * - `alert`: confirmation dialog (`role="alertdialog"`); overlay click does NOT
   *   close so the user must explicitly choose an action. Use for destructive
   *   or otherwise irreversible flows. Place Cancel first in the footer DOM
   *   order so it gets default focus.
   */
  severity?: 'default' | 'alert'
  /**
   * Visual tone. `danger` swaps the Memphis offset shadow to the destructive
   * token, telegraphing a high-stakes action. Orthogonal to `severity` — an
   * info dialog can still be danger-toned (e.g. error report) and an alert
   * dialog can stay default-toned.
   */
  tone?: 'default' | 'danger'
  /** Hide the built-in close button (rendered as an X in the upper right). */
}

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent(
  {
    className,
    children,
    hideClose,
    severity = 'default',
    tone = 'default',
    onPointerDownOutside,
    onInteractOutside,
    ...rest
  },
  ref,
) {
  const i18n = useI18n()
  const isAlert = severity === 'alert'
  // Override Radix's default `role="dialog"` only in alert mode. Passing
  // `role={undefined}` would actually wipe Radix's assignment (React removes
  // attributes whose value is undefined), so we spread the prop conditionally.
  const alertRoleProp = isAlert ? { role: 'alertdialog' as const } : null
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        {...alertRoleProp}
        onPointerDownOutside={(event) => {
          onPointerDownOutside?.(event)
          if (isAlert && !event.defaultPrevented) event.preventDefault()
        }}
        onInteractOutside={(event) => {
          onInteractOutside?.(event)
          if (isAlert && !event.defaultPrevented) event.preventDefault()
        }}
        className={cn(
          'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-lg bg-card text-foreground',
          'border-2 border-memphis shadow-memphis-lg rounded-none',
          'p-6 flex flex-col gap-4',
          'focus:outline-none',
          tone === 'danger' && '[--memphis-shadow-color:var(--destructive)]',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...rest}
      >
        {children}
        {!hideClose && !isAlert && (
          // Alert mode hides the X button by design — the user must choose
          // an explicit footer action (Cancel / Confirm) to close.
          <DialogClose
            aria-label={i18n.dialog.closeLabel}
            className={cn(
              'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center',
              'border border-transparent rounded-none text-muted-foreground cursor-pointer',
              'hover:text-foreground hover:bg-muted',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <CloseIcon size={18} />
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})

export const DialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1 pr-8', className)} {...rest} />
  },
)

export const DialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DialogFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
        {...rest}
      />
    )
  },
)

export const DialogTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-display text-2xl leading-tight tracking-wide', className)}
      {...rest}
    />
  )
})

export const DialogDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
})
