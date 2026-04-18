import { cva, type VariantProps } from 'class-variance-authority'

export const chipVariants = cva(
  [
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold',
    'rounded-pill border-thin whitespace-nowrap',
    'font-mono tracking-wider',
  ],
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-ink border-border',
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
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type ChipVariants = VariantProps<typeof chipVariants>
