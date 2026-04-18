'use client'

import { useEffect, useState } from 'react'

export function usePersistedAttr<T extends string>(
  storageKey: string,
  htmlAttr: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValueState] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(storageKey)
    return (stored as T) ?? defaultValue
  })

  useEffect(() => {
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
