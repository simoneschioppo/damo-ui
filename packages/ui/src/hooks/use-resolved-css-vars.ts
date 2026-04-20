import { useEffect, useState } from 'react'

// Resolve CSS custom properties at runtime. Re-reads whenever <html>
// `data-theme` or `data-palette` changes (MutationObserver), so hex labels
// and contrast-aware text track palette switches.
//
// Why `key` (the joined names) is the *only* dependency: callers typically
// pass a fresh `.map(...)` array on every render. Using the array directly
// would make the effect rerun → setValues → rerender → effect rerun → …
// Joining into a stable string lets us bail out cleanly while still picking
// up genuine changes to the watched-var set.
export function useResolvedCssVars(names: ReadonlyArray<string>): Record<string, string> {
  const key = names.join('|')
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    const watched = key.split('|').filter(Boolean)
    const read = () => {
      const cs = getComputedStyle(root)
      const next: Record<string, string> = {}
      for (const n of watched) {
        next[n] = cs.getPropertyValue(n).trim()
      }
      setValues((prev) => {
        // Avoid a setState when nothing actually changed — keeps us out of
        // React's "same value → bail" path and prevents needless rerenders.
        const prevKeys = Object.keys(prev)
        if (prevKeys.length === watched.length) {
          let same = true
          for (const n of watched) {
            if (prev[n] !== next[n]) {
              same = false
              break
            }
          }
          if (same) return prev
        }
        return next
      })
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] })
    return () => obs.disconnect()
  }, [key])
  return values
}
