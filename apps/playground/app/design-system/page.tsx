'use client'

/**
 * /design-system — Damacchi DS v1 on lib primitives only.
 *
 * All 11 sections consume @simoneschioppo/damo-ui components (ColorScale, TokenSwatch,
 * ShowcaseCard, SubPanel, SectionHeader, TypeSpecimen, UserCard, FeatureCard,
 * TooltipCard, ArticleCard, Badge, Chip, Medal, PatternSwatch, MemphisShape, Hint,
 * plus inputs + icons). Only hero / TOC / layout / section scroll-margin /
 * footer use inline style — every styled surface is a lib component.
 *
 * Layout: 2-column grid
 *   - Left sidebar (240px, plum-900 bg, ivory text): brand block + numbered TOC
 *   - Right main (ivory bg): hero + 11 numbered sections
 */

import { type CSSProperties, type ReactNode, useState } from 'react'
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
  ColorScale,
  TokenSwatch,
  ShowcaseCard,
  SectionHeader,
  SubPanel,
  TypeSpecimen,
  UserCard,
  FeatureCard,
  TooltipCard,
  ArticleCard,
  Badge,
  Chip,
  Medal,
  PatternSwatch,
  MemphisShape,
  Hint,
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
} from '@simoneschioppo/damo-ui'

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
// Layout-only inline styles (hero / TOC / main / footer).
// All styled surfaces inside sections use lib components now; these
// remaining styles only cover page chrome + section scroll anchor.
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

// Inline-styled mono eyebrow used inside ShowcaseCards as a secondary sub-heading
// (e.g. "BADGE · rank / medal" inside "BADGE · status" showcase card).
const subEyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--ink-muted)',
  fontWeight: 700,
  marginBottom: 16,
  display: 'block',
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

function ColorsSection() {
  return (
    <section id="colors" style={sectionStyle}>
      <SectionHeader
        num="01"
        title="Colori"
        desc="3 scale brand (Plum, Gold, Paper) in bande orizzontali + 8 token semantici. Plum per l'ink, Gold per l'accento, Paper per gli sfondi caldi."
      />
      <ShowcaseCard>
        <ColorScale
          name={PLUM_SCALE.name}
          token={PLUM_SCALE.token}
          desc={PLUM_SCALE.desc}
          stops={PLUM_SCALE.stops}
        />
        <ColorScale
          name={GOLD_SCALE.name}
          token={GOLD_SCALE.token}
          desc={GOLD_SCALE.desc}
          stops={GOLD_SCALE.stops}
        />
        <ColorScale
          name={PAPER_SCALE.name}
          token={PAPER_SCALE.token}
          desc={PAPER_SCALE.desc}
          stops={PAPER_SCALE.stops}
        />

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
            <TokenSwatch key={b.token} name={b.name} cssVar={b.cssVar} usage={b.usage} />
          ))}
        </div>
      </ShowcaseCard>
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
        <TypeSpecimen
          name="DISPLAY · AUDIOWIDE · GOOGLE FONTS"
          sample="Damacchi"
          fontFamily="var(--font-display)"
          sampleSize={72}
        />
        <TypeSpecimen
          name="BODY · EXO 2 · GOOGLE FONTS"
          sample="Cavallo, ma a spazzare."
          fontFamily="var(--font-body)"
          sampleSize={42}
        />
      </div>

      {/* Scale ladder — single card with 3-col rows */}
      <ShowcaseCard label="SCALA TIPOGRAFICA · 10 stili">
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
      </ShowcaseCard>
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
  // State simulations use className arbitrary-value shorthands (Tailwind v4)
  // so we don't need inline style / boxShadow props.
  const primaryStates: ReadonlyArray<ButtonStateCell> = [
    { label: 'Default', node: <Button variant="primary">GIOCA</Button> },
    {
      label: 'Hover',
      node: (
        <Button
          variant="primary"
          className="translate-x-[-1px] translate-y-[-1px] shadow-[7px_7px_0_var(--black)] bg-[var(--gold-400)]"
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
          className="translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_var(--black)]"
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
          className="outline outline-2 outline-offset-2 outline-[var(--ring)]"
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
          className="translate-x-[-1px] translate-y-[-1px] shadow-[7px_7px_0_var(--gold-500)] bg-[var(--surface-2)]"
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
          className="translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_var(--gold-500)]"
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
          className="outline outline-2 outline-offset-2 outline-[var(--ring)]"
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
      <ShowcaseCard>
        <SubPanel label="PRIMARY · GOLD BACKGROUND">
          <ButtonStateRow cells={primaryStates} />
        </SubPanel>

        <div style={{ height: 24 }} />

        <SubPanel label="GHOST · OUTLINE NEUTRO">
          <ButtonStateRow cells={ghostStates} />
        </SubPanel>

        <div style={{ height: 24 }} />

        <SubPanel label="SIZES">
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
        </SubPanel>
      </ShowcaseCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 04 · Cards — domain patterns (Player / Mode / Info / Content)
// ═══════════════════════════════════════════════════════════

function CardsSection() {
  return (
    <section id="cards" style={sectionStyle}>
      <SectionHeader
        num="04"
        title="Cards"
        desc="4 varianti principali. Tutte condividono bordo 2px + shadow Memphis, cambia solo accento e layout."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        <ShowcaseCard label="USER CARD">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserCard
              name="Marini · Bianco"
              meta={<>ELO 1842 · RAPID</>}
              trailing={
                <span
                  className="font-mono font-bold text-ink border-2 border-gold-500 bg-paper-50"
                  style={{
                    display: 'inline-block',
                    padding: '8px 14px',
                    fontSize: 14,
                    boxShadow: '2px 2px 0 var(--gold-500)',
                  }}
                >
                  05:42
                </span>
              }
            />
          </div>
        </ShowcaseCard>
        <ShowcaseCard label="FEATURE CARD">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FeatureCard
              title="CLASSICO"
              desc="Scacchi ortodossi, pezzi mangiati tornano come pedine"
              meta="10+5 MIN"
              icon={<ArrowRightIcon size={18} style={{ color: 'var(--accent)' }} />}
            />
          </div>
        </ShowcaseCard>
        <ShowcaseCard label="TOOLTIP CARD · tooltip/popover">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 16,
            }}
          >
            <div style={{ width: 200 }}>
              <TooltipCard label="Mosse rimanenti" title="23" body="" />
            </div>
          </div>
        </ShowcaseCard>
        <ShowcaseCard label="ARTICLE CARD · neutra">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ArticleCard label="REGOLA" title="Mangia come scacchi, muovi come dama">
              Il pezzo cattura con le regole degli scacchi. Ma se arriva in fondo, promuove come
              nella dama italiana.
            </ArticleCard>
          </div>
        </ShowcaseCard>
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
        <ShowcaseCard label="TEXT FIELD · stati">
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
              <Input
                id="nick-focus"
                defaultValue="MarinaChess"
                className="border-[var(--gold-500)] shadow-[3px_3px_0_var(--gold-500)] outline-none"
              />
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
                className="bg-[var(--paper-200)]"
              />
              <span style={inputStateCaptionStyle}>Disabled</span>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard label="SELECT">
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
              <span style={subEyebrowStyle}>SEGMENTED</span>
              <SegmentedControl defaultValue="blitz" aria-label="Tempo">
                <SegmentedControlItem value="bullet">BULLET</SegmentedControlItem>
                <SegmentedControlItem value="blitz">BLITZ</SegmentedControlItem>
                <SegmentedControlItem value="rapid">RAPID</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard label="TOGGLE">
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
        </ShowcaseCard>

        <ShowcaseCard label="SLIDER">
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
        </ShowcaseCard>
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
        desc="Status, rank, tag. Sempre maiuscoli, mono, tracking 0.08em."
      />
      <ShowcaseCard label="BADGE & CHIP">
        <SubPanel label="BADGE · status">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge>DEFAULT</Badge>
            <Badge variant="copper">NUOVO</Badge>
            <Badge variant="navy">BETA</Badge>
            <Badge variant="win">VITTORIA</Badge>
            <Badge variant="loss">SCONFITTA</Badge>
            <Badge variant="draw">PAREGGIO</Badge>
            <Badge variant="outline">OUTLINE</Badge>
          </div>
        </SubPanel>

        <div style={{ height: 16 }} />

        <SubPanel label="BADGE · rank / medal">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="rank">♛ GRAN MAESTRO</Badge>
            <Badge variant="copper">★ TOP 100</Badge>
            <Badge variant="navy">ELO 2100+</Badge>
            <Badge variant="win">ON FIRE · 7W</Badge>
          </div>
        </SubPanel>

        <div style={{ height: 16 }} />

        <SubPanel label="CHIP · tag filtrabili">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip dotColor="var(--gold-500)">Blitz</Chip>
            <Chip active dotColor="#fff">
              Rapid
            </Chip>
            <Chip dotColor="var(--plum-500)">Classico</Chip>
            <Chip dotColor="var(--success)">Damacchi</Chip>
            <Chip dotColor="var(--danger)">Torneo</Chip>
          </div>
        </SubPanel>
      </ShowcaseCard>
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
        desc="24×24 viewport, stroke solido, path singolo. 30 icone dal set damo-ui."
      />
      <span style={iconNoteStyle}>
        {`${ICONS_GRID.length} icone SVG stroke-based, viewBox 24×24, stroke-width 1.75`}
      </span>
      <ShowcaseCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {ICONS_GRID.map(({ Cmp, name }) => (
            <div
              key={name}
              style={{
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderRight: '1.5px solid color-mix(in oklab, var(--ink) 12%, transparent)',
                borderBottom: '1.5px solid color-mix(in oklab, var(--ink) 12%, transparent)',
              }}
            >
              <Cmp size={28} />
              <span style={iconTileLabelStyle}>{name}</span>
            </div>
          ))}
        </div>
      </ShowcaseCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 08 · Avatars & medals — avatars in 4 sizes × 4 colors, plus octagonal medals.
// ═══════════════════════════════════════════════════════════

type MedalEntry = {
  readonly rank: 'bronze' | 'silver' | 'gold' | 'master' | 'grandmaster'
  readonly label: string
  readonly rankNumber?: number
}

const MEDALS: ReadonlyArray<MedalEntry> = [
  { rank: 'bronze', label: 'BRONZO', rankNumber: 1 },
  { rank: 'silver', label: 'ARGENTO', rankNumber: 2 },
  { rank: 'gold', label: 'ORO', rankNumber: 3 },
  { rank: 'master', label: 'MAESTRO' },
  { rank: 'grandmaster', label: 'GRAN MAESTRO' },
]

function AvatarsSection() {
  return (
    <section id="avatars" style={sectionStyle}>
      <SectionHeader
        num="08"
        title="Avatar & medaglie"
        desc="Avatar in 4 taglie × 4 colori. Medaglie per ranking e achievement, forma ottagonale con bordo nero."
      />
      <ShowcaseCard label="AVATAR · square & round">
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

        <div style={{ ...subEyebrowStyle, marginTop: 32 }}>AVATAR GROUP</div>
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

        <div style={{ ...subEyebrowStyle, marginTop: 32 }}>MEDAGLIE · rank</div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {MEDALS.map((m) => (
            <Medal key={m.label} rank={m.rank} label={m.label} rankNumber={m.rankNumber} size={64} />
          ))}
        </div>
      </ShowcaseCard>
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
      <ShowcaseCard>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          <SubPanel label="PLACEHOLDER">
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
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
                margin: '8px 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              <li>Hero · onboarding · empty state</li>
            </ul>
          </SubPanel>
        </div>
      </ShowcaseCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 10 · Pattern Memphis (data-app-pattern + decorazioni)
// ═══════════════════════════════════════════════════════════

function PatternsSection() {
  return (
    <section id="patterns" style={sectionStyle}>
      <SectionHeader
        num="10"
        title="Pattern Memphis"
        desc="Texture e forme che riempono gli spazi vuoti. Mai tutti assieme — uno per volta, con misura."
      />
      <ShowcaseCard label="PATTERN · tileable backgrounds">
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
          {/* TODO(lib): PatternSwatch does not expose backgroundPosition — CHECKER/WEAVE will render without the half-step offset. */}
          <PatternSwatch
            name="CHECKER"
            background="linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%), linear-gradient(45deg, var(--paper-200) 25%, transparent 25%, transparent 75%, var(--paper-200) 75%)"
            backgroundColor="#fff"
            backgroundSize="20px 20px"
          />
          <PatternSwatch
            name="WEAVE"
            background="linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%), linear-gradient(45deg, var(--gold-500) 25%, transparent 25%, transparent 75%, var(--gold-500) 75%)"
            backgroundSize="24px 24px"
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
      </ShowcaseCard>

      <div style={{ height: 24 }} />

      <ShowcaseCard label="SHAPE PRIMITIVES">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <MemphisShape variant="diamond" size={64} color="var(--gold-500)" />
          <MemphisShape variant="circle" size={64} color="var(--plum-500)" />
          <MemphisShape variant="triangle" size={64} color="var(--plum-900)" />
          {/* TODO(lib): no "stripes" / "nested-squares" MemphisShape variant — keep inline. */}
          <div
            aria-hidden
            style={{
              width: 64,
              height: 64,
              background:
                'repeating-linear-gradient(45deg, var(--ink) 0 3px, transparent 3px 8px)',
            }}
          />
          <MemphisShape variant="blob" size={64} color="var(--success)" />
          <MemphisShape variant="wave" size={64} color="#000" />
          <MemphisShape variant="star" size={64} color="var(--gold-500)" />
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
      </ShowcaseCard>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// 11 · Export → Figma (hint)
// ═══════════════════════════════════════════════════════════

const hintCodeStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  background: 'var(--surface)',
  color: 'var(--ink)',
  border: '1px solid var(--border-memphis)',
  padding: '1px 6px',
  fontSize: 12,
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
