import { cva, type VariantProps } from 'class-variance-authority'

export const cardVariants = cva(['bg-surface text-ink'], {
  variants: {
    variant: {
      default: ['border-2 border-border-memphis shadow-memphis rounded-none'],
      elevated: ['border-2 border-border-memphis shadow-m-lg rounded-none'],
      featured: [
        '[--shadow-memphis-color:var(--gold-500)]',
        'border-2 border-border-memphis shadow-memphis rounded-none',
      ],
      interactive: [
        'border-2 border-border-memphis shadow-memphis rounded-none',
        'cursor-pointer select-none',
        'transition-[transform,box-shadow] duration-snap ease-memphis',
        'hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      ],
      dark: [
        'bg-plum-900 text-paper-50',
        'border border-[color-mix(in_oklab,theme(colors.paper.50)_12%,transparent)]',
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
