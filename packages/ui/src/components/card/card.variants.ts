import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva(['bg-card text-card-foreground'], {
  variants: {
    variant: {
      default: ['border-2 border-memphis shadow-memphis rounded-none'],
      elevated: ['border-2 border-memphis shadow-memphis-lg rounded-none'],
      featured: [
        // Primary-tinted Memphis shadow (see #66 for the per-color
        // utilities that replaced the broken inherited-var recipe).
        'border-2 border-memphis shadow-memphis-primary rounded-none',
      ],
      interactive: [
        'border-2 border-memphis shadow-memphis rounded-none',
        'cursor-pointer select-none',
        'transition-[transform,box-shadow] duration-snap ease-memphis',
        'hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      ],
      inverse: [
        'bg-foreground text-background',
        'border border-[color-mix(in_oklab,var(--background)_12%,transparent)]',
        'shadow-md rounded-md',
      ],
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

export type CardVariants = VariantProps<typeof cardVariants>
