import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...rest },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        'text-xs font-semibold uppercase tracking-wider text-ink-muted cursor-pointer',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  )
})
