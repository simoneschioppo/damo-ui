'use client'

/**
 * /theme-generator — Live color palette editor.
 *
 * Layout: 2-column — left controls (color pickers) + right live preview.
 * Mutates CSS variables on `:root` via JS inline style for instant preview.
 * On unmount, restores the default tokens.
 *
 * Inspired by https://shadcnstudio.com/theme-generator.
 */

import { useEffect, useState, type CSSProperties } from 'react'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  Container,
  CrownIcon,
  Input,
  Label,
  Switch,
} from '@damacchi/ui'

// ═══════════════════════════════════════════════════════════
// Theme state
// ═══════════════════════════════════════════════════════════

type ThemeState = {
  readonly plum500: string
  readonly plum900: string
  readonly gold500: string
  readonly gold400: string
  readonly paper50: string
}

const DEFAULT_THEME: ThemeState = {
  plum500: '#7a3980',
  plum900: '#2a0f2d',
  gold500: '#c4942a',
  gold400: '#d5a845',
  paper50: '#fbf7ee',
} as const

const THEME_KEY_TO_VAR: Readonly<Record<keyof ThemeState, string>> = {
  plum500: '--plum-500',
  plum900: '--plum-900',
  gold500: '--gold-500',
  gold400: '--gold-400',
  paper50: '--paper-50',
} as const

// ═══════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════

const wrapperStyle: CSSProperties = {
  padding: '32px 0 64px',
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 56,
  margin: '0 0 8px',
  lineHeight: 1,
  color: 'var(--ink)',
}

const leadStyle: CSSProperties = {
  color: 'var(--ink-muted)',
  margin: '0 0 32px',
  fontSize: 15,
  maxWidth: 640,
}

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: 32,
  alignItems: 'start',
}

const controlsStyle: CSSProperties = {
  padding: 24,
  border: '2px solid var(--border-memphis)',
  background: 'var(--surface)',
  boxShadow: '6px 6px 0 var(--black)',
  position: 'sticky',
  top: 24,
  alignSelf: 'start',
}

const controlsHeadingStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  margin: '0 0 16px',
  color: 'var(--ink)',
}

const pickerRowStyle: CSSProperties = {
  marginBottom: 16,
}

const pickerInputsStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 6,
  alignItems: 'center',
}

const colorInputStyle: CSSProperties = {
  width: 48,
  height: 40,
  border: '2px solid var(--border-memphis)',
  padding: 2,
  cursor: 'pointer',
  background: 'var(--surface)',
}

const eyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--gold-500)',
  fontWeight: 700,
  margin: 0,
}

const previewStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const copyFeedbackStyle: CSSProperties = {
  marginTop: 8,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.1em',
  color: 'var(--ink-muted)',
  textTransform: 'uppercase',
  textAlign: 'center',
}

// ═══════════════════════════════════════════════════════════
// Helpers (pure, immutable)
// ═══════════════════════════════════════════════════════════

function buildCss(theme: ThemeState): string {
  return `:root {
  --plum-500: ${theme.plum500};
  --plum-900: ${theme.plum900};
  --gold-500: ${theme.gold500};
  --gold-400: ${theme.gold400};
  --paper-50: ${theme.paper50};
}`
}

function applyThemeToRoot(theme: ThemeState): void {
  const root = document.documentElement
  ;(Object.keys(THEME_KEY_TO_VAR) as Array<keyof ThemeState>).forEach((key) => {
    root.style.setProperty(THEME_KEY_TO_VAR[key], theme[key])
  })
}

function resetRootTheme(): void {
  const root = document.documentElement
  ;(Object.keys(THEME_KEY_TO_VAR) as Array<keyof ThemeState>).forEach((key) => {
    root.style.removeProperty(THEME_KEY_TO_VAR[key])
  })
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

export default function ThemeGeneratorPage() {
  const [theme, setTheme] = useState<ThemeState>(DEFAULT_THEME)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    applyThemeToRoot(theme)
    return () => {
      resetRootTheme()
    }
  }, [theme])

  async function handleCopyCss() {
    try {
      await navigator.clipboard.writeText(buildCss(theme))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: no-op; user can manually copy from DevTools. Swallowed on
      // purpose because clipboard API can be blocked in iframes/insecure contexts.
      setCopied(false)
    }
  }

  function handleReset() {
    setTheme(DEFAULT_THEME)
  }

  function updateField(key: keyof ThemeState, value: string) {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Container size="xl">
      <div style={wrapperStyle}>
        <h1 style={titleStyle}>Theme Generator</h1>
        <p style={leadStyle}>
          Componi la tua palette custom e scarica le CSS vars. Cambia i valori e vedi
          l&apos;anteprima a destra aggiornarsi live.
        </p>

        <div style={layoutStyle}>
          {/* Controls */}
          <aside style={controlsStyle}>
            <h2 style={controlsHeadingStyle}>Colori</h2>

            {(Object.keys(theme) as Array<keyof ThemeState>).map((key) => {
              const value = theme[key]
              return (
                <div key={key} style={pickerRowStyle}>
                  <Label htmlFor={key}>{key}</Label>
                  <div style={pickerInputsStyle}>
                    <input
                      type="color"
                      id={key}
                      value={value}
                      onChange={(e) => updateField(key, e.target.value)}
                      style={colorInputStyle}
                      aria-label={`Color picker for ${key}`}
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateField(key, e.target.value)}
                      style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12 }}
                      aria-label={`Hex value for ${key}`}
                    />
                  </div>
                </div>
              )
            })}

            <Button fullWidth onClick={handleCopyCss} style={{ marginTop: 16 }}>
              Copia CSS
            </Button>

            <Button variant="ghost" fullWidth onClick={handleReset} style={{ marginTop: 8 }}>
              Reset
            </Button>

            {copied ? <div style={copyFeedbackStyle}>Copiato negli appunti</div> : null}
          </aside>

          {/* Preview */}
          <main style={previewStyle}>
            <section>
              <h3 style={eyebrowStyle}>BUTTONS</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <Button>Primary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </section>

            <section>
              <h3 style={eyebrowStyle}>CARD + BADGES</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 16,
                  marginTop: 12,
                }}
              >
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Ultima partita</CardTitle>
                    <CardDescription>Vittoria · 4:12</CardDescription>
                  </CardHeader>
                  <CardBody>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Badge variant="featured">VITTORIA</Badge>
                      <Badge>+42 ELO</Badge>
                    </div>
                  </CardBody>
                </Card>
                <Card variant="featured">
                  <CardHeader>
                    <CardTitle>
                      <CrownIcon size={20} style={{ verticalAlign: '-4px', marginRight: 8 }} />
                      Obiettivo mensile
                    </CardTitle>
                    <CardDescription>70% completato</CardDescription>
                  </CardHeader>
                  <CardBody>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Chip variant="success">Win-streak 8</Chip>
                      <Chip variant="brand">Top 50</Chip>
                      <Chip>28 partite</Chip>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </section>

            <section>
              <h3 style={eyebrowStyle}>FORM</h3>
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  maxWidth: 360,
                }}
              >
                <div>
                  <Label htmlFor="preview-email">EMAIL</Label>
                  <Input
                    id="preview-email"
                    type="email"
                    placeholder="you@damacchi.app"
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Switch id="preview-notifications" defaultChecked />
                  <Label htmlFor="preview-notifications">Notifiche push</Label>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Container>
  )
}
