'use client'

import { forwardRef, type HTMLAttributes, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { cardVariants, type CardVariants } from './card.variants'

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardVariants {}

/**
 * Card — surface container with 5 variants (default, elevated, featured, interactive, inverse).
 * Compose with CardHeader, CardTitle, CardDescription, CardBody, CardFooter.
 *
 * When `variant="interactive"`, the card auto-receives `role="button"`,
 * `tabIndex={0}`, and keyboard activation (Enter / Space) so screen-reader
 * and keyboard-only users can reach and trigger it. Consumers can still
 * override `role` and `tabIndex` explicitly. The card MUST have an
 * accessible name — pass `aria-label` or include readable inner content.
 *
 * @example
 * ```tsx
 * <Card variant="featured" padding="md">
 *   <CardHeader><CardTitle>Title</CardTitle></CardHeader>
 *   <CardBody>Content</CardBody>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant, padding, className, role, tabIndex, onKeyDown, ...rest },
  ref,
) {
  const isInteractive = variant === 'interactive'
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      ;(event.currentTarget as HTMLDivElement).click()
    }
    onKeyDown?.(event)
  }

  return (
    <div
      ref={ref}
      role={role ?? (isInteractive ? 'button' : undefined)}
      tabIndex={isInteractive ? (tabIndex ?? 0) : tabIndex}
      onKeyDown={isInteractive || onKeyDown ? handleKeyDown : undefined}
      className={cn(cardVariants({ variant, padding }), className)}
      {...rest}
    />
  )
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
  return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...rest} />
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
