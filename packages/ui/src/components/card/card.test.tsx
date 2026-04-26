import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from './card'

describe('Card', () => {
  it('renders default variant with semantic tokens', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('text-card-foreground')
  })

  it('renders default variant base classes', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-2')
    expect(card.className).toContain('border-memphis')
    expect(card.className).toContain('shadow-memphis')
    expect(card.className).toContain('rounded-none')
  })

  it('renders elevated variant', () => {
    const { container } = render(<Card variant="elevated">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('border-2')
    expect(card.className).toContain('border-memphis')
    expect(card.className).toContain('shadow-memphis-lg')
    expect(card.className).toContain('rounded-none')
  })

  it('renders featured variant', () => {
    const { container } = render(<Card variant="featured">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('border-2')
    expect(card.className).toContain('border-memphis')
    expect(card.className).toContain('shadow-memphis')
    expect(card.className).toContain('rounded-none')
  })

  it('renders interactive variant', () => {
    const { container } = render(<Card variant="interactive">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('border-2')
    expect(card.className).toContain('border-memphis')
    expect(card.className).toContain('cursor-pointer')
    expect(card.className).toContain('select-none')
  })

  it('renders inverse variant (renamed from dark)', () => {
    const { container } = render(<Card variant="inverse">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('bg-foreground')
    expect(card.className).toContain('text-background')
  })

  it('inverse variant has border and shadow', () => {
    const { container } = render(<Card variant="inverse">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border')
    expect(card.className).toContain('shadow-md')
    expect(card.className).toContain('rounded-md')
  })

  it('defaults to md padding', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('p-5')
  })

  it('renders padding=none', () => {
    const { container } = render(<Card padding="none">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('p-0')
  })

  it('renders padding=sm', () => {
    const { container } = render(<Card padding="sm">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('p-3')
  })

  it('renders padding=lg', () => {
    const { container } = render(<Card padding="lg">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('p-8')
  })

  it('forwards className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-class')
  })

  it('forwards children', () => {
    const { container } = render(<Card>Hello World</Card>)
    expect((container.firstChild as HTMLElement).textContent).toBe('Hello World')
  })

  it('renders as a div', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders CardHeader', () => {
    const { container } = render(
      <Card>
        <CardHeader>Header</CardHeader>
      </Card>,
    )
    expect(container.querySelector('div > div')?.textContent).toBe('Header')
  })

  it('renders CardTitle as h3', () => {
    const { getByRole } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    )
    expect(getByRole('heading', { level: 3 }).textContent).toBe('Title')
  })

  it('renders CardDescription as p', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
      </Card>,
    )
    expect(container.querySelector('p')?.textContent).toBe('Desc')
  })

  it('renders CardBody', () => {
    const { container } = render(
      <Card>
        <CardBody>Body content</CardBody>
      </Card>,
    )
    expect(container.querySelector('div > div')?.textContent).toBe('Body content')
  })

  it('renders CardFooter', () => {
    const { container } = render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )
    expect(container.querySelector('div > div')?.textContent).toBe('Footer')
  })
})
