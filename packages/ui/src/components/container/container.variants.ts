import { cva, type VariantProps } from 'class-variance-authority'

export const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-none',
    },
    padded: {
      true: 'px-4 md:px-6 lg:px-8',
      false: '',
    },
  },
  defaultVariants: {
    size: 'lg',
    padded: true,
  },
})

export type ContainerVariants = VariantProps<typeof containerVariants>
