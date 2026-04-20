import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { FeedPreview } from './feed-preview'

describe('FeedPreview', () => {
  it('renders without crashing', () => {
    const { getByPlaceholderText } = render(<FeedPreview />)
    expect(getByPlaceholderText('Cerca…')).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(<FeedPreview className="extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra')
  })

  it('renders the filter chips and the Filtri action', () => {
    const { getByText, getByRole } = render(<FeedPreview />)
    expect(getByRole('button', { name: 'Filtri' })).toBeInTheDocument()
    expect(getByText('Tutti')).toBeInTheDocument()
    expect(getByText('Nuovi')).toBeInTheDocument()
    expect(getByText('Popolari')).toBeInTheDocument()
    expect(getByText('Archiviati')).toBeInTheDocument()
  })

  it('renders 3 feed items', () => {
    const { getAllByTestId } = render(<FeedPreview />)
    expect(getAllByTestId('feed-preview-item')).toHaveLength(3)
  })
})
