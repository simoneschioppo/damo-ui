'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
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
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Progress,
  Spinner,
  Badge,
  Chip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  NavItem,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  HomeIcon,
  SearchIcon,
  CogIcon,
  TrophyIcon,
  TrashIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  CrownIcon,
} from '@damacchi/ui'

// ───────────────────────────────────────────
// Styles (tokens-driven, inline for clarity)
// ───────────────────────────────────────────

const pageStyle: CSSProperties = {
  background: 'var(--bg)',
  minHeight: '100vh',
}

const heroStyle: CSSProperties = {
  padding: '72px 32px 48px',
  maxWidth: 1280,
  margin: '0 auto',
  borderBottom: '2px solid var(--ink)',
  position: 'relative',
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
  fontSize: 68,
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
}

const sectionStyle: CSSProperties = {
  padding: '48px 32px',
  maxWidth: 1280,
  margin: '0 auto',
}

const sectionHeaderStyle: CSSProperties = {
  marginBottom: 32,
}

const sectionNumStyle: CSSProperties = {
  display: 'inline-block',
  color: 'var(--gold-500)',
  fontFamily: 'var(--font-display)',
  fontSize: 14,
  letterSpacing: '0.15em',
  marginRight: 16,
  verticalAlign: 'super',
}

const sectionTitleStyle: CSSProperties = {
  display: 'inline-block',
  fontFamily: 'var(--font-display)',
  fontSize: 56,
  color: 'var(--ink)',
  margin: 0,
}

const sectionDescStyle: CSSProperties = {
  color: 'var(--ink-muted)',
  fontSize: 18,
  marginTop: 8,
  maxWidth: 600,
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

// ───────────────────────────────────────────
// Reusable section shell
// ───────────────────────────────────────────

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

// ───────────────────────────────────────────
// 01 · Colors
// ───────────────────────────────────────────

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
    <section style={sectionStyle}>
      <SectionHeader
        num="01"
        title="Colors & Palette"
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

// ───────────────────────────────────────────
// 02 · Typography
// ───────────────────────────────────────────

const TYPE_LADDER: ReadonlyArray<{ label: string; size: number }> = [
  { label: 'text-7xl', size: 72 },
  { label: 'text-6xl', size: 60 },
  { label: 'text-5xl', size: 48 },
  { label: 'text-4xl', size: 36 },
  { label: 'text-3xl', size: 30 },
  { label: 'text-2xl', size: 24 },
  { label: 'text-xl', size: 20 },
  { label: 'text-lg', size: 18 },
  { label: 'text-base', size: 16 },
  { label: 'text-sm', size: 14 },
  { label: 'text-xs', size: 12 },
]

function TypographySection() {
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="02"
        title="Typography"
        desc="Audiowide per i titoli display, Exo 2 per il body. Scala di size coerente con Tailwind."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Display · Audiowide">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 1 }}>
            Damacchi
          </div>
          <div style={stateNoteStyle}>var(--font-display) · 72px</div>
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
            <span style={{ fontWeight: 300 }}>Mangia come scacchi, muovi come dama. (300)</span>
            <span style={{ fontWeight: 400 }}>Mangia come scacchi, muovi come dama. (400)</span>
            <span style={{ fontWeight: 600 }}>Mangia come scacchi, muovi come dama. (600)</span>
            <span style={{ fontWeight: 700 }}>Mangia come scacchi, muovi come dama. (700)</span>
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
                    minWidth: 80,
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
              <div className="display" style={{ fontSize: 28 }}>
                .display
              </div>
              <div style={stateNoteStyle}>Audiowide · letter-spacing tight</div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 14 }}>
                .mono const {'{'} pawns: 12 {'}'}
              </div>
              <div style={stateNoteStyle}>Exo 2 · letter-spacing 0.04em</div>
            </div>
            <div>
              <div className="eyebrow">Finalmente una dama con le palle</div>
              <div style={stateNoteStyle}>.eyebrow · uppercase · tracking wide</div>
            </div>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// 03 · Buttons
// ───────────────────────────────────────────

function ButtonsSection() {
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="03"
        title="Buttons"
        desc="Memphis hard: bordo 2px nero, shadow offset, click fisico snap."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Primary · Stati">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <div>
              <Button>Default</Button>
              <div style={stateNoteStyle}>default</div>
            </div>
            <div>
              <Button style={{ boxShadow: 'var(--shadow-memphis-hover)' }}>Hover</Button>
              <div style={stateNoteStyle}>hover</div>
            </div>
            <div>
              <Button style={{ boxShadow: 'var(--shadow-memphis-active)' }}>Active</Button>
              <div style={stateNoteStyle}>active</div>
            </div>
            <div>
              <Button
                style={{
                  outline: '3px solid var(--ring)',
                  outlineOffset: 2,
                }}
              >
                Focus
              </Button>
              <div style={stateNoteStyle}>focus</div>
            </div>
            <div>
              <Button disabled>Disabled</Button>
              <div style={stateNoteStyle}>disabled</div>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Variants">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </div>
        </SubPanel>

        <SubPanel label="Sizes">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
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
            <Button variant="danger">
              <TrashIcon size={16} /> Elimina
            </Button>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// 04 · Cards (domain + content)
// ───────────────────────────────────────────

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
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>Marina "MC" Rossi</div>
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
    <button
      type="button"
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis)',
        background: 'var(--surface)',
        padding: 16,
        textAlign: 'left',
        cursor: 'pointer',
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
    </button>
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
        Cattura diagonale a distanza libera, movimento di una casella alla volta. L'ibrido che
        riscrive le regole.
      </p>
    </div>
  )
}

function CardsSection() {
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="04"
        title="Cards"
        desc="Variants di Card generici più pattern di dominio: player, mode, info, contenuto."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Player Card">
          <PlayerCard />
        </SubPanel>
        <SubPanel label="Mode Card">
          <ModeCard />
        </SubPanel>
        <SubPanel label="Info Card · Tooltip/Popover">
          <InfoCard />
        </SubPanel>
        <SubPanel label="Content Card · Neutra">
          <ContentCardNeutra />
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// 05 · Inputs
// ───────────────────────────────────────────

function InputsSection() {
  const [segMode, setSegMode] = useState('blitz')
  const [toggleOff] = useState(false)
  const [toggleOn] = useState(true)
  const [slider1, setSlider1] = useState([30])
  const [slider2, setSlider2] = useState([60])
  const [slider3, setSlider3] = useState([90])

  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="05"
        title="Inputs"
        desc="Text field, select, segmented, toggle, slider. Tutti rispondono ai token semantici."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Text Field · Stati">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label
                htmlFor="nick-default"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Nickname
              </Label>
              <Input id="nick-default" defaultValue="Damo42" />
              <div style={stateNoteStyle}>Default</div>
            </div>
            <div>
              <Label
                htmlFor="nick-focus"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
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
              <Label
                htmlFor="email-disabled"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
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

        <SubPanel label="Select">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <Label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Modalità
              </Label>
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
              <Label
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Segmented
              </Label>
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

        <SubPanel label="Toggle">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={toggleOff} aria-label="Off" />
              <span style={stateNoteStyle}>Off</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={toggleOn} aria-label="On" />
              <span style={stateNoteStyle}>On</span>
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
            <div>
              <Slider value={slider3} onValueChange={setSlider3} min={0} max={100} />
              <div style={stateNoteStyle}>{slider3[0]}%</div>
            </div>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// 06 · Feedback
// ───────────────────────────────────────────

function InlineToast({
  variant,
  title,
  desc,
}: {
  variant: 'default' | 'success' | 'warning' | 'danger'
  title: string
  desc: string
}) {
  const colors: Record<typeof variant, { bg: string; ink: string }> = {
    default: { bg: 'var(--surface)', ink: 'var(--ink)' },
    success: { bg: 'color-mix(in oklab, var(--success) 15%, var(--surface))', ink: 'var(--ink)' },
    warning: { bg: 'color-mix(in oklab, var(--warning) 18%, var(--surface))', ink: 'var(--ink)' },
    danger: { bg: 'color-mix(in oklab, var(--danger) 15%, var(--surface))', ink: 'var(--ink)' },
  }
  return (
    <div
      style={{
        border: '2px solid var(--border-memphis)',
        boxShadow: 'var(--shadow-memphis-sm)',
        background: colors[variant].bg,
        color: colors[variant].ink,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{desc}</div>
    </div>
  )
}

function FeedbackSection() {
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="06"
        title="Feedback"
        desc="Tooltip, toast, progress, spinner, badge. Segnali chiari, micro-interazioni Memphis."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Tooltip">
          <TooltipProvider delayDuration={100}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Tooltip open>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Tooltip Memphis</TooltipContent>
              </Tooltip>
              <span style={stateNoteStyle}>Always open (showcase)</span>
            </div>
          </TooltipProvider>
        </SubPanel>

        <SubPanel label="Toast">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InlineToast variant="success" title="Partita salvata" desc="La riprenderai dopo." />
            <InlineToast
              variant="warning"
              title="Connessione debole"
              desc="Alcune mosse potrebbero ritardare."
            />
            <InlineToast variant="danger" title="Tempo scaduto" desc="Turno perso." />
          </div>
        </SubPanel>

        <SubPanel label="Progress · Spinner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 4 }}>
                60%
              </div>
              <Progress value={60} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Spinner size={16} />
              <Spinner size={24} />
              <Spinner size={32} />
              <span style={stateNoteStyle}>16 · 24 · 32</span>
            </div>
          </div>
        </SubPanel>

        <SubPanel label="Badges · Chips">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Badge>12</Badge>
              <Badge variant="featured">HOT</Badge>
              <span style={stateNoteStyle}>Badge</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip>Default</Chip>
              <Chip variant="accent">Accent</Chip>
              <Chip variant="brand">Brand</Chip>
              <Chip variant="success">Win</Chip>
              <Chip variant="danger">Loss</Chip>
              <Chip variant="warning">Draw</Chip>
            </div>
          </div>
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// 07 · Navigation
// ───────────────────────────────────────────

function NavigationSection() {
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="07"
        title="Navigation"
        desc="Tabs, dropdown, context menu, breadcrumbs, pagination, nav items laterali."
      />
      <div style={sectionFrameStyle}>
        <SubPanel label="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Dettagli</TabsTrigger>
              <TabsTrigger value="history">Storia</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">Partita in corso, 34 mosse.</TabsContent>
            <TabsContent value="details">ELO medio 1820.</TabsContent>
            <TabsContent value="history">Ultime 5 partite: 3W · 1D · 1L.</TabsContent>
          </Tabs>
        </SubPanel>

        <SubPanel label="Dropdown + Context">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Azioni ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profilo</DropdownMenuItem>
                <DropdownMenuItem>Impostazioni</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Esci</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  style={{
                    padding: '8px 12px',
                    border: '2px dashed var(--border-strong)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--ink-muted)',
                    userSelect: 'none',
                  }}
                >
                  Right-click zone
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuLabel>Azioni</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem>Copia</ContextMenuItem>
                <ContextMenuItem>Incolla</ContextMenuItem>
                <ContextMenuItem>Elimina</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </SubPanel>

        <SubPanel label="Breadcrumbs + Pagination">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Breadcrumbs>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Partite</BreadcrumbItem>
              <BreadcrumbItem current>#1842</BreadcrumbItem>
            </Breadcrumbs>
            <Pagination currentPage={2} totalPages={8} onPageChange={() => {}} />
          </div>
        </SubPanel>

        <SubPanel label="Nav Items">
          <nav
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: 8,
            }}
          >
            <NavItem href="#" icon={<HomeIcon size={18} />} active>
              Home
            </NavItem>
            <NavItem href="#" icon={<SearchIcon size={18} />}>
              Cerca
            </NavItem>
            <NavItem href="#" icon={<TrophyIcon size={18} />} endAdornment={<Badge>12</Badge>}>
              Classifica
            </NavItem>
            <NavItem href="#" icon={<CogIcon size={18} />}>
              Impostazioni
            </NavItem>
          </nav>
        </SubPanel>
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// Variant showcase (leverages existing Card)
// ───────────────────────────────────────────

function CardVariantsPreview() {
  const variants = ['default', 'elevated', 'featured', 'interactive', 'dark'] as const
  return (
    <section style={sectionStyle}>
      <SectionHeader
        num="04b"
        title="Card Variants"
        desc="I 5 variants standard di Card. Usati come fondamenta per i pattern di dominio."
      />
      <div
        style={{
          ...sectionFrameStyle,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        {variants.map((v) => (
          <Card
            key={v}
            variant={v}
            tabIndex={v === 'interactive' ? 0 : undefined}
            style={{ minHeight: 160 }}
          >
            <CardHeader>
              <CardTitle style={{ color: v === 'dark' ? 'var(--paper-50)' : undefined }}>
                {v}
              </CardTitle>
              <CardDescription style={{ color: v === 'dark' ? 'var(--paper-100)' : undefined }}>
                variant={v}
              </CardDescription>
            </CardHeader>
            <CardBody style={{ fontSize: 13 }}>Card di base in variant {v}.</CardBody>
            <CardFooter>
              <Button variant="ghost" size="sm">
                Azione
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ───────────────────────────────────────────
// Page
// ───────────────────────────────────────────

export default function DesignSystemPage() {
  return (
    <main style={pageStyle}>
      <header style={heroStyle}>
        <div style={heroEyebrowStyle}>Damacchi · UI · v1</div>
        <h1 style={heroTitleStyle}>DAMACCHI — Design System v1</h1>
        <p style={heroLeadStyle}>
          Vista unificata: tokens, typography, buttons, cards, inputs, feedback, navigation. Ogni
          sezione riprende i pattern del design system originale — frame esterno Memphis, sub-panel
          tratteggiati, label eyebrow mono.
        </p>
        <div style={heroMetaStyle}>
          <span>
            <b style={{ color: 'var(--ink)', fontWeight: 700 }}>7</b> sezioni
          </span>
          <span>
            <b style={{ color: 'var(--ink)', fontWeight: 700 }}>40+</b> componenti
          </span>
          <span>
            <b style={{ color: 'var(--ink)', fontWeight: 700 }}>Memphis</b> hard
          </span>
        </div>
      </header>

      <ColorsSection />
      <TypographySection />
      <ButtonsSection />
      <CardsSection />
      <CardVariantsPreview />
      <InputsSection />
      <FeedbackSection />
      <NavigationSection />
    </main>
  )
}
