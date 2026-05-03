import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { UserCard } from './user-card'

describe('UserCard', () => {
  it('renders the name', () => {
    const { getByText } = render(<UserCard name="Mario" />)
    expect(getByText('Mario')).toBeTruthy()
  })

  it('renders the optional meta slot (ReactNode)', () => {
    const { getByText } = render(<UserCard name="Mario" meta={<>Designer · Team Lead</>} />)
    expect(getByText(/Designer\s+·\s+Team\s+Lead/)).toBeTruthy()
  })

  it('applies mono + uppercase classes on the meta slot', () => {
    const { container } = render(<UserCard name="Mario" meta={<>Designer · Team Lead</>} />)
    const meta = container.querySelector('[data-slot="meta"]') as HTMLElement
    expect(meta).not.toBeNull()
    expect(meta.className).toContain('font-mono')
    expect(meta.className).toContain('uppercase')
  })

  it('does not render the meta slot when meta is not provided', () => {
    const { container } = render(<UserCard name="Mario" />)
    expect(container.querySelector('[data-slot="meta"]')).toBeNull()
  })

  it('renders the trailing slot on the right (e.g. a clock chip)', () => {
    const { getByTestId } = render(
      <UserCard name="Mario" trailing={<span data-testid="trailing-clock">05:42</span>} />,
    )
    expect(getByTestId('trailing-clock')).toBeTruthy()
  })

  it('does not render the trailing slot when not provided', () => {
    const { container } = render(<UserCard name="Mario" />)
    expect(container.querySelector('[data-slot="trailing"]')).toBeNull()
  })

  it('falls back to the first letter avatar when no avatar prop', () => {
    const { container } = render(<UserCard name="Mario" />)
    const avatar = container.querySelector('[data-slot="avatar"]')
    expect(avatar).not.toBeNull()
    expect(avatar!.textContent).toBe('M')
    // First letter of "Mario"
  })

  it('renders a custom avatar node when provided', () => {
    const { getByTestId } = render(
      <UserCard name="Mario" avatar={<span data-testid="custom-avatar">X</span>} />,
    )
    expect(getByTestId('custom-avatar')).toBeTruthy()
  })

  it('applies Memphis frame classes on the root', () => {
    const { container } = render(<UserCard name="Mario" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
    expect(root.className).toContain('bg-card')
  })

  it('forwards className to the root', () => {
    const { container } = render(<UserCard name="Mario" className="custom-user" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('custom-user')
  })

  it('spreads rest props onto the root element', () => {
    const { container } = render(<UserCard name="Mario" data-testid="user-root" />)
    const root = container.firstChild as HTMLElement
    expect(root.getAttribute('data-testid')).toBe('user-root')
  })

  it('uses a 48x48 plum-900 circle for the default avatar', () => {
    const { container } = render(<UserCard name="Mario" />)
    const avatar = container.querySelector('[data-slot="avatar"]') as HTMLElement
    expect(avatar).not.toBeNull()
    expect(avatar.className).toContain('w-12')
    expect(avatar.className).toContain('h-12')
    expect(avatar.className).toContain('bg-foreground')
    expect(avatar.className).toContain('rounded-full')
  })

  it('uses the Memphis card shadow token (not a hardcoded value)', () => {
    const { container } = render(<UserCard name="Mario" />)
    const root = container.firstChild as HTMLElement
    const styleAttr = root.getAttribute('style') ?? ''
    expect(styleAttr).toContain('var(--shadow-memphis-card)')
    expect(styleAttr).not.toMatch(/box-shadow:\s*\d+px\s+\d+px\s+0/)
  })
})
