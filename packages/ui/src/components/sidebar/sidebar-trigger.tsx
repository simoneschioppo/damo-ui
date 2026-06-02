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

/** Box + icon dimensions of the hamburger, per size. */
export type SidebarTriggerSize = 'sm' | 'md' | 'lg'
const TRIGGER_SIZE: Record<SidebarTriggerSize, { box: string; icon: number }> = {
  sm: { box: 'h-8 w-8', icon: 16 },
  md: { box: 'h-10 w-10', icon: 20 },
  lg: { box: 'h-12 w-12', icon: 24 },
}

export interface SidebarTriggerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'size'> {
  /**
   * Box + icon size of the hamburger, so it can be matched to an adjacent
   * action button (e.g. an `IconButton`). The box uses density-aware spacing
   * utilities. Default `'md'` (40px box, 20px icon).
   */
  size?: SidebarTriggerSize
}

/**
 * Hamburger button that toggles a responsive `Sidebar`'s mobile drawer.
 * Auto-hidden at and above the provider's breakpoint. Must be rendered inside
 * a `SidebarProvider`.
 */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger({ className, onClick, children, size = 'md', ...rest }, ref) {
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
          'inline-flex items-center justify-center rounded-none',
          TRIGGER_SIZE[size].box,
          'border-2 border-memphis bg-card text-foreground cursor-pointer',
          'transition-colors duration-fast hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          HIDE_AT[breakpoint],
          className,
        )}
        {...rest}
      >
        {children ?? <MenuIcon size={TRIGGER_SIZE[size].icon} />}
      </button>
    )
  },
)
