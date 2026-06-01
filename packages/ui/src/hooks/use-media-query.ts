'use client'

import { useCallback, useSyncExternalStore } from 'react'

/** Tailwind's default breakpoints (px). "Mobile" means *below* one of these. */
const BREAKPOINTS = { sm: 640, md: 768, lg: 1024 } as const

export type Breakpoint = keyof typeof BREAKPOINTS

const noop = () => {}

/**
 * Subscribe to a CSS media query and return whether it currently matches.
 *
 * SSR-safe via `useSyncExternalStore`: the server snapshot is always `false`,
 * so server markup is deterministic and there is no hydration mismatch; the
 * client re-reads `matchMedia` immediately after hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return noop
      const mql = window.matchMedia(query)
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onStoreChange)
        return () => mql.removeEventListener('change', onStoreChange)
      }
      // Safari < 14 fallback.
      mql.addListener(onStoreChange)
      return () => mql.removeListener(onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia(query).matches
  }, [query])

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/**
 * `true` while the viewport is *below* the given breakpoint (default `lg`, i.e.
 * < 1024px) — the point at which a responsive `Sidebar` collapses to a drawer.
 * The `- 0.02px` stops the boundary width from matching both the mobile and
 * desktop queries at the exact breakpoint.
 */
export function useIsMobile(breakpoint: Breakpoint = 'lg'): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS[breakpoint] - 0.02}px)`)
}
