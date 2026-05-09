import { cva, type VariantProps } from 'class-variance-authority'

// `shadow-memphis-{intent}` lives in each variant rather than the base
// because each variant paints a differently-tinted shadow via its own
// per-color @utility (see `packages/ui/src/styles/theme.css` and #66).
export const bannerVariants = cva(
  ['relative flex items-start gap-3 p-4', 'border-2 border-memphis rounded-none'],
  {
    variants: {
      variant: {
        info: 'bg-card text-foreground shadow-memphis-info',
        success:
          'bg-[color-mix(in_oklab,var(--success)_12%,var(--card))] text-foreground shadow-memphis-success',
        warning:
          'bg-[color-mix(in_oklab,var(--warning)_12%,var(--card))] text-foreground shadow-memphis-warning',
        danger:
          'bg-[color-mix(in_oklab,var(--destructive)_12%,var(--card))] text-foreground shadow-memphis-destructive',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

export type BannerVariants = VariantProps<typeof bannerVariants>
