import { cva, type VariantProps } from 'class-variance-authority'

export const bannerVariants = cva(
  [
    'relative flex items-start gap-3 p-4',
    'border-2 border-memphis shadow-memphis rounded-none',
  ],
  {
    variants: {
      variant: {
        info: 'bg-card text-foreground [--shadow-memphis-color:var(--info)]',
        success:
          'bg-[color-mix(in_oklab,var(--success)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--success)]',
        warning:
          'bg-[color-mix(in_oklab,var(--warning)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--warning)]',
        danger:
          'bg-[color-mix(in_oklab,var(--destructive)_12%,var(--card))] text-foreground [--shadow-memphis-color:var(--destructive)]',
        rage: 'bg-[color-mix(in_oklab,var(--rage)_15%,var(--card))] text-foreground [--shadow-memphis-color:var(--rage)]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

export type BannerVariants = VariantProps<typeof bannerVariants>
