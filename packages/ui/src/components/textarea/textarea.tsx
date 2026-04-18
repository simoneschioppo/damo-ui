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
        'w-full px-3 py-2 text-base resize-y',
        'bg-surface text-ink placeholder:text-ink-muted',
        'border-thin border-border rounded-md',
        'transition-colors duration-fast',
        'hover:border-border-strong',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'focus-visible:border-accent',
        'disabled:opacity-50 disabled:pointer-events-none',
        invalid && 'border-danger',
        className,
      )}
      {...rest}
    />
  )
})
