import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap cursor-pointer',
    'font-body font-semibold',
    'transition-[transform,box-shadow,background-color,color] duration-snap ease-memphis',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary text-primary-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:bg-primary/90 hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:bg-secondary/80 hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        ghost: [
          'bg-card text-card-foreground',
          'border-2 border-memphis rounded-none',
          '[--memphis-shadow-color:var(--primary)] shadow-memphis',
          'hover:bg-muted hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        destructive: [
          'bg-destructive text-destructive-foreground',
          'border-2 border-memphis shadow-memphis rounded-none',
          'hover:brightness-110 hover:-translate-x-px hover:-translate-y-px hover:shadow-memphis-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-memphis-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        outline: [
          'bg-card text-card-foreground',
          'border-2 border-memphis rounded-none',
          'hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        link: [
          'bg-transparent text-primary underline underline-offset-2',
          'border-none shadow-none rounded-none p-0',
          'hover:text-primary/80',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        ],
      },
      size: {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 text-base gap-2',
        lg: 'px-7 py-3.5 text-lg gap-2.5',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'link', size: 'sm', class: '!p-0 text-sm' },
      { variant: 'link', size: 'md', class: '!p-0 text-base' },
      { variant: 'link', size: 'lg', class: '!p-0 text-lg' },
      { variant: 'link', size: 'icon', class: '!p-0 h-auto w-auto' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
