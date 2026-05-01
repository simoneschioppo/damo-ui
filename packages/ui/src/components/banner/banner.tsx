'use client'

import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react'
import { cn } from '../../lib/cn'
import { bannerVariants, type BannerVariants } from './banner.variants'
import { CloseIcon, InfoIcon, CheckIcon, BoltIcon, TargetIcon, HeartIcon } from '../../icons'

const DEFAULT_ICONS: Record<NonNullable<BannerVariants['variant']>, ReactNode> = {
  info: <InfoIcon size={20} />,
  success: <CheckIcon size={20} />,
  warning: <BoltIcon size={20} />,
  danger: <TargetIcon size={20} />,
  rage: <HeartIcon size={20} />,
}

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, BannerVariants {
  title?: ReactNode
  icon?: ReactNode | false
  dismissible?: boolean
  onDismiss?: () => void
  dismissLabel?: string
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    variant = 'info',
    title,
    icon,
    dismissible,
    onDismiss,
    dismissLabel = 'Chiudi',
    className,
    children,
    ...rest
  },
  ref,
) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const renderedIcon = icon === false ? null : (icon ?? DEFAULT_ICONS[variant ?? 'info'])

  function handleDismiss() {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      ref={ref}
      role={variant === 'danger' || variant === 'rage' ? 'alert' : 'status'}
      className={cn(bannerVariants({ variant }), className)}
      {...rest}
    >
      {renderedIcon && (
        <span className="shrink-0 mt-0.5" aria-hidden="true">
          {renderedIcon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold text-base leading-snug">{title}</div>}
        {children && (
          <div className={cn('text-sm text-muted-foreground', title && 'mt-1')}>{children}</div>
        )}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={handleDismiss}
          className={cn(
            'shrink-0 inline-flex h-8 w-8 items-center justify-center',
            'text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          )}
        >
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  )
})
