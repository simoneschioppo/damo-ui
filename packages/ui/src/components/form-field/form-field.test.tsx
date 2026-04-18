import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './form-field'

describe('FormField', () => {
  it('renders label and input child', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>,
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <FormField label="Email" description="Useremo questo per contattarti">
        <input type="email" />
      </FormField>,
    )
    expect(screen.getByText('Useremo questo per contattarti')).toBeInTheDocument()
  })

  it('renders error and sets aria-invalid on the input child', () => {
    render(
      <FormField label="Email" error="Indirizzo non valido">
        <input type="email" />
      </FormField>,
    )
    expect(screen.getByText('Indirizzo non valido')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('generates a unique id and wires label htmlFor + input id', () => {
    render(
      <FormField label="Email">
        <input type="email" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const label = screen.getByText('Email')
    const id = input.getAttribute('id')
    expect(id).toBeTruthy()
    expect(label).toHaveAttribute('for', id ?? '')
  })

  it('accepts a custom id prop and uses it on input + label for', () => {
    render(
      <FormField id="my-email" label="Email">
        <input type="email" />
      </FormField>,
    )
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-email')
    expect(screen.getByText('Email')).toHaveAttribute('for', 'my-email')
  })

  it('aria-describedby includes description id when description provided', () => {
    render(
      <FormField label="Email" description="hint text">
        <input type="email" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const description = screen.getByText('hint text')
    expect(input.getAttribute('aria-describedby')).toContain(description.id)
  })

  it('aria-describedby includes error id when error provided', () => {
    render(
      <FormField label="Email" error="err text">
        <input type="email" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const errorEl = screen.getByText('err text')
    expect(input.getAttribute('aria-describedby')).toContain(errorEl.id)
  })

  it('aria-describedby combines description and error ids when both provided', () => {
    render(
      <FormField label="Email" description="desc" error="err">
        <input type="email" />
      </FormField>,
    )
    const input = screen.getByRole('textbox')
    const desc = screen.getByText('desc')
    const err = screen.getByText('err')
    const aria = input.getAttribute('aria-describedby') ?? ''
    expect(aria).toContain(desc.id)
    expect(aria).toContain(err.id)
  })
})
