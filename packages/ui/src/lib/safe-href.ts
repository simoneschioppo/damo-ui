/**
 * Reject URL schemes that can execute JavaScript or evaluate to arbitrary
 * binary content. Used by anchor-rendering components (`BreadcrumbItem`,
 * `NavItem`) to guard against XSS via consumer-supplied `href` props.
 *
 * Returns the original href when safe, or `undefined` when unsafe — callers
 * should treat `undefined` as "no href" (anchor renders without it).
 *
 * Unsafe schemes filtered:
 *   - `javascript:` — runs JS on click
 *   - `data:`       — can return HTML with inline scripts
 *   - `vbscript:`   — legacy IE, blocked by modern browsers but cheap to filter
 *
 * The check is case-insensitive and tolerant of leading whitespace, which
 * matches the relaxed parsing browsers apply to href values.
 */
export function sanitizeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined
  const lower = href.trim().toLowerCase()
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:')
  ) {
    return undefined
  }
  return href
}
