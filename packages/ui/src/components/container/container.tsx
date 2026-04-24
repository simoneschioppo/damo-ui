'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { containerVariants, type ContainerVariants } from './container.variants'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement>, ContainerVariants {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size, padded, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cn(containerVariants({ size, padded }), className)} {...rest} />
})
