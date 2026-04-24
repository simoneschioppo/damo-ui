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
        'focus-visible:outline-none focus-visible:border-primary focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis',
        'disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none',
        'aria-invalid:border-danger aria-invalid:[--memphis-shadow-color:var(--danger)] aria-invalid:shadow-memphis',
        className,
      )}
      {...rest}
    />
  )
})
