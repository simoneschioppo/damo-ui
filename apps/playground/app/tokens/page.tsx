import type { ReactNode } from 'react'

const PAGE_STYLE = {
  padding: '32px 48px 64px',
  maxWidth: 1280,
  margin: '0 auto',
}

const PLUM_STOPS = [100, 300, 500, 700, 800, 900] as const
const GOLD_STOPS = [100, 200, 300, 400, 500] as const
const PAPER_STOPS = [50, 100, 200, 300] as const

const SEMANTIC = [
  ['--bg', 'Background'],
  ['--surface', 'Surface'],
  ['--surface-2', 'Surface 2'],
  ['--ink', 'Ink'],
  ['--ink-soft', 'Ink Soft'],
  ['--ink-muted', 'Ink Muted'],
  ['--border-memphis', 'Border Memphis'],
  ['--accent', 'Accent'],
] as const

const TYPE_SCALE = [
  { label: 'text-7xl', size: 80 },
  { label: 'text-6xl', size: 64 },
  { label: 'text-5xl', size: 48 },
  { label: 'text-4xl', size: 40 },
  { label: 'text-3xl', size: 32 },
  { label: 'text-2xl', size: 24 },
  { label: 'text-xl', size: 20 },
  { label: 'text-lg', size: 18 },
  { label: 'text-base', size: 16 },
  { label: 'text-sm', size: 14 },
  { label: 'text-xs', size: 12 },
] as const

const RADIUS_SCALE = [
  ['--radius-none', 'none'],
  ['--radius-sm', 'sm'],
  ['--radius-md', 'md'],
  ['--radius-lg', 'lg'],
  ['--radius-pill', 'pill'],
] as const

const SHADOW_SCALE = [
  ['--shadow-memphis-sm', 'memphis-sm'],
  ['--shadow-memphis', 'memphis'],
  ['--shadow-memphis-lg', 'memphis-lg'],
  ['--shadow-sm', 'shadow-sm'],
  ['--shadow-md', 'shadow-md'],
  ['--shadow-lg', 'shadow-lg'],
] as const

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 className="display" style={{ fontSize: 32, margin: '0 0 16px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Swatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        padding: 12,
        minWidth: 140,
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          height: 48,
          background: `var(${varName})`,
          marginBottom: 8,
          border: '1px solid var(--border)',
        }}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-muted)' }}>
        {varName}
      </div>
    </div>
  )
}

export default function TokensPage() {
  return (
    <main style={PAGE_STYLE}>
      <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
        Design Tokens
      </h1>
      <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
        Tutti i token rispondono ai switcher theme/palette/density in alto.
      </p>

      <Section title="Plum scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PLUM_STOPS.map((k) => (
            <Swatch key={k} varName={`--plum-${k}`} label={`plum-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Gold scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GOLD_STOPS.map((k) => (
            <Swatch key={k} varName={`--gold-${k}`} label={`gold-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Paper scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PAPER_STOPS.map((k) => (
            <Swatch key={k} varName={`--paper-${k}`} label={`paper-${k}`} />
          ))}
        </div>
      </Section>

      <Section title="Semantic tokens">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {SEMANTIC.map(([v, l]) => (
            <Swatch key={v} varName={v} label={l} />
          ))}
        </div>
      </Section>

      <Section title="Typography scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TYPE_SCALE.map((t) => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
              <span
                className="mono"
                style={{ fontSize: 11, color: 'var(--ink-muted)', minWidth: 80 }}
              >
                {t.label} · {t.size}
              </span>
              <span style={{ fontSize: t.size, fontWeight: 500 }}>Damacchi · regina e cavallo</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Display font — Audiowide">
        <div className="display" style={{ fontSize: 72 }}>
          Damacchi
        </div>
      </Section>

      <Section title="Eyebrow utility">
        <div className="eyebrow">Finalmente una dama con le palle</div>
      </Section>

      <Section title="Radius scale">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {RADIUS_SCALE.map(([v, l]) => (
            <div
              key={v}
              style={{
                width: 120,
                height: 80,
                background: 'var(--plum-500)',
                borderRadius: `var(${v})`,
                display: 'grid',
                placeItems: 'center',
                color: 'var(--paper-50)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Shadow scale (Memphis + soft)">
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', padding: 24 }}>
          {SHADOW_SCALE.map(([v, l]) => (
            <div
              key={v}
              style={{
                width: 120,
                height: 80,
                background: 'var(--surface)',
                border: '2px solid var(--border-memphis)',
                boxShadow: `var(${v})`,
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing (4px grid)">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20].map((n) => (
            <div key={n} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: `var(--space-${n})`,
                  height: `var(--space-${n})`,
                  background: 'var(--gold-500)',
                  border: '1px solid var(--border-memphis)',
                }}
              />
              <div className="mono" style={{ fontSize: 10, marginTop: 4 }}>
                {n}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  )
}
