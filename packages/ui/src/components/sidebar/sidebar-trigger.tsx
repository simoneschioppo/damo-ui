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

/**
 * Memphis surface of the hamburger, per variant. `raised` mirrors the Button
 * `ghost` variant (offset shadow + hover/active/open press). Whole Tailwind
 * literals so the v4 source scanner can see every class.
 */
export type SidebarTriggerVariant = 'flat' | 'raised'
const TRIGGER_VARIANT: Record<SidebarTriggerVariant, string> = {
  flat: 'transition-colors duration-fast',
  raised:
    'transition-[transform,box-shadow,background-color,color] duration-snap ease-memphis ' +
    'shadow-memphis-primary ' +
    'hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-primary-hover ' +
    'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-primary-active ' +
    'data-[state=open]:translate-x-[3px] data-[state=open]:translate-y-[3px] data-[state=open]:shadow-memphis-primary-active',
}

export interface SidebarTriggerProps extends Omit<ComponentPropsWithoutRef<'button'>, 'size'> {
  /**
   * Box + icon size of the hamburger, so it can be matched to an adjacent
   * action button (e.g. an `IconButton`). The box uses density-aware spacing
   * utilities. Default `'md'` (40px box, 20px icon).
   */
  size?: SidebarTriggerSize
  /**
   * Memphis surface. `'flat'` (default) is a plain bordered button; `'raised'`
   * adds the Memphis offset shadow + press animation, identical to the Button
   * `ghost` variant.
   */
  variant?: SidebarTriggerVariant
  /**
   * Render at `data-density="compact"`. Combined with the default `md` size
   * this yields a 30px box, pixel-matching a compact `IconButton`. Default
   * `false`.
   */
  compact?: boolean
}

/**
 * Hamburger button that toggles a responsive `Sidebar`'s mobile drawer.
 * Auto-hidden at and above the provider's breakpoint. Must be rendered inside
 * a `SidebarProvider`.
 */
export const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger(
    { className, onClick, children, size = 'md', variant = 'flat', compact = false, ...rest },
    ref,
  ) {
    const { toggleMobile, openMobile, breakpoint } = useSidebar()
    const i18n = useI18n()
    return (
      <button
        ref={ref}
        type="button"
        aria-label={i18n.sidebar.toggleLabel}
        aria-expanded={openMobile}
        data-density={compact ? 'compact' : undefined}
        data-state={openMobile ? 'open' : 'closed'}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) toggleMobile()
        }}
        className={cn(
          'inline-flex items-center justify-center rounded-none',
          TRIGGER_SIZE[size].box,
          'border-2 border-memphis bg-card text-foreground cursor-pointer',
          'hover:bg-muted',
          TRIGGER_VARIANT[variant],
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
