import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Register the lib's custom Memphis-shadow utilities in `tailwind-merge`'s
// `shadow` conflict group. Without this, twMerge keeps both
// `shadow-memphis-primary` and a consumer-supplied `shadow-none` (or any
// other built-in `shadow-*`) on the same element, leaving last-wins source
// order to decide which paints — brittle, and breaks the "consumer can
// opt out" contract every other shadow utility honours. Cross-tier
// collisions (e.g. `shadow-memphis` + `shadow-memphis-lg-destructive`)
// also collapse correctly with this config.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [
        'shadow-memphis',
        'shadow-memphis-sm',
        'shadow-memphis-card',
        'shadow-memphis-lg',
        'shadow-memphis-hover',
        'shadow-memphis-active',
        'shadow-memphis-primary',
        'shadow-memphis-primary-hover',
        'shadow-memphis-primary-active',
        'shadow-memphis-success',
        'shadow-memphis-warning',
        'shadow-memphis-destructive',
        'shadow-memphis-info',
        'shadow-memphis-lg-destructive',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
