import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

afterEach(() => {
  cleanup()
})

describe('SelectContent — surface tokens', () => {
  it('reads --popover / --popover-foreground (not --card / --foreground)', async () => {
    const user = userEvent.setup()
    render(
      <Select defaultValue="a">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Bravo</SelectItem>
        </SelectContent>
      </Select>,
    )
    await user.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox')
    expect(listbox).not.toBeNull()
    expect(listbox.className).toContain('bg-popover')
    expect(listbox.className).toContain('text-popover-foreground')
    expect(listbox.className).not.toMatch(/\bbg-card\b/)
  })
})
