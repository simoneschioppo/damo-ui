'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export type AspectRatioProps = ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  function AspectRatio(props, ref) {
    return <AspectRatioPrimitive.Root ref={ref} {...props} />
  },
)
