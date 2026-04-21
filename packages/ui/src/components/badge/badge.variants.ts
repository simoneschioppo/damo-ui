import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 px-2 py-0.5',
    'text-[11px] font-mono font-bold uppercase tracking-[0.08em]',
    'rounded-none whitespace-nowrap',
    'border-2 border-border-memphis shadow-memphis-sm',
  ],
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-ink',
        featured: 'bg-gold-500 text-black',
        copper: 'bg-gold-500 text-white',
        navy: 'bg-plum-900 text-gold-200',
        win: 'bg-[var(--success)] text-white',
        loss: 'bg-[var(--danger)] text-white',
        draw: 'bg-paper-100 text-plum-900',
        rank: 'bg-gold-100 text-plum-900',
        outline: 'bg-transparent text-ink',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
