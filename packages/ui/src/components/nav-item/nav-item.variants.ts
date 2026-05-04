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
          'text-muted-foreground hover:text-foreground hover:bg-muted hover:translate-x-0.5',
          'aria-[current=page]:text-foreground',
          'aria-[current=page]:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_18%,transparent),color-mix(in_oklab,var(--secondary)_10%,transparent))]',
          'aria-[current=page]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_30%,transparent)]',
          'aria-[current=page]:before:content-[""] aria-[current=page]:before:absolute',
          // Bleeds 2px into the sidebar's left rail/padding gutter — matches the
          // reference and gives the bar room to land outside the rounded outline.
          'aria-[current=page]:before:left-[-2px] aria-[current=page]:before:top-2 aria-[current=page]:before:bottom-2',
          'aria-[current=page]:before:w-[3px] aria-[current=page]:before:rounded-[2px]',
          'aria-[current=page]:before:bg-primary',
        ],
        onDark: [
          'text-[rgba(255,255,255,0.72)] hover:text-white hover:bg-white/5 hover:translate-x-0.5',
          'aria-[current=page]:text-[var(--nav-on-dark-accent)]',
          'aria-[current=page]:bg-[linear-gradient(135deg,rgba(213,168,69,0.22),rgba(122,57,128,0.12))]',
          'aria-[current=page]:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--nav-on-dark-accent-strong)_30%,transparent)]',
          'aria-[current=page]:before:content-[""] aria-[current=page]:before:absolute',
          'aria-[current=page]:before:left-[-2px] aria-[current=page]:before:top-2 aria-[current=page]:before:bottom-2',
          'aria-[current=page]:before:w-[3px] aria-[current=page]:before:rounded-[2px]',
          'aria-[current=page]:before:bg-[var(--nav-on-dark-accent-strong)]',
        ],
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

export type NavItemVariants = VariantProps<typeof navItemVariants>
