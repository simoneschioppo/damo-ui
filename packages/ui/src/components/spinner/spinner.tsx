'use client'

import { forwardRef, type SVGProps } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  label?: string
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
  { size = 20, label, className, ...rest },
  ref,
) {
  const i18n = useI18n()
  return (
    <svg
      ref={ref}
      role="status"
      aria-label={label ?? i18n.spinner.label}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn('animate-spin text-primary', className)}
      {...rest}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
})
