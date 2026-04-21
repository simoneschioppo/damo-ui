import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { sidebarVariants } from './sidebar.variants'

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** When true (default) the sidebar sticks to `--header-height`. */
  sticky?: boolean
  /** Memphis border side. Defaults to `right` (matches theme-generator reference). */
  border?: 'right' | 'left' | 'none'
  /** Optional fixed width (number → px, string → raw CSS value). */
  width?: number | string
  children?: ReactNode
}

/**
 * Sidebar — sticky vertical panel with Memphis chrome. Compose with
 * SidebarHeader, SidebarBrand, SidebarSubtitle, SidebarBody, SidebarFooter.
 *
 * @example
 * ```tsx
 * <Sidebar width={300}>
 *   <SidebarHeader>
 *     <SidebarBrand>DAMO · UI</SidebarBrand>
 *     <SidebarSubtitle>THEME GENERATOR</SidebarSubtitle>
 *   </SidebarHeader>
 *   <SidebarBody>…editor…</SidebarBody>
 *   <SidebarFooter>…actions…</SidebarFooter>
 * </Sidebar>
 * ```
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { sticky = true, border = 'right', width, className, style, children, ...rest },
  ref,
) {
  const widthStyle =
    width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : undefined
  return (
    <aside
      ref={ref}
      className={cn(sidebarVariants({ sticky, border }), className)}
      style={{ ...widthStyle, ...style }}
      {...rest}
    >
      {children}
    </aside>
  )
})

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn('flex flex-col gap-1', className)} {...rest} />
  },
)

export const SidebarBrand = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarBrand({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('font-display text-lg tracking-[0.12em] text-accent', className)}
        {...rest}
      />
    )
  },
)

export const SidebarSubtitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarSubtitle({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'font-mono text-[10px] tracking-[0.2em] uppercase text-accent',
          className,
        )}
        {...rest}
      />
    )
  },
)

export const SidebarBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarBody({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex-1 min-h-0 overflow-y-auto', className)} {...rest} />
    )
  },
)

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'mt-auto pt-5 border-t-2 border-border-memphis flex flex-col gap-3',
          className,
        )}
        {...rest}
      />
    )
  },
)
