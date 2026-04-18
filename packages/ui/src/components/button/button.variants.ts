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
          'bg-plum-500 text-paper-50',
          'border-2 border-border-memphis shadow-memphis rounded-none',
          'hover:bg-plum-700 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        accent: [
          'bg-gold-500 text-black',
          'border-2 border-border-memphis shadow-memphis rounded-none',
          'hover:bg-accent-strong hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        ghost: [
          'bg-surface text-ink',
          'border-2 border-border-memphis rounded-none',
          '[--shadow-memphis-color:var(--gold-500)] shadow-memphis',
          'hover:bg-surface-2 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        danger: [
          'bg-danger text-paper-50',
          'border-2 border-border-memphis shadow-memphis rounded-none',
          'hover:brightness-110 hover:-translate-x-px hover:-translate-y-px hover:shadow-m-hover',
          'active:translate-x-[3px] active:translate-y-[3px] active:shadow-m-active',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        ],
        link: [
          'bg-transparent text-accent underline underline-offset-2',
          'border-none shadow-none rounded-none p-0',
          'hover:text-accent-strong',
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
      // link shouldn't use size padding — it's inline text
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
