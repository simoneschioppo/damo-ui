'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Palette = 'plum-gold' | 'frost' | 'circuit'

const LABELS: Record<Palette, string> = {
  'plum-gold': 'Plum+Gold',
  frost: 'Frost',
  circuit: 'Circuit',
}

export function PaletteSwitcher() {
  const [palette, setPalette] = usePersistedAttr<Palette>(
    'palette',
    'data-palette',
    'plum-gold',
  )

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
