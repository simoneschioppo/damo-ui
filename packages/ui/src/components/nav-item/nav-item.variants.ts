import { cva, type VariantProps } from 'class-variance-authority'

export const navItemVariants = cva(
  [
    'relative flex items-center gap-3 w-full text-left',
    'px-3 py-2.5 text-sm font-medium',
    'font-body cursor-pointer',
    'transition-[background,color,transform] duration-fast',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    'disabled:opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      tone: {
        default: [
          'text-ink-soft hover:text-ink hover:bg-surface-2 hover:translate-x-0.5',
          'aria-[current=page]:text-ink aria-[current=page]:bg-surface-2',
        ],
        onDark: [
          'text-[rgba(255,255,255,0.72)] hover:text-white hover:bg-white/5 hover:translate-x-0.5',
          'aria-[current=page]:text-gold-200',
          'aria-[current=page]:bg-[linear-gradient(135deg,rgba(213,168,69,0.22),rgba(122,57,128,0.12))]',
          'aria-[current=page]:shadow-[inset_0_0_0_1px_rgba(213,168,69,0.3)]',
          'aria-[current=page]:before:content-[""] aria-[current=page]:before:absolute',
          'aria-[current=page]:before:left-[-2px] aria-[current=page]:before:top-2 aria-[current=page]:before:bottom-2',
          'aria-[current=page]:before:w-[3px] aria-[current=page]:before:rounded-[2px]',
          'aria-[current=page]:before:bg-gold-400',
        ],
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

export type NavItemVariants = VariantProps<typeof navItemVariants>
