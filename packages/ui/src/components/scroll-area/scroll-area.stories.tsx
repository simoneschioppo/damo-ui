import { ScrollArea } from './scroll-area'

const LONG = Array.from({ length: 40 }, (_, i) => `Riga ${i + 1} — contenuto demo della lista.`)
const WIDE = Array.from({ length: 20 }, (_, i) => `Colonna ${i + 1}`)

export const Vertical = () => (
  <ScrollArea
    style={{
      height: 220,
      width: 320,
      border: '2px solid var(--memphis-border-color)',
      background: 'var(--card)',
    }}
  >
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {LONG.map((t, i) => (
        <div key={i} style={{ padding: 8, background: 'var(--muted)', fontSize: 13 }}>
          {t}
        </div>
      ))}
    </div>
  </ScrollArea>
)

export const Horizontal = () => (
  <ScrollArea
    style={{
      width: 420,
      border: '2px solid var(--memphis-border-color)',
      background: 'var(--card)',
    }}
  >
    <div style={{ display: 'flex', gap: 8, padding: 12 }}>
      {WIDE.map((t) => (
        <div
          key={t}
          style={{
            padding: '16px 20px',
            background: 'var(--gold-100)',
            border: '2px solid var(--memphis-border-color)',
            whiteSpace: 'nowrap',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  </ScrollArea>
)

export const Both = () => (
  <ScrollArea
    style={{
      width: 320,
      height: 220,
      border: '2px solid var(--memphis-border-color)',
      background: 'var(--card)',
    }}
  >
    <div
      style={{
        width: 800,
        padding: 12,
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 70px)',
        gap: 6,
      }}
    >
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: 12,
            background: 'var(--plum-100)',
            border: '2px solid var(--memphis-border-color)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            textAlign: 'center',
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  </ScrollArea>
)
