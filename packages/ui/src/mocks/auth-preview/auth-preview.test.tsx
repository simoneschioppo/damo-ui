import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AuthPreview } from './auth-preview'

describe('AuthPreview', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<AuthPreview />)
    expect(getByText('Bentornato')).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(<AuthPreview className="extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra')
  })

  it('renders the Italian welcome heading and primary CTA', () => {
    const { getByText, getByRole } = render(<AuthPreview />)
    expect(getByText('Bentornato')).toBeInTheDocument()
    expect(getByRole('button', { name: 'Entra' })).toBeInTheDocument()
  })

  it('renders Google and GitHub ghost buttons plus the footer link', () => {
    const { getByRole, getByText } = render(<AuthPreview />)
    expect(getByRole('button', { name: 'Google' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'GitHub' })).toBeInTheDocument()
    expect(getByText('Non hai un account? Registrati')).toBeInTheDocument()
  })
})
