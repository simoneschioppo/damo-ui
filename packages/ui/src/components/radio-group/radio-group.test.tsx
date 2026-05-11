import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup, RadioGroupItem } from './radio-group'

function Harness({
  value,
  defaultValue,
  onValueChange,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <RadioGroup
      aria-label="Plan"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <RadioGroupItem value="free" aria-label="Free" />
      <RadioGroupItem value="pro" aria-label="Pro" />
      <RadioGroupItem value="enterprise" aria-label="Enterprise" />
    </RadioGroup>
  )
}

describe('RadioGroup', () => {
  it('renders 3 radio items with role="radio"', () => {
    render(<Harness />)
    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('selects an item on click and fires onValueChange with its value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness onValueChange={onValueChange} />)

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(onValueChange).toHaveBeenCalledWith('pro')
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true')
  })

  it('only one item is checked at a time', async () => {
    const user = userEvent.setup()
    render(<Harness defaultValue="free" />)

    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true')

    await user.click(screen.getByRole('radio', { name: 'Enterprise' }))
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'Enterprise' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('respects controlled `value` prop (visual state held by consumer)', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Harness value="free" onValueChange={onValueChange} />)

    await user.click(screen.getByRole('radio', { name: 'Pro' }))
    expect(onValueChange).toHaveBeenCalledWith('pro')
    // Visual state stays on "free" — consumer must update.
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAttribute('aria-checked', 'true')
  })

  it('exposes radiogroup role with aria-label', () => {
    render(<Harness />)
    // RadioGroup itself surfaces as role="radiogroup"; arrow-key navigation
    // is handled by Radix and not deterministically observable in jsdom
    // without a real focus model, so we assert the structural contract
    // (role + label + radio count) rather than the keyboard side-effect.
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument()
  })
})
