import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SidebarProvider } from './sidebar-context'
import { SidebarTrigger } from './sidebar-trigger'

afterEach(() => {
  cleanup()
})

function renderTrigger(variant?: 'flat' | 'raised') {
  return render(
    <SidebarProvider>
      <SidebarTrigger variant={variant} />
    </SidebarProvider>,
  )
}

function trigger() {
  return screen.getByRole('button', { name: 'Toggle navigation' })
}

describe('SidebarTrigger — variant', () => {
  it('defaults to flat: no Memphis shadow, color-only transition', () => {
    renderTrigger()
    const classes = trigger().className.split(/\s+/)
    expect(classes).not.toContain('shadow-memphis-primary')
    expect(classes).toContain('transition-colors')
  })

  it('raised: applies the Memphis shadow + press, matching the ghost button', () => {
    renderTrigger('raised')
    const classes = trigger().className.split(/\s+/)
    expect(classes).toContain('shadow-memphis-primary')
    expect(classes).toContain('hover:shadow-memphis-primary-hover')
    expect(classes).toContain('active:shadow-memphis-primary-active')
    expect(classes).toContain('active:translate-x-[3px]')
    expect(classes).toContain('data-[state=open]:shadow-memphis-primary-active')
    expect(classes).not.toContain('transition-colors')
  })
})
