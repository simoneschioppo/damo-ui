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

// Server: always returns `defaultValue` — no DOM storage available, and
// returning anything else would diverge from SSR markup.
// Client: lazy-init reads localStorage synchronously so the first commit's
// state matches whatever a host-side FOUC script (e.g. apps/web/app/layout.tsx)
// already wrote to the data-attribute. Without lazy init, the post-paint
// useEffect below would run with `value = defaultValue` and clobber the
// script's attribute write — producing a one-frame flash before storage is
// re-read and re-applied. Hydration mismatch on the React tree is not a
// concern: consumers either render the value inside lazily-mounted UI
// (e.g. Popover content) or compose data-attributes on <html>/<body> which
// are already covered by `suppressHydrationWarning`.
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

  const [value, setValueState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored !== null) return stored as T
    } catch {
      // Storage unavailable (Safari private mode, blocked cookies,
      // quota exceeded). Fall through to defaultValue.
    }
    return defaultValue
  })

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
