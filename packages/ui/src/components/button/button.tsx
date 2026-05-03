'use client'

import { Slot } from '@radix-ui/react-slot'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { buttonVariants, type ButtonVariants } from './button.variants'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  /**
   * When true, render the child element with all Button styles applied
   * (Radix Slot pattern). The child must be a single React element such as
   * a `<Link>` or `<a>`. The `type="button"` default is not propagated to
   * non-button children. Default: `false`.
   *
   * The forwarded ref points to the child DOM node when `asChild` is true.
   */
  asChild?: boolean
}

/**
 * Button — Memphis signature component with thick black border + offset shadow + click feedback.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Start</Button>
 * <Button variant="secondary" onClick={handleClick}>Submit</Button>
 *
 * // Render as a link, keeping all variant + animation classes:
 * <Button asChild variant="primary">
 *   <a href="/docs">Browse docs</a>
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, asChild = false, className, type = 'button', ...rest },
  ref,
) {
  const composedClassName = cn(buttonVariants({ variant, size, fullWidth }), className)

  if (asChild) {
    return <Slot ref={ref} className={composedClassName} {...rest} />
  }

  return <button ref={ref} type={type} className={composedClassName} {...rest} />
})
