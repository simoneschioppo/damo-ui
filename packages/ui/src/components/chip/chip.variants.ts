import { cva, type VariantProps } from 'class-variance-authority'

export const chipVariants = cva(
  [
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium',
    'rounded-pill border-2 whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: 'bg-paper-100 text-ink border-border-memphis',
        accent:
          'bg-[color-mix(in_oklab,var(--gold-500)_18%,var(--surface))] text-ink border-[color-mix(in_oklab,var(--gold-500)_40%,transparent)]',
        brand:
          'bg-[color-mix(in_oklab,var(--plum-500)_14%,var(--surface))] text-plum-700 border-[color-mix(in_oklab,var(--plum-500)_30%,transparent)]',
        success:
          'bg-[color-mix(in_oklab,var(--success)_14%,var(--surface))] text-[var(--success)] border-[color-mix(in_oklab,var(--success)_35%,transparent)]',
        danger:
          'bg-[color-mix(in_oklab,var(--danger)_14%,var(--surface))] text-[var(--danger)] border-[color-mix(in_oklab,var(--danger)_35%,transparent)]',
        warning:
          'bg-[color-mix(in_oklab,var(--warning)_14%,var(--surface))] text-[var(--warning)] border-[color-mix(in_oklab,var(--warning)_35%,transparent)]',
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
