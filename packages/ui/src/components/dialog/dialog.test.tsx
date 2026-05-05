import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './dialog'

afterEach(() => {
  cleanup()
})

describe('Dialog — default severity (informational)', () => {
  it('opens on trigger click and exposes role=dialog', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
            <DialogDescription>World</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders the close button by default', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Chiudi' })).toBeInTheDocument()
  })

  it('hides the close button when hideClose is true', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.queryByRole('button', { name: 'Chiudi' })).toBeNull()
  })
})

describe('Dialog — severity="alert"', () => {
  it('renders role=alertdialog instead of role=dialog', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent severity="alert">
          <DialogHeader>
            <DialogTitle>Delete?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('hides the built-in close X — the user must use a footer action', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent severity="alert">
          <DialogHeader>
            <DialogTitle>Delete?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    // Only the footer Cancel button is rendered — no second "Chiudi" X.
    expect(screen.queryByRole('button', { name: 'Chiudi' })).toBeNull()
  })
})

describe('Dialog — tone="danger"', () => {
  it('applies the destructive shadow color override', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent tone="danger">
          <DialogHeader>
            <DialogTitle>Heads up</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByRole('dialog')
    expect(content.className).toContain('[--memphis-shadow-color:var(--destructive)]')
  })

  it('does not apply the destructive shadow override in default tone', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByRole('dialog')
    expect(content.className).not.toContain('[--memphis-shadow-color:var(--destructive)]')
  })
})

describe('Dialog — severity + tone are orthogonal', () => {
  it('alert + default tone keeps the standard shadow', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent severity="alert">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByRole('alertdialog')
    expect(content.className).not.toContain('[--memphis-shadow-color:var(--destructive)]')
  })

  it('alert + danger tone combines both', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent severity="alert" tone="danger">
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const content = screen.getByRole('alertdialog')
    expect(content.className).toContain('[--memphis-shadow-color:var(--destructive)]')
  })
})
