'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, disabled, rows = 4, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full px-3 py-2 text-base resize-y font-body font-medium',
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
