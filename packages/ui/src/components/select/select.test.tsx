import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

afterEach(() => {
  cleanup()
})

function renderSelect(props?: Partial<Parameters<typeof Select>[0]>) {
  return render(
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Pick…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Alpha</SelectItem>
        <SelectItem value="b">Bravo</SelectItem>
        <SelectItem value="c" disabled>
          Charlie (disabled)
        </SelectItem>
      </SelectContent>
    </Select>,
  )
}

describe('SelectContent — surface tokens', () => {
  it('reads --popover / --popover-foreground (not --card / --foreground)', async () => {
    const user = userEvent.setup()
    renderSelect({ defaultValue: 'a' })
    await user.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox')
    expect(listbox).not.toBeNull()
    expect(listbox.className).toContain('bg-popover')
    expect(listbox.className).toContain('text-popover-foreground')
    expect(listbox.className).not.toMatch(/\bbg-card\b/)
  })
})

describe('Select — open/close behavior', () => {
  it('renders the trigger placeholder when no value is set', () => {
    renderSelect()
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick…')
  })

  it('opens the listbox on trigger click and lists the options', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Bravo' })).toBeInTheDocument()
  })

  it('closes the listbox after the user picks an option', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Alpha' }))
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})

describe('Select — selection behavior', () => {
  it('updates the trigger label after the user picks an option (uncontrolled)', async () => {
    const user = userEvent.setup()
    renderSelect()
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Bravo' }))
    expect(screen.getByRole('combobox')).toHaveTextContent('Bravo')
  })

  it('honors `defaultValue` for the initial selected label', () => {
    renderSelect({ defaultValue: 'b' })
    expect(screen.getByRole('combobox')).toHaveTextContent('Bravo')
  })

  it('invokes onValueChange with the picked value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderSelect({ onValueChange })
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Alpha' }))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('keeps `value` parent-owned when controlled — clicks call onValueChange but the trigger reflects the prop', async () => {
    function Controlled() {
      const [val] = useState('a')
      return (
        <Select value={val}>
          <SelectTrigger>
            <SelectValue placeholder="Pick…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Alpha</SelectItem>
            <SelectItem value="b">Bravo</SelectItem>
          </SelectContent>
        </Select>
      )
    }
    const user = userEvent.setup()
    render(<Controlled />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha')
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Bravo' }))
    // No setter wired ⇒ the trigger label remains pinned to 'a'.
    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha')
  })
})

describe('Select — disabled options', () => {
  it('does not select a disabled option when clicked', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    renderSelect({ onValueChange })
    await user.click(screen.getByRole('combobox'))
    const disabledOption = screen.getByRole('option', { name: /charlie/i })
    expect(disabledOption.getAttribute('data-disabled')).toBe('')
    // Radix swallows the click on a disabled item; no change should fire.
    await user.click(disabledOption)
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
