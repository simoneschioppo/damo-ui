import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker } from './date-picker'

/**
 * react-day-picker v10 renders each day as a `<button>` inside a `<td role="gridcell">`.
 * The button's accessible name is the verbose locale-formatted date ("Friday, May 15th,
 * 2026"), while its visible textContent is the day number. We query via the gridcell's
 * textContent so the assertion is locale-stable.
 */
function getDayCell(day: number) {
  const grid = screen.getByRole('grid')
  // gridcells are the table cells; we filter to the visible day number.
  const cells = within(grid).getAllByRole('gridcell')
  const cell = cells.find((c) => c.textContent?.trim() === String(day))
  if (!cell) throw new Error(`No gridcell for day ${day}`)
  const btn = cell.querySelector('button')
  if (!btn) throw new Error(`No button inside gridcell for day ${day}`)
  return btn
}

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

describe('DatePicker — selection behavior', () => {
  it('selecting a day invokes onValueChange with that Date and closes the popover', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    // Anchor the calendar to a known month via `defaultMonth` so the test
    // is stable regardless of the wall clock.
    render(
      <DatePicker
        placeholder="Pick"
        defaultMonth={new Date('2026-05-15')}
        onValueChange={onValueChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /pick/i }))
    await screen.findByRole('grid')
    await user.click(getDayCell(15))
    expect(onValueChange).toHaveBeenCalledTimes(1)
    const arg = onValueChange.mock.calls[0]?.[0] as Date
    expect(arg).toBeInstanceOf(Date)
    expect(arg.getDate()).toBe(15)
    // The popover closes after a selection.
    expect(screen.queryByRole('grid')).toBeNull()
  })

  it('updates the trigger label from placeholder to the selected date (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<DatePicker placeholder="Pick a date" defaultMonth={new Date('2026-05-15')} />)
    const trigger = screen.getByRole('button', { name: /pick a date/i })
    await user.click(trigger)
    await screen.findByRole('grid')
    await user.click(getDayCell(15))
    // After selection the placeholder is gone from the trigger.
    expect(trigger).not.toHaveTextContent('Pick a date')
  })

  it('treats `value` as parent-owned: the trigger label tracks the prop, not the local click', async () => {
    function Controlled() {
      const [value] = useState<Date | undefined>(new Date('2026-05-10'))
      // No setter: clicks must NOT change the visible label.
      return <DatePicker value={value} defaultMonth={new Date('2026-05-15')} />
    }
    const user = userEvent.setup()
    render(<Controlled />)
    const trigger = screen.getByRole('button')
    const labelBefore = trigger.textContent
    await user.click(trigger)
    await screen.findByRole('grid')
    await user.click(getDayCell(15))
    // Label stays pinned to the parent-owned May 10 value.
    expect(trigger.textContent).toBe(labelBefore)
  })

  it('honors a controlled `value`-`onValueChange` pair end-to-end', async () => {
    function Controlled() {
      const [value, setValue] = useState<Date | undefined>(undefined)
      return (
        <DatePicker
          value={value}
          onValueChange={setValue}
          defaultMonth={new Date('2026-05-15')}
          placeholder="Pick"
        />
      )
    }
    const user = userEvent.setup()
    render(<Controlled />)
    const trigger = screen.getByRole('button', { name: /pick/i })
    await user.click(trigger)
    await screen.findByRole('grid')
    await user.click(getDayCell(15))
    // Parent committed the date — the label no longer reads the placeholder.
    expect(trigger).not.toHaveTextContent('Pick')
  })
})

describe('DatePicker — disabled trigger', () => {
  it('does NOT open the popover when the `disabled` prop is set', async () => {
    const user = userEvent.setup()
    render(<DatePicker placeholder="Pick" disabled />)
    const trigger = screen.getByRole('button', { name: /pick/i })
    expect(trigger).toBeDisabled()
    await user.click(trigger)
    // disabled <button> swallows the click — no popover content mounts.
    expect(screen.queryByRole('grid')).toBeNull()
  })
})

describe('DatePicker — `disabled` Matcher inside the calendar', () => {
  it('marks specific dates as disabled when passed a Date array Matcher', async () => {
    const user = userEvent.setup()
    render(
      <DatePicker
        placeholder="Pick"
        defaultMonth={new Date('2026-05-15')}
        disabledDays={[new Date('2026-05-15')]}
      />,
    )
    await user.click(screen.getByRole('button', { name: /pick/i }))
    await screen.findByRole('grid')
    const day15 = getDayCell(15)
    // react-day-picker disables days via the `disabled` attribute on the
    // underlying button (not aria-disabled). The HTML element interface
    // surfaces this as the `disabled` property.
    expect(day15).toBeDisabled()
  })

  it('does NOT invoke onValueChange when a disabled day is clicked', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DatePicker
        placeholder="Pick"
        defaultMonth={new Date('2026-05-15')}
        disabledDays={[new Date('2026-05-15')]}
        onValueChange={onValueChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /pick/i }))
    await screen.findByRole('grid')
    const day15 = getDayCell(15)
    await user.click(day15)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('honors a functional Matcher (e.g. disable weekends)', async () => {
    const user = userEvent.setup()
    // 2026-05-09 is a Saturday, 2026-05-10 a Sunday. The functional matcher
    // disables every Sat+Sun in the visible month.
    render(
      <DatePicker
        placeholder="Pick"
        defaultMonth={new Date('2026-05-09')}
        disabledDays={(d: Date) => d.getDay() === 0 || d.getDay() === 6}
      />,
    )
    await user.click(screen.getByRole('button', { name: /pick/i }))
    await screen.findByRole('grid')
    expect(getDayCell(9)).toBeDisabled()
    expect(getDayCell(10)).toBeDisabled()
    // 11th is a Monday — should still be enabled.
    expect(getDayCell(11)).not.toBeDisabled()
  })
})
