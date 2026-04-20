import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProfilePreview } from './profile-preview'

describe('ProfilePreview', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<ProfilePreview />)
    expect(getByText('Marina Rossi')).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(<ProfilePreview className="extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra')
  })

  it('renders the user meta, action button, and badges', () => {
    const { getByText, getByRole } = render(<ProfilePreview />)
    expect(getByText(/marina@acme\.io/)).toBeInTheDocument()
    expect(getByRole('button', { name: 'Modifica' })).toBeInTheDocument()
    expect(getByText('PRO')).toBeInTheDocument()
    expect(getByText('Early adopter')).toBeInTheDocument()
    expect(getByText('42 progetti')).toBeInTheDocument()
  })

  it('renders 4 medals and interest chips', () => {
    const { getAllByRole, getByText } = render(<ProfilePreview />)
    const medals = getAllByRole('img').filter(node => node.tagName === 'svg')
    expect(medals.length).toBeGreaterThanOrEqual(4)
    expect(getByText('Design')).toBeInTheDocument()
    expect(getByText('Typography')).toBeInTheDocument()
    expect(getByText('UX')).toBeInTheDocument()
    expect(getByText('Frontend')).toBeInTheDocument()
  })
})
