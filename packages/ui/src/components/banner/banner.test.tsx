import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Banner } from './banner'

afterEach(() => {
  cleanup()
})

describe('Banner — content surface', () => {
  it('renders title + body as separate visual blocks', () => {
    render(<Banner title="Heads up">Body copy</Banner>)
    // Title and body share an alert/status surface — distinct nodes, not concatenated.
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })

  it('renders children alone (no title) without crashing', () => {
    render(<Banner>only body</Banner>)
    expect(screen.getByText('only body')).toBeInTheDocument()
  })

  it('does NOT render a dismiss button when `dismissible` is omitted', () => {
    render(<Banner title="x">y</Banner>)
    expect(screen.queryByRole('button')).toBeNull()
  })
})

describe('Banner — role/live mapping', () => {
  it('uses role="status" + aria-live="polite" for non-danger variants', () => {
    const variants = ['info', 'success', 'warning'] as const
    for (const variant of variants) {
      cleanup()
      render(
        <Banner variant={variant} title={variant}>
          body
        </Banner>,
      )
      // Find the surface — title text is rendered inside the banner root.
      const surface = screen.getByText(variant).closest('[role]') as HTMLElement
      expect(surface.getAttribute('role')).toBe('status')
      expect(surface.getAttribute('aria-live')).toBe('polite')
    }
  })

  it('uses role="alert" + aria-live="assertive" for variant="danger"', () => {
    render(
      <Banner variant="danger" title="boom">
        body
      </Banner>,
    )
    const surface = screen.getByText('boom').closest('[role]') as HTMLElement
    expect(surface.getAttribute('role')).toBe('alert')
    expect(surface.getAttribute('aria-live')).toBe('assertive')
  })
})

describe('Banner — icon behavior', () => {
  it('renders the variant default icon when `icon` is omitted', () => {
    const { container } = render(<Banner variant="success">y</Banner>)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('omits the icon slot entirely when `icon={false}` is passed', () => {
    const { container } = render(
      <Banner variant="success" icon={false}>
        y
      </Banner>,
    )
    // Without an icon, there is no aria-hidden wrapper preceding the body.
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('renders a caller-supplied icon node, replacing the variant default', () => {
    render(
      <Banner variant="info" icon={<span data-testid="custom-icon">★</span>}>
        body
      </Banner>,
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })
})

describe('Banner — dismiss behavior', () => {
  it('clicking dismiss unmounts the surface (default uncontrolled flow)', async () => {
    const user = userEvent.setup()
    render(
      <Banner dismissible title="bye">
        body
      </Banner>,
    )
    expect(screen.getByText('body')).toBeInTheDocument()
    await user.click(screen.getByRole('button'))
    // Internal `dismissed` flag short-circuits render → null.
    expect(screen.queryByText('body')).toBeNull()
    expect(screen.queryByText('bye')).toBeNull()
  })

  it('invokes onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(
      <Banner dismissible onDismiss={onDismiss} title="x">
        body
      </Banner>,
    )
    await user.click(screen.getByRole('button'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('honors a custom `dismissLabel` prop on the close button', () => {
    render(
      <Banner dismissible dismissLabel="Hide notice" title="x">
        body
      </Banner>,
    )
    expect(screen.getByRole('button', { name: 'Hide notice' })).toBeInTheDocument()
  })
})
