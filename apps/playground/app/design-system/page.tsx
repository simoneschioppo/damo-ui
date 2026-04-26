'use client'

/**
 * /design-system — Damo UI DS v1 on lib primitives only.
 *
 * All 11 sections consume @damo/ui components (ColorScale, TokenSwatch,
 * ShowcaseCard, SubPanel, SectionHeader, TypeSpecimen, UserCard, FeatureCard,
 * TooltipCard, ArticleCard, Badge, Chip, Medal, PatternSwatch, MemphisShape, Hint,
 * plus inputs + icons). Only hero / TOC / layout / section scroll-margin /
 * footer use inline style — every styled surface is a lib component.
 *
 * Layout: 2-column grid
 *   - Left sidebar (300px, surface-2 bg, ink text): lib `Sidebar` with brand block + numbered TOC
 *   - Right main (ivory bg): hero + 11 numbered sections
 */

import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { computeActiveSection } from './active-section'
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
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarHeader,
  SidebarSubtitle,
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
} from '@damo/ui'
import { PATTERNS } from './patterns'

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
  gridTemplateColumns: '300px 1fr',
  minHeight: '100vh',
  background: 'var(--background)',
  color: 'var(--foreground)',
}

const tocListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const tocLinkStyle: CSSProperties = {
  color: 'var(--muted-foreground)',
  textDecoration: 'none',
  padding: '8px 12px',
  fontSize: 13,
  letterSpacing: '0.02em',
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderLeftColor: 'transparent',
  display: 'block',
  transition: 'all .15s',
}

const tocLinkActiveStyle: CSSProperties = {
  color: 'var(--foreground)',
  borderLeftColor: 'var(--primary)',
  background: 'color-mix(in oklab, var(--foreground) 6%, transparent)',
}

const tocNumStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--primary)',
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
  borderBottom: '2px solid var(--foreground)',
}

const heroAccentStyle: CSSProperties = {
  position: 'absolute',
  bottom: -2,
  left: 0,
  width: 120,
  height: 2,
  background: 'var(--primary)',
}

const heroEyebrowStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.28em',
  color: 'var(--primary)',
  textTransform: 'uppercase',
  marginBottom: 16,
  fontWeight: 700,
}

const heroTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 72,
  lineHeight: 0.95,
  margin: '0 0 20px',
  color: 'var(--foreground)',
  letterSpacing: '-0.01em',
}

const heroLeadStyle: CSSProperties = {
  fontSize: 18,
  color: 'var(--muted-foreground)',
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
  color: 'var(--muted-foreground)',
  flexWrap: 'wrap',
}

const heroMetaBoldStyle: CSSProperties = {
  color: 'var(--foreground)',
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
  color: 'var(--muted-foreground)',
  fontWeight: 700,
  marginBottom: 16,
  display: 'block',
}

// ═══════════════════════════════════════════════════════════
// Shared primitives
// ═══════════════════════════════════════════════════════════

function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        setActiveId((prev) => computeActiveSection(SECTIONS, prev, Array.from(visible)))
      },
      {
        // Activate a section when its top crosses ~15% from the viewport top
        // (below the header) and keep it active until it scrolls past ~40% up.
        rootMargin: '-15% 0px -55% 0px',
        threshold: 0,
      },
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return activeId
}

function Toc({ activeId }: { activeId: string }) {
  return (
    <Sidebar aria-label="Design system navigation">
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>DESIGN SYSTEM</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>
        <nav aria-label="Page sections" style={tocListStyle}>
          {SECTIONS.map((s) => {
            const isActive = s.id === activeId
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={isActive ? 'true' : undefined}
                data-active={isActive ? 'true' : undefined}
                style={{ ...tocLinkStyle, ...(isActive ? tocLinkActiveStyle : {}) }}
              >
                <span style={tocNumStyle}>{s.num}</span>
                {s.title}
              </a>
            )
          })}
        </nav>
      </SidebarBody>
    </Sidebar>
  )
}

// ═══════════════════════════════════════════════════════════
// 01 · Colors — horizontal color bands (faithful to original)
// ═══════════════════════════════════════════════════════════
// Ogni scala è una banda orizzontale piena: left col (nome + token + desc),
// right col grid di stops con background colore + nome/hex inline.
//
// Colors are rendered via CSS variables (`var(--ink-500)` etc.) so the
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
  name: 'Ink',
  token: 'ink',
  desc: 'Primario scuro — foreground, testo, sfondi notturni',
  stops: [{ k: 900 }, { k: 800 }, { k: 700 }, { k: 500 }, { k: 300 }, { k: 100 }],
}

const GOLD_SCALE: ColorScaleDef = {
  name: 'Brand',
  token: 'brand',
  desc: 'Accent brand — bottoni, bordi, highlight',
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
  { token: '--background', name: 'Background', cssVar: '--background', usage: "Sfondo principale dell'app" },
  {
    token: '--card',
    name: 'Card',
    cssVar: '--card',
    usage: 'Card, modali, superfici elevate',
  },
  {
    token: '--muted',
    name: 'Muted',
    cssVar: '--muted',
    usage: 'Superficie secondaria, hover',
  },
  { token: '--foreground', name: 'Foreground', cssVar: '--foreground', usage: 'Testo primario, bordi' },
  { token: '--muted-foreground', name: 'Muted Foreground', cssVar: '--muted-foreground', usage: 'Testo secondario e hint' },
  {
    token: '--memphis-border-color',
    name: 'Memphis Border',
    cssVar: '--memphis-border-color',
    usage: 'Bordo 2px Memphis nero',
  },
  { token: '--primary', name: 'Primary', cssVar: '--primary', usage: 'Gold 500 — brand highlight' },
  { token: '--secondary', name: 'Secondary', cssVar: '--secondary', usage: 'Plum 500 — brand secondario' },
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
          <h3 className="display" style={{ fontSize: 24, margin: 0, color: 'var(--foreground)' }}>
            Semantici
          </h3>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 13, fontStyle: 'italic' }}>
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
    color: 'var(--foreground)',
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
          sample="Damo UI"
          fontFamily="var(--font-display)"
          sampleSize={72}
        />
        <TypeSpecimen
          name="BODY · EXO 2 · GOOGLE FONTS"
          sample="Ogni token al suo posto."
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
                idx === 0 ? 'none' : '1.5px solid color-mix(in oklab, var(--foreground) 12%, transparent)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                fontWeight: 700,
              }}
            >
              {t.name}
            </div>
            <div style={typeSpecStyle(t)}>
              {t.upper ? 'DAMO · UI · DESIGN' : 'Damo UI · token e componenti'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--primary)',
                textAlign: 'right',
                fontWeight: 700,
              }}
            >
              {t.size}px / {t.weight}
              <br />
              <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>--font-{t.font}</span>
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
  color: 'var(--muted-foreground)',
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
    { label: 'Default', node: <Button variant="primary">SALVA</Button> },
    {
      label: 'Hover',
      node: (
        <Button
          variant="primary"
          className="translate-x-[-1px] translate-y-[-1px] shadow-[7px_7px_0_var(--black)] bg-[var(--brand-400)]"
        >
          SALVA
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
          SALVA
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
          SALVA
        </Button>
      ),
    },
    {
      label: 'Disabled',
      node: (
        <Button variant="primary" disabled>
          SALVA
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
          className="translate-x-[-1px] translate-y-[-1px] shadow-[7px_7px_0_var(--primary)] bg-[var(--muted)]"
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
          className="translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_var(--primary)]"
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
              name="Mario Rossi"
              meta={<>Designer · Team Lead</>}
              trailing={
                <span
                  className="font-mono font-bold text-foreground border-2 border-primary bg-background"
                  style={{
                    display: 'inline-block',
                    padding: '8px 14px',
                    fontSize: 14,
                    boxShadow: '2px 2px 0 var(--primary)',
                  }}
                >
                  PRO
                </span>
              }
            />
          </div>
        </ShowcaseCard>
        <ShowcaseCard label="FEATURE CARD">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FeatureCard
              title="TIPOGRAFIA"
              desc="Due famiglie, dieci scale — dal caption al display XL."
              meta="10 STILI"
              icon={<ArrowRightIcon size={18} style={{ color: 'var(--primary)' }} />}
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
              <TooltipCard label="Componenti totali" title="47" body="" />
            </div>
          </div>
        </ShowcaseCard>
        <ShowcaseCard label="ARTICLE CARD · neutra">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ArticleCard label="GUIDA" title="Un import, un componente">
              Ogni componente è importabile con una riga da <code>@damo/ui</code>. Tutti i token
              sono CSS variables, quindi il tema cambia live senza rebuild.
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
  color: 'var(--foreground)',
}

const inputStateCaptionStyle: CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: 'var(--muted-foreground)',
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
                defaultValue="MarioRossi"
                className="border-[var(--primary)] shadow-[3px_3px_0_var(--primary)] outline-none"
              />
              <span style={inputStateCaptionStyle}>Focus</span>
            </div>
            <div>
              <label htmlFor="email-disabled" style={inputLabelStyle}>
                Email
              </label>
              <Input
                id="email-disabled"
                defaultValue="mario@damo.design"
                disabled
                readOnly
                className="bg-[var(--muted)]"
              />
              <span style={inputStateCaptionStyle}>Disabled</span>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard label="SELECT">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={inputLabelStyle}>Tema</label>
              <Select defaultValue="light">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <span style={subEyebrowStyle}>SEGMENTED</span>
              <SegmentedControl defaultValue="md" aria-label="Size">
                <SegmentedControlItem value="sm">SMALL</SegmentedControlItem>
                <SegmentedControlItem value="md">MEDIUM</SegmentedControlItem>
                <SegmentedControlItem value="lg">LARGE</SegmentedControlItem>
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
                    color: 'var(--muted-foreground)',
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
            <Badge variant="win">SUCCESSO</Badge>
            <Badge variant="loss">ERRORE</Badge>
            <Badge variant="draw">AVVISO</Badge>
            <Badge variant="outline">OUTLINE</Badge>
          </div>
        </SubPanel>

        <div style={{ height: 16 }} />

        <SubPanel label="BADGE · rank / medal">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="rank">♛ PREMIUM</Badge>
            <Badge variant="copper">★ TOP PICK</Badge>
            <Badge variant="navy">PRO</Badge>
            <Badge variant="win">LIVE · 7D</Badge>
          </div>
        </SubPanel>

        <div style={{ height: 16 }} />

        <SubPanel label="CHIP · tag filtrabili">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip dotColor="var(--primary)">Button</Chip>
            <Chip active dotColor="#fff">
              Card
            </Chip>
            <Chip dotColor="var(--secondary)">Dialog</Chip>
            <Chip dotColor="var(--success)">Input</Chip>
            <Chip dotColor="var(--destructive)">Table</Chip>
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
  color: 'var(--muted-foreground)',
  marginBottom: 16,
  letterSpacing: '0.04em',
}

const iconTileLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--muted-foreground)',
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
                borderRight: '1.5px solid color-mix(in oklab, var(--foreground) 12%, transparent)',
                borderBottom: '1.5px solid color-mix(in oklab, var(--foreground) 12%, transparent)',
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
  readonly value?: ReactNode
}

const MEDALS: ReadonlyArray<MedalEntry> = [
  { rank: 'bronze', label: 'BRONZO', value: 1 },
  { rank: 'silver', label: 'ARGENTO', value: 2 },
  { rank: 'gold', label: 'ORO', value: 3 },
  { rank: 'master', label: 'MAESTRO', value: 'M' },
  { rank: 'grandmaster', label: 'LEGGENDA', value: 'GM' },
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
            <Medal key={m.label} rank={m.rank} label={m.label} value={m.value} size={64} />
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
              {/* Glifo provvisorio: figura coronata che rappresenta la mascotte */}
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
                  fill="var(--primary)"
                  stroke="var(--memphis-border-color)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* head/body */}
                <circle
                  cx="80"
                  cy="90"
                  r="32"
                  fill="var(--secondary)"
                  stroke="var(--memphis-border-color)"
                  strokeWidth="2"
                />
                {/* eyes */}
                <circle cx="70" cy="85" r="3" fill="var(--background)" />
                <circle cx="90" cy="85" r="3" fill="var(--background)" />
                {/* body base */}
                <path
                  d="M50 135 L110 135 L120 170 L40 170 Z"
                  fill="var(--secondary-foreground)"
                  stroke="var(--memphis-border-color)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </SubPanel>

          <SubPanel label="USAGE">
            <p style={{ color: 'var(--muted-foreground)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              Damo è la mascotte della libreria. Asset SVG/PNG arriveranno in v0.2 — per ora usiamo
              un glifo provvisorio.
            </p>
            <h4
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 20,
                marginBottom: 0,
                color: 'var(--muted-foreground)',
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
                color: 'var(--muted-foreground)',
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
                color: 'var(--muted-foreground)',
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
                color: 'var(--muted-foreground)',
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
          {PATTERNS.map((p) => (
            <PatternSwatch
              key={p.name}
              name={p.name}
              background={p.background}
              backgroundSize={p.backgroundSize}
              backgroundColor={p.backgroundColor}
            >
              {p.children}
            </PatternSwatch>
          ))}
        </div>
      </ShowcaseCard>

      <div style={{ height: 24 }} />

      <ShowcaseCard label="SHAPE PRIMITIVES">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <MemphisShape variant="diamond" size={64} color="var(--primary)" />
          <MemphisShape variant="circle" size={64} color="var(--secondary)" />
          <MemphisShape variant="triangle" size={64} color="var(--foreground)" />
          {/* TODO(lib): no "stripes" / "nested-squares" MemphisShape variant — keep inline. */}
          <div
            aria-hidden
            style={{
              width: 64,
              height: 64,
              background: 'repeating-linear-gradient(45deg, var(--foreground) 0 3px, transparent 3px 8px)',
            }}
          />
          <MemphisShape variant="blob" size={64} color="var(--success)" />
          <MemphisShape variant="wave" size={64} color="#000" />
          <MemphisShape variant="star" size={64} color="var(--primary)" />
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
            <rect
              x="10"
              y="10"
              width="44"
              height="44"
              fill="var(--foreground)"
              stroke="#000"
              strokeWidth="3"
            />
            <rect x="18" y="18" width="14" height="14" fill="var(--primary)" />
            <rect x="32" y="32" width="14" height="14" fill="var(--primary)" />
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
  background: 'var(--card)',
  color: 'var(--foreground)',
  border: '1px solid var(--memphis-border-color)',
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
        stroke="var(--foreground)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* brand circle */}
      <circle
        cx="200"
        cy="30"
        r="18"
        fill="var(--primary)"
        stroke="var(--foreground)"
        strokeWidth="2"
      />
      {/* violet diamond */}
      <path
        d="M60 90 L90 60 L120 90 L90 120 Z"
        fill="var(--secondary)"
        stroke="var(--foreground)"
        strokeWidth="2"
      />
      {/* ink triangle */}
      <path d="M170 110 L200 70 L230 110 Z" fill="var(--foreground)" />
      {/* x mark */}
      <path
        d="M240 50 L255 65 M255 50 L240 65"
        stroke="var(--primary)"
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
  const activeId = useActiveSection()
  return (
    <div style={pageStyle}>
      <Toc activeId={activeId} />
      <main style={mainStyle}>
        <header style={heroStyle}>
          <HeroDecor />
          <div style={heroEyebrowStyle}>DAMO · UI · DESIGN SYSTEM</div>
          <h1 style={heroTitleStyle}>
            Token, componenti,
            <br />
            un sistema solo.
          </h1>
          <p style={heroLeadStyle}>
            Linguaggio visivo completo per React e Next.js: token, componenti, icone e pattern
            Memphis. Pensato per essere importato in Figma in 3 modi diversi — vedi sezione 11.
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
              <b style={heroMetaBoldStyle}>{PATTERNS.length}</b> pattern
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
            borderTop: '2px solid var(--foreground)',
            marginTop: 80,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <span>DAMO · UI · DESIGN SYSTEM</span>
          <span>
            MADE WITH <span style={{ color: 'var(--destructive)' }}>♥</span> BY DAMO
          </span>
        </footer>
      </main>
    </div>
  )
}
