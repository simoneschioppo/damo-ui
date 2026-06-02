import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SidebarProvider } from './sidebar-context'
import { SidebarTrigger } from './sidebar-trigger'

afterEach(() => {
  cleanup()
})

function renderTrigger(size?: 'sm' | 'md' | 'lg') {
  return render(
    <SidebarProvider>
      <SidebarTrigger size={size} />
    </SidebarProvider>,
  )
}

function trigger() {
  return screen.getByRole('button', { name: 'Toggle navigation' })
}

describe('SidebarTrigger — size', () => {
  it('defaults to md (h-10 w-10 box, 20px icon)', () => {
    renderTrigger()
    const btn = trigger()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-10')
    expect(classes).toContain('w-10')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('20')
  })

  it('renders sm (h-8 w-8 box, 16px icon) without the md box classes', () => {
    renderTrigger('sm')
    const btn = trigger()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-8')
    expect(classes).toContain('w-8')
    expect(classes).not.toContain('h-10')
    expect(classes).not.toContain('w-10')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('16')
  })

  it('renders lg (h-12 w-12 box, 24px icon)', () => {
    renderTrigger('lg')
    const btn = trigger()
    const classes = btn.className.split(/\s+/)
    expect(classes).toContain('h-12')
    expect(classes).toContain('w-12')
    expect(btn.querySelector('svg')!.getAttribute('width')).toBe('24')
  })

  it('keeps the shared chrome classes regardless of size', () => {
    renderTrigger('sm')
    const classes = trigger().className.split(/\s+/)
    expect(classes).toContain('border-2')
    expect(classes).toContain('border-memphis')
    expect(classes).toContain('lg:hidden')
  })
})
