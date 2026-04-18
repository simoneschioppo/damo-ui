'use client'

import { usePersistedAttr } from '@/lib/use-persisted-attr'

type Theme = 'light' | 'dark'

export function ThemeSwitcher() {
  const [theme, setTheme] = usePersistedAttr<Theme>('theme', 'data-theme', 'light')

  return (
    <div style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <span className="eyebrow">Theme</span>
      <div style={{ display: 'inline-flex', border: '2px solid var(--border-memphis)' }}>
        {(['light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '6px 12px',
              background: theme === t ? 'var(--plum-500)' : 'var(--surface)',
              color: theme === t ? 'var(--paper-50)' : 'var(--ink)',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
