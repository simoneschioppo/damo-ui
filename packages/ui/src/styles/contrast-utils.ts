export interface RGB {
  r: number
  g: number
  b: number
}

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

export function relativeLuminance(rgb: RGB): number {
  const r = channelLuminance(rgb.r)
  const g = channelLuminance(rgb.g)
  const b = channelLuminance(rgb.b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(hexToRgb(fg))
  const l2 = relativeLuminance(hexToRgb(bg))
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function passesAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5
}
