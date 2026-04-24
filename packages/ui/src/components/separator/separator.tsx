'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'
import { separatorVariants, type SeparatorVariants } from './separator.variants'

export interface SeparatorProps
  extends
    Omit<ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>, 'orientation'>,
    SeparatorVariants {}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', variant, className, decorative = true, ...rest },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation ?? undefined}
      className={cn(separatorVariants({ orientation, variant }), className)}
      {...rest}
    />
  )
})
