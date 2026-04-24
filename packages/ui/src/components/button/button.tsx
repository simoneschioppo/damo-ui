'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { buttonVariants, type ButtonVariants } from './button.variants'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

/**
 * Button — Memphis signature component with thick black border + offset shadow + click feedback.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Start</Button>
 * <Button variant="secondary" onClick={handleClick}>Submit</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...rest}
    />
  )
})
