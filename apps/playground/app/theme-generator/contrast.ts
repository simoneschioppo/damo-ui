/**
 * WCAG contrast helpers for the theme-generator UI (live badges).
 * Mirrors packages/ui/src/styles/contrast-utils.ts but lives in the app
 * to avoid cross-package export setup.
 */

function parse(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '')
  const n =
    c.length === 3
      ? c
          .split('')
          .map((x) => x + x)
          .join('')
      : c
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  }
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  const ch = (v: number) => {
    const n = v / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * ch(rgb.r) + 0.7152 * ch(rgb.g) + 0.0722 * ch(rgb.b)
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(parse(fg))
  const l2 = luminance(parse(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type ContrastLevel = 'aaa' | 'aa' | 'fail'

export function contrastLevel(fg: string, bg: string): ContrastLevel {
  const r = contrastRatio(fg, bg)
  if (r >= 7.0) return 'aaa'
  if (r >= 4.5) return 'aa'
  return 'fail'
}
