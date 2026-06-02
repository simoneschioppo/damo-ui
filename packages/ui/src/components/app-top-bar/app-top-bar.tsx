'use client'

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { MenuIcon } from '../../icons'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../drawer/drawer'
import type { Breakpoint } from '../../hooks/use-media-query'

/** Whole Tailwind literals so the v4 source scanner can see them. */
const NAV_REVEAL: Record<Breakpoint, string> = {
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
}
const MENU_HIDE: Record<Breakpoint, string> = {
  sm: 'sm:hidden',
  md: 'md:hidden',
  lg: 'lg:hidden',
}

/** Box + icon dimensions of the mobile menu hamburger, per size. */
export type AppTopBarMenuSize = 'sm' | 'md' | 'lg'
const MENU_TRIGGER_SIZE: Record<AppTopBarMenuSize, { box: string; icon: number }> = {
  sm: { box: 'h-8 w-8', icon: 16 },
  md: { box: 'h-10 w-10', icon: 20 },
  lg: { box: 'h-12 w-12', icon: 24 },
}

/**
 * Memphis surface of the mobile menu hamburger, per variant. `raised` mirrors
 * the Button `ghost` variant (offset shadow + hover/active/open press) so the
 * hamburger can match a `ghost` action button (e.g. an `IconButton`). Whole
 * Tailwind literals so the v4 source scanner can see every class.
 */
export type AppTopBarMenuVariant = 'flat' | 'raised'
const MENU_TRIGGER_VARIANT: Record<AppTopBarMenuVariant, string> = {
  flat: 'transition-colors duration-fast',
  raised:
    'transition-[transform,box-shadow,background-color,color] duration-snap ease-memphis ' +
    'shadow-memphis-primary ' +
    'hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-primary-hover ' +
    'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-primary-active ' +
    'data-[state=open]:translate-x-[3px] data-[state=open]:translate-y-[3px] data-[state=open]:shadow-memphis-primary-active',
}

export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  logo: ReactNode
  nav?: ReactNode
  actions?: ReactNode
  /** When true (default) the header is rendered as a sticky top banner. */
  sticky?: boolean
  /**
   * Below this breakpoint the `nav` collapses into a mobile menu (hamburger →
   * Drawer) so the single-row header never wraps and spills over the page.
   * Default `md` (768px).
   */
  mobileBreakpoint?: Breakpoint
  /**
   * Box + icon size of the mobile menu hamburger, so it can be matched to an
   * adjacent action button (e.g. an `IconButton`). The box uses density-aware
   * spacing utilities. Default `'md'` (40px box, 20px icon).
   */
  menuTriggerSize?: AppTopBarMenuSize
  /**
   * Memphis surface of the mobile menu hamburger. `'flat'` (default) is a plain
   * bordered button; `'raised'` adds the Memphis offset shadow + press
   * animation, identical to the Button `ghost` variant (e.g. an `IconButton`).
   */
  menuTriggerVariant?: AppTopBarMenuVariant
}

/**
 * AppTopBar — Memphis-styled site header with logo, optional nav, and optional
 * actions slots. Defaults to sticky top placement; opt out via `sticky={false}`.
 * Below `mobileBreakpoint` the nav collapses into a hamburger-driven drawer.
 *
 * @example
 * ```tsx
 * <AppTopBar
 *   logo={<Link href="/">Brand</Link>}
 *   nav={<><Link href="/a">A</Link><Link href="/b">B</Link></>}
 *   actions={<DisplaySettings />}
 * />
 * ```
 */
export const AppTopBar = forwardRef<HTMLElement, AppTopBarProps>(function AppTopBar(
  {
    logo,
    nav,
    actions,
    sticky = true,
    mobileBreakpoint = 'md',
    menuTriggerSize = 'md',
    menuTriggerVariant = 'flat',
    className,
    ...rest
  },
  ref,
) {
  const hasNav = nav !== undefined && nav !== null
  const hasActions = actions !== undefined && actions !== null
  return (
    <header
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-6 px-6',
        'h-[var(--header-height)] min-h-[var(--header-height)]',
        'border-b-2 border-memphis bg-card text-foreground',
        sticky && 'sticky top-0 z-header',
        className,
      )}
      {...rest}
    >
      <div className="font-display text-xl tracking-wider">{logo}</div>
      {hasNav && (
        <nav className={cn('items-center gap-6', NAV_REVEAL[mobileBreakpoint])}>{nav}</nav>
      )}
      {(hasActions || hasNav) && (
        <div className="flex gap-4 items-center flex-wrap">
          {actions}
          {hasNav && (
            <AppTopBarMobileMenu
              breakpoint={mobileBreakpoint}
              size={menuTriggerSize}
              variant={menuTriggerVariant}
            >
              {nav}
            </AppTopBarMobileMenu>
          )}
        </div>
      )}
    </header>
  )
})

interface AppTopBarMobileMenuProps {
  breakpoint: Breakpoint
  size: AppTopBarMenuSize
  variant: AppTopBarMenuVariant
  children: ReactNode
}

/** Hamburger (below the breakpoint) that opens the nav in a right-side drawer. */
function AppTopBarMobileMenu({ breakpoint, size, variant, children }: AppTopBarMobileMenuProps) {
  const [open, setOpen] = useState(false)
  const i18n = useI18n()
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          aria-label={i18n.appTopBar.menuLabel}
          className={cn(
            'inline-flex items-center justify-center rounded-none',
            MENU_TRIGGER_SIZE[size].box,
            'border-2 border-memphis bg-card text-foreground cursor-pointer',
            'hover:bg-muted',
            MENU_TRIGGER_VARIANT[variant],
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            MENU_HIDE[breakpoint],
          )}
        >
          <MenuIcon size={MENU_TRIGGER_SIZE[size].icon} />
        </button>
      </DrawerTrigger>
      <DrawerContent side="right" aria-describedby={undefined} className="w-[min(85vw,18rem)]">
        <DrawerTitle className="sr-only">{i18n.appTopBar.menuLabel}</DrawerTitle>
        {/* Close the menu once a nav link is selected. */}
        <nav
          className="mt-2 flex flex-col gap-1"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setOpen(false)
          }}
        >
          {children}
        </nav>
      </DrawerContent>
    </Drawer>
  )
}
