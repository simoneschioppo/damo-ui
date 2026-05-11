import { afterEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

afterEach(() => {
  cleanup()
})

describe('PopoverContent — surface tokens', () => {
  it('reads --popover and --popover-foreground (not --card / --foreground)', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByText('Body').closest('[role="dialog"]') as HTMLElement
    expect(content).not.toBeNull()
    // The content must be themable via --popover / --popover-foreground —
    // previously it was bound to --card / --foreground, so the theme
    // generator's Popover editor was a no-op.
    expect(content.className).toContain('bg-popover')
    expect(content.className).toContain('text-popover-foreground')
    expect(content.className).not.toMatch(/\bbg-card\b/)
    expect(content.className).not.toMatch(/\btext-foreground\b/)
  })
})

describe('Popover — open/close behavior', () => {
  it('content is not in the DOM before the trigger is clicked', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('clicking the trigger opens the popover', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('pressing Escape closes the popover', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Body')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByText('Body')).toBeNull()
  })

  it('respects `defaultOpen` so the popover is mounted on initial render', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>,
    )
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
})

describe('Popover — controlled mode', () => {
  function Controlled({ onChange }: { onChange: (next: boolean) => void }) {
    const [open, setOpen] = useState(false)
    return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          onChange(next)
        }}
      >
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>
    )
  }

  it('invokes onOpenChange(true) when the trigger opens, and (false) on Escape', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Controlled onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(onChange).toHaveBeenCalledWith(true)
    await user.keyboard('{Escape}')
    expect(onChange).toHaveBeenLastCalledWith(false)
  })
})
