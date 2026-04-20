'use client'

import { useEffect } from 'react'
import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Palette = 'plum-gold' | 'neon' | 'sunset'

const LABELS: Record<Palette, string> = {
  'plum-gold': 'Plum+Gold',
  neon: 'Neon',
  sunset: 'Sunset',
}

const VALID: ReadonlySet<Palette> = new Set(Object.keys(LABELS) as Palette[])

export function PaletteSwitcher() {
  const [palette, setPalette] = usePersistedAttr<Palette>('palette', 'data-palette', 'plum-gold')

  // Sanitize: migrate legacy values (frost, circuit, …) stored in
  // localStorage to the default so the <select> never shows a value
  // that isn't part of the current option set.
  useEffect(() => {
    if (!VALID.has(palette)) setPalette('plum-gold')
  }, [palette, setPalette])

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Palette</span>
      <select
        value={palette}
        onChange={(e) => setPalette(e.target.value as Palette)}
        style={{
          padding: '6px 10px',
          border: '2px solid var(--border-memphis)',
          background: 'var(--surface)',
          color: 'var(--ink)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {(Object.keys(LABELS) as Palette[]).map((p) => (
          <option key={p} value={p}>
            {LABELS[p]}
          </option>
        ))}
      </select>
    </div>
  )
}
