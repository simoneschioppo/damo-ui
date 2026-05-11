import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './switch'

describe('Switch', () => {
  it('renders unchecked by default with role="switch" and aria-checked=false', () => {
    render(<Switch aria-label="Notifications" />)
    const sw = screen.getByRole('switch', { name: 'Notifications' })
    expect(sw).toBeInTheDocument()
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles on click and fires onCheckedChange', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Toggle" onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch', { name: 'Toggle' })

    await user.click(sw)
    expect(onCheckedChange).toHaveBeenLastCalledWith(true)
    expect(sw).toHaveAttribute('aria-checked', 'true')

    await user.click(sw)
    expect(onCheckedChange).toHaveBeenLastCalledWith(false)
    expect(sw).toHaveAttribute('aria-checked', 'false')
  })

  it('respects controlled `checked` prop', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Locked" checked onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch', { name: 'Locked' })

    await user.click(sw)
    expect(onCheckedChange).toHaveBeenCalledWith(false)
    expect(sw).toHaveAttribute('aria-checked', 'true')
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Off" disabled onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch', { name: 'Off' })

    await user.click(sw)
    expect(onCheckedChange).not.toHaveBeenCalled()
    expect(sw).toBeDisabled()
  })

  it('toggles via keyboard Space', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="KB" onCheckedChange={onCheckedChange} />)
    const sw = screen.getByRole('switch', { name: 'KB' })

    sw.focus()
    await user.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })
})
