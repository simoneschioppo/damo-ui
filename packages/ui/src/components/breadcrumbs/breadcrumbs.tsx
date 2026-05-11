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
import { useI18n } from '../../lib/i18n'
import { sanitizeHref } from '../../lib/safe-href'
import { ChevronRightIcon } from '../../icons'

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  separator?: ReactNode
  /** Override the `aria-label` on the `<nav>`. Defaults to the i18n string. */
  'aria-label'?: string
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { separator, className, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const i18n = useI18n()
  const sep = separator ?? <ChevronRightIcon size={14} />
  const items = Children.toArray(children).filter(isValidElement)
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel ?? i18n.breadcrumbs.label}
      className={cn('w-full', className)}
      {...rest}
    >
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

/**
 * BreadcrumbItem renders either a `<span>` (when `current`) or an `<a>`
 * (the navigable past steps). The ref type therefore widens to the union
 * of both element types — consumers receive the actual DOM node and can
 * use `instanceof` to discriminate when imperative access is needed.
 */
export const BreadcrumbItem = forwardRef<HTMLSpanElement | HTMLAnchorElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ current, href, className, children, ...rest }, ref) {
    if (current) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
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
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={sanitizeHref(href)}
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
