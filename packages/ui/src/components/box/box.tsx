'use client'

import {
  forwardRef,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react'
import { cn } from '../../lib/cn'
import { boxVariants, type BoxVariants } from './box.variants'

type BoxOwnProps<E extends ElementType> = BoxVariants & {
  as?: E
  className?: string
}

export type BoxProps<E extends ElementType = 'div'> = BoxOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof BoxOwnProps<E>>

export const Box = forwardRef(function Box<E extends ElementType = 'div'>(
  { as, className, direction, gap, align, justify, wrap, inline, ...rest }: BoxProps<E>,
  ref: React.Ref<Element>,
) {
  const Component = (as ?? 'div') as ElementType
  return (
    <Component
      ref={ref}
      className={cn(boxVariants({ direction, gap, align, justify, wrap, inline }), className)}
      {...rest}
    />
  )
}) as <E extends ElementType = 'div'>(
  props: BoxProps<E> & { ref?: React.Ref<Element> },
) => ReactElement | null
