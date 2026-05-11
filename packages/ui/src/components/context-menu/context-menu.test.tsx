import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from './context-menu'

afterEach(() => {
  cleanup()
})

describe('ContextMenuContent — surface tokens', () => {
  it('reads --popover / --popover-foreground (not --card / --foreground)', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="ctx-area">area</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    // Radix's ContextMenu only mounts content after a contextmenu event,
    // so dispatch one to make the menu render.
    const area = container.querySelector('[data-testid="ctx-area"]') as HTMLElement
    fireEvent.contextMenu(area, { clientX: 10, clientY: 10 })
    const menu = document.querySelector('[role="menu"]') as HTMLElement
    expect(menu).not.toBeNull()
    expect(menu.className).toContain('bg-popover')
    expect(menu.className).toContain('text-popover-foreground')
    expect(menu.className).not.toMatch(/\bbg-card\b/)
  })
})

describe('ContextMenu — open/close behavior', () => {
  function setup() {
    return render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="ctx-area">area</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
          <ContextMenuSeparator data-testid="sep" />
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
  }

  it('is closed on initial render — no menu in the DOM', () => {
    setup()
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('opens on right-click of the trigger', () => {
    setup()
    fireEvent.contextMenu(screen.getByTestId('ctx-area'), { clientX: 10, clientY: 10 })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  it('renders the separator as a wired DOM node', () => {
    setup()
    fireEvent.contextMenu(screen.getByTestId('ctx-area'), { clientX: 10, clientY: 10 })
    expect(screen.getByTestId('sep')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    setup()
    fireEvent.contextMenu(screen.getByTestId('ctx-area'), { clientX: 10, clientY: 10 })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).toBeNull()
  })
})

describe('ContextMenu — item selection', () => {
  it('invokes the item onSelect handler when clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="ctx-area">area</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByTestId('ctx-area'), { clientX: 10, clientY: 10 })
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('closes the menu after an item is selected', async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div data-testid="ctx-area">area</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByTestId('ctx-area'), { clientX: 10, clientY: 10 })
    await user.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(screen.queryByRole('menu')).toBeNull()
  })
})
