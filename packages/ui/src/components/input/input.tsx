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
        'bg-surface text-ink placeholder:text-ink-muted',
        'border-2 border-border-memphis rounded-none',
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
