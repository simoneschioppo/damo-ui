import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 px-2 py-0.5',
    'text-[11px] font-mono font-bold uppercase tracking-[0.08em]',
    'rounded-none whitespace-nowrap',
    'border-2 border-memphis shadow-memphis-sm',
  ],
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground',
        featured: 'bg-badge-featured text-badge-featured-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        info: 'bg-info text-info-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
