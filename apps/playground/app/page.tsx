import Link from 'next/link'

export default function IndexPage() {
  return (
    <main style={{ padding: 48, maxWidth: 800, margin: '0 auto' }}>
      <h1 className="display" style={{ fontSize: 56, marginBottom: 16 }}>
        Damacchi UI
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-muted)', marginBottom: 32 }}>
        Showcase di componenti in stile Memphis. Usa la top bar per cambiare tema, palette e density
        in live preview.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        <li>
          <Link
            href="/tokens"
            style={{
              display: 'block',
              padding: 16,
              border: '2px solid var(--border-memphis)',
              boxShadow: 'var(--shadow-memphis)',
              background: 'var(--surface)',
              fontWeight: 600,
            }}
          >
            → Design Tokens
          </Link>
        </li>
      </ul>
    </main>
  )
}
