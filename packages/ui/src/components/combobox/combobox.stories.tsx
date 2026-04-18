import { useState } from 'react'
import { Combobox } from './combobox'

const COUNTRIES = [
  { value: 'it', label: 'Italia' },
  { value: 'fr', label: 'Francia' },
  { value: 'es', label: 'Spagna' },
  { value: 'de', label: 'Germania' },
  { value: 'uk', label: 'Regno Unito' },
  { value: 'us', label: 'Stati Uniti' },
  { value: 'jp', label: 'Giappone' },
  { value: 'kr', label: 'Corea del Sud' },
  { value: 'br', label: 'Brasile' },
  { value: 'ar', label: 'Argentina' },
]

export const Basic = () => (
  <div style={{ width: 280 }}>
    <Combobox options={COUNTRIES} placeholder="Seleziona paese" />
  </div>
)

export const Controlled = () => {
  const [val, setVal] = useState('it')
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Combobox options={COUNTRIES} value={val} onValueChange={setVal} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)' }}>
        selected: {val}
      </span>
    </div>
  )
}

export const WithDisabled = () => (
  <div style={{ width: 280 }}>
    <Combobox
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B (disabled)', disabled: true },
        { value: 'c', label: 'C' },
      ]}
    />
  </div>
)

export const Disabled = () => (
  <div style={{ width: 280 }}>
    <Combobox options={COUNTRIES} disabled placeholder="Non selezionabile" />
  </div>
)
