import * as ProgressPrimitive from '@radix-ui/react-progress'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
}

export const Progress = forwardRef<ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  function Progress({ className, indicatorClassName, value, ...rest }, ref) {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={value}
        className={cn(
          'relative h-3 w-full overflow-hidden bg-surface-2',
          'border-thin border-border-memphis rounded-md',
          className,
        )}
        {...rest}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 bg-plum-500 transition-transform duration-slow ease-out',
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  },
)
