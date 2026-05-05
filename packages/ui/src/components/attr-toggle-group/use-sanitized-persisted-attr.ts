'use client'

import { useEffect, useMemo } from 'react'
import { usePersistedAttr } from '../../hooks/use-persisted-attr'

export interface SanitizedOption {
  value: string
}

/**
 * Wraps `usePersistedAttr` with a sanitisation pass: if a previously persisted
 * value is no longer in `options`, the hook resets it to `fallback` so the
 * <html> attribute, the local state, and localStorage all converge on a known
 * good value.
 *
 * Used internally by `AttrToggleGroup`. Kept as a separate hook in case
 * future attribute-bound primitives need the same self-healing behaviour.
 */
export function useSanitizedPersistedAttr(
  options: ReadonlyArray<SanitizedOption>,
  storageKey: string,
  attribute: string,
  fallback: string,
): readonly [string, (value: string) => void] {
  const validValues = useMemo(() => new Set(options.map((o) => o.value)), [options])
  const [value, setValue] = usePersistedAttr<string>(storageKey, attribute, fallback)

  useEffect(() => {
    if (!validValues.has(value)) setValue(fallback)
  }, [value, fallback, validValues, setValue])

  return [value, setValue] as const
}
