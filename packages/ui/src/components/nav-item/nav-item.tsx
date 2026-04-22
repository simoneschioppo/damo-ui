'use client'

import { forwardRef, type AnchorHTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { navItemVariants, type NavItemVariants } from './nav-item.variants'

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement>, NavItemVariants {
  as?: ElementType
  active?: boolean
  icon?: ReactNode
  endAdornment?: ReactNode
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { as, active, icon, endAdornment, className, tone, children, ...rest },
  ref,
) {
  const Component = (as ?? 'a') as ElementType
  return (
    <Component
      ref={ref}
      aria-current={active ? 'page' : undefined}
      className={cn(navItemVariants({ tone }), className)}
      {...rest}
    >
      {icon && (
        <span className="inline-flex h-5 w-5 items-center justify-center opacity-80">{icon}</span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {endAdornment && <span className="ml-auto shrink-0">{endAdornment}</span>}
    </Component>
  )
})
