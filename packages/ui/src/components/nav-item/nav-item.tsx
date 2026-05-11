'use client'

import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { sanitizeHref } from '../../lib/safe-href'
import { navItemVariants, type NavItemVariants } from './nav-item.variants'

type NavItemOwnProps = NavItemVariants & {
  active?: boolean
  icon?: ReactNode
  endAdornment?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * Polymorphic prop set for `NavItem`. Defaulting `E = 'a'` keeps the existing
 * `AnchorHTMLAttributes` ergonomics for the common case, while
 * `<NavItem as="button" ref={btnRef}>` correctly types `btnRef` as
 * `HTMLButtonElement`. The inner `forwardRef` is loose because React 18's
 * signature cannot express polymorphism; the outer `as` cast publishes the
 * real shape.
 */
export type NavItemProps<E extends ElementType = 'a'> = NavItemOwnProps & {
  as?: E
} & Omit<ComponentPropsWithRef<E>, keyof NavItemOwnProps | 'as'>

export const NavItem = forwardRef(function NavItem<E extends ElementType = 'a'>(
  {
    as,
    active,
    icon,
    endAdornment,
    className,
    tone,
    children,
    href,
    ...rest
  }: NavItemProps<E> & AnchorHTMLAttributes<HTMLAnchorElement>,
  ref: Ref<Element>,
) {
  const Component = (as ?? 'a') as ElementType
  const safeHref = sanitizeHref(href)
  return (
    <Component
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(navItemVariants({ tone }), className)}
      {...(safeHref !== undefined ? { href: safeHref } : {})}
      {...rest}
    >
      {icon && (
        <span className="inline-flex h-5 w-5 items-center justify-center opacity-80">{icon}</span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {endAdornment && <span className="ml-auto shrink-0">{endAdornment}</span>}
    </Component>
  )
}) as <E extends ElementType = 'a'>(
  props: NavItemProps<E> & { ref?: ComponentPropsWithRef<E>['ref'] },
) => ReactElement | null
;(NavItem as { displayName?: string }).displayName = 'NavItem'
