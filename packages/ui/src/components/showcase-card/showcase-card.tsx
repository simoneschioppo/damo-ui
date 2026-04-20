import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface ShowcaseCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Optional monospace eyebrow label rendered at the top of the card. */
  label?: string
  /** Card body content. */
  children: ReactNode
  className?: string
}

// Faithful port of the design-system `.ds-card`: white surface, 2px Memphis
// border, 4px solid black Memphis shadow, 28px padding (p-7), and an optional
// monospace eyebrow label at the top.
//
// The border/shadow tokens go through inline style because Tailwind cannot
// express the 4px 4px 0 Memphis shadow concisely with CSS variable colors.
export const ShowcaseCard = forwardRef<HTMLDivElement, ShowcaseCardProps>(function ShowcaseCard(
  { label, children, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('p-7 relative', className)}
      style={{
        background: 'var(--surface)',
        border: '2px solid var(--border-memphis)',
        boxShadow: '4px 4px 0 var(--black)',
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent mb-4 font-bold block">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  )
})
