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
        'focus-visible:outline-none focus-visible:border-primary focus-visible:[--memphis-shadow-color:var(--primary)] focus-visible:shadow-memphis',
        'disabled:bg-muted disabled:text-muted-foreground disabled:pointer-events-none',
        'aria-invalid:border-danger aria-invalid:[--memphis-shadow-color:var(--danger)] aria-invalid:shadow-memphis',
        className,
      )}
      {...rest}
    />
  )
})
