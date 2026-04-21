'use client'

import { useEffect, useState } from 'react'

// Always initialize to `defaultValue` so server + client first render agree.
// After mount, read localStorage and promote to the persisted value if any.
// This avoids the hydration mismatch that would happen if the factory read
// localStorage synchronously — the server has no DOM storage and would diverge.
export function usePersistedAttr<T extends string>(
  storageKey: string,
  htmlAttr: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(defaultValue)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(storageKey)
    if (stored !== null && stored !== value) {
      setValueState(stored as T)
    }
    // Intentionally run once at mount — we want to hydrate from storage, not
    // whenever the value changes (that's the setValue path).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.setAttribute(htmlAttr, value)
  }, [htmlAttr, value])

  const setValue = (next: T) => {
    setValueState(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, next)
    }
  }

  return [value, setValue]
}
