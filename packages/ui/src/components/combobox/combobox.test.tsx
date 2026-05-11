import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from './combobox'

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie' },
]

afterEach(() => {
  cleanup()
})

describe('Combobox — open/close behavior', () => {
  it('opens the listbox on trigger click and renders all options', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} />)
    const trigger = screen.getByRole('button')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Bravo')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('closes the listbox after selecting an option', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} />)
    const trigger = screen.getByRole('button')
    await user.click(trigger)
    await user.click(screen.getByText('Bravo'))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('does not open when `disabled` is true', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} disabled />)
    const trigger = screen.getByRole('button')
    await user.click(trigger)
    // No listbox content rendered.
    expect(screen.queryByText('Alpha')).toBeNull()
  })
})

describe('Combobox — selection behavior', () => {
  it('updates the visible label after the user picks an option (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} />)
    const trigger = screen.getByRole('button')
    await user.click(trigger)
    await user.click(screen.getByText('Charlie'))
    expect(trigger).toHaveTextContent('Charlie')
  })

  it('honors `defaultValue` for the initial selected label', () => {
    render(<Combobox options={OPTIONS} defaultValue="b" />)
    expect(screen.getByRole('button')).toHaveTextContent('Bravo')
  })

  it('invokes onValueChange with the selected value', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('button'))
    await user.click(screen.getByText('Alpha'))
    expect(onValueChange).toHaveBeenCalledWith('a')
  })

  it('does NOT mutate internal state when `value` is controlled', async () => {
    const user = userEvent.setup()
    // Controlled with no onValueChange handler: clicking must not change the label.
    render(<Combobox options={OPTIONS} value="a" />)
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveTextContent('Alpha')
    await user.click(trigger)
    await user.click(screen.getByText('Bravo'))
    // After the popover closes, the trigger still reflects the parent-owned value.
    expect(trigger).toHaveTextContent('Alpha')
  })

  it('shows the resolved label for the currently-selected `value`', () => {
    render(<Combobox options={OPTIONS} value="c" />)
    expect(screen.getByRole('button')).toHaveTextContent('Charlie')
  })
})

describe('Combobox — custom placeholders + empty state', () => {
  it('passes a custom `placeholder` through to the trigger', () => {
    render(<Combobox options={OPTIONS} placeholder="Pick one" />)
    expect(screen.getByRole('button')).toHaveTextContent('Pick one')
  })

  it('honors `searchPlaceholder` inside the popover input', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} searchPlaceholder="Filter…" />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByPlaceholderText('Filter…')).toBeInTheDocument()
  })

  it('renders the `emptyMessage` when search filters out every option', async () => {
    const user = userEvent.setup()
    render(<Combobox options={OPTIONS} emptyMessage="Nothing matches" />)
    await user.click(screen.getByRole('button'))
    await user.type(screen.getByRole('combobox'), 'zzzzz')
    expect(screen.getByText('Nothing matches')).toBeInTheDocument()
  })
})
