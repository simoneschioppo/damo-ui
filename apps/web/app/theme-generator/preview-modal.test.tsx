import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { PreviewModal } from './preview-modal'

describe('PreviewModal', () => {
  it('renders the trigger button by default', () => {
    render(<PreviewModal initialScene="dashboard" />)
    expect(screen.getByTestId('open-preview-modal')).toBeInTheDocument()
    expect(screen.queryByTestId('preview-modal-content')).toBeNull()
  })

  it('opens the modal when the trigger is clicked', () => {
    render(<PreviewModal initialScene="dashboard" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    expect(screen.getByTestId('preview-modal-content')).toBeInTheDocument()
  })

  it('renders the scene tabs inside the modal body', () => {
    render(<PreviewModal initialScene="dashboard" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    const body = screen.getByTestId('preview-modal-body')
    expect(within(body).getByRole('tab', { name: 'Gallery' })).toBeInTheDocument()
    expect(within(body).getByRole('tab', { name: 'Auth' })).toBeInTheDocument()
    expect(within(body).getByRole('tab', { name: 'Dashboard' })).toBeInTheDocument()
    expect(within(body).getByRole('tab', { name: 'Profile' })).toBeInTheDocument()
    expect(within(body).getByRole('tab', { name: 'Feed' })).toBeInTheDocument()
  })

  it('starts with data-theme="light" and switches to dark when toggled', () => {
    render(<PreviewModal initialScene="dashboard" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    const body = screen.getByTestId('preview-modal-body')
    expect(body.getAttribute('data-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }))
    expect(body.getAttribute('data-theme')).toBe('dark')
  })

  it('honors the initial scene prop', () => {
    render(<PreviewModal initialScene="profile" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    const body = screen.getByTestId('preview-modal-body')
    const profileTab = within(body).getByRole('tab', { name: 'Profile' })
    expect(profileTab.getAttribute('data-state')).toBe('active')
  })

  it('resets the scene to the initial value each time the modal reopens', () => {
    const { rerender } = render(<PreviewModal initialScene="dashboard" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    let body = screen.getByTestId('preview-modal-body')
    expect(within(body).getByRole('tab', { name: 'Dashboard' }).getAttribute('data-state')).toBe(
      'active',
    )
    // Close + reopen with a different initial scene
    fireEvent.keyDown(body, { key: 'Escape', code: 'Escape' })
    rerender(<PreviewModal initialScene="feed" />)
    fireEvent.click(screen.getByTestId('open-preview-modal'))
    body = screen.getByTestId('preview-modal-body')
    expect(within(body).getByRole('tab', { name: 'Feed' }).getAttribute('data-state')).toBe(
      'active',
    )
  })
})
