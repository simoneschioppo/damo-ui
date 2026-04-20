import { forwardRef, useId, type CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { Label } from '../label'
import { Input } from '../input'

export interface ColorPickerProps {
  id?: string
  label: string
  value: string
  onChange: (next: string) => void
  className?: string
}

const swatchStyle: CSSProperties = {
  width: 44,
  height: 40,
  padding: 2,
  border: '2px solid var(--border-memphis)',
  background: 'var(--surface)',
  cursor: 'pointer',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 6,
  alignItems: 'center',
}

const hexInputStyle: CSSProperties = {
  flex: 1,
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
}

/**
 * ColorPicker — native color swatch paired with a hex text input.
 *
 * Both controls share the same `value` and call `onChange` with the raw
 * string they emit. The parent is responsible for validating hex strings
 * before re-binding them to state.
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Accent"
 *   value={theme.accent}
 *   onChange={(next) => setTheme({ ...theme, accent: next })}
 * />
 * ```
 */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  { id, label, value, onChange, className },
  ref,
) {
  const autoId = useId()
  const colorId = id ?? `cp-${autoId}`

  return (
    <div ref={ref} className={cn(className)}>
      <Label htmlFor={colorId}>{label}</Label>
      <div style={rowStyle}>
        <input
          type="color"
          id={colorId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={swatchStyle}
          aria-label={`Color picker for ${label}`}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={hexInputStyle}
          aria-label={`Hex value for ${label}`}
        />
      </div>
    </div>
  )
})
