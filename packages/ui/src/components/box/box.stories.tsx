import { Box } from './box'

const Chip = ({ label }: { label: string }) => (
  <div
    style={{
      padding: '6px 12px',
      border: '2px solid var(--border-memphis)',
      background: 'var(--gold-100)',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
)

export const RowBasic = () => (
  <Box direction="row" gap={2}>
    <Chip label="1" />
    <Chip label="2" />
    <Chip label="3" />
  </Box>
)

export const ColumnBasic = () => (
  <Box direction="column" gap={3}>
    <Chip label="top" />
    <Chip label="middle" />
    <Chip label="bottom" />
  </Box>
)

export const GapScale = () => (
  <Box direction="column" gap={6}>
    {([1, 2, 4, 6, 8, 12] as const).map((g) => (
      <div key={g}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 8 }}>gap={g}</div>
        <Box direction="row" gap={g}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Chip key={i} label={String(i + 1)} />
          ))}
        </Box>
      </div>
    ))}
  </Box>
)

export const AlignCenter = () => (
  <Box
    direction="row"
    gap={3}
    align="center"
    style={{ height: 120, background: 'var(--surface-2)', padding: 12 }}
  >
    <div style={{ height: 40, width: 40, background: 'var(--plum-500)' }} />
    <div style={{ height: 80, width: 40, background: 'var(--gold-500)' }} />
    <div style={{ height: 24, width: 40, background: 'var(--plum-300)' }} />
  </Box>
)

export const JustifyBetween = () => (
  <Box direction="row" justify="between" style={{ width: 400 }}>
    <Chip label="left" />
    <Chip label="right" />
  </Box>
)

export const Wrap = () => (
  <Box direction="row" gap={2} wrap="wrap" style={{ width: 300 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <Chip key={i} label={`item ${i + 1}`} />
    ))}
  </Box>
)

export const AsHeader = () => (
  <Box
    as="header"
    direction="row"
    align="center"
    justify="between"
    gap={3}
    style={{ padding: 12, border: '2px solid var(--border-memphis)' }}
  >
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>BRAND</span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>as=&quot;header&quot;</span>
  </Box>
)

export const Inline = () => (
  <p style={{ fontSize: 14 }}>
    Qui c&apos;è del testo, e in mezzo{' '}
    <Box inline gap={1} align="center">
      <Chip label="chip1" />
      <Chip label="chip2" />
    </Box>{' '}
    rimane inline con il paragrafo.
  </p>
)
