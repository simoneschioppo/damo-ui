import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider',
    'rounded-pill whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-ink border border-border',
        featured: [
          'bg-gold-500 text-black',
          'border-2 border-border-memphis shadow-memphis-sm rounded-none',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
