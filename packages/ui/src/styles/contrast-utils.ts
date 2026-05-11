/**
 * Internal — WCAG contrast helpers used by the lib's contrast tests only.
 * NOT re-exported from `src/index.ts`, so this module is not part of the
 * public API. Marked `@internal` so future contributors don't accidentally
 * surface it (e.g. via a `export *` in the root barrel). If consumers need
 * contrast utilities, copy the file or fork it — we don't commit to keeping
 * the surface stable.
 *
 * @internal
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/** @internal */
export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const normalized =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

function channelLuminance(channel: number): number {
  const v = channel / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

/** @internal */
export function relativeLuminance(rgb: RGB): number {
  const r = channelLuminance(rgb.r)
  const g = channelLuminance(rgb.g)
  const b = channelLuminance(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** @internal */
export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(hexToRgb(fg))
  const l2 = relativeLuminance(hexToRgb(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** @internal */
export function passesAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5
}
