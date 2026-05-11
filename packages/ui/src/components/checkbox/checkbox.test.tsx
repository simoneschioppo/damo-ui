import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders unchecked by default with role="checkbox" and aria-checked=false', () => {
    render(<Checkbox aria-label="Subscribe" />)
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles checked state on click and fires onCheckedChange', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Toggle" onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Toggle' })

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledTimes(1)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    expect(checkbox).toHaveAttribute('aria-checked', 'true')

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledTimes(2)
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
  })

  it('respects the controlled `checked` prop and ignores internal toggle', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Locked" checked onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Locked' })
    expect(checkbox).toHaveAttribute('aria-checked', 'true')

    await user.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
    // Visual state stays controlled — consumer must flip `checked`.
    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('does not fire onCheckedChange when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Disabled" disabled onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Disabled' })

    await user.click(checkbox)
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(checkbox).toBeDisabled()
  })

  it('supports keyboard toggle via Space', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Keyboard" onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'Keyboard' })

    checkbox.focus()
    await user.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
