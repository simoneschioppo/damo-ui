'use client'

import Link from 'next/link'
import {
  Box,
  Container,
  AspectRatio,
  ScrollArea,
  Separator,
  Ornament,
  FormField,
  HomeIcon,
  SearchIcon,
  CrownIcon,
  PawnIcon,
  TrophyIcon,
  HeartIcon,
  StarIcon,
  BoltIcon,
  ClockIcon,
  CogIcon,
  TargetIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  CheckIcon,
  CloseIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 48,
  paddingBottom: 32,
  borderBottom: '1px solid var(--border)',
}

const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 32,
  margin: '0 0 16px',
} as const

const sampleInput = {
  padding: '8px 10px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontSize: 14,
  width: '100%',
}

export default function FoundationsPage() {
  const demoIcons = [
    { name: 'Home', Cmp: HomeIcon },
    { name: 'Search', Cmp: SearchIcon },
    { name: 'Crown', Cmp: CrownIcon },
    { name: 'Pawn', Cmp: PawnIcon },
    { name: 'Trophy', Cmp: TrophyIcon },
    { name: 'Heart', Cmp: HeartIcon },
    { name: 'Star', Cmp: StarIcon },
    { name: 'Bolt', Cmp: BoltIcon },
    { name: 'Clock', Cmp: ClockIcon },
    { name: 'Cog', Cmp: CogIcon },
    { name: 'Target', Cmp: TargetIcon },
    { name: 'ArrowRight', Cmp: ArrowRightIcon },
    { name: 'Play', Cmp: PlayIcon },
    { name: 'Pause', Cmp: PauseIcon },
    { name: 'Check', Cmp: CheckIcon },
    { name: 'Close', Cmp: CloseIcon },
  ]

  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Foundations
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          Icon set, layout primitives, separator/ornament decorativi, FormField. Tier 3 del sistema
          Memphis.
        </p>

        {/* Icons */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Icons (30)</h2>
          <Box direction="row" wrap="wrap" gap={3}>
            {demoIcons.map(({ name, Cmp }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 12,
                  border: '2px solid var(--border-memphis)',
                  background: 'var(--surface)',
                  minWidth: 96,
                  gap: 6,
                }}
              >
                <Cmp size={28} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ink-muted)',
                  }}
                >
                  {name}
                </span>
              </div>
            ))}
          </Box>
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--ink-muted)' }}>
            …e altre 14. Tutte esportate da <code>@damacchi/ui</code>.
          </p>
        </section>

        {/* Box */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Box</h2>
          <Box direction="column" gap={3}>
            <Box direction="row" gap={2}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 14px',
                    background: 'var(--gold-100)',
                    border: '2px solid var(--border-memphis)',
                  }}
                >
                  row item {i}
                </div>
              ))}
            </Box>
            <Box direction="row" justify="between" align="center">
              <span className="mono">justify=between</span>
              <span className="mono">align=center</span>
            </Box>
          </Box>
        </section>

        {/* Container */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Container</h2>
          <Container
            size="md"
            style={{
              background: 'var(--surface-2)',
              padding: 16,
              border: '2px solid var(--border-memphis)',
            }}
          >
            <span className="mono">size=md (max-width screen-md), padded</span>
          </Container>
        </section>

        {/* AspectRatio */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>AspectRatio</h2>
          <Box direction="row" gap={4} wrap="wrap">
            <div style={{ width: 240 }}>
              <AspectRatio ratio={16 / 9}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--plum-500), var(--gold-500))',
                    border: '2px solid var(--border-memphis)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--paper-50)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  16:9
                </div>
              </AspectRatio>
            </div>
            <div style={{ width: 160 }}>
              <AspectRatio ratio={1}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--plum-700), var(--accent))',
                    border: '2px solid var(--border-memphis)',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--paper-50)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  1:1
                </div>
              </AspectRatio>
            </div>
          </Box>
        </section>

        {/* ScrollArea */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>ScrollArea</h2>
          <ScrollArea
            style={{
              height: 180,
              width: 360,
              border: '2px solid var(--border-memphis)',
              background: 'var(--surface)',
            }}
          >
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} style={{ padding: 8, background: 'var(--surface-2)', fontSize: 13 }}>
                  Riga {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>

        {/* Separator */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Separator</h2>
          <Box direction="column" gap={4} style={{ maxWidth: 400 }}>
            <div>
              <span className="mono" style={{ fontSize: 11 }}>
                solid (default)
              </span>
              <Separator />
            </div>
            <div>
              <span className="mono" style={{ fontSize: 11 }}>
                dashed
              </span>
              <Separator variant="dashed" />
            </div>
            <div>
              <span className="mono" style={{ fontSize: 11 }}>
                memphis-double
              </span>
              <Separator variant="memphis-double" />
            </div>
          </Box>
        </section>

        {/* Ornament */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Ornament</h2>
          <div style={{ width: 480, textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                margin: 0,
              }}
            >
              Chapter 1
            </p>
            <Ornament />
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                margin: 0,
              }}
            >
              Chapter 2
            </p>
          </div>
        </section>

        {/* FormField */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>FormField</h2>
          <Box direction="column" gap={4} style={{ maxWidth: 420 }}>
            <FormField label="Email" description="Non verrà condivisa">
              <input type="email" placeholder="you@damacchi.app" style={sampleInput} />
            </FormField>
            <FormField label="Password" error="Almeno 8 caratteri">
              <input type="password" defaultValue="abc" style={sampleInput} />
            </FormField>
            <FormField label="Bio" description="Max 200 caratteri" error="Troppo lunga">
              <textarea
                rows={3}
                defaultValue={'a'.repeat(210)}
                style={{ ...sampleInput, resize: 'vertical' }}
              />
            </FormField>
          </Box>
        </section>

        <p style={{ marginTop: 32 }}>
          <Link href="/" style={{ fontWeight: 600, color: 'var(--accent)' }}>
            ← Torna alla home
          </Link>
        </p>
      </div>
    </Container>
  )
}
