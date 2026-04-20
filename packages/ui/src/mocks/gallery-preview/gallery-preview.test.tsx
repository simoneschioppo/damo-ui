import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GalleryPreview } from './gallery-preview'

describe('GalleryPreview', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<GalleryPreview />)
    expect(getByText('BUTTONS')).toBeInTheDocument()
  })

  it('forwards className to the root element', () => {
    const { container } = render(<GalleryPreview className="extra" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('extra')
  })

  it('renders all 5 showcase sections (BUTTONS, CARDS, BADGES & CHIPS, INPUTS, AVATARS)', () => {
    const { getByText } = render(<GalleryPreview />)
    expect(getByText('BUTTONS')).toBeInTheDocument()
    expect(getByText('CARDS')).toBeInTheDocument()
    expect(getByText('BADGES & CHIPS')).toBeInTheDocument()
    expect(getByText('INPUTS')).toBeInTheDocument()
    expect(getByText('AVATARS')).toBeInTheDocument()
  })
})
