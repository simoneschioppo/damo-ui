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
        'bg-surface text-ink placeholder:text-ink-muted',
        'border-base border-border-memphis rounded-none',
        'transition-colors duration-fast',
        'hover:bg-surface-2',
        'focus-visible:outline-none focus-visible:border-accent focus-visible:[--shadow-memphis-color:var(--gold-500)] focus-visible:shadow-memphis',
        'disabled:bg-surface-2 disabled:text-ink-muted disabled:pointer-events-none',
        'aria-invalid:border-danger aria-invalid:[--shadow-memphis-color:var(--danger)] aria-invalid:shadow-memphis',
        className,
      )}
      {...rest}
    />
  )
})
