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
        default: 'bg-muted text-muted-foreground',
        featured: 'bg-badge-featured text-badge-featured-foreground',
        copper: 'bg-badge-copper text-badge-copper-foreground',
        navy: 'bg-badge-navy text-badge-navy-foreground',
        win: 'bg-success text-success-foreground',
        loss: 'bg-destructive text-destructive-foreground',
        draw: 'bg-badge-draw text-badge-draw-foreground',
        rank: 'bg-badge-rank text-badge-rank-foreground',
        outline: 'bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
