import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PaletteSwitcher } from './PaletteSwitcher'
import { DensitySwitcher } from './DensitySwitcher'

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
        }}
      >
        DAMACCHI · UI
      </Link>

      <nav style={{ display: 'flex', gap: 16 }}>
        <Link href="/design-system" style={{ fontSize: 14, fontWeight: 600 }}>
          Design System
        </Link>
        <Link href="/tokens" style={{ fontSize: 14, fontWeight: 600 }}>
          Tokens
        </Link>
        <Link href="/components/foundations" style={{ fontSize: 14, fontWeight: 600 }}>
          Foundations
        </Link>
        <Link href="/components/tier1" style={{ fontSize: 14, fontWeight: 600 }}>
          Tier 1
        </Link>
        <Link href="/components/forms" style={{ fontSize: 14, fontWeight: 600 }}>
          Forms
        </Link>
        <Link href="/components/feedback" style={{ fontSize: 14, fontWeight: 600 }}>
          Feedback
        </Link>
        <Link href="/components/navigation" style={{ fontSize: 14, fontWeight: 600 }}>
          Navigation
        </Link>
        <Link href="/components/data" style={{ fontSize: 14, fontWeight: 600 }}>
          Data
        </Link>
      </nav>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <ThemeSwitcher />
        <PaletteSwitcher />
        <DensitySwitcher />
      </div>
    </header>
  )
}
