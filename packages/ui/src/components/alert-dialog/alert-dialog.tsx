import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal
export const AlertDialogAction = AlertDialogPrimitive.Action
export const AlertDialogCancel = AlertDialogPrimitive.Cancel

export const AlertDialogOverlay = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...rest }, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-overlay bg-ink/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className,
      )}
      {...rest}
    />
  )
})

export interface AlertDialogContentProps extends ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> {
  tone?: 'default' | 'danger'
}

export const AlertDialogContent = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(function AlertDialogContent({ className, tone = 'default', ...rest }, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-1/2 top-1/2 z-modal -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-md bg-surface text-ink',
          'border-base border-border-memphis shadow-m-lg rounded-none',
          'p-6 flex flex-col gap-4',
          'focus:outline-none',
          tone === 'danger' && '[--shadow-memphis-color:var(--danger)]',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        )}
        {...rest}
      />
    </AlertDialogPortal>
  )
})

export const AlertDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest} />
  },
)

export const AlertDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
        {...rest}
      />
    )
  },
)

export const AlertDialogTitle = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...rest }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn('font-display text-2xl leading-tight tracking-wide', className)}
      {...rest}
    />
  )
})

export const AlertDialogDescription = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...rest }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-ink-muted', className)}
      {...rest}
    />
  )
})
