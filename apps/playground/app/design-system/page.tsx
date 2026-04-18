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
// 01 · Colors
// ═══════════════════════════════════════════════════════════

const PLUM_STOPS = [100, 300, 500, 700, 800, 900] as const
const GOLD_STOPS = [100, 200, 300, 400, 500] as const
const PAPER_STOPS = [50, 100, 200, 300] as const

const SEMANTIC_TOKENS: ReadonlyArray<readonly [string, string]> = [
  ['--bg', 'Background'],
  ['--surface', 'Surface'],
  ['--surface-2', 'Surface 2'],
  ['--ink', 'Ink'],
  ['--ink-soft', 'Ink Soft'],
  ['--ink-muted', 'Ink Muted'],
  ['--border-memphis', 'Border'],
  ['--accent', 'Accent'],
]

function Swatch({ varName, label }: { varName: string; label: string }) {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        background: 'var(--surface)',
        padding: 10,
      }}
    >
      <div
        style={{
          height: 44,
          background: `var(${varName})`,
          border: '1px solid var(--border)',
          marginBottom: 6,
        }}
      />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>{label}</div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--ink-muted)',
        }}
      >
        {varName}
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
        desc="Plum per l'ink scuro, Gold per l'accento, Paper (ivory/cream) per gli sfondi caldi."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Plum Scale">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {PLUM_STOPS.map((s) => (
              <Swatch key={s} varName={`--plum-${s}`} label={`plum-${s}`} />
            ))}
          </div>
        </SubPanel>

        <SubPanel label="Gold Scale">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {GOLD_STOPS.map((s) => (
              <Swatch key={s} varName={`--gold-${s}`} label={`gold-${s}`} />
            ))}
          </div>
        </SubPanel>

        <SubPanel label="Paper Scale">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {PAPER_STOPS.map((s) => (
              <Swatch key={s} varName={`--paper-${s}`} label={`paper-${s}`} />
            ))}
          </div>
        </SubPanel>

        <SubPanel label="Semantic">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {SEMANTIC_TOKENS.map(([v, l]) => (
              <Swatch key={v} varName={v} label={l} />
            ))}
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 02 · Typography
// ═══════════════════════════════════════════════════════════

const TYPE_LADDER: ReadonlyArray<{ label: string; size: number }> = [
  { label: 'text-6xl', size: 60 },
  { label: 'text-5xl', size: 48 },
  { label: 'text-4xl', size: 36 },
  { label: 'text-3xl', size: 30 },
  { label: 'text-2xl', size: 24 },
  { label: 'text-xl', size: 20 },
  { label: 'text-base', size: 16 },
  { label: 'text-sm', size: 14 },
  { label: 'text-xs', size: 12 },
]

function TypographySection() {
  return (
    <section id="type" style={sectionStyle}>
      <SectionHeader
        num="02"
        title="Tipografia"
        desc="Audiowide per i titoli display, Exo 2 per il body. Scala coerente con Tailwind."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Display · Audiowide">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1 }}>
            Damacchi
          </div>
          <div style={stateNoteStyle}>var(--font-display) · 64px</div>
        </SubPanel>

        <SubPanel label="Body · Exo 2">
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 300 }}>Mangia come scacchi. (300)</span>
            <span style={{ fontWeight: 400 }}>Mangia come scacchi. (400)</span>
            <span style={{ fontWeight: 600 }}>Mangia come scacchi. (600)</span>
            <span style={{ fontWeight: 700 }}>Mangia come scacchi. (700)</span>
          </div>
        </SubPanel>

        <SubPanel label="Scala">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TYPE_LADDER.map((t) => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--ink-muted)',
                    minWidth: 72,
                  }}
                >
                  {t.label}
                </span>
                <span style={{ fontSize: t.size, lineHeight: 1.1 }}>Damacchi</span>
              </div>
            ))}
          </div>
        </SubPanel>

        <SubPanel label="Utilities">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>.display</div>
              <div style={stateNoteStyle}>Audiowide · letter-spacing tight</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                .mono const {'{'} pawns: 12 {'}'}
              </div>
              <div style={stateNoteStyle}>Exo 2 · letter-spacing 0.04em</div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  fontWeight: 700,
                }}
              >
                Finalmente una dama con le palle
              </div>
              <div style={stateNoteStyle}>.eyebrow · uppercase · tracking wide</div>
            </div>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 03 · Buttons
// ═══════════════════════════════════════════════════════════

function ButtonsSection() {
  return (
    <section id="buttons" style={sectionStyle}>
      <SectionHeader
        num="03"
        title="Bottoni"
        desc="Memphis hard: bordo 2px nero, L-shadow offset pure black, click fisico snap."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Stati · Outline">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <div>
              <Button variant="outline">Default</Button>
              <div style={stateNoteStyle}>default</div>
            </div>
            <div>
              <Button variant="outline" style={{ boxShadow: 'var(--shadow-memphis-hover)' }}>
                Hover
              </Button>
              <div style={stateNoteStyle}>hover</div>
            </div>
            <div>
              <Button variant="outline" style={{ boxShadow: 'var(--shadow-memphis-active)' }}>
                Active
              </Button>
              <div style={stateNoteStyle}>active</div>
            </div>
            <div>
              <Button
                variant="outline"
                style={{ outline: '3px solid var(--ring)', outlineOffset: 2 }}
              >
                Focus
              </Button>
              <div style={stateNoteStyle}>focus</div>
            </div>
            <div>
              <Button variant="outline" disabled>
                Disabled
              </Button>
              <div style={stateNoteStyle}>disabled</div>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Variants">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
        </SubPanel>

        <SubPanel label="Sizes">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button variant="outline" size="sm">
              Small
            </Button>
            <Button variant="outline" size="md">
              Medium
            </Button>
            <Button variant="outline" size="lg">
              Large
            </Button>
            <IconButton aria-label="Search">
              <SearchIcon size={18} />
            </IconButton>
          </div>
        </SubPanel>

        <SubPanel label="With Icons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button variant="primary">
              <CrownIcon size={16} /> Play
            </Button>
            <Button variant="accent">
              <TrophyIcon size={16} /> Classifica
            </Button>
            <Button variant="outline">
              <ArrowRightIcon size={16} /> Continua
            </Button>
            <Button variant="danger">
              <TrashIcon size={16} /> Elimina
            </Button>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 04 · Cards (domain patterns)
// ═══════════════════════════════════════════════════════════

function PlayerCard() {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis)',
        background: 'var(--surface)',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        minHeight: 92,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: 'var(--plum-500)',
          border: '2px solid var(--border-memphis)',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--paper-50)',
        }}
      >
        <UserIcon size={24} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
          Marina &quot;MC&quot; Rossi
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--ink-muted)',
            textTransform: 'uppercase',
            marginTop: 2,
          }}
        >
          ELO 1847 · ONLINE
        </div>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <ClockIcon size={14} /> 10:32
      </div>
    </div>
  )
}

function ModeCard() {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis)',
        background: 'var(--surface)',
        padding: 16,
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: 'var(--ink)',
            marginBottom: 4,
          }}
        >
          Classico
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
          Partita standard 8×8 con orologio.
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-500)',
            fontWeight: 700,
          }}
        >
          10+5 MIN
        </div>
      </div>
      <div
        style={{
          width: 36,
          height: 36,
          background: 'var(--ink)',
          color: 'var(--paper-50)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <ArrowRightIcon size={18} />
      </div>
    </div>
  )
}

function InfoCard() {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis)',
        background: 'var(--surface)',
        padding: 20,
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -8,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 12,
          height: 12,
          background: 'var(--gold-500)',
          border: '2px solid var(--border-memphis)',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        Mosse Rimanenti
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 64,
          color: 'var(--ink)',
          lineHeight: 1,
        }}
      >
        23
      </div>
    </div>
  )
}

function ContentCardNeutra() {
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis)',
        background: 'var(--surface)',
        padding: 20,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--gold-500)',
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        Regola
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: 'var(--ink)',
          marginBottom: 10,
          lineHeight: 1.15,
        }}
      >
        Mangia come scacchi,
        <br />
        muovi come dama
      </div>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
        Cattura diagonale a distanza libera, movimento di una casella alla volta. L&apos;ibrido che
        riscrive le regole.
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
        desc="Player, mode, info, content card — pattern di dominio costruiti sul Memphis frame."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Player Card">
          <PlayerCard />
        </SubPanel>
        <SubPanel label="Mode Card">
          <ModeCard />
        </SubPanel>
        <SubPanel label="Info Card">
          <InfoCard />
        </SubPanel>
        <SubPanel label="Content Card · Neutra">
          <ContentCardNeutra />
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
