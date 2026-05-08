import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ArticleCard } from './article-card'

describe('ArticleCard', () => {
  it('renders the title', () => {
    const { getByText } = render(
      <ArticleCard title="Regola base">
        <p>Testo della regola</p>
      </ArticleCard>,
    )
    expect(getByText('Regola base')).toBeTruthy()
  })

  it('renders the children body', () => {
    const { getByText } = render(
      <ArticleCard title="Regola base">
        <p>Testo della regola</p>
      </ArticleCard>,
    )
    expect(getByText('Testo della regola')).toBeTruthy()
  })

  it('renders the optional eyebrow label when provided', () => {
    const { getByText } = render(
      <ArticleCard label="REGOLA" title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const label = getByText('REGOLA')
    expect(label).toBeTruthy()
    expect(label.className).toContain('font-mono')
    expect(label.className).toContain('uppercase')
  })

  it('does not render an eyebrow when label is omitted', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    expect(container.querySelector('[data-slot="label"]')).toBeNull()
  })

  it('applies the display font to the title', () => {
    const { getByText } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const title = getByText('Regola base')
    expect(title.className).toContain('font-display')
  })

  it('applies Memphis frame + surface classes via Card composition', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
    expect(root.className).toContain('bg-card')
  })

  it('declares rounded-none so --radius-none token theming reaches the frame', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('rounded-none')
  })

  it('caps width to 420px via max-w-[420px] className', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('max-w-[420px]')
  })

  it('keeps the legacy p-6 padding (off Card scale, applied via className)', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('p-6')
  })

  it('forwards className', () => {
    const { container } = render(
      <ArticleCard title="Regola base" className="custom-article">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-article')
  })

  it('inherits the Memphis shadow utility from Card (no inline boxShadow override)', () => {
    const { container } = render(
      <ArticleCard title="Regola base">
        <p>Testo</p>
      </ArticleCard>,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('shadow-memphis')
    // No inline boxShadow — relies on the Card variant's class instead.
    expect(root.style.boxShadow).toBe('')
  })
})
