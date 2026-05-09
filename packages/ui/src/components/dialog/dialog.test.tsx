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
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
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
    // Only the footer Cancel button is rendered — no second close X.
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull()
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
    // Post-#66: tinting flows through the per-color `shadow-memphis-lg-destructive`
    // utility, mutually exclusive with the default `shadow-memphis-lg`.
    // Use classList.contains for exact-token comparison — substring
    // matches like `toContain('shadow-memphis-lg')` would trivially pass
    // on `shadow-memphis-lg-destructive` and miss the regression.
    expect(content.classList.contains('shadow-memphis-lg-destructive')).toBe(true)
    expect(content.classList.contains('shadow-memphis-lg')).toBe(false)
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
    expect(content.classList.contains('shadow-memphis-lg-destructive')).toBe(false)
    expect(content.classList.contains('shadow-memphis-lg')).toBe(true)
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
    expect(content.classList.contains('shadow-memphis-lg-destructive')).toBe(false)
    expect(content.classList.contains('shadow-memphis-lg')).toBe(true)
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
    expect(content.classList.contains('shadow-memphis-lg-destructive')).toBe(true)
    expect(content.classList.contains('shadow-memphis-lg')).toBe(false)
  })
})

describe('Dialog — overlay backdrop', () => {
  // Regression: DialogOverlay used `bg-ink/40`, but `--color-ink` is not
  // declared by the lib's Tailwind theme bridge — the backdrop dim never
  // resolved, leaving an invisible overlay over the page.
  // The lib's semantic token for the page text/dim is `--foreground`,
  // exposed via `--color-foreground`. Switching to `bg-foreground/40`
  // gives a token-driven, theme-aware dim that works for any consumer
  // who hasn't shipped an --ink palette.
  it('renders the overlay with a resolved foreground-tinted backdrop', async () => {
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
    // Radix renders the Overlay alongside the Content in the portal.
    // Find by the unique class combination `fixed inset-0 backdrop-blur-sm`.
    const overlay = document.querySelector('div.fixed.inset-0.backdrop-blur-sm') as HTMLElement
    expect(overlay).toBeTruthy()
    const classes = overlay.className.split(/\s+/)
    expect(classes).toContain('bg-foreground/40')
    expect(classes).not.toContain('bg-ink/40')
  })
})
