import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppTopBar } from './app-top-bar'

afterEach(() => {
  cleanup()
})

function renderBar(menuTriggerCompact?: boolean) {
  return render(
    <AppTopBar
      logo={<span>L</span>}
      nav={<a href="/a">A</a>}
      menuTriggerCompact={menuTriggerCompact}
    />,
  )
}

function menuButton() {
  return screen.getByRole('button', { name: 'Open menu' })
}

describe('AppTopBar — menuTriggerCompact', () => {
  it('sets no density on the hamburger by default', () => {
    renderBar()
    expect(menuButton().getAttribute('data-density')).toBeNull()
  })

  it('renders the hamburger at compact density when set', () => {
    renderBar(true)
    const btn = menuButton()
    // The density-aware box class stays md; compact shrinks it via --spacing
    // (h-10 × 0.75 = 30px) so it pixel-matches a compact icon button.
    expect(btn.getAttribute('data-density')).toBe('compact')
    expect(btn.className.split(/\s+/)).toContain('h-10')
  })
})
