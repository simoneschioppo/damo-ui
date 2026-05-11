'use client'

import { forwardRef, type ElementType, type ComponentPropsWithRef, type ReactElement } from 'react'
import { cn } from '../../lib/cn'
import { boxVariants, type BoxVariants } from './box.variants'

type BoxOwnProps<E extends ElementType> = BoxVariants & {
  as?: E
  className?: string
}

/**
 * Polymorphic prop set for `Box`. Spreading `ComponentPropsWithRef<E>`
 * (instead of `ComponentPropsWithoutRef`) is what preserves the ref
 * polymorphism on the public API — `<Box as="a" ref={anchorRef}>` types
 * `anchorRef` as `HTMLAnchorElement` automatically. Inner `forwardRef`
 * uses a loose `Ref<Element>` because React 18's signature cannot natively
 * express polymorphism; the outer `as` cast publishes the real shape.
 */
export type BoxProps<E extends ElementType = 'div'> = BoxOwnProps<E> &
  Omit<ComponentPropsWithRef<E>, keyof BoxOwnProps<E>>

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
  props: BoxProps<E> & { ref?: ComponentPropsWithRef<E>['ref'] },
) => ReactElement | null
;(Box as { displayName?: string }).displayName = 'Box'
