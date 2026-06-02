import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SidebarProvider } from './sidebar-context'
import { SidebarTrigger } from './sidebar-trigger'

afterEach(() => {
  cleanup()
})

function renderTrigger(compact?: boolean) {
  return render(
    <SidebarProvider>
      <SidebarTrigger compact={compact} />
    </SidebarProvider>,
  )
}

function trigger() {
  return screen.getByRole('button', { name: 'Toggle navigation' })
}

describe('SidebarTrigger — compact', () => {
  it('sets no density by default', () => {
    renderTrigger()
    expect(trigger().getAttribute('data-density')).toBeNull()
  })

  it('renders at compact density when set', () => {
    renderTrigger(true)
    expect(trigger().getAttribute('data-density')).toBe('compact')
  })
})
