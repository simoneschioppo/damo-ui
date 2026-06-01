'use client'

import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { MenuIcon } from '../../icons'
import { useSidebar } from './sidebar-context'
import type { Breakpoint } from '../../hooks/use-media-query'

/**
 * Whole Tailwind literals (one per breakpoint) so the v4 source scanner can
 * see them — a constructed string like `${bp}:hidden` would be invisible.
 */
const HIDE_AT: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
}

export type SidebarTriggerProps = ComponentPropsWithoutRef<'button'>

/**
 * Hamburger button that toggles a responsive `Sidebar`'s mobile drawer.
 * Auto-hidden at and above the provider's breakpoint. Must be rendered inside
 * a `SidebarProvider`.
 */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger({ className, onClick, children, ...rest }, ref) {
    const { toggleMobile, openMobile, breakpoint } = useSidebar()
    const i18n = useI18n()
    return (
      <button
        ref={ref}
        type="button"
        aria-label={i18n.sidebar.toggleLabel}
        aria-expanded={openMobile}
        data-state={openMobile ? 'open' : 'closed'}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) toggleMobile()
        }}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-none',
          'border-2 border-memphis bg-card text-foreground cursor-pointer',
          'transition-colors duration-fast hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          HIDE_AT[breakpoint],
          className,
        )}
        {...rest}
      >
        {children ?? <MenuIcon size={20} />}
      </button>
    )
  },
)
