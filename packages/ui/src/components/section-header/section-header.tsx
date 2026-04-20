import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Small monospace section number rendered in gold accent (e.g. "02"). */
  num: string
  /** Section title rendered as an h2 in the display font. */
  title: string
  /** Description paragraph rendered in ink-soft below the title. */
  desc: string
  className?: string
}

// Numbered section header used by the design system showcase page.
// Layout: flex-wrap row with a mono `num` eyebrow, a large display h2, and a
// description paragraph that wraps onto its own line (flex-basis:100%).
//
// The gold accent color on `num` goes through inline style because Tailwind
// doesn't expose the raw `var(--gold-500)` token as a text color utility.
export const SectionHeader = forwardRef<HTMLElement, SectionHeaderProps>(function SectionHeader(
  { num, title, desc, className, ...rest },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn('flex flex-wrap items-baseline gap-4 mb-8', className)}
      {...rest}
    >
      <span
        className="font-mono text-sm font-bold tracking-[0.1em]"
        style={{ color: 'var(--gold-500)' }}
      >
        {num}
      </span>
      <h2
        className="font-display text-[44px] m-0 text-ink tracking-[0.01em]"
      >
        {title}
      </h2>
      <p className="text-ink-soft max-w-[640px] mt-2 text-[15px] basis-full m-0">
        {desc}
      </p>
    </header>
  )
})
