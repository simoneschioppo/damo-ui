'use client'

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { eyebrow, title, description, actions, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        'flex flex-col gap-3 pb-5 mb-8',
        'border-b border-border',
        'md:flex-row md:items-end md:justify-between md:gap-8',
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="font-display text-4xl md:text-5xl leading-tight tracking-wide text-foreground m-0">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base max-w-[60ch] m-0 mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-2 items-center shrink-0">{actions}</div>}
    </header>
  )
})
