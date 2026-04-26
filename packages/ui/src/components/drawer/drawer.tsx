'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { CloseIcon } from '../../icons'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerPortal = DialogPrimitive.Portal
export const DrawerClose = DialogPrimitive.Close

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Overlay
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

const drawerContentVariants = cva(
  [
    'fixed z-modal bg-card text-foreground',
    'border-memphis shadow-memphis-lg rounded-none',
    'p-6 flex flex-col gap-4',
    'focus:outline-none',
  ],
  {
    variants: {
      side: {
        right: [
          'right-0 top-0 h-full w-full max-w-md',
          'border-l-2 border-y-0 border-r-0',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
        ],
        left: [
          'left-0 top-0 h-full w-full max-w-md',
          'border-r-2 border-y-0 border-l-0',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left',
        ],
        top: [
          'top-0 left-0 w-full max-h-[75vh]',
          'border-b-2 border-x-0 border-t-0',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-top',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top',
        ],
        bottom: [
          'bottom-0 left-0 w-full max-h-[75vh]',
          'border-t-2 border-x-0 border-b-0',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
        ],
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

export interface DrawerContentProps
  extends
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof drawerContentVariants> {
  hideClose?: boolean
}

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, children, side, hideClose, ...rest }, ref) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(drawerContentVariants({ side }), className)}
        {...rest}
      >
        {children}
        {!hideClose && (
          <DrawerClose
            aria-label="Chiudi"
            className={cn(
              'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center',
              'border border-transparent rounded-none text-muted-foreground cursor-pointer',
              'hover:text-foreground hover:bg-muted',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <CloseIcon size={18} />
          </DrawerClose>
        )}
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
})

export const DrawerHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DrawerHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1 pr-8 border-b border-border pb-3', className)}
        {...rest}
      />
    )
  },
)

export const DrawerBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DrawerBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('flex-1 overflow-auto py-3', className)} {...rest} />
  },
)

export const DrawerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DrawerFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col-reverse gap-2 border-t border-border pt-3 sm:flex-row sm:justify-end',
          className,
        )}
        {...rest}
      />
    )
  },
)

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DrawerTitle({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('font-display text-2xl leading-tight tracking-wide', className)}
      {...rest}
    />
  )
})

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DrawerDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
})
