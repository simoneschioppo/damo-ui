import { cva, type VariantProps } from 'class-variance-authority'

export const sidebarVariants = cva(
  ['flex flex-col gap-5', 'px-5 py-8', 'bg-surface-2 text-ink', 'overflow-hidden'],
  {
    variants: {
      sticky: {
        true: [
          'sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))]',
          'self-start',
        ],
        false: [],
      },
      border: {
        right: ['border-r-2 border-border-memphis'],
        left: ['border-l-2 border-border-memphis'],
        none: [],
      },
    },
    defaultVariants: {
      sticky: true,
      border: 'right',
    },
  },
)

export type SidebarVariants = VariantProps<typeof sidebarVariants>
