import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from './dropdown-menu'

afterEach(() => {
  cleanup()
})

function renderRadioMenu(value: string) {
  return render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={value}>
          <DropdownMenuRadioItem value="a">Alpha</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="b">Bravo</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>,
  )
}

describe('DropdownMenuContent', () => {
  it('renders content with memphis chrome inside the portal', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Hello</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const menu = screen.getByRole('menu')
    expect(menu.className).toContain('border-2')
    expect(menu.className).toContain('border-memphis')
    expect(menu.className).toContain('shadow-memphis')
    expect(menu.className).toContain('bg-card')
  })
})

describe('DropdownMenuRadioItem — checked state chrome', () => {
  it('applies outline + left accent bar when checked, NOT a solid bg-secondary fill', () => {
    // Reference: claude-design-system styles.css `.nav-item.active`. The
    // checked radio item should mirror that recipe — gradient background,
    // 1px inset outline, and a 3px ::before bar pinned to the left edge.
    renderRadioMenu('a')
    const checked = screen.getByRole('menuitemradio', { name: 'Alpha' })
    const cls = checked.className

    // Gradient bg gated on data-state=checked (replaces the flat bg-secondary
    // fill so selection reads as an outlined accent rather than a slab).
    expect(cls).toMatch(/data-\[state=checked\]:bg-\[linear-gradient\(/)
    // Inset 1px outline.
    expect(cls).toMatch(/data-\[state=checked\]:shadow-\[inset_0_0_0_1px_/)
    // ::before bar.
    expect(cls).toContain('data-[state=checked]:before:content-[""]')
    expect(cls).toContain('data-[state=checked]:before:absolute')
    expect(cls).toContain('data-[state=checked]:before:w-[3px]')
    expect(cls).toContain('data-[state=checked]:before:bg-primary')
    // New `selection` radius token — the chrome rounding is now configurable
    // through the theme generator instead of being hardcoded.
    expect(cls).toContain('data-[state=checked]:rounded-selection')

    // Crucially: the previous solid fill must be gone. We check that no
    // `data-[state=checked]:bg-secondary` rule slipped through twMerge.
    expect(cls).not.toMatch(/data-\[state=checked\]:bg-secondary(\s|$)/)
  })

  it('does NOT apply selection chrome on the unchecked sibling', () => {
    renderRadioMenu('a')
    const unchecked = screen.getByRole('menuitemradio', { name: 'Bravo' })
    expect(unchecked.getAttribute('data-state')).toBe('unchecked')
    // Even though the utilities are class-name-encoded, the data-state gate
    // ensures they don't *render* on unchecked items at runtime.
    expect(unchecked.getAttribute('aria-checked')).toBe('false')
  })

  it('reflects data-state="checked" on the active item', () => {
    renderRadioMenu('b')
    const checked = screen.getByRole('menuitemradio', { name: 'Bravo' })
    expect(checked.getAttribute('data-state')).toBe('checked')
    expect(checked.getAttribute('aria-checked')).toBe('true')
  })

  it('keeps both the soft focus tint and the data-[state=checked] gradient after twMerge', () => {
    // Compound state guard: when a checked item also receives focus, the
    // background utilities are gated on different variants (focus: vs
    // data-[state=checked]:) so twMerge MUST keep both — losing either one
    // would break either the persistent selection chrome or the keyboard
    // focus highlight. The CSS cascade then resolves which one wins when
    // both states are active simultaneously.
    renderRadioMenu('a')
    const cls = screen.getByRole('menuitemradio', { name: 'Alpha' }).className
    expect(cls).toContain('focus:bg-foreground/5')
    expect(cls).toMatch(/data-\[state=checked\]:bg-\[linear-gradient\(/)
  })
})

describe('DropdownMenuItem — focus chrome', () => {
  it('uses a soft tint for the focus/hover highlight (no solid secondary slab)', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Action</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const item = screen.getByRole('menuitem')
    // The previous focus:bg-secondary slab read as too aggressive next to the
    // new outlined selection chrome on radio items. We now use a low-opacity
    // foreground tint that's visible for keyboard a11y but not visually loud.
    expect(item.className).toContain('focus:bg-foreground/5')
    expect(item.className).toContain('focus:text-foreground')
    expect(item.className).not.toContain('focus:bg-secondary')
  })
})

describe('DropdownMenuCheckboxItem — preserved behavior', () => {
  it('still renders the indicator slot and base class', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Toggle</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const item = screen.getByRole('menuitemcheckbox')
    expect(item.className).toContain('focus:bg-foreground/5')
    expect(item.className).toContain('pl-8')
  })
})

describe('DropdownMenuLabel & Separator', () => {
  it('label uses mono uppercase styling', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuItem>x</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const label = screen.getByText('Theme')
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
    expect(label.className).toContain('text-primary')
  })

  it('separator renders a memphis 1px line', () => {
    const { container } = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>x</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="sep" />
          <DropdownMenuItem>y</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const sep = container.ownerDocument.querySelector('[data-testid="sep"]')!
    expect(sep.className).toContain('h-px')
    expect(sep.className).toContain('bg-memphis')
  })

  it('inset label gets pl-8 to align with indicator-padded items', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Group</DropdownMenuLabel>
          <DropdownMenuItem>x</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByText('Group').className).toContain('pl-8')
  })
})

describe('DropdownMenuItem inset variant', () => {
  it('applies pl-8 when inset is true', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Indented</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByRole('menuitem').className).toContain('pl-8')
  })
})

describe('DropdownMenuSubTrigger / DropdownMenuSubContent', () => {
  it('sub-trigger renders chevron icon and adopts secondary fill on open', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Nested</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const trigger = screen.getByRole('menuitem', { name: /More/ })
    expect(trigger.className).toContain('data-[state=open]:bg-secondary')
    expect(trigger.querySelector('svg')).not.toBeNull()
  })

  it('sub-trigger forwards inset prop to add pl-8', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>x</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByRole('menuitem', { name: /More/ }).className).toContain('pl-8')
  })
})

describe('DropdownMenuShortcut', () => {
  it('renders the shortcut span with mono typography', () => {
    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    const shortcut = screen.getByText('⌘S')
    expect(shortcut.tagName.toLowerCase()).toBe('span')
    expect(shortcut.className).toContain('font-mono')
    expect(shortcut.className).toContain('ml-auto')
  })
})
