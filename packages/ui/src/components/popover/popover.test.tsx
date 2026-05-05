import { afterEach, describe, expect, it } from 'vitest'
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
