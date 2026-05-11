import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

function Harness({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>
          <button type="button">Save</button>
        </TooltipTrigger>
        <TooltipContent>Saves the document</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  it('does not render content by default (closed state)', () => {
    render(<Harness />)
    expect(screen.queryByText('Saves the document')).not.toBeInTheDocument()
  })

  it('renders content when `defaultOpen` is true', () => {
    render(<Harness defaultOpen />)
    // Radix renders the tooltip content in a portal; matchers query the
    // document body, so the text is reachable via screen.getByText.
    expect(screen.getAllByText('Saves the document').length).toBeGreaterThan(0)
  })

  it('shows content on focus and hides on blur', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const trigger = screen.getByRole('button', { name: 'Save' })
    await user.tab()
    expect(trigger).toHaveFocus()
    await waitFor(() => {
      expect(screen.getAllByText('Saves the document').length).toBeGreaterThan(0)
    })

    trigger.blur()
    await waitFor(() => {
      expect(screen.queryByText('Saves the document')).not.toBeInTheDocument()
    })
  })
})
