import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppTopBar } from './app-top-bar'

afterEach(() => {
  cleanup()
})

// The mobile menu hamburger only renders when `nav` is provided.
function renderBar(menuTriggerSize?: 'sm' | 'md' | 'lg') {
  return render(
    <AppTopBar logo={<span>L</span>} nav={<a href="/a">A</a>} menuTriggerSize={menuTriggerSize} />,
  )
}

function menuButton() {
  return screen.getByRole('button', { name: 'Open menu' })
}

describe('AppTopBar — menuTriggerSize', () => {
  it('defaults to md (h-10 w-10 box, 20px icon)', () => {
    renderBar()
    const btn = menuButton()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-10')
    expect(classes).toContain('w-10')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('20')
  })

  it('renders sm (h-8 w-8 box, 16px icon) without the md box classes', () => {
    renderBar('sm')
    const btn = menuButton()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-8')
    expect(classes).toContain('w-8')
    expect(classes).not.toContain('h-10')
    expect(classes).not.toContain('w-10')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('16')
  })

  it('renders lg (h-12 w-12 box, 24px icon)', () => {
    renderBar('lg')
    const btn = menuButton()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-12')
    expect(classes).toContain('w-12')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('24')
  })

  it('keeps the shared chrome classes regardless of size', () => {
    renderBar('sm')
    const classes = menuButton().className.split(/\s+/)
    expect(classes).toContain('border-2')
    expect(classes).toContain('border-memphis')
    expect(classes).toContain('md:hidden')
  })
})
