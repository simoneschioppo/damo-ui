'use client'

import { forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { Drawer, DrawerContent, DrawerTitle } from '../drawer/drawer'
import { sidebarVariants, type SidebarVariants } from './sidebar.variants'
import { SidebarContext } from './sidebar-context'
import type { Breakpoint } from '../../hooks/use-media-query'

/** Reveal-at-breakpoint literals for the desktop aside (flash-guarded on mobile). */
const REVEAL_AT: Record<Breakpoint, string> = {
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
}

export interface SidebarProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'>, SidebarVariants {
  /** Optional fixed width (number → px, string → raw CSS value). */
  width?: number | string
  /**
   * Collapse to an off-canvas drawer below the `SidebarProvider`'s breakpoint,
   * toggled by a `SidebarTrigger`. Requires a `SidebarProvider` ancestor;
   * without one it renders as a normal (non-responsive) sidebar.
   */
  responsive?: boolean
  children?: ReactNode
}

/**
 * Sidebar — sticky vertical panel with Memphis chrome. Compose with
 * SidebarHeader, SidebarBrand, SidebarSubtitle, SidebarBody, SidebarFooter.
 *
 * @example
 * ```tsx
 * <Sidebar width={300}>
 *   <SidebarHeader>
 *     <SidebarBrand>DAMO · UI</SidebarBrand>
 *     <SidebarSubtitle>THEME GENERATOR</SidebarSubtitle>
 *   </SidebarHeader>
 *   <SidebarBody>…editor…</SidebarBody>
 *   <SidebarFooter>…actions…</SidebarFooter>
 * </Sidebar>
 * ```
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    sticky = true,
    border = 'right',
    width,
    responsive = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const ctx = useContext(SidebarContext)
  const i18n = useI18n()
  const widthStyle =
    width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : undefined

  // Mobile: render the body inside an off-canvas drawer driven by the provider.
  if (responsive && ctx?.isMobile) {
    return (
      <Drawer open={ctx.openMobile} onOpenChange={ctx.setOpenMobile}>
        <DrawerContent
          side="left"
          aria-describedby={undefined}
          className={cn('w-[min(85vw,22rem)] max-w-none gap-5 bg-muted px-5 py-8', className)}
        >
          <DrawerTitle className="sr-only">{i18n.sidebar.label}</DrawerTitle>
          {children}
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop (or no provider): the sticky aside. When responsive, hide it below
  // the breakpoint so the SSR / pre-hydration markup never flashes on mobile.
  const revealClass = responsive && ctx ? REVEAL_AT[ctx.breakpoint] : undefined

  return (
    <aside
      ref={ref}
      className={cn(sidebarVariants({ sticky, border }), revealClass, className)}
      style={{ ...widthStyle, ...style }}
      {...rest}
    >
      {children}
    </aside>
  )
})

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest} />
  },
)

export const SidebarBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarBrand({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('font-display text-lg tracking-[0.12em] text-primary', className)}
        {...rest}
      />
    )
  },
)

export const SidebarSubtitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarSubtitle({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('font-mono text-[10px] tracking-[0.2em] uppercase text-primary', className)}
        {...rest}
      />
    )
  },
)

export const SidebarBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarBody({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex-1 min-h-0 overflow-y-auto pr-3', className)} {...rest} />
    )
  },
)

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('mt-auto pt-5 border-t-2 border-memphis flex flex-col gap-3', className)}
        {...rest}
      />
    )
  },
)
