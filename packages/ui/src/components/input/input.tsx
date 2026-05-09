'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, disabled, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full px-3 py-2 text-base font-body font-medium',
        'bg-card text-foreground placeholder:text-muted-foreground',
        'border-2 border-memphis rounded-none',
        'transition-colors duration-fast',
        'hover:bg-muted',
        // Tinted Memphis shadow on focus/invalid (see #66 for the per-color
        // utilities that replaced the broken inherited-var recipe).
        'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-memphis-primary',
        'disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none',
        'aria-invalid:border-destructive aria-invalid:shadow-memphis-destructive',
        className,
      )}
      {...rest}
    />
  )
})
