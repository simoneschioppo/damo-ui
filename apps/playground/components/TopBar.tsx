import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PaletteSwitcher } from './PaletteSwitcher'

export function TopBar() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        gap: 24,
        flexWrap: 'wrap',
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          letterSpacing: '0.08em',
          color: 'var(--ink)',
          textDecoration: 'none',
        }}
      >
        DAMACCHI · UI
      </Link>

      <nav style={{ display: 'flex', gap: 24 }}>
        <Link
          href="/design-system"
          style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'var(--ink)' }}
        >
          Design System
        </Link>
        <Link
          href="/theme-generator"
          style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'var(--ink)' }}
        >
          Theme Generator
        </Link>
      </nav>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <ThemeSwitcher />
        <PaletteSwitcher />
      </div>
    </header>
  )
}
