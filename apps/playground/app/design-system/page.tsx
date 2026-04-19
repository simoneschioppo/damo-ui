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

import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Button,
  IconButton,
  Input,
  Label,
  Switch,
  Slider,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Chip,
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

const stateNoteStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--ink-muted)',
  marginTop: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
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

// ═══════════════════════════════════════════════════════════
// 01 · Colors — horizontal color bands (faithful to original)
// ═══════════════════════════════════════════════════════════
// Ogni scala è una banda orizzontale piena: left col (nome + token + desc),
// right col grid di stops con background colore + nome/hex inline.

type ColorStop = { readonly k: number; readonly hex: string; readonly text: 'dark' | 'light' }
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
  stops: [
    { k: 900, hex: '#2a0f2d', text: 'dark' },
    { k: 800, hex: '#3d1a40', text: 'dark' },
    { k: 700, hex: '#522357', text: 'dark' },
    { k: 500, hex: '#7a3980', text: 'dark' },
    { k: 300, hex: '#b17cb5', text: 'dark' },
    { k: 100, hex: '#e0c6e2', text: 'light' },
  ],
}

const GOLD_SCALE: ColorScaleDef = {
  name: 'Gold',
  token: 'gold',
  desc: 'Accent brand — bottoni, bordi dorati, highlight',
  stops: [
    { k: 500, hex: '#c4942a', text: 'dark' },
    { k: 400, hex: '#d5a845', text: 'dark' },
    { k: 300, hex: '#e5bc6d', text: 'light' },
    { k: 200, hex: '#f0d49a', text: 'light' },
    { k: 100, hex: '#f8e5bc', text: 'light' },
  ],
}

const PAPER_SCALE: ColorScaleDef = {
  name: 'Paper',
  token: 'paper',
  desc: 'Sfondi caldi ivory/cream — base del prodotto',
  stops: [
    { k: 300, hex: '#ddd0ae', text: 'light' },
    { k: 200, hex: '#ece2c6', text: 'light' },
    { k: 100, hex: '#f5efde', text: 'light' },
    { k: 50, hex: '#fbf7ee', text: 'light' },
  ],
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
        {scale.stops.map((s, idx) => (
          <div
            key={s.k}
            style={{
              background: s.hex,
              color: s.text === 'dark' ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.75)',
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
              {s.hex}
            </div>
          </div>
        ))}
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
  return (
    <section id="cards" style={sectionStyle}>
      <SectionHeader
        num="04"
        title="Cards"
        desc="4 varianti principali. Tutte condividono bordo 2px + shadow Memphis, cambia solo accento e layout."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="PLAYER CARD">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 16,
              background: 'var(--paper-50)',
              minHeight: 140,
            }}
          >
            <PlayerCard />
          </div>
        </SubPanel>
        <SubPanel label="MODE CARD">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 16,
              background: 'var(--paper-50)',
              minHeight: 200,
            }}
          >
            <ModeCard />
          </div>
        </SubPanel>
        <SubPanel label="INFO CARD · TOOLTIP/POPOVER">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: '32px 16px 16px',
              background: 'var(--paper-50)',
              minHeight: 180,
            }}
          >
            <InfoCard />
          </div>
        </SubPanel>
        <SubPanel label="CONTENT CARD · NEUTRA">
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              padding: 16,
              background: 'var(--paper-50)',
              minHeight: 200,
            }}
          >
            <ContentCardNeutra />
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 05 · Inputs
// ═══════════════════════════════════════════════════════════

const fieldLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  display: 'block',
  marginBottom: 6,
  fontWeight: 700,
}

function InputsSection() {
  const [segMode, setSegMode] = useState('blitz')
  const [toggleA, setToggleA] = useState(false)
  const [toggleB, setToggleB] = useState(true)
  const [slider1, setSlider1] = useState([30])
  const [slider2, setSlider2] = useState([60])

  return (
    <section id="inputs" style={sectionStyle}>
      <SectionHeader
        num="05"
        title="Inputs"
        desc="Text field, select, segmented, toggle minimalista, slider. Tutto risponde ai token."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Text Field · Stati">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label htmlFor="nick-default" style={fieldLabelStyle}>
                Nickname
              </Label>
              <Input id="nick-default" defaultValue="Damo42" />
              <div style={stateNoteStyle}>Default</div>
            </div>
            <div>
              <Label htmlFor="nick-focus" style={fieldLabelStyle}>
                Nickname
              </Label>
              <Input
                id="nick-focus"
                defaultValue="MarinaChess"
                style={{
                  borderColor: 'var(--gold-500)',
                  boxShadow: '0 0 0 3px color-mix(in oklab, var(--gold-500) 35%, transparent)',
                }}
              />
              <div style={stateNoteStyle}>Focus</div>
            </div>
            <div>
              <Label htmlFor="email-disabled" style={fieldLabelStyle}>
                Email
              </Label>
              <Input
                id="email-disabled"
                defaultValue="mario@damacchi.it"
                disabled
                style={{ background: 'var(--paper-100)', color: 'var(--ink-muted)' }}
              />
              <div style={stateNoteStyle}>Disabled</div>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Select · Segmented">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label style={fieldLabelStyle}>Modalità</Label>
              <Select defaultValue="classico">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classico">Classico</SelectItem>
                  <SelectItem value="rapid">Rapid</SelectItem>
                  <SelectItem value="rage">Rage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label style={fieldLabelStyle}>Tempo</Label>
              <SegmentedControl
                value={segMode}
                onValueChange={(v) => v && setSegMode(v)}
                aria-label="Tempo"
              >
                <SegmentedControlItem value="bullet">BULLET</SegmentedControlItem>
                <SegmentedControlItem value="blitz">BLITZ</SegmentedControlItem>
                <SegmentedControlItem value="rapid">RAPID</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Toggle · Minimalist">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={toggleA} onCheckedChange={setToggleA} aria-label="Toggle off" />
              <span style={stateNoteStyle}>{toggleA ? 'ON' : 'OFF'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={toggleB} onCheckedChange={setToggleB} aria-label="Toggle on" />
              <span style={stateNoteStyle}>{toggleB ? 'ON' : 'OFF'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch disabled aria-label="Toggle disabled" />
              <span style={stateNoteStyle}>DISABLED</span>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Slider">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <Slider value={slider1} onValueChange={setSlider1} min={0} max={100} />
              <div style={stateNoteStyle}>{slider1[0]}%</div>
            </div>
            <div>
              <Slider value={slider2} onValueChange={setSlider2} min={0} max={100} />
              <div style={stateNoteStyle}>{slider2[0]}%</div>
            </div>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 06 · Badges & Chips
// ═══════════════════════════════════════════════════════════

function BadgesSection() {
  return (
    <section id="badges" style={sectionStyle}>
      <SectionHeader
        num="06"
        title="Badge & Chip"
        desc="Etichette discrete per numeri, status, categorie. Chip per filtri, badge per conteggi."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Badge · Default">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge>12</Badge>
            <Badge>NEW</Badge>
            <Badge>99+</Badge>
          </div>
        </SubPanel>

        <SubPanel label="Badge · Featured">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="featured">HOT</Badge>
            <Badge variant="featured">PRO</Badge>
            <Badge variant="featured">1°</Badge>
          </div>
        </SubPanel>

        <SubPanel label="Chip · Variants">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Chip>Default</Chip>
            <Chip variant="accent">Accent</Chip>
            <Chip variant="brand">Brand</Chip>
            <Chip variant="success">Win</Chip>
            <Chip variant="danger">Loss</Chip>
            <Chip variant="warning">Draw</Chip>
          </div>
        </SubPanel>

        <SubPanel label="Chip · Sizes">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip size="sm">Small</Chip>
            <Chip size="md">Medium</Chip>
            <Chip size="lg">Large</Chip>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 07 · Icons (full 30-icon grid)
// ═══════════════════════════════════════════════════════════

const ICON_LIST = [
  { C: HomeIcon, name: 'home' },
  { C: SearchIcon, name: 'search' },
  { C: CloseIcon, name: 'close' },
  { C: CheckIcon, name: 'check' },
  { C: PlusIcon, name: 'plus' },
  { C: MinusIcon, name: 'minus' },
  { C: MenuIcon, name: 'menu' },
  { C: ChevronUpIcon, name: 'chev-up' },
  { C: ChevronDownIcon, name: 'chev-down' },
  { C: ChevronLeftIcon, name: 'chev-left' },
  { C: ChevronRightIcon, name: 'chev-right' },
  { C: CrownIcon, name: 'crown' },
  { C: PawnIcon, name: 'pawn' },
  { C: TrophyIcon, name: 'trophy' },
  { C: UserIcon, name: 'user' },
  { C: HeartIcon, name: 'heart' },
  { C: StarIcon, name: 'star' },
  { C: BoltIcon, name: 'bolt' },
  { C: BookmarkIcon, name: 'bookmark' },
  { C: InfoIcon, name: 'info' },
  { C: CogIcon, name: 'cog' },
  { C: EditIcon, name: 'edit' },
  { C: TrashIcon, name: 'trash' },
  { C: FilterIcon, name: 'filter' },
  { C: ExternalLinkIcon, name: 'external' },
  { C: ArrowRightIcon, name: 'arrow-right' },
  { C: PlayIcon, name: 'play' },
  { C: PauseIcon, name: 'pause' },
  { C: ClockIcon, name: 'clock' },
  { C: TargetIcon, name: 'target' },
] as const

function IconsSection() {
  return (
    <section id="icons" style={sectionStyle}>
      <SectionHeader
        num="07"
        title="Icone"
        desc={`${ICON_LIST.length} icone line-style dal set damacchi-ui. Stroke 2px, grid 24×24.`}
      />
      <div
        style={{
          border: '2px solid var(--border-memphis)',
          boxShadow: 'var(--shadow-memphis)',
          background: 'var(--surface)',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
        }}
      >
        {ICON_LIST.map(({ C, name }) => (
          <div
            key={name}
            style={{
              aspectRatio: '1 / 1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRight: '1px solid color-mix(in oklab, var(--ink) 12%, transparent)',
              borderBottom: '1px solid color-mix(in oklab, var(--ink) 12%, transparent)',
              padding: 16,
            }}
          >
            <C size={28} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--ink-muted)',
                letterSpacing: '0.05em',
              }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 08 · Avatars
// ═══════════════════════════════════════════════════════════

function AvatarsSection() {
  return (
    <section id="avatars" style={sectionStyle}>
      <SectionHeader
        num="08"
        title="Avatar & Medaglie"
        desc="Avatar in 4 size (sm, md, lg, xl) e 2 shape (circle, square). AvatarGroup per overlap."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Sizes · Circle">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Avatar size="sm">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar size="md">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
            <Avatar size="xl">
              <AvatarFallback>MR</AvatarFallback>
            </Avatar>
          </div>
        </SubPanel>

        <SubPanel label="Sizes · Square">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <Avatar size="sm" shape="square">
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
            <Avatar size="md" shape="square">
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
            <Avatar size="lg" shape="square">
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
            <Avatar size="xl" shape="square">
              <AvatarFallback>DA</AvatarFallback>
            </Avatar>
          </div>
        </SubPanel>

        <SubPanel label="Group · Overlap">
          <AvatarGroup max={4}>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>F</AvatarFallback>
            </Avatar>
          </AvatarGroup>
        </SubPanel>

        <SubPanel label="Medaglie · Podium">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {[
              { place: '1', color: 'var(--gold-500)', ink: '#000' },
              { place: '2', color: 'var(--plum-300)', ink: '#fff' },
              { place: '3', color: 'var(--gold-300)', ink: 'var(--ink)' },
            ].map((m) => (
              <div
                key={m.place}
                style={{
                  width: 56,
                  height: 56,
                  border: '2px solid var(--border-memphis)',
                  boxShadow: 'var(--shadow-memphis-sm)',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  background: m.color,
                  color: m.ink,
                }}
              >
                {m.place}°
              </div>
            ))}
          </div>
        </SubPanel>
      </div>
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
        desc="Lo spirito del sistema. Asset SVG in arrivo — placeholder attuale per layout."
      />
      <div
        style={{
          border: '2px solid var(--border-memphis)',
          boxShadow: 'var(--shadow-memphis)',
          background:
            'linear-gradient(180deg, color-mix(in oklab, var(--plum-300) 32%, var(--surface)) 0%, var(--paper-50) 100%)',
          padding: 48,
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--plum-500)',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Mascotte
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 44,
              lineHeight: 1,
              margin: '0 0 16px',
              color: 'var(--plum-700)',
            }}
          >
            Damo, il pezzo ibrido
          </h3>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '0 0 8px' }}>
            Parte pedone, parte dama — muove di una casella, cattura in diagonale come una regina.
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-muted)', margin: 0 }}>
            Gli asset grafici completi (idle, cheer, think, lose) verranno aggiunti a breve.
          </p>
        </div>
        <div
          style={{
            aspectRatio: '1 / 1',
            maxWidth: 320,
            background: 'var(--surface)',
            border: '2px dashed var(--border-strong)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--ink-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          asset placeholder
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 10 · Memphis Patterns
// ═══════════════════════════════════════════════════════════

const PATTERNS: ReadonlyArray<{
  label: string
  style: CSSProperties
}> = [
  {
    label: 'Dots',
    style: {
      backgroundImage: 'radial-gradient(var(--ink) 2px, transparent 2px)',
      backgroundSize: '14px 14px',
      backgroundColor: 'var(--paper-50)',
    },
  },
  {
    label: 'Grid',
    style: {
      backgroundImage:
        'linear-gradient(var(--ink) 1.5px, transparent 1.5px), linear-gradient(90deg, var(--ink) 1.5px, transparent 1.5px)',
      backgroundSize: '20px 20px',
      backgroundColor: 'var(--paper-50)',
    },
  },
  {
    label: 'Stripes 45°',
    style: {
      backgroundImage:
        'repeating-linear-gradient(45deg, var(--gold-500) 0 6px, transparent 6px 14px)',
      backgroundColor: 'var(--paper-50)',
    },
  },
  {
    label: 'Stripes 0°',
    style: {
      backgroundImage:
        'repeating-linear-gradient(0deg, var(--plum-900) 0 4px, transparent 4px 12px)',
      backgroundColor: 'var(--paper-50)',
    },
  },
  {
    label: 'Checker',
    style: {
      backgroundImage:
        'linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%), linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      backgroundColor: 'var(--surface)',
    },
  },
  {
    label: 'Diagonal Weave',
    style: {
      backgroundImage:
        'linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%), linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%)',
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      backgroundColor: 'var(--paper-50)',
    },
  },
]

function PatternsSection() {
  return (
    <section id="patterns" style={sectionStyle}>
      <SectionHeader
        num="10"
        title="Pattern Memphis"
        desc="Sfondi decorativi di supporto: dots, grid, stripes, checker, weave."
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}
      >
        {PATTERNS.map((p) => (
          <div
            key={p.label}
            style={{
              aspectRatio: '1 / 1',
              border: '2px solid var(--border-memphis)',
              boxShadow: 'var(--shadow-memphis-sm)',
              position: 'relative',
              overflow: 'hidden',
              ...p.style,
            }}
          >
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--ink)',
                color: '#fff',
                padding: '3px 8px',
                fontWeight: 700,
              }}
            >
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 11 · Export → Figma (hint)
// ═══════════════════════════════════════════════════════════

function FigmaSection() {
  return (
    <section id="figma" style={sectionStyle}>
      <SectionHeader
        num="11"
        title="Export → Figma"
        desc="Ponte tra codice e design file. Token CSS importabili via Design Tokens plugin."
      />
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: 20,
          background: 'color-mix(in oklab, var(--plum-300) 32%, var(--surface))',
          border: '2px solid var(--border-memphis)',
          boxShadow: 'var(--shadow-memphis)',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            background: 'var(--plum-500)',
            border: '2px solid var(--border-memphis)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: 18,
          }}
        >
          F
        </div>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              margin: '0 0 8px',
              color: 'var(--plum-700)',
            }}
          >
            Preset CSS → Figma
          </h4>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            Importa i token CSS del pacchetto{' '}
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--surface)',
                border: '1px solid var(--ink)',
                padding: '1px 6px',
                fontSize: 12,
              }}
            >
              @damacchi/ui/styles/tokens.css
            </code>{' '}
            usando il plugin <strong>Design Tokens</strong> di Figma.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-muted)' }}>
            Le variabili color/space/radius/shadow vengono create automaticamente come Figma
            Variables; le componenti React restano la fonte di verità.
          </p>
        </div>
      </div>
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
