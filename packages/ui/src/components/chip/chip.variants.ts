import { cva, type VariantProps } from 'class-variance-authority'

export const chipVariants = cva(
  [
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
    'rounded-pill border-2 whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: 'bg-[var(--surface)] text-ink border-border-memphis',
        accent:
          'bg-[color-mix(in_oklab,var(--gold-500)_28%,var(--surface))] text-[color-mix(in_oklab,var(--gold-500)_55%,var(--ink))] border-[color-mix(in_oklab,var(--gold-500)_50%,transparent)]',
        brand:
          'bg-[color-mix(in_oklab,var(--plum-500)_28%,var(--surface))] text-[color-mix(in_oklab,var(--plum-500)_55%,var(--ink))] border-[color-mix(in_oklab,var(--plum-500)_50%,transparent)]',
        success:
          'bg-[color-mix(in_oklab,var(--success)_28%,var(--surface))] text-[color-mix(in_oklab,var(--success)_65%,var(--ink))] border-[color-mix(in_oklab,var(--success)_50%,transparent)]',
        danger:
          'bg-[color-mix(in_oklab,var(--danger)_28%,var(--surface))] text-[color-mix(in_oklab,var(--danger)_65%,var(--ink))] border-[color-mix(in_oklab,var(--danger)_50%,transparent)]',
        warning:
          'bg-[color-mix(in_oklab,var(--warning)_28%,var(--surface))] text-[color-mix(in_oklab,var(--warning)_65%,var(--ink))] border-[color-mix(in_oklab,var(--warning)_50%,transparent)]',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1.5 text-xs',
        lg: 'px-3.5 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type ChipVariants = VariantProps<typeof chipVariants>
