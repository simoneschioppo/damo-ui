'use client'

/**
 * /design-system — Damacchi DS v1 (faithful port of the original DS page).
 *
 * Layout: 2-column grid
 *   - Left sidebar (240px, plum-900 bg, ivory text): brand block + numbered TOC
 *   - Right main (ivory bg): hero + 11 numbered sections
 *
 * Reference: /Users/simoneschioppo/Documents/damacchi-design/claude-design-system/design-system.css
 */

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  Input,
  Switch,
  Slider,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  HomeIcon,
  SearchIcon,
  CloseIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  MenuIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CrownIcon,
  PawnIcon,
  TrophyIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  BoltIcon,
  BookmarkIcon,
  InfoIcon,
  CogIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  TargetIcon,
} from '@damacchi/ui'

// ═══════════════════════════════════════════════════════════
// Section registry (drives both the TOC and jump targets)
// ═══════════════════════════════════════════════════════════

const SECTIONS = [
  { id: 'colors', num: '01', title: 'Colori' },
  { id: 'type', num: '02', title: 'Tipografia' },
  { id: 'buttons', num: '03', title: 'Bottoni' },
  { id: 'cards', num: '04', title: 'Cards' },
  { id: 'inputs', num: '05', title: 'Inputs' },
  { id: 'badges', num: '06', title: 'Badge & Chip' },
  { id: 'icons', num: '07', title: 'Icone' },
  { id: 'avatars', num: '08', title: 'Avatar & Medaglie' },
  { id: 'mascot', num: '09', title: 'Mascotte Damo' },
  { id: 'patterns', num: '10', title: 'Pattern Memphis' },
  { id: 'figma', num: '11', title: 'Export → Figma' },
] as const

// ═══════════════════════════════════════════════════════════
// Inline styles — faithful port of design-system.css.
// Using inline styles keeps the file self-contained; tokens are
// referenced via CSS custom properties so the global theme governs.
// ═══════════════════════════════════════════════════════════

const pageStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '240px 1fr',
  minHeight: '100vh',
  background: 'var(--paper-50)',
  color: 'var(--ink)',
}

const tocStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  height: '100vh',
  background: 'var(--plum-900)',
  color: '#fff',
  padding: '32px 20px',
  overflowY: 'auto',
}

const tocBrandStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 18,
  letterSpacing: '0.12em',
  color: 'var(--gold-300)',
  marginBottom: 4,
}

const tocSubStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.2em',
  color: 'var(--gold-500)',
  textTransform: 'uppercase',
  marginBottom: 32,
}

const tocListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const tocLinkStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.7)',
  textDecoration: 'none',
  padding: '8px 12px',
  fontSize: 13,
  letterSpacing: '0.02em',
  borderLeft: '2px solid transparent',
  display: 'block',
  transition: 'all .15s',
}

const tocLinkActiveStyle: CSSProperties = {
  color: 'var(--gold-300)',
  borderLeftColor: 'var(--gold-500)',
  background: 'rgba(255,255,255,0.06)',
}

const tocNumStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--gold-500)',
  marginRight: 8,
}

const mainStyle: CSSProperties = {
  padding: '0 48px 80px',
  maxWidth: 1200,
  position: 'relative',
}

// Hero
const heroStyle: CSSProperties = {
  padding: '72px 0 56px',
  position: 'relative',
  borderBottom: '2px solid var(--ink)',
}

const heroAccentStyle: CSSProperties = {
  position: 'absolute',
  bottom: -2,
  left: 0,
  width: 120,
  height: 2,
  background: 'var(--gold-500)',
}

const heroEyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.28em',
  color: 'var(--gold-500)',
  textTransform: 'uppercase',
  marginBottom: 16,
  fontWeight: 700,
}

const heroTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 72,
  lineHeight: 0.95,
  margin: '0 0 20px',
  color: 'var(--ink)',
  letterSpacing: '-0.01em',
}

const heroLeadStyle: CSSProperties = {
  fontSize: 18,
  color: 'var(--ink-soft)',
  maxWidth: 640,
  margin: 0,
  lineHeight: 1.5,
}

const heroMetaStyle: CSSProperties = {
  marginTop: 32,
  display: 'flex',
  gap: 24,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  flexWrap: 'wrap',
}

const heroMetaBoldStyle: CSSProperties = {
  color: 'var(--ink)',
  fontWeight: 700,
}

const heroDecorStyle: CSSProperties = {
  position: 'absolute',
  top: 60,
  right: 0,
  pointerEvents: 'none',
}

// Sections
const sectionStyle: CSSProperties = {
  padding: '72px 0 24px',
  scrollMarginTop: 32,
}

const sectionHeaderStyle: CSSProperties = {
  marginBottom: 40,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  gap: 16,
}

const sectionNumStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 14,
  color: 'var(--gold-500)',
  letterSpacing: '0.1em',
  fontWeight: 700,
}

const sectionTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 44,
  margin: 0,
  color: 'var(--ink)',
  letterSpacing: '0.01em',
}

const sectionDescStyle: CSSProperties = {
  color: 'var(--ink-soft)',
  maxWidth: 640,
  margin: '8px 0 0',
  fontSize: 15,
  flexBasis: '100%',
}

const sectionFrameStyle: CSSProperties = {
  border: '2px solid var(--border-memphis)',
  boxShadow: 'var(--shadow-memphis)',
  background: 'var(--surface)',
  padding: 32,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 24,
}

const subPanelStyle: CSSProperties = {
  border: '1px dashed var(--border-strong)',
  padding: 20,
  background: 'var(--surface)',
}

const subPanelLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  marginBottom: 16,
  display: 'block',
}

// Faithful port of .ds-card (CSS rule in design-system.css):
//   background: #fff; border: 2px solid var(--ink);
//   box-shadow: 4px 4px 0 #000; padding: 28px;
const dsCardStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '2px solid var(--border-memphis)',
  boxShadow: '4px 4px 0 var(--black)',
  padding: 28,
  position: 'relative',
}

// Faithful port of .ds-card__label
const dsCardLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  fontWeight: 700,
  marginBottom: 16,
  display: 'block',
}

// Faithful port of .showcase — paper-100 bg, dashed border
const showcaseStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  flexWrap: 'wrap',
  padding: 24,
  background: 'var(--paper-100)',
  border: '2px dashed color-mix(in oklab, var(--ink) 25%, transparent)',
  alignItems: 'center',
}

// ═══════════════════════════════════════════════════════════
// Shared primitives
// ═══════════════════════════════════════════════════════════

function Toc() {
  return (
    <aside style={tocStyle}>
      <div style={tocBrandStyle}>DAMACCHI</div>
      <div style={tocSubStyle}>DESIGN SYSTEM V1</div>
      <nav style={tocListStyle}>
        {SECTIONS.map((s, idx) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            style={{ ...tocLinkStyle, ...(idx === 0 ? tocLinkActiveStyle : {}) }}
          >
            <span style={tocNumStyle}>{s.num}</span>
            {s.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}

function SectionHeader({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <header style={sectionHeaderStyle}>
      <span style={sectionNumStyle}>{num}</span>
      <h2 style={sectionTitleStyle}>{title}</h2>
      <p style={sectionDescStyle}>{desc}</p>
    </header>
  )
}

function SubPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={subPanelStyle}>
      <span style={subPanelLabelStyle}>{label}</span>
      {children}
    </div>
  )
}

// DsCard — faithful port of `.ds-card` from the original design-system.css.
// Structure: white bg, 2px black border, 4px solid black Memphis shadow,
// 28px padding, optional label block at top.
function DsCard({
  label,
  style,
  children,
}: {
  label?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div style={{ ...dsCardStyle, ...(style ?? {}) }}>
      {label ? <div style={dsCardLabelStyle}>{label}</div> : null}
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// 01 · Colors — horizontal color bands (faithful to original)
// ═══════════════════════════════════════════════════════════
// Ogni scala è una banda orizzontale piena: left col (nome + token + desc),
// right col grid di stops con background colore + nome/hex inline.
//
// Colors are rendered via CSS variables (`var(--plum-500)` etc.) so the
// bands react live to `data-theme` and `data-palette` changes. The hex
// label next to each stop is resolved at runtime via getComputedStyle and
// kept in sync by observing <html> attribute mutations.

type ColorStop = { readonly k: number }
type ColorScaleDef = {
  readonly name: string
  readonly token: string
  readonly desc: string
  readonly stops: ReadonlyArray<ColorStop>
}

const PLUM_SCALE: ColorScaleDef = {
  name: 'Plum',
  token: 'plum',
  desc: 'Primario scuro — ink, testo, sfondi notturni',
  stops: [{ k: 900 }, { k: 800 }, { k: 700 }, { k: 500 }, { k: 300 }, { k: 100 }],
}

const GOLD_SCALE: ColorScaleDef = {
  name: 'Gold',
  token: 'gold',
  desc: 'Accent brand — bottoni, bordi dorati, highlight',
  stops: [{ k: 500 }, { k: 400 }, { k: 300 }, { k: 200 }, { k: 100 }],
}

const PAPER_SCALE: ColorScaleDef = {
  name: 'Paper',
  token: 'paper',
  desc: 'Sfondi caldi ivory/cream — base del prodotto',
  stops: [{ k: 300 }, { k: 200 }, { k: 100 }, { k: 50 }],
}

// Resolve CSS custom properties at runtime. Re-reads whenever <html>
// `data-theme` or `data-palette` changes (MutationObserver), so the hex
// labels and contrast-aware text track palette switches.
//
// Why `key` (the joined names) is the *only* dependency: the `names` array
// is recreated on every parent render (`.map(...)`) and using it directly
// would make the effect rerun → setValues → rerender → effect rerun → …
// Joining into a stable string lets us bail out cleanly while still picking
// up genuine changes to the watched-var set.
function useResolvedCssVars(names: ReadonlyArray<string>): Record<string, string> {
  const key = names.join('|')
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = document.documentElement
    const watched = key.split('|').filter(Boolean)
    const read = () => {
      const cs = getComputedStyle(root)
      const next: Record<string, string> = {}
      for (const n of watched) {
        next[n] = cs.getPropertyValue(n).trim()
      }
      setValues((prev) => {
        // Avoid a setState when nothing actually changed — keeps us out of
        // React's "same value → bail" path and prevents needless rerenders.
        const prevKeys = Object.keys(prev)
        if (prevKeys.length === watched.length) {
          let same = true
          for (const n of watched) {
            if (prev[n] !== next[n]) {
              same = false
              break
            }
          }
          if (same) return prev
        }
        return next
      })
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] })
    return () => obs.disconnect()
  }, [key])
  return values
}

// Pick readable text color (black or white) for a given background hex.
// Uses perceptual luminance. Falls back to dark ink for unknown inputs.
function pickContrastText(hex: string): string {
  const m = hex.replace(/\s+/g, '').match(/^#?([a-f\d]{6})$/i)
  if (!m || !m[1]) return 'rgba(0,0,0,0.8)'
  const hx = m[1]
  const r = parseInt(hx.slice(0, 2), 16)
  const g = parseInt(hx.slice(2, 4), 16)
  const b = parseInt(hx.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.62 ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.94)'
}

const SEMANTIC_BLOCKS: ReadonlyArray<{
  readonly token: string
  readonly name: string
  readonly cssVar: string
  readonly usage: string
}> = [
  { token: '--bg', name: 'Background', cssVar: '--bg', usage: "Sfondo principale dell'app" },
  {
    token: '--surface',
    name: 'Surface',
    cssVar: '--surface',
    usage: 'Card, modali, superfici elevate',
  },
  {
    token: '--surface-2',
    name: 'Surface 2',
    cssVar: '--surface-2',
    usage: 'Superficie secondaria, hover',
  },
  { token: '--ink', name: 'Ink', cssVar: '--ink', usage: 'Testo primario, bordi' },
  { token: '--ink-soft', name: 'Ink Soft', cssVar: '--ink-soft', usage: 'Testo secondario' },
  {
    token: '--ink-muted',
    name: 'Ink Muted',
    cssVar: '--ink-muted',
    usage: 'Hint, placeholder, meta',
  },
  {
    token: '--border-memphis',
    name: 'Border Memphis',
    cssVar: '--border-memphis',
    usage: 'Bordo 2px Memphis nero',
  },
  { token: '--accent', name: 'Accent', cssVar: '--accent', usage: 'Gold 500 — brand highlight' },
]

function ColorBand({ scale }: { scale: ColorScaleDef }) {
  const varNames = scale.stops.map((s) => `--${scale.token}-${s.k}`)
  const resolved = useResolvedCssVars(varNames)
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 12,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h3 className="display" style={{ fontSize: 28, margin: 0, color: 'var(--ink)' }}>
            {scale.name}
          </h3>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent)',
              fontWeight: 700,
            }}
          >
            --{scale.token}-*
          </span>
        </div>
        <div
          style={{
            color: 'var(--ink-muted)',
            fontSize: 13,
            fontStyle: 'italic',
          }}
        >
          {scale.desc}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${scale.stops.length}, 1fr)`,
          border: '2px solid var(--border-memphis)',
          boxShadow: '6px 6px 0 var(--black)',
          overflow: 'hidden',
        }}
      >
        {scale.stops.map((s, idx) => {
          const cssVar = `--${scale.token}-${s.k}`
          const hex = resolved[cssVar] ?? ''
          return (
            <div
              key={s.k}
              style={{
                background: `var(${cssVar})`,
                color: pickContrastText(hex),
                aspectRatio: '1.2 / 1',
                padding: '14px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                borderLeft: idx === 0 ? 'none' : '2px solid var(--border-memphis)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                {scale.token}-{s.k}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  opacity: 0.85,
                  marginTop: 2,
                }}
              >
                {hex || '\u00a0'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SemanticBlock({
  token,
  name,
  cssVar,
  usage,
}: {
  token: string
  name: string
  cssVar: string
  usage: string
}) {
  return (
    <div
      style={{
        padding: 16,
        border: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        boxShadow: '3px 3px 0 var(--black)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 44,
          background: `var(${cssVar})`,
          border: '2px solid var(--border-memphis)',
          marginBottom: 10,
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: 'var(--ink)',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent)',
          marginTop: 2,
          fontWeight: 700,
        }}
      >
        {token}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--ink-muted)',
          marginTop: 6,
          lineHeight: 1.35,
        }}
      >
        {usage}
      </div>
    </div>
  )
}

function ColorsSection() {
  return (
    <section id="colors" style={sectionStyle}>
      <SectionHeader
        num="01"
        title="Colori"
        desc="3 scale brand (Plum, Gold, Paper) in bande orizzontali + 8 token semantici. Plum per l'ink, Gold per l'accento, Paper per gli sfondi caldi."
      />
      <div
        style={{
          border: '2px solid var(--border-memphis)',
          boxShadow: 'var(--shadow-memphis)',
          background: 'var(--surface)',
          padding: 32,
        }}
      >
        <ColorBand scale={PLUM_SCALE} />
        <ColorBand scale={GOLD_SCALE} />
        <ColorBand scale={PAPER_SCALE} />

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 40,
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <h3 className="display" style={{ fontSize: 24, margin: 0, color: 'var(--ink)' }}>
            Semantici
          </h3>
          <div style={{ color: 'var(--ink-muted)', fontSize: 13, fontStyle: 'italic' }}>
            Alias di livello prodotto — usa questi nei componenti
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          {SEMANTIC_BLOCKS.map((b) => (
            <SemanticBlock key={b.token} {...b} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 02 · Typography — type specimens + scale ladder
// ═══════════════════════════════════════════════════════════

type TypeScaleRow = {
  readonly name: string
  readonly size: number
  readonly weight: number
  readonly font: 'display' | 'body' | 'mono'
  readonly upper?: boolean
  readonly track?: number
}

const TYPE_SCALE: ReadonlyArray<TypeScaleRow> = [
  { name: 'Display XL', size: 68, weight: 400, font: 'display' },
  { name: 'Display L', size: 48, weight: 400, font: 'display' },
  { name: 'Display M', size: 36, weight: 400, font: 'display' },
  { name: 'Display S', size: 24, weight: 400, font: 'display' },
  { name: 'Body XL', size: 20, weight: 500, font: 'body' },
  { name: 'Body L', size: 18, weight: 500, font: 'body' },
  { name: 'Body M', size: 16, weight: 400, font: 'body' },
  { name: 'Body S', size: 14, weight: 400, font: 'body' },
  { name: 'Caption', size: 12, weight: 500, font: 'body' },
  { name: 'Mono / Eyebrow', size: 11, weight: 700, font: 'mono', upper: true, track: 0.22 },
]

const typeCardStyle: CSSProperties = {
  padding: 32,
  background: 'var(--surface)',
  border: '2px solid var(--border-memphis)',
  boxShadow: '6px 6px 0 var(--black)',
  position: 'relative',
}

const typeCardMetaStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  marginBottom: 16,
  fontWeight: 700,
}

const typeCardSmallStyle: CSSProperties = {
  marginTop: 20,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
}

const typeChipStyle: CSSProperties = {
  padding: '4px 8px',
  background: 'var(--paper-100)',
  border: '1.5px solid var(--border-memphis)',
}

function typeSpecStyle(t: TypeScaleRow): CSSProperties {
  const family =
    t.font === 'display'
      ? 'var(--font-display)'
      : t.font === 'mono'
        ? 'var(--font-mono)'
        : 'var(--font-body)'
  return {
    fontFamily: family,
    fontSize: t.size,
    fontWeight: t.weight,
    textTransform: t.upper ? 'uppercase' : 'none',
    letterSpacing: t.track ? `${t.track}em` : '0',
    lineHeight: 1.1,
    color: 'var(--ink)',
  }
}

function TypographySection() {
  return (
    <section id="type" style={sectionStyle}>
      <SectionHeader
        num="02"
        title="Tipografia"
        desc="Audiowide per il display, Exo 2 per body e UI. Nessun font extra — la personalità sta nel peso e nel tracking."
      />

      {/* Two big type specimens side-by-side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          marginBottom: 32,
        }}
      >
        <div style={typeCardStyle}>
          <div style={typeCardMetaStyle}>
            <span>
              DISPLAY · <b style={{ color: 'var(--accent)' }}>AUDIOWIDE</b>
            </span>
            <span>Google Fonts</span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
            }}
          >
            Damacchi
          </p>
          <div style={typeCardSmallStyle}>
            <span style={typeChipStyle}>400 regular</span>
            <span style={typeChipStyle}>letter-spacing: 0.02em</span>
            <span style={typeChipStyle}>Solo display — mai body</span>
          </div>
        </div>

        <div style={typeCardStyle}>
          <div style={typeCardMetaStyle}>
            <span>
              BODY · <b style={{ color: 'var(--accent)' }}>EXO 2</b>
            </span>
            <span>Google Fonts</span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-body)',
              fontSize: 42,
              fontWeight: 600,
              lineHeight: 1,
              color: 'var(--ink)',
            }}
          >
            Cavallo, ma a spazzare.
          </p>
          <div style={typeCardSmallStyle}>
            <span style={typeChipStyle}>300 / 400 / 500 / 600 / 700</span>
            <span style={typeChipStyle}>Body + UI + eyebrow</span>
          </div>
        </div>
      </div>

      {/* Scale ladder — single card with 3-col rows */}
      <div style={typeCardStyle}>
        <div style={typeCardMetaStyle}>
          <span>SCALA TIPOGRAFICA</span>
          <span>10 stili · rem + px</span>
        </div>
        {TYPE_SCALE.map((t, idx) => (
          <div
            key={t.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 160px',
              gap: 24,
              alignItems: 'baseline',
              padding: '18px 0',
              borderTop:
                idx === 0 ? 'none' : '1.5px solid color-mix(in oklab, var(--ink) 12%, transparent)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
                fontWeight: 700,
              }}
            >
              {t.name}
            </div>
            <div style={typeSpecStyle(t)}>
              {t.upper ? 'SCACCHI + DAMA' : 'Damacchi · Cavallo e pedona'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                textAlign: 'right',
                fontWeight: 700,
              }}
            >
              {t.size}px / {t.weight}
              <br />
              <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>--font-{t.font}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 03 · Buttons — full-state grid (Primary / Ghost / Sizes)
// ═══════════════════════════════════════════════════════════

const stateLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  fontWeight: 700,
  marginTop: 8,
  textAlign: 'center',
}

const sectionFrameSingleStyle: CSSProperties = {
  border: '2px solid var(--border-memphis)',
  boxShadow: 'var(--shadow-memphis)',
  background: 'var(--surface)',
  padding: 32,
}

const buttonSubPanelStyle: CSSProperties = {
  border: '1px dashed var(--border-strong)',
  padding: 24,
  background: 'var(--paper-50)',
}

const buttonSubPanelLabelStyle: CSSProperties = {
  ...subPanelLabelStyle,
  marginBottom: 20,
}

type ButtonStateCell = { label: string; node: ReactNode }

function ButtonStateRow({ cells }: { cells: ReadonlyArray<ButtonStateCell> }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 20,
        alignItems: 'start',
      }}
    >
      {cells.map((c) => (
        <div
          key={c.label}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {c.node}
          <div style={stateLabelStyle}>{c.label}</div>
        </div>
      ))}
    </div>
  )
}

function ButtonsSection() {
  const primaryStates: ReadonlyArray<ButtonStateCell> = [
    { label: 'Default', node: <Button variant="primary">GIOCA</Button> },
    {
      label: 'Hover',
      node: (
        <Button
          variant="primary"
          style={{
            transform: 'translate(-1px,-1px)',
            boxShadow: '7px 7px 0 var(--black)',
            background: 'var(--gold-400)',
          }}
        >
          GIOCA
        </Button>
      ),
    },
    {
      label: 'Active',
      node: (
        <Button
          variant="primary"
          style={{
            transform: 'translate(3px,3px)',
            boxShadow: '2px 2px 0 var(--black)',
          }}
        >
          GIOCA
        </Button>
      ),
    },
    {
      label: 'Focus',
      node: (
        <Button
          variant="primary"
          style={{
            outline: '2px solid var(--ring)',
            outlineOffset: 2,
          }}
        >
          GIOCA
        </Button>
      ),
    },
    {
      label: 'Disabled',
      node: (
        <Button variant="primary" disabled>
          GIOCA
        </Button>
      ),
    },
  ]

  const ghostStates: ReadonlyArray<ButtonStateCell> = [
    { label: 'Default', node: <Button variant="ghost">INDIETRO</Button> },
    {
      label: 'Hover',
      node: (
        <Button
          variant="ghost"
          style={{
            transform: 'translate(-1px,-1px)',
            boxShadow: '7px 7px 0 var(--gold-500)',
            background: 'var(--surface-2)',
          }}
        >
          INDIETRO
        </Button>
      ),
    },
    {
      label: 'Active',
      node: (
        <Button
          variant="ghost"
          style={{
            transform: 'translate(3px,3px)',
            boxShadow: '2px 2px 0 var(--gold-500)',
          }}
        >
          INDIETRO
        </Button>
      ),
    },
    {
      label: 'Focus',
      node: (
        <Button
          variant="ghost"
          style={{
            outline: '2px solid var(--ring)',
            outlineOffset: 2,
          }}
        >
          INDIETRO
        </Button>
      ),
    },
    {
      label: 'Disabled',
      node: (
        <Button variant="ghost" disabled>
          INDIETRO
        </Button>
      ),
    },
  ]

  return (
    <section id="buttons" style={sectionStyle}>
      <SectionHeader
        num="03"
        title="Bottoni"
        desc="Bordo nero 2px + shadow Memphis di 4-6px. Offset si riduce a 2px su :active per la press response."
      />
      <div style={sectionFrameSingleStyle}>
        <div style={buttonSubPanelStyle}>
          <div style={buttonSubPanelLabelStyle}>PRIMARY · GOLD BACKGROUND</div>
          <ButtonStateRow cells={primaryStates} />
        </div>

        <div style={{ height: 24 }} />

        <div style={buttonSubPanelStyle}>
          <div style={buttonSubPanelLabelStyle}>GHOST · OUTLINE NEUTRO</div>
          <ButtonStateRow cells={ghostStates} />
        </div>

        <div style={{ height: 24 }} />

        <div style={buttonSubPanelStyle}>
          <div style={buttonSubPanelLabelStyle}>SIZES</div>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="ghost" size="md">
              <ArrowRightIcon size={14} /> Con icona
            </Button>
            <IconButton aria-label="Settings" variant="ghost">
              <CogIcon size={18} />
            </IconButton>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 04 · Cards — domain patterns (Player / Mode / Info / Content)
// ═══════════════════════════════════════════════════════════

function PlayerCard() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: 16,
        border: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        boxShadow: '4px 4px 0 var(--black)',
        width: '100%',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'var(--plum-900)',
          color: 'var(--paper-50)',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 20,
          border: '2px solid var(--border-memphis)',
          flexShrink: 0,
        }}
      >
        M
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>Marini · Bianco</div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--ink-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: 2,
          }}
        >
          ELO 1842 · RAPID
        </div>
      </div>
      <div
        style={{
          padding: '8px 14px',
          border: '2px solid var(--gold-500)',
          background: 'var(--paper-50)',
          fontFamily: 'var(--font-mono)',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--ink)',
          boxShadow: '2px 2px 0 var(--gold-500)',
        }}
      >
        05:42
      </div>
    </div>
  )
}

function ModeCard() {
  return (
    <div
      style={{
        padding: 20,
        border: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        boxShadow: '4px 4px 0 var(--gold-500)',
        width: 280,
      }}
    >
      <h4
        className="display"
        style={{
          fontSize: 24,
          margin: '0 0 8px',
          color: 'var(--ink)',
          letterSpacing: '0.02em',
        }}
      >
        CLASSICO
      </h4>
      <p
        style={{
          color: 'var(--ink-muted)',
          fontSize: 13,
          margin: '0 0 24px',
          lineHeight: 1.4,
        }}
      >
        Scacchi ortodossi, pezzi mangiati tornano come pedine
      </p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
          }}
        >
          10+5 MIN
        </span>
        <ArrowRightIcon size={18} style={{ color: 'var(--accent)' }} />
      </div>
    </div>
  )
}

function InfoCard() {
  return (
    <div style={{ position: 'relative', width: 200 }}>
      {/* Gold diamond indicator on top */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -10,
          right: 20,
          width: 16,
          height: 16,
          background: 'var(--gold-500)',
          transform: 'rotate(45deg)',
          border: '2px solid var(--border-memphis)',
        }}
      />
      <div
        style={{
          padding: 16,
          border: '2px solid var(--border-memphis)',
          background: 'var(--surface)',
          boxShadow: '4px 4px 0 var(--black)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
          }}
        >
          Mosse rimanenti
        </div>
        <div
          className="display"
          style={{
            fontSize: 40,
            lineHeight: 1,
            marginTop: 8,
            color: 'var(--ink)',
          }}
        >
          23
        </div>
      </div>
    </div>
  )
}

function ContentCardNeutra() {
  return (
    <div
      style={{
        padding: 24,
        border: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        boxShadow: '4px 4px 0 var(--black)',
        maxWidth: 420,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        Regola
      </div>
      <h4
        className="display"
        style={{
          fontSize: 22,
          lineHeight: 1.15,
          margin: '0 0 12px',
          color: 'var(--ink)',
        }}
      >
        Mangia come scacchi, muovi come dama
      </h4>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0 }}>
        Il pezzo cattura con le regole degli scacchi. Ma se arriva in fondo, promuove come nella
        dama italiana.
      </p>
    </div>
  )
}

function CardsSection() {
  const sampleWrapStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    background: 'var(--paper-50)',
    border: '2px dashed color-mix(in oklab, var(--ink) 25%, transparent)',
  }

  return (
    <section id="cards" style={sectionStyle}>
      <SectionHeader
        num="04"
        title="Cards"
        desc="4 varianti principali. Tutte condividono bordo 2px + shadow Memphis, cambia solo accento e layout."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        <DsCard label="PLAYER CARD">
          <div style={sampleWrapStyle}>
            <PlayerCard />
          </div>
        </DsCard>
        <DsCard label="MODE CARD">
          <div style={sampleWrapStyle}>
            <ModeCard />
          </div>
        </DsCard>
        <DsCard label="INFO CARD · tooltip/popover">
          <div style={{ ...sampleWrapStyle, paddingTop: 40 }}>
            <InfoCard />
          </div>
        </DsCard>
        <DsCard label="CONTENT CARD · neutra">
          <div style={sampleWrapStyle}>
            <ContentCardNeutra />
          </div>
        </DsCard>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 05 · Inputs — 4 sub-panel 2x2 (Text Field stati / Select+Segmented / Toggle / Slider)
// ═══════════════════════════════════════════════════════════

const inputLabelStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: 6,
  color: 'var(--ink)',
}

const inputStateCaptionStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: 'var(--ink-muted)',
  fontStyle: 'italic',
  marginTop: 6,
}

const inputFocusOverrideStyle: CSSProperties = {
  borderColor: 'var(--gold-500)',
  boxShadow: '3px 3px 0 var(--gold-500)',
  outline: 'none',
}

const inputDisabledOverrideStyle: CSSProperties = {
  background: 'var(--paper-200)',
}

const SLIDER_INITIAL = [30, 60, 90] as const

function InputsSection() {
  const [sliderValues, setSliderValues] = useState<readonly number[]>(SLIDER_INITIAL)
  return (
    <section id="inputs" style={sectionStyle}>
      <SectionHeader
        num="05"
        title="Inputs"
        desc="Text, toggle, slider, select. Stesso linguaggio: bordo nero 2px, shadow hard."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        <DsCard label="TEXT FIELD · stati">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label htmlFor="nick-default" style={inputLabelStyle}>
                Nickname
              </label>
              <Input id="nick-default" defaultValue="Damo42" />
              <span style={inputStateCaptionStyle}>Default</span>
            </div>
            <div>
              <label htmlFor="nick-focus" style={inputLabelStyle}>
                Nickname
              </label>
              <Input id="nick-focus" defaultValue="MarinaChess" style={inputFocusOverrideStyle} />
              <span style={inputStateCaptionStyle}>Focus</span>
            </div>
            <div>
              <label htmlFor="email-disabled" style={inputLabelStyle}>
                Email
              </label>
              <Input
                id="email-disabled"
                defaultValue="mario@damacchi.it"
                disabled
                readOnly
                style={inputDisabledOverrideStyle}
              />
              <span style={inputStateCaptionStyle}>Disabled</span>
            </div>
          </div>
        </DsCard>

        <DsCard label="SELECT">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={inputLabelStyle}>Modalità</label>
              <Select defaultValue="classico">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classico">Classico</SelectItem>
                  <SelectItem value="damacchi">Damacchi</SelectItem>
                  <SelectItem value="blitz">Blitz 3+0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span style={dsCardLabelStyle}>SEGMENTED</span>
              <SegmentedControl defaultValue="blitz" aria-label="Tempo">
                <SegmentedControlItem value="bullet">BULLET</SegmentedControlItem>
                <SegmentedControlItem value="blitz">BLITZ</SegmentedControlItem>
                <SegmentedControlItem value="rapid">RAPID</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
        </DsCard>

        <DsCard label="TOGGLE">
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch id="tg-off" aria-label="Toggle off" />
              <span style={inputStateCaptionStyle}>Off</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch id="tg-on" defaultChecked aria-label="Toggle on" />
              <span style={inputStateCaptionStyle}>On</span>
            </div>
          </div>
        </DsCard>

        <DsCard label="SLIDER">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sliderValues.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Slider
                    value={[v]}
                    min={0}
                    max={100}
                    onValueChange={(next) => {
                      const head = next[0]
                      if (typeof head !== 'number') return
                      setSliderValues((prev) => prev.map((x, j) => (j === i ? head : x)))
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    color: 'var(--ink-muted)',
                    minWidth: 36,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {v}%
                </span>
              </div>
            ))}
          </div>
        </DsCard>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 06 · Badges & Chips — faithful to original .badge / .chip-ds
// Uses raw styled spans so we can express all the color variants the
// original design ships (default / copper / navy / win / loss / draw /
// rank / outline). The @damacchi/ui <Badge /> only supports two variants.
// ═══════════════════════════════════════════════════════════

const badgeBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '4px 10px',
  border: '1.5px solid var(--border-memphis)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  whiteSpace: 'nowrap',
}

type BadgeFlavor = 'default' | 'copper' | 'navy' | 'win' | 'loss' | 'draw' | 'rank' | 'outline'

function badgeFlavorStyle(flavor: BadgeFlavor): CSSProperties {
  switch (flavor) {
    case 'copper':
      return { background: 'var(--gold-500)', color: '#fff' }
    case 'navy':
      return { background: 'var(--plum-900)', color: 'var(--gold-200)' }
    case 'win':
      return { background: 'var(--success)', color: '#fff' }
    case 'loss':
      return { background: 'var(--danger)', color: '#fff' }
    case 'draw':
      return { background: 'var(--paper-100)' }
    case 'rank':
      return { background: 'var(--gold-100)' }
    case 'outline':
      return { background: 'transparent' }
    default:
      return {}
  }
}

function DsBadge({ flavor = 'default', children }: { flavor?: BadgeFlavor; children: ReactNode }) {
  return <span style={{ ...badgeBaseStyle, ...badgeFlavorStyle(flavor) }}>{children}</span>
}

const chipBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  background: 'var(--paper-100)',
  border: '2px solid var(--border-memphis)',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--ink)',
}

const chipActiveStyle: CSSProperties = {
  background: 'var(--gold-500)',
  color: '#fff',
}

const chipDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  border: '1.5px solid var(--border-memphis)',
  display: 'inline-block',
}

function DsChip({
  active = false,
  dotColor,
  children,
}: {
  active?: boolean
  dotColor: string
  children: ReactNode
}) {
  const dotBorder = active ? '#fff' : 'var(--border-memphis)'
  return (
    <span style={{ ...chipBaseStyle, ...(active ? chipActiveStyle : {}) }}>
      <span style={{ ...chipDotStyle, background: dotColor, borderColor: dotBorder }} />
      {children}
    </span>
  )
}

function BadgesSection() {
  return (
    <section id="badges" style={sectionStyle}>
      <SectionHeader
        num="06"
        title="Badge & Chip"
        desc="Status, rank, tag. Sempre maiuscoli, mono, tracking 0.08em."
      />
      <DsCard label="BADGE · status">
        <div style={showcaseStyle}>
          <DsBadge>DEFAULT</DsBadge>
          <DsBadge flavor="copper">NUOVO</DsBadge>
          <DsBadge flavor="navy">BETA</DsBadge>
          <DsBadge flavor="win">VITTORIA</DsBadge>
          <DsBadge flavor="loss">SCONFITTA</DsBadge>
          <DsBadge flavor="draw">PAREGGIO</DsBadge>
          <DsBadge flavor="outline">OUTLINE</DsBadge>
        </div>

        <div style={{ ...dsCardLabelStyle, marginTop: 24 }}>BADGE · rank / medal</div>
        <div style={showcaseStyle}>
          <DsBadge flavor="rank">♛ GRAN MAESTRO</DsBadge>
          <DsBadge flavor="copper">★ TOP 100</DsBadge>
          <DsBadge flavor="navy">ELO 2100+</DsBadge>
          <DsBadge flavor="win">ON FIRE · 7W</DsBadge>
        </div>

        <div style={{ ...dsCardLabelStyle, marginTop: 24 }}>CHIP · tag filtrabili</div>
        <div style={showcaseStyle}>
          <DsChip dotColor="var(--gold-500)">Blitz</DsChip>
          <DsChip active dotColor="#fff">
            Rapid
          </DsChip>
          <DsChip dotColor="var(--plum-500)">Classico</DsChip>
          <DsChip dotColor="var(--success)">Damacchi</DsChip>
          <DsChip dotColor="var(--danger)">Torneo</DsChip>
        </div>
      </DsCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 07 · Icons — grid of all 30 icons, each in a small card
// ═══════════════════════════════════════════════════════════

const ICONS_GRID = [
  { Cmp: HomeIcon, name: 'Home' },
  { Cmp: SearchIcon, name: 'Search' },
  { Cmp: CloseIcon, name: 'Close' },
  { Cmp: CheckIcon, name: 'Check' },
  { Cmp: PlusIcon, name: 'Plus' },
  { Cmp: MinusIcon, name: 'Minus' },
  { Cmp: MenuIcon, name: 'Menu' },
  { Cmp: ChevronUpIcon, name: 'ChevronUp' },
  { Cmp: ChevronDownIcon, name: 'ChevronDown' },
  { Cmp: ChevronLeftIcon, name: 'ChevronLeft' },
  { Cmp: ChevronRightIcon, name: 'ChevronRight' },
  { Cmp: CrownIcon, name: 'Crown' },
  { Cmp: PawnIcon, name: 'Pawn' },
  { Cmp: TrophyIcon, name: 'Trophy' },
  { Cmp: UserIcon, name: 'User' },
  { Cmp: HeartIcon, name: 'Heart' },
  { Cmp: StarIcon, name: 'Star' },
  { Cmp: BoltIcon, name: 'Bolt' },
  { Cmp: BookmarkIcon, name: 'Bookmark' },
  { Cmp: InfoIcon, name: 'Info' },
  { Cmp: CogIcon, name: 'Cog' },
  { Cmp: EditIcon, name: 'Edit' },
  { Cmp: TrashIcon, name: 'Trash' },
  { Cmp: FilterIcon, name: 'Filter' },
  { Cmp: ExternalLinkIcon, name: 'ExternalLink' },
  { Cmp: ArrowRightIcon, name: 'ArrowRight' },
  { Cmp: PlayIcon, name: 'Play' },
  { Cmp: PauseIcon, name: 'Pause' },
  { Cmp: ClockIcon, name: 'Clock' },
  { Cmp: TargetIcon, name: 'Target' },
] as const

const iconNoteStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--ink-muted)',
  marginBottom: 16,
  letterSpacing: '0.04em',
}

// Original .icon-tile — thin dividers, no outer borders on individual tiles.
const iconTileStyle: CSSProperties = {
  aspectRatio: '1 / 1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: 16,
  borderRight: '1.5px solid color-mix(in oklab, var(--ink) 12%, transparent)',
  borderBottom: '1.5px solid color-mix(in oklab, var(--ink) 12%, transparent)',
  background: 'var(--surface)',
}

const iconTileLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-muted)',
  letterSpacing: '0.05em',
}

function IconsSection() {
  return (
    <section id="icons" style={sectionStyle}>
      <SectionHeader
        num="07"
        title="Iconografia"
        desc="24×24 viewport, stroke solido, path singolo. 30 icone dal set damacchi-ui."
      />
      <span style={iconNoteStyle}>
        {`${ICONS_GRID.length} icone SVG stroke-based, viewBox 24×24, stroke-width 1.75`}
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          border: '2px solid var(--border-memphis)',
          boxShadow: '4px 4px 0 var(--black)',
          background: 'var(--surface)',
        }}
      >
        {ICONS_GRID.map(({ Cmp, name }) => (
          <div key={name} style={iconTileStyle}>
            <Cmp size={28} />
            <span style={iconTileLabelStyle}>{name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 08 · Avatars & medals — avatars in 4 sizes × 4 colors, plus octagonal medals.
// ═══════════════════════════════════════════════════════════

// Octagonal medal — faithful port of the original .medal SVG (sections.jsx).
// Each medal has outer polygon (ring), inner polygon (core), and label text.
type MedalDef = {
  readonly label: string
  readonly outerFill: string
  readonly innerFill: string
  readonly innerStroke: string
  readonly text: string
  readonly textColor: string
  readonly textSize: number
}

const MEDALS: ReadonlyArray<MedalDef> = [
  {
    label: 'BRONZO',
    outerFill: '#e5bc6d',
    innerFill: '#c4942a',
    innerStroke: '#000',
    text: 'I',
    textColor: '#fff',
    textSize: 18,
  },
  {
    label: 'ARGENTO',
    outerFill: '#c5d2e0',
    innerFill: '#6f8aa9',
    innerStroke: '#000',
    text: 'II',
    textColor: '#fff',
    textSize: 18,
  },
  {
    label: 'ORO',
    outerFill: '#f8e5bc',
    innerFill: '#d5a845',
    innerStroke: '#000',
    text: 'III',
    textColor: '#fff',
    textSize: 18,
  },
  {
    label: 'MAESTRO',
    outerFill: '#b17cb5',
    innerFill: '#522357',
    innerStroke: '#000',
    text: 'M',
    textColor: '#fff',
    textSize: 18,
  },
  {
    label: 'GRAN MAESTRO',
    outerFill: '#2a0f2d',
    innerFill: '#3d1a40',
    innerStroke: '#e5bc6d',
    text: 'GM',
    textColor: '#e5bc6d',
    textSize: 16,
  },
]

function Medal({ medal }: { medal: MedalDef }) {
  return (
    <div
      style={{
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--ink-muted)',
        fontWeight: 700,
      }}
    >
      <svg viewBox="0 0 64 64" width={64} height={64} aria-label={medal.label}>
        <polygon
          points="32,4 54,14 58,38 42,58 22,58 6,38 10,14"
          fill={medal.outerFill}
          stroke="#000"
          strokeWidth="3"
        />
        <polygon
          points="32,14 48,20 50,36 40,50 24,50 14,36 16,20"
          fill={medal.innerFill}
          stroke={medal.innerStroke}
          strokeWidth="2"
        />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="Audiowide"
          fontSize={medal.textSize}
          fill={medal.textColor}
        >
          {medal.text}
        </text>
      </svg>
      <span style={{ display: 'block', marginTop: 8 }}>{medal.label}</span>
    </div>
  )
}

function AvatarsSection() {
  return (
    <section id="avatars" style={sectionStyle}>
      <SectionHeader
        num="08"
        title="Avatar & medaglie"
        desc="Avatar in 4 taglie × 4 colori. Medaglie per ranking e achievement, forma ottagonale con bordo nero."
      />
      <DsCard label="AVATAR · square & round">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Avatar size="sm">
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>L</AvatarFallback>
          </Avatar>
          <Avatar size="xl">
            <AvatarFallback>XL</AvatarFallback>
          </Avatar>
          <span style={{ width: 16 }} />
          <Avatar shape="square">
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
          <Avatar shape="square" size="lg">
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
        </div>

        <div style={{ ...dsCardLabelStyle, marginTop: 32 }}>AVATAR GROUP</div>
        <AvatarGroup max={4}>
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>K</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>X</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <div style={{ ...dsCardLabelStyle, marginTop: 32 }}>MEDAGLIE · rank</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {MEDALS.map((m) => (
            <Medal key={m.label} medal={m} />
          ))}
        </div>
      </DsCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 09 · Mascotte Damo (placeholder, assets TBD)
// ═══════════════════════════════════════════════════════════

function MascotSection() {
  return (
    <section id="mascot" style={sectionStyle}>
      <SectionHeader
        num="09"
        title="Mascotte Damo"
        desc="Placeholder per la mascotte ufficiale. Gli asset SVG/PNG definitivi arriveranno in v0.2."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="PLACEHOLDER">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 32,
              background: 'var(--paper-50)',
              border: '2px solid var(--border-memphis)',
              minHeight: 240,
            }}
          >
            {/* Glifo provvisorio: un pezzo a forma di pedina coronata */}
            <svg
              width="160"
              height="180"
              viewBox="0 0 160 180"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Damo mascotte placeholder"
            >
              {/* crown */}
              <path
                d="M60 30 L70 45 L80 25 L90 45 L100 30 L100 55 L60 55 Z"
                fill="var(--gold-500)"
                stroke="var(--border-memphis)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* head/body */}
              <circle
                cx="80"
                cy="90"
                r="32"
                fill="var(--plum-500)"
                stroke="var(--border-memphis)"
                strokeWidth="2"
              />
              {/* eyes */}
              <circle cx="70" cy="85" r="3" fill="var(--paper-50)" />
              <circle cx="90" cy="85" r="3" fill="var(--paper-50)" />
              {/* body base */}
              <path
                d="M50 135 L110 135 L120 170 L40 170 Z"
                fill="var(--plum-700)"
                stroke="var(--border-memphis)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </SubPanel>

        <SubPanel label="USAGE">
          <div style={{ padding: 8 }}>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              Damo è la mascotte ufficiale di Damacchi. Asset SVG/PNG arriveranno in v0.2 — per ora
              usiamo un glifo provvisorio.
            </p>
            <h4
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 20,
                marginBottom: 0,
                color: 'var(--ink-muted)',
              }}
            >
              Sizes
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '8px 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              <li>Small — 40px (avatar, toast)</li>
              <li>Medium — 80px (card header)</li>
              <li>Large — 160px (hero, empty state)</li>
            </ul>
            <h4
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 20,
                marginBottom: 0,
                color: 'var(--ink-muted)',
              }}
            >
              Placement
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '8px 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              <li>Hero · onboarding · empty state</li>
            </ul>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 10 · Pattern Memphis (data-app-pattern + decorazioni)
// ═══════════════════════════════════════════════════════════

// Tileable Memphis pattern swatch. We reproduce the original CSS-only
// patterns from design-system.css (stripes, dots, grid, checker, weave).
// The WAVES and SCATTER swatches are SVGs rendered inline.
const patternSwatchStyle: CSSProperties = {
  aspectRatio: '1 / 1',
  border: '2px solid var(--border-memphis)',
  boxShadow: '3px 3px 0 var(--black)',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--paper-50)',
}

const patternLabelStyle: CSSProperties = {
  position: 'absolute',
  bottom: 8,
  left: 8,
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  background: 'var(--border-memphis)',
  color: '#fff',
  padding: '3px 8px',
  fontWeight: 700,
}

function PatternSwatch({
  name,
  background,
  backgroundSize,
  backgroundPosition,
  backgroundColor,
  children,
}: {
  name: string
  background?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundColor?: string
  children?: ReactNode
}) {
  const style: CSSProperties = {
    ...patternSwatchStyle,
    ...(background ? { background } : {}),
    ...(backgroundSize ? { backgroundSize } : {}),
    ...(backgroundPosition ? { backgroundPosition } : {}),
    ...(backgroundColor ? { backgroundColor } : {}),
  }
  return (
    <div style={style}>
      {children}
      <span style={patternLabelStyle}>{name}</span>
    </div>
  )
}

// Shape primitive styles — faithful to original .shape variants.
const shapeBaseStyle: CSSProperties = {
  width: 64,
  height: 64,
  border: '2px solid var(--border-memphis)',
  display: 'grid',
  placeItems: 'center',
  background: 'var(--surface)',
}

function PatternsSection() {
  return (
    <section id="patterns" style={sectionStyle}>
      <SectionHeader
        num="10"
        title="Pattern Memphis"
        desc="Texture e forme che riempono gli spazi vuoti. Mai tutti assieme — uno per volta, con misura."
      />
      <DsCard label="PATTERN · tileable backgrounds">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginTop: 8,
          }}
        >
          <PatternSwatch
            name="STRIPES 45°"
            background="repeating-linear-gradient(45deg, var(--gold-500) 0 6px, transparent 6px 14px)"
          />
          <PatternSwatch
            name="STRIPES H"
            background="repeating-linear-gradient(0deg, var(--plum-900) 0 4px, transparent 4px 12px)"
          />
          <PatternSwatch
            name="DOTS"
            background="radial-gradient(var(--ink) 2px, transparent 2px)"
            backgroundSize="14px 14px"
          />
          <PatternSwatch
            name="GRID"
            background="linear-gradient(var(--ink) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--ink) 1.5px, transparent 1.5px)"
            backgroundSize="20px 20px"
          />
          <PatternSwatch
            name="CHECKER"
            background="linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%), linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%)"
            backgroundColor="#fff"
            backgroundSize="20px 20px"
            backgroundPosition="0 0, 10px 10px"
          />
          <PatternSwatch
            name="WEAVE"
            background="linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%), linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%)"
            backgroundSize="24px 24px"
            backgroundPosition="0 0, 12px 12px"
            backgroundColor="var(--paper-50)"
          />
          <PatternSwatch name="WAVES" background="var(--gold-500)">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0 50 Q 12.5 20 25 50 T 50 50 T 75 50 T 100 50"
                stroke="#000"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M0 70 Q 12.5 40 25 70 T 50 70 T 75 70 T 100 70"
                stroke="#fff"
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M0 30 Q 12.5 0 25 30 T 50 30 T 75 30 T 100 30"
                stroke="var(--plum-900)"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </PatternSwatch>
          <PatternSwatch name="SCATTER" background="var(--paper-100)">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="8" fill="var(--gold-500)" stroke="#000" strokeWidth="2" />
              <rect
                x="55"
                y="10"
                width="18"
                height="18"
                transform="rotate(45 64 19)"
                fill="var(--plum-500)"
                stroke="#000"
                strokeWidth="2"
              />
              <polygon points="80,70 95,95 65,95" fill="var(--plum-900)" />
              <path d="M10 60 Q 25 50 40 60 T 55 70" stroke="#000" strokeWidth="3" fill="none" />
              <circle cx="72" cy="55" r="4" fill="#000" />
              <path d="M15 85 l8 8 M23 85 l-8 8" stroke="var(--gold-500)" strokeWidth="3" />
            </svg>
          </PatternSwatch>
        </div>
      </DsCard>

      <div style={{ height: 24 }} />

      <DsCard label="SHAPE PRIMITIVES">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              ...shapeBaseStyle,
              transform: 'rotate(45deg)',
              background: 'var(--gold-500)',
            }}
          />
          <div
            style={{
              ...shapeBaseStyle,
              borderRadius: '50%',
              background: 'var(--plum-500)',
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              background: 'transparent',
              border: 'none',
              borderLeft: '36px solid transparent',
              borderRight: '36px solid transparent',
              borderBottom: '64px solid var(--plum-900)',
            }}
          />
          <div
            style={{
              ...shapeBaseStyle,
              background: 'repeating-linear-gradient(45deg, var(--ink) 0 3px, transparent 3px 8px)',
            }}
          />
          <div
            style={{
              ...shapeBaseStyle,
              background: 'var(--success)',
              borderRadius: '60% 40% 70% 30% / 40% 50% 50% 60%',
            }}
          />
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
            <path
              d="M4 32 Q 14 4 24 32 T 44 32 T 60 32"
              stroke="#000"
              strokeWidth="4"
              fill="none"
            />
          </svg>
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
            <polygon
              points="32,4 40,24 60,24 44,36 50,56 32,44 14,56 20,36 4,24 24,24"
              fill="var(--gold-500)"
              stroke="#000"
              strokeWidth="3"
            />
          </svg>
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
            <rect
              x="10"
              y="10"
              width="44"
              height="44"
              fill="var(--plum-900)"
              stroke="#000"
              strokeWidth="3"
            />
            <rect x="18" y="18" width="14" height="14" fill="var(--gold-500)" />
            <rect x="32" y="32" width="14" height="14" fill="var(--gold-500)" />
          </svg>
        </div>
      </DsCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 11 · Export → Figma (hint)
// ═══════════════════════════════════════════════════════════

// .hint — faithful port of the original .hint card.
// Uses color-mix + semantic tokens so it adapts to light/dark + palette.
// In light: plum-500 @ 22% over white surface → soft lilac.
// In dark:  plum-500 @ 22% over plum-900 surface → muted violet.
const hintStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  padding: 20,
  background: 'color-mix(in oklab, var(--plum-500) 22%, var(--surface))',
  border: '2px solid var(--border-memphis)',
  boxShadow: '4px 4px 0 var(--shadow-memphis-color)',
  alignItems: 'flex-start',
  marginBottom: 24,
}

const hintIconStyle: CSSProperties = {
  flexShrink: 0,
  width: 40,
  height: 40,
  background: 'var(--plum-500)',
  border: '2px solid var(--border-memphis)',
  display: 'grid',
  placeItems: 'center',
  color: 'var(--paper-50)',
  fontFamily: 'var(--font-display)',
  fontSize: 18,
}

const hintTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 16,
  margin: '0 0 4px',
  color: 'var(--ink)',
}

const hintCodeStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  border: '1px solid var(--border-memphis)',
  padding: '1px 6px',
  fontSize: 12,
}

function Hint({ num, title, children }: { num: number; title: ReactNode; children: ReactNode }) {
  return (
    <div style={hintStyle}>
      <div style={hintIconStyle}>{num}</div>
      <div style={{ flex: 1 }}>
        <h4 style={hintTitleStyle}>{title}</h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
          {children}
        </p>
      </div>
    </div>
  )
}

function FigmaSection() {
  return (
    <section id="figma" style={sectionStyle}>
      <SectionHeader
        num="11"
        title="Come portare tutto in Figma"
        desc="Non posso generare un .fig direttamente, ma ecco 3 modi collaudati per importare il sistema."
      />

      <Hint
        num={1}
        title={
          <>
            Plugin <i>html.to.design</i> (la via più completa)
          </>
        }
      >
        In Figma apri <code style={hintCodeStyle}>Plugins → html.to.design → da URL</code>, incolla
        il link di questa pagina. Importerà l&apos;intera pagina come frame Figma, con tutti gli SVG
        e i colori già strutturati in layer. Gratis per i primi 3 import al giorno.
      </Hint>

      <Hint num={2} title="Copia-incolla SVG (1:1, perfetto per icone e medaglie)">
        Ispeziona l&apos;elemento → copia il nodo <code style={hintCodeStyle}>&lt;svg&gt;</code> →
        incolla in Figma con <code style={hintCodeStyle}>Cmd+V</code>. Figma lo converte in vettore
        nativo con tutti i path editabili. Usalo per icone, medaglie, forme Memphis.
      </Hint>

      <Hint
        num={3}
        title={
          <>
            Plugin <i>Tokens Studio</i> (solo colori + tipografia)
          </>
        }
      >
        Copia le CSS variables da <code style={hintCodeStyle}>tokens.css</code> e incollale in
        Tokens Studio (<code style={hintCodeStyle}>+ → Import → CSS Variables</code>). I token
        diventano stili Figma nativi che puoi applicare ai tuoi componenti.
      </Hint>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// Hero decoration (inline SVG Memphis)
// ═══════════════════════════════════════════════════════════

function HeroDecor() {
  return (
    <svg
      style={heroDecorStyle}
      width="260"
      height="120"
      viewBox="0 0 260 120"
      fill="none"
      aria-hidden
    >
      {/* tilde wave */}
      <path
        d="M20 30 Q40 10 60 30 T100 30"
        stroke="var(--plum-900)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* gold circle */}
      <circle
        cx="200"
        cy="30"
        r="18"
        fill="var(--gold-500)"
        stroke="var(--plum-900)"
        strokeWidth="2"
      />
      {/* violet diamond */}
      <path
        d="M60 90 L90 60 L120 90 L90 120 Z"
        fill="var(--plum-500)"
        stroke="var(--plum-900)"
        strokeWidth="2"
      />
      {/* plum triangle */}
      <path d="M170 110 L200 70 L230 110 Z" fill="var(--plum-900)" />
      {/* x mark */}
      <path
        d="M240 50 L255 65 M255 50 L240 65"
        stroke="var(--gold-500)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

export default function DesignSystemPage() {
  return (
    <div style={pageStyle}>
      <Toc />
      <main style={mainStyle}>
        <header style={heroStyle}>
          <HeroDecor />
          <div style={heroEyebrowStyle}>DAMACCHI · DESIGN SYSTEM · V1.0</div>
          <h1 style={heroTitleStyle}>
            Scacchi + dama,
            <br />
            un sistema solo.
          </h1>
          <p style={heroLeadStyle}>
            Linguaggio visivo completo: token, componenti, mascotte e pattern. Pensato per essere
            importato in Figma in 3 modi diversi — vedi sezione 11.
          </p>
          <div style={heroMetaStyle}>
            <span>
              <b style={heroMetaBoldStyle}>11</b> sezioni
            </span>
            <span>
              <b style={heroMetaBoldStyle}>4</b> scale colore
            </span>
            <span>
              <b style={heroMetaBoldStyle}>30</b> icone
            </span>
            <span>
              <b style={heroMetaBoldStyle}>6</b> pattern
            </span>
          </div>
          <span style={heroAccentStyle} aria-hidden />
        </header>

        <ColorsSection />
        <TypographySection />
        <ButtonsSection />
        <CardsSection />
        <InputsSection />
        <BadgesSection />
        <IconsSection />
        <AvatarsSection />
        <MascotSection />
        <PatternsSection />
        <FigmaSection />

        <footer
          style={{
            padding: '80px 0 40px',
            borderTop: '2px solid var(--ink)',
            marginTop: 80,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span>DAMACCHI · DESIGN SYSTEM v1.0</span>
          <span>
            MADE WITH <span style={{ color: 'var(--danger)' }}>♥</span> BY DAMO
          </span>
        </footer>
      </main>
    </div>
  )
}
