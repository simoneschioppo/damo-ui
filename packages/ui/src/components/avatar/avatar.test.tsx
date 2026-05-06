import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarGroup } from './avatar'

describe('Avatar', () => {
  it('renders with default size and shape', () => {
    const { container } = render(
      <Avatar data-testid="avatar">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )
    const root = container.querySelector('[data-testid="avatar"]')
    expect(root).toBeTruthy()
    expect(root!.className).toContain('h-10')
    expect(root!.className).toContain('w-10')
    expect(root!.className).toContain('rounded-full')
  })

  it('applies square shape with Memphis border', () => {
    const { container } = render(
      <Avatar data-testid="avatar" shape="square">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    )
    const root = container.querySelector('[data-testid="avatar"]')!
    expect(root.className).toContain('rounded-none')
    expect(root.className).toContain('border-2')
    expect(root.className).toContain('border-memphis')
  })
})

describe('AvatarGroup', () => {
  // Regression: AvatarGroup wrapped each child in `ring-2 ring-bg`, but
  // `ring-bg` is not a valid Tailwind utility (no --color-bg in the theme).
  // The ring should reference the `--background` semantic token via the
  // `ring-background` utility so the outline matches the page surface.
  it('applies the background-token ring utility to each wrapped child', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    )

    // Match by class fragment so the assertion stays valid if the inner DOM
    // depth changes (e.g. a future Radix slot wraps each avatar).
    const wrappers = Array.from(container.querySelectorAll('div.ring-2'))
    expect(wrappers.length).toBe(2)
    for (const wrapper of wrappers) {
      const classes = wrapper.className.split(/\s+/)
      expect(classes).toContain('ring-background')
      expect(classes).not.toContain('ring-bg')
    }
  })

  it('renders a +N overflow tile when children exceed max', () => {
    const { container } = render(
      <AvatarGroup max={2}>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>C</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>D</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    )
    expect(container.textContent).toContain('+2')
  })
})
