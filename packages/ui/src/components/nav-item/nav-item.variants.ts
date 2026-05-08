import { cva, type VariantProps } from 'class-variance-authority'
import { selectionChromeClasses } from '../../lib/selection-chrome'

// Selection chrome (rounded-selection radius + 135° tinted gradient + 1px
// inset outline + 3px ::before bar) is shared with DropdownMenuRadioItem.
// Source of truth: `packages/ui/src/lib/selection-chrome.ts`. The bar inset
// (-2px) intentionally bleeds into the sidebar's left padding gutter, which
// is why NavItem differs from RadioItem (left-1 inside an overflow-hidden
// menu panel).
const navItemDefaultChrome = selectionChromeClasses({
  gate: 'aria-[current=page]',
  radiusToken: 'rounded-selection',
  gradientFrom: 'var(--primary)',
  gradientFromMix: 18,
  gradientTo: 'var(--secondary)',
  gradientToMix: 10,
  outlineToken: 'var(--primary)',
  outlineMix: 30,
  barColor: 'bg-primary',
  barInset: '-2px',
  barTop: '2',
  barBottom: '2',
})

// onDark mirrors the same recipe but every token is swapped to the
// `--nav-on-dark-*` set so the theme generator's "Nav on dark" controls
// reach the gradient/outline/bar layers (regression guard:
// `nav-item.tone-on-dark.test.ts`).
const navItemOnDarkChrome = selectionChromeClasses({
  gate: 'aria-[current=page]',
  radiusToken: 'rounded-selection',
  gradientFrom: 'var(--nav-on-dark-accent-strong)',
  gradientFromMix: 22,
  gradientTo: 'var(--nav-on-dark-accent)',
  gradientToMix: 12,
  outlineToken: 'var(--nav-on-dark-accent-strong)',
  outlineMix: 30,
  barColor: 'bg-[var(--nav-on-dark-accent-strong)]',
  barInset: '-2px',
  barTop: '2',
  barBottom: '2',
})

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
          ...navItemDefaultChrome,
        ],
        onDark: [
          // Idle + hover colours read from the nav-on-dark identity tokens so
          // the theme generator's "Nav on dark" controls actually theme the
          // navbar — previously these were hardcoded to the default rgba/white
          // and ignored token overrides.
          'text-[var(--nav-on-dark-foreground)] hover:text-[var(--nav-on-dark-foreground-strong)] hover:bg-white/5 hover:translate-x-0.5',
          'aria-[current=page]:text-[var(--nav-on-dark-accent)]',
          ...navItemOnDarkChrome,
        ],
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)

export type NavItemVariants = VariantProps<typeof navItemVariants>
