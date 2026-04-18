'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Density = 'compact' | 'normal' | 'comfortable'

export function DensitySwitcher() {
  const [density, setDensity] = usePersistedAttr<Density>(
    'density',
    'data-density',
    'normal',
  )

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Density</span>
      <div style={{ display: 'inline-flex', border: '2px solid var(--border-memphis)' }}>
        {(['compact', 'normal', 'comfortable'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            style={{
              padding: '6px 10px',
              background: density === d ? 'var(--gold-500)' : 'var(--surface)',
              color: 'var(--ink)',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: 'none',
              borderLeft: d !== 'compact' ? '2px solid var(--border-memphis)' : 'none',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}
