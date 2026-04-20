import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DashboardPreview } from './dashboard-preview'

describe('DashboardPreview', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<DashboardPreview />)
    expect(getByText('Dashboard')).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(<DashboardPreview className="extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra')
  })

  it('renders 3 Stat blocks with Italian labels and the action button', () => {
    const { getByText, getByRole } = render(<DashboardPreview />)
    expect(getByText('Ricavi')).toBeInTheDocument()
    expect(getByText('Utenti')).toBeInTheDocument()
    expect(getByText('Conversione')).toBeInTheDocument()
    expect(getByRole('button', { name: '+ Nuovo' })).toBeInTheDocument()
  })

  it('renders the chart bars and filter chips', () => {
    const { getAllByTestId, getByText } = render(<DashboardPreview />)
    const bars = getAllByTestId('dashboard-bar')
    expect(bars).toHaveLength(7)
    expect(getByText('Tutti')).toBeInTheDocument()
    expect(getByText('7g')).toBeInTheDocument()
    expect(getByText('30g')).toBeInTheDocument()
    expect(getByText('90g')).toBeInTheDocument()
  })
})
