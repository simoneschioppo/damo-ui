'use client'

/**
 * /theme-generator — Live color palette editor.
 *
 * Layout: 2-column — left controls (Card with color pickers) + right live
 * preview built entirely from @damacchi/ui primitives (Button / Card /
 * Badge / Chip / Input / Label / Switch). Mutates CSS variables on `:root`
 * via JS inline style for instant preview; restores defaults on unmount.
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
  ColorPicker,
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

const FIELD_LABEL: Readonly<Record<keyof ThemeState, string>> = {
  plum500: 'Plum 500',
  plum900: 'Plum 900',
  gold500: 'Gold 500',
  gold400: 'Gold 400',
  paper50: 'Paper 50',
} as const

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
// Local styles (only for layout + the one control the lib doesn't
// ship: the native HTML <input type="color"> swatch).
// ═══════════════════════════════════════════════════════════

const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: 32,
  alignItems: 'start',
  marginTop: 32,
}

const stickyStyle: CSSProperties = {
  position: 'sticky',
  top: 24,
  alignSelf: 'start',
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
      // Swallowed on purpose: clipboard API can be blocked in iframes or
      // insecure contexts. User can still copy manually from DevTools.
      setCopied(false)
    }
  }

  function handleReset() {
    setTheme(DEFAULT_THEME)
  }

  function updateField(key: keyof ThemeState, next: string) {
    setTheme((prev) => ({ ...prev, [key]: next }))
  }

  const fieldKeys = Object.keys(theme) as Array<keyof ThemeState>

  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px', lineHeight: 1 }}>
          Theme Generator
        </h1>
        <p style={{ color: 'var(--ink-muted)', margin: '0 0 8px', maxWidth: 640 }}>
          Componi la tua palette custom e scarica le CSS vars. Cambia i valori e vedi l&apos;anteprima
          a destra aggiornarsi live.
        </p>

        <div style={layoutStyle}>
          {/* Controls — Card from the lib, not an inline <aside>. */}
          <Card variant="default" padding="md" style={stickyStyle}>
            <CardHeader>
              <CardTitle>Colori</CardTitle>
              <CardDescription>Trascina i picker o incolla un hex.</CardDescription>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fieldKeys.map((key) => (
                  <ColorPicker
                    key={key}
                    id={`cp-${key}`}
                    label={FIELD_LABEL[key]}
                    value={theme[key]}
                    onChange={(next) => updateField(key, next)}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
                <Button fullWidth onClick={handleCopyCss}>
                  Copia CSS
                </Button>
                <Button variant="ghost" fullWidth onClick={handleReset}>
                  Reset
                </Button>
                {copied ? (
                  <span className="eyebrow" style={{ textAlign: 'center', marginTop: 4 }}>
                    Copiato negli appunti
                  </span>
                ) : null}
              </div>
            </CardBody>
          </Card>

          {/* Preview — every surface here comes from @damacchi/ui. */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <h3 className="eyebrow">Buttons</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <Button>Primary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </section>

            <section>
              <h3 className="eyebrow">Card + Badges</h3>
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
              <h3 className="eyebrow">Form</h3>
              <Card variant="default" style={{ marginTop: 12, maxWidth: 420 }}>
                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <Label htmlFor="preview-email">Email</Label>
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
                </CardBody>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </Container>
  )
}
