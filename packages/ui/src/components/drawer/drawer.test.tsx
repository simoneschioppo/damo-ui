import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from './drawer'

afterEach(() => {
  cleanup()
})

describe('Drawer — overlay backdrop', () => {
  // Regression: DrawerOverlay used `bg-ink/40`, but the lib does not ship
  // an --ink token surface. The class never resolved and the backdrop dim
  // was invisible. Switch to `bg-foreground/40` for token-driven theme-
  // aware dimming. See Dialog test for the full rationale.
  it('renders the overlay with a resolved foreground-tinted backdrop', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Hello</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const overlay = document.querySelector('div.fixed.inset-0.backdrop-blur-sm') as HTMLElement
    expect(overlay).toBeTruthy()
    const classes = overlay.className.split(/\s+/)
    expect(classes).toContain('bg-foreground/40')
    expect(classes).not.toContain('bg-ink/40')
  })
})

describe('Drawer — sides', () => {
  it('defaults to right side and renders the close button', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Hello</DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
