/**
 * Shared "selection chrome" recipe used by NavItem (`aria-current="page"`)
 * and DropdownMenuRadioItem (`data-state="checked"`).
 *
 * The chrome combines four CSS effects, all gated on the supplied attribute
 * selector:
 *
 *   1. `rounded-selection` (10px radius from the `--radius-selection` token)
 *   2. 135° linear gradient via `color-mix(in oklab, …)` of two tokens
 *   3. 1px inset outline shadow tinted with the `outlineToken`
 *   4. Absolute-positioned 3px-wide left bar (`::before`) with 2px radius
 *
 * The bar inset is intentionally polymorphic:
 *   - `'-2px'` (NavItem) bleeds outside the rounded outline into the
 *     sidebar's left rail/padding gutter.
 *   - `'1'` (DropdownMenuRadioItem) keeps the bar inside the menu's
 *     `overflow-hidden` panel, where a bleeding bar would be clipped.
 */
export interface SelectionChromeOptions {
  /**
   * Tailwind variant prefix that gates every emitted utility — typically
   * `'aria-[current=page]'` or `'data-[state=checked]'`. Do not include the
   * trailing colon; the helper appends it.
   */
  gate: string
  /** Tailwind radius utility, e.g. `'rounded-selection'`. */
  radiusToken: string
  /** First gradient stop token (CSS `var(...)` string). */
  gradientFrom: string
  /** First gradient stop mix percentage into transparent (0–100). */
  gradientFromMix: number
  /** Second gradient stop token (CSS `var(...)` string). */
  gradientTo: string
  /** Second gradient stop mix percentage into transparent (0–100). */
  gradientToMix: number
  /** Inset outline token (CSS `var(...)` string). */
  outlineToken: string
  /** Inset outline mix percentage into transparent (0–100). */
  outlineMix: number
  /**
   * `::before` bar background — a Tailwind background utility, either named
   * (`'bg-primary'`) or arbitrary (`'bg-[var(--nav-on-dark-accent-strong)]'`).
   * A leading `before:` prefix is stripped if accidentally provided, so
   * `'before:bg-primary'` and `'bg-primary'` produce the same class.
   */
  barColor: string
  /**
   * Bar left-inset. Either a Tailwind spacing-scale token (e.g. `'1'` →
   * `before:left-1`, `'1.5'` → `before:left-1.5`) or an arbitrary value
   * (e.g. `'-2px'` → `before:left-[-2px]`, `'var(--rail)'` →
   * `before:left-[var(--rail)]`). Anything that is not a bare positive
   * decimal is wrapped in `[…]`.
   */
  barInset: string
  /**
   * Bar `top` value. Same polymorphism as `barInset` — spacing-scale tokens
   * stay bare, arbitrary values are wrapped.
   */
  barTop: string
  /**
   * Bar `bottom` value. Same polymorphism as `barInset` — spacing-scale
   * tokens stay bare, arbitrary values are wrapped.
   */
  barBottom: string
}

// Spacing-scale tokens are bare positive decimals (`'1'`, `'1.5'`, `'.5'`,
// `'2'`). Anything else (signs, units, vars, fractions like `'1/2'`) is
// treated as a Tailwind arbitrary value and wrapped in `[…]`.
const SPACING_SCALE_PATTERN = /^\d*\.?\d+$/

function formatSpacing(prefix: string, value: string): string {
  return SPACING_SCALE_PATTERN.test(value) ? `${prefix}-${value}` : `${prefix}-[${value}]`
}

// Strip an accidental leading `before:` so `'before:bg-primary'` and
// `'bg-primary'` produce the same emitted class. Defensive against
// copy-paste from the original call-sites.
function normalizeBarColor(value: string): string {
  return value.startsWith('before:') ? value.slice('before:'.length) : value
}

export function selectionChromeClasses(opts: SelectionChromeOptions): string[] {
  const {
    gate,
    radiusToken,
    gradientFrom,
    gradientFromMix,
    gradientTo,
    gradientToMix,
    outlineToken,
    outlineMix,
    barColor,
    barInset,
    barTop,
    barBottom,
  } = opts

  const g = `${gate}:`

  return [
    `${g}${radiusToken}`,
    `${g}bg-[linear-gradient(135deg,color-mix(in_oklab,${gradientFrom}_${gradientFromMix}%,transparent),color-mix(in_oklab,${gradientTo}_${gradientToMix}%,transparent))]`,
    `${g}shadow-[inset_0_0_0_1px_color-mix(in_oklab,${outlineToken}_${outlineMix}%,transparent)]`,
    `${g}before:content-[""]`,
    `${g}before:absolute`,
    `${g}${formatSpacing('before:left', barInset)}`,
    `${g}${formatSpacing('before:top', barTop)}`,
    `${g}${formatSpacing('before:bottom', barBottom)}`,
    `${g}before:w-[3px]`,
    `${g}before:rounded-[2px]`,
    `${g}before:${normalizeBarColor(barColor)}`,
  ]
}
