import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './date-picker'

describe('DatePicker', () => {
  it('renders a trigger button with the placeholder text when no value', () => {
    render(<DatePicker placeholder="Pick a date" />)
    const trigger = screen.getByRole('button', { name: /pick a date/i })
    expect(trigger).toBeInTheDocument()
  })

  it('opens the calendar popover when the trigger is clicked', async () => {
    const user = userEvent.setup()
    render(<DatePicker placeholder="Pick a date" />)

    const trigger = screen.getByRole('button', { name: /pick a date/i })
    await user.click(trigger)

    // react-day-picker renders a `grid` role for the calendar table.
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })

  it('displays the selected date value when controlled', () => {
    render(<DatePicker placeholder="Pick a date" value={new Date('2026-05-11')} />)
    // The trigger label shifts from the placeholder to the formatted date —
    // we don't assert the exact format (locale-dependent), just that the
    // placeholder is gone.
    expect(screen.queryByText('Pick a date')).not.toBeInTheDocument()
  })

  it('forwards a ref to the trigger button', () => {
    let captured: HTMLButtonElement | null = null
    render(
      <DatePicker
        placeholder="Pick"
        ref={(el) => {
          captured = el
        }}
      />,
    )
    expect(captured).toBeInstanceOf(HTMLButtonElement)
  })
})
