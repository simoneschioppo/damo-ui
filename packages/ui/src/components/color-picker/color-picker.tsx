'use client'

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
  /** Hide the hex text input; show only the color swatch. Defaults to false. */
  showInput?: boolean
  /** Hide the visual label while preserving accessibility via aria-label. Defaults to true. */
  showLabel?: boolean
}

const swatchStyle: CSSProperties = {
  width: 44,
  height: 'calc(var(--spacing) * 10)',
  padding: 2,
  border: '2px solid var(--memphis-border-color)',
  background: 'var(--card)',
  cursor: 'pointer',
}

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 6,
  alignItems: 'center',
}

const rowStyleNoLabel: CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
}

const hexInputStyle: CSSProperties = {
  minWidth: '6ch',
  flex: 1,
  fontFamily: 'var(--font-mono)',
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
  { id, label, value, onChange, className, showInput = true, showLabel = true },
  ref,
) {
  const autoId = useId()
  const colorId = id ?? `cp-${autoId}`

  return (
    <div ref={ref} className={cn(className)}>
      {showLabel && <Label htmlFor={colorId}>{label}</Label>}
      <div style={showLabel ? rowStyle : rowStyleNoLabel}>
        <input
          type="color"
          id={colorId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={swatchStyle}
          aria-label={`Color picker for ${label}`}
        />
        {showInput && (
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={hexInputStyle}
            aria-label={`Hex value for ${label}`}
          />
        )}
      </div>
    </div>
  )
})
