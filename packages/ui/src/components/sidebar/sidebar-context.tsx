'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { useIsMobile, type Breakpoint } from '../../hooks/use-media-query'

export interface SidebarContextValue {
  /** Viewport is below the provider's breakpoint → drawer mode. */
  isMobile: boolean
  /** Whether the mobile drawer is open. */
  openMobile: boolean
  /** Set the mobile drawer's open state. */
  setOpenMobile: (open: boolean) => void
  /** Toggle the mobile drawer open/closed. */
  toggleMobile: () => void
  /** Breakpoint below which the sidebar collapses to a drawer. */
  breakpoint: Breakpoint
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

/** Access the nearest `SidebarProvider`. Throws if used outside one. */
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (ctx === null) {
    throw new Error('useSidebar must be used within a <SidebarProvider>.')
  }
  return ctx
}

export interface SidebarProviderProps {
  /** Collapse to a drawer below this breakpoint. Default `lg` (1024px). */
  breakpoint?: Breakpoint
  /** Initial open state of the mobile drawer. Default `false`. */
  defaultOpen?: boolean
  /** Called whenever the mobile drawer open state changes. */
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
}

/**
 * Shares the state a `SidebarTrigger` (anywhere in the tree) needs to drive a
 * `responsive` `Sidebar`'s mobile drawer. Intentionally minimal — no cookie
 * persistence or keyboard shortcuts, just `isMobile` + open state.
 */
export function SidebarProvider({
  breakpoint = 'lg',
  defaultOpen = false,
  onOpenChange,
  children,
}: SidebarProviderProps) {
  const isMobile = useIsMobile(breakpoint)
  const [openMobile, setOpen] = useState(defaultOpen)

  const setOpenMobile = useCallback(
    (open: boolean) => {
      setOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange],
  )

  const value = useMemo<SidebarContextValue>(
    () => ({
      isMobile,
      openMobile,
      setOpenMobile,
      toggleMobile: () => setOpenMobile(!openMobile),
      breakpoint,
    }),
    [isMobile, openMobile, setOpenMobile, breakpoint],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
