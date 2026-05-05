'use client'

import { useCallback, useEffect, useState } from 'react'

// Restricts the HTML attribute name to a `data-*` form so a misuse cannot
// turn an attribute write into an event-handler binding. `data-` is the only
// shape consumers should reasonably need; everything else is a bug.
const SAFE_DATA_ATTR = /^data-[a-z][a-z0-9-]*$/

// Restrict the localStorage key to a conservative shape. This blocks both
// accidental collisions with other libraries and adversarial keys like
// `__proto__` / `constructor` that some runtimes treat as prototype probes.
const SAFE_STORAGE_KEY = /^[a-zA-Z0-9_:.-]{1,128}$/

// Always initialize to `defaultValue` so server + client first render agree.
// After mount, read localStorage and promote to the persisted value if any.
// This avoids the hydration mismatch that would happen if the factory read
// localStorage synchronously — the server has no DOM storage and would diverge.
export function usePersistedAttr<T extends string>(
  storageKey: string,
  htmlAttr: string,
  defaultValue: T,
): [T, (value: T) => void] {
  if (!SAFE_DATA_ATTR.test(htmlAttr)) {
    throw new Error(
      `usePersistedAttr: htmlAttr must match /^data-[a-z][a-z0-9-]*$/, got "${htmlAttr}"`,
    )
  }
  if (!SAFE_STORAGE_KEY.test(storageKey)) {
    throw new Error(
      `usePersistedAttr: storageKey must match /^[a-zA-Z0-9_:.-]{1,128}$/, got "${storageKey}"`,
    )
  }

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

  // Stable identity so consumers can include the setter in effect dep arrays
  // without causing extra re-subscriptions on every render.
  const setValue = useCallback(
    (next: T) => {
      setValueState(next)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, next)
      }
    },
    [storageKey],
  )

  return [value, setValue]
}
