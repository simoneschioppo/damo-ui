import { useState } from 'react'
import { DatePicker } from './date-picker'

export const Basic = () => (
  <div style={{ width: 280 }}>
    <DatePicker />
  </div>
)

export const Controlled = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <DatePicker value={date} onValueChange={setDate} />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-muted)' }}>
        {date?.toISOString() ?? '(nessuna data)'}
      </span>
    </div>
  )
}

export const Disabled = () => (
  <div style={{ width: 280 }}>
    <DatePicker disabled />
  </div>
)
