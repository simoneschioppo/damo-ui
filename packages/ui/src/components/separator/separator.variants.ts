import { cva, type VariantProps } from 'class-variance-authority'

export const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
    variant: {
      solid: '',
      dashed:
        'bg-transparent border-t border-dashed border-border-strong data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l',
      'memphis-double':
        'bg-transparent border-y-2 border-memphis h-1 data-[orientation=vertical]:border-y-0 data-[orientation=vertical]:border-x-2 data-[orientation=vertical]:w-1 data-[orientation=vertical]:h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
})

export type SeparatorVariants = VariantProps<typeof separatorVariants>
