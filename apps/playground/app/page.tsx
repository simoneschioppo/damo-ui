import Link from 'next/link'

const cardStyle = {
  display: 'block',
  padding: 20,
  border: '2px solid var(--border-memphis)',
  boxShadow: '6px 6px 0 var(--black)',
  background: 'var(--surface)',
  fontWeight: 600,
  color: 'var(--ink)',
  textDecoration: 'none',
}

export default function IndexPage() {
  return (
    <main style={{ padding: 64, maxWidth: 800, margin: '0 auto' }}>
      <h1
        className="display"
        style={{ fontSize: 80, lineHeight: 0.95, marginBottom: 24, letterSpacing: '0.01em' }}
      >
        Damacchi UI
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-muted)', marginBottom: 40 }}>
        React component library Memphis-inspired per l&apos;app Damacchi. Esplora il design system o
        genera il tuo tema custom.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 16 }}>
        <li>
          <Link href="/design-system" style={cardStyle}>
            → Design System (specimen page completa)
          </Link>
        </li>
        <li>
          <Link href="/theme-generator" style={cardStyle}>
            → Theme Generator (componi il tuo tema)
          </Link>
        </li>
      </ul>
    </main>
  )
}
