import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { cardVariants, type CardVariants } from './card.variants'

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardVariants {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, padding, className, ...rest },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ variant, padding }), className)} {...rest} />
})

// Convenience subparts for composition
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1.5 pb-3 border-b border-border', className)}
        {...rest}
      />
    )
  },
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...rest }, ref) {
    return (
      <h3
        ref={ref}
        className={cn('font-display text-xl leading-tight tracking-wide', className)}
        {...rest}
      />
    )
  },
)

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...rest }, ref) {
  return <p ref={ref} className={cn('text-sm text-ink-muted', className)} {...rest} />
})

export const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('py-3', className)} {...rest} />
  },
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-end gap-2 pt-3 border-t border-border', className)}
        {...rest}
      />
    )
  },
)
