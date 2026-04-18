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
        'h-10 w-full px-3 py-2 text-base',
        'bg-surface text-ink placeholder:text-ink-muted',
        'border-thin border-border rounded-md',
        'transition-colors duration-fast',
        'hover:border-border-strong',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'focus-visible:border-accent',
        'disabled:opacity-50 disabled:pointer-events-none',
        invalid && 'border-danger aria-[invalid=true]:border-danger',
        className,
      )}
      {...rest}
    />
  )
})
