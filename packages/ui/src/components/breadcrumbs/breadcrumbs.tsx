'use client'

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  Children,
  Fragment,
  isValidElement,
} from 'react'
import { cn } from '../../lib/cn'
import { ChevronRightIcon } from '../../icons'

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  separator?: ReactNode
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { separator, className, children, ...rest },
  ref,
) {
  const sep = separator ?? <ChevronRightIcon size={14} />
  const items = Children.toArray(children).filter(isValidElement)
  return (
    <nav ref={ref} aria-label="Breadcrumb" className={cn('w-full', className)} {...rest}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((child, idx) => (
          <Fragment key={idx}>
            <li className="inline-flex items-center">{child}</li>
            {idx < items.length - 1 && (
              <li
                role="presentation"
                aria-hidden="true"
                className="text-muted-foreground inline-flex items-center"
              >
                {sep}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
})

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLSpanElement> {
  current?: boolean
  href?: string
}

export const BreadcrumbItem = forwardRef<HTMLSpanElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ current, href, className, children, ...rest }, ref) {
    if (current) {
      return (
        <span
          ref={ref}
          aria-current="page"
          className={cn('text-foreground font-semibold', className)}
          {...rest}
        >
          {children}
        </span>
      )
    }
    return (
      <a
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(
          'text-muted-foreground hover:text-foreground hover:underline underline-offset-2',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          className,
        )}
        {...(rest as AnchorAttrs)}
      >
        {children}
      </a>
    )
  },
)

type AnchorAttrs = React.AnchorHTMLAttributes<HTMLAnchorElement>
