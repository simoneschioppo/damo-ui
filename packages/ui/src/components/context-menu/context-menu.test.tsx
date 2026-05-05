import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
