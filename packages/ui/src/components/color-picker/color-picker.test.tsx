import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ColorPicker } from './color-picker'

describe('ColorPicker', () => {
  it('renders label text', () => {
    render(<ColorPicker label="Accent" value="#ff0000" onChange={() => {}} />)
    expect(screen.getByText('Accent')).toBeInTheDocument()
  })

  it('renders both a native color input and a text input', () => {
    const { container } = render(
      <ColorPicker label="Accent" value="#ff0000" onChange={() => {}} />,
    )
    const colorInput = container.querySelector('input[type="color"]')
    const textInput = container.querySelector('input[type="text"], input:not([type="color"])')
    expect(colorInput).toBeTruthy()
    expect(textInput).toBeTruthy()
  })

  it('forwards id to the native color input and wires the label for attribute', () => {
    const { container } = render(
      <ColorPicker id="cp-accent" label="Accent" value="#ff0000" onChange={() => {}} />,
    )
    const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement
    expect(colorInput).toBeTruthy()
    expect(colorInput.id).toBe('cp-accent')
    expect(screen.getByText('Accent').getAttribute('for')).toBe('cp-accent')
  })

  it('generates a stable id when none is provided and wires label + color input', () => {
    const { container } = render(
      <ColorPicker label="Accent" value="#ff0000" onChange={() => {}} />,
    )
    const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement
    expect(colorInput.id).toBeTruthy()
    expect(screen.getByText('Accent').getAttribute('for')).toBe(colorInput.id)
  })

  it('shows the initial value in the native color input', () => {
    const { container } = render(
      <ColorPicker label="Accent" value="#abcdef" onChange={() => {}} />,
    )
    const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement
    expect(colorInput.value).toBe('#abcdef')
  })

  it('shows the initial value in the hex text input', () => {
    const { container } = render(
      <ColorPicker label="Accent" value="#abcdef" onChange={() => {}} />,
    )
    const hexInput = container.querySelector(
      'input:not([type="color"])',
    ) as HTMLInputElement
    expect(hexInput.value).toBe('#abcdef')
  })

  it('fires onChange with new color when the swatch changes', () => {
    const handleChange = vi.fn()
    const { container } = render(
      <ColorPicker label="Accent" value="#ff0000" onChange={handleChange} />,
    )
    const colorInput = container.querySelector('input[type="color"]') as HTMLInputElement
    fireEvent.change(colorInput, { target: { value: '#00ff00' } })
    expect(handleChange).toHaveBeenCalledWith('#00ff00')
  })

  it('fires onChange with new string when the hex input changes', () => {
    const handleChange = vi.fn()
    const { container } = render(
      <ColorPicker label="Accent" value="#ff0000" onChange={handleChange} />,
    )
    const hexInput = container.querySelector(
      'input:not([type="color"])',
    ) as HTMLInputElement
    fireEvent.change(hexInput, { target: { value: '#123abc' } })
    expect(handleChange).toHaveBeenCalledWith('#123abc')
  })

  it('forwards raw (possibly invalid) strings from the hex input without validation', () => {
    const handleChange = vi.fn()
    const { container } = render(
      <ColorPicker label="Accent" value="#ff0000" onChange={handleChange} />,
    )
    const hexInput = container.querySelector(
      'input:not([type="color"])',
    ) as HTMLInputElement
    fireEvent.change(hexInput, { target: { value: 'not-a-color' } })
    expect(handleChange).toHaveBeenCalledWith('not-a-color')
  })

  it('forwards className to the outer wrapper', () => {
    const { container } = render(
      <ColorPicker
        label="Accent"
        value="#ff0000"
        onChange={() => {}}
        className="my-custom-class"
      />,
    )
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('my-custom-class')
  })

  it('does not fire onChange on mount', () => {
    const handleChange = vi.fn()
    render(<ColorPicker label="Accent" value="#ff0000" onChange={handleChange} />)
    expect(handleChange).not.toHaveBeenCalled()
  })
})
