import { forwardRef, type SVGProps } from 'react'
import { cn } from '../lib/cn'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size = 20, className, children, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={cn('inline-block', className)}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
})
