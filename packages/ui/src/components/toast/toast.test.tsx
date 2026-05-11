import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'

function Harness({
  open,
  onOpenChange,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <ToastProvider>
      <Toast open={open} onOpenChange={onOpenChange}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your changes have been stored.</ToastDescription>
        <ToastClose aria-label="Close toast" />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}

describe('Toast', () => {
  it('renders title + description when controlled open', () => {
    render(<Harness open onOpenChange={() => {}} />)
    expect(screen.getByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('Your changes have been stored.')).toBeInTheDocument()
  })

  it('does not render content when controlled closed', () => {
    render(<Harness open={false} onOpenChange={() => {}} />)
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when ToastClose is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Harness open onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Close toast' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('exposes role="status" on the toast root', () => {
    render(<Harness open onOpenChange={() => {}} />)
    // Radix Toast roots with default `type` ("foreground") use role="status".
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
