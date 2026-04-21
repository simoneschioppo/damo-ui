import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  logo: ReactNode
  nav?: ReactNode
  actions?: ReactNode
  /** When true (default) the header is rendered as a sticky top banner. */
  sticky?: boolean
}

/**
 * AppTopBar — Memphis-styled site header with logo, optional nav, and optional
 * actions slots. Defaults to sticky top placement; opt out via `sticky={false}`.
 *
 * @example
 * ```tsx
 * <AppTopBar
 *   logo={<Link href="/">Brand</Link>}
 *   nav={<><Link href="/a">A</Link><Link href="/b">B</Link></>}
 *   actions={<><ThemeSwitcher /><PaletteSwitcher options={[…]} /></>}
 * />
 * ```
 */
export const AppTopBar = forwardRef<HTMLElement, AppTopBarProps>(function AppTopBar(
  { logo, nav, actions, sticky = true, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-6 flex-wrap px-6',
        'h-[var(--header-height)] min-h-[var(--header-height)]',
        'border-b-2 border-border-memphis bg-surface text-ink',
        sticky && 'sticky top-0 z-sticky',
        className,
      )}
      {...rest}
    >
      <div className="font-display text-xl tracking-wider">{logo}</div>
      {nav !== undefined && nav !== null && <nav className="flex gap-6">{nav}</nav>}
      {actions !== undefined && actions !== null && (
        <div className="flex gap-4 items-center flex-wrap">{actions}</div>
      )}
    </header>
  )
})
