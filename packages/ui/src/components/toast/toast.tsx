'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'
import { CloseIcon } from '../../icons'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef<
  ElementRef<typeof ToastPrimitive.Viewport>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(function ToastViewport({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Viewport
      ref={ref}
      className={cn(
        'fixed z-toast bottom-0 right-0 flex max-h-screen w-full flex-col-reverse gap-3 p-4',
        'sm:bottom-auto sm:top-0 sm:right-0 sm:max-w-[420px] sm:flex-col',
        className,
      )}
      {...rest}
    />
  )
})

const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden',
    'p-4 border-2 border-memphis shadow-memphis rounded-none',
    'data-[state=open]:animate-in data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full',
    'data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
  ],
  {
    variants: {
      variant: {
        default: 'bg-card text-foreground',
        success:
          'bg-[color-mix(in_oklab,var(--success)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--success)]',
        warning:
          'bg-[color-mix(in_oklab,var(--warning)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--warning)]',
        danger:
          'bg-[color-mix(in_oklab,var(--destructive)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--destructive)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface ToastProps
  extends
    ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = forwardRef<ElementRef<typeof ToastPrimitive.Root>, ToastProps>(function Toast(
  { className, variant, ...rest },
  ref,
) {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...rest}
    />
  )
})

export const ToastTitle = forwardRef<
  ElementRef<typeof ToastPrimitive.Title>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(function ToastTitle({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Title
      ref={ref}
      className={cn('text-sm font-semibold leading-none', className)}
      {...rest}
    />
  )
})

export const ToastDescription = forwardRef<
  ElementRef<typeof ToastPrimitive.Description>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(function ToastDescription({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Description
      ref={ref}
      className={cn('mt-1 text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
})

export const ToastAction = forwardRef<
  ElementRef<typeof ToastPrimitive.Action>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(function ToastAction({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Action
      ref={ref}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-semibold',
        'border-2 border-memphis bg-card cursor-pointer',
        'hover:bg-muted',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...rest}
    />
  )
})

export const ToastClose = forwardRef<
  ElementRef<typeof ToastPrimitive.Close>,
  ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(function ToastClose({ className, ...rest }, ref) {
  return (
    <ToastPrimitive.Close
      ref={ref}
      aria-label="Chiudi"
      className={cn(
        'shrink-0 inline-flex h-8 w-8 items-center justify-center',
        'text-muted-foreground hover:text-foreground cursor-pointer',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
      {...rest}
    >
      <CloseIcon size={16} />
    </ToastPrimitive.Close>
  )
})
