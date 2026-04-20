import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Badge } from './badge'

const VARIANT_MARKERS: Array<[NonNullable<Parameters<typeof Badge>[0]['variant']>, string]> = [
  ['default', 'bg-surface-2'],
  ['featured', 'bg-gold-500'],
  ['copper', 'bg-gold-500'],
  ['navy', 'bg-plum-900'],
  ['win', 'bg-[var(--success)]'],
  ['loss', 'bg-[var(--danger)]'],
  ['draw', 'bg-paper-100'],
  ['rank', 'bg-gold-100'],
  ['outline', 'bg-transparent'],
]

describe('Badge', () => {
  it('renders with each variant', () => {
    for (const [variant, marker] of VARIANT_MARKERS) {
      const { container, unmount } = render(<Badge variant={variant}>label</Badge>)
      const el = container.firstChild as HTMLElement
      expect(el, `variant ${variant} root element`).toBeTruthy()
      expect(
        el.className,
        `variant ${variant} should include marker ${marker}`,
      ).toContain(marker)
      // Shared base classes — applied across all 9 variants
      expect(el.className, `variant ${variant} base`).toContain('border-2')
      expect(el.className, `variant ${variant} base`).toContain('border-border-memphis')
      expect(el.className, `variant ${variant} base`).toContain('shadow-memphis-sm')
      expect(el.className, `variant ${variant} base`).toContain('rounded-none')
      expect(el.className, `variant ${variant} base`).toContain('font-mono')
      expect(el.className, `variant ${variant} base`).toContain('uppercase')
      expect(el.className, `variant ${variant} base`).toContain('tracking-[0.08em]')
      unmount()
    }
  })

  it('defaults to default variant when none specified', () => {
    const { container } = render(<Badge>label</Badge>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-surface-2')
  })

  it('forwards children', () => {
    const { container } = render(<Badge variant="copper">hello world</Badge>)
    expect(container.firstChild?.textContent).toBe('hello world')
  })

  it('forwards className', () => {
    const { container } = render(
      <Badge variant="win" className="custom-extra">
        x
      </Badge>,
    )
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('custom-extra')
  })
})
