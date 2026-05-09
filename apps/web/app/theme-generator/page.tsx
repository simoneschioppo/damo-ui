'use client'

/**
 * /theme-generator — three-layer token editor.
 *
 * See docs/specs/2026-04-24-theme-architecture-refactor-design.md §8.
 *
 * Left sidebar has three tabs: Palette (raw palette steps) / Theme (semantic
 * bg+fg pairs with WCAG contrast badges, light/dark edit mode) / Identity
 * (medals, charts, nav-on-dark, typography, radius, shadows, spacing, motion).
 *
 * Right main pane has two tabs: Preview (scene selector + preview-mode toggle)
 * / Export (CSS | Tailwind | JSON sub-tabs).
 */

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  ColorPicker,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarSubtitle,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@damo/ui'
import { BRAND } from '../../lib/brand'
import {
  AuthPreview,
  ComponentsPreview,
  DashboardPreview,
  FeedPreview,
  GalleryPreview,
  ProfilePreview,
} from '@damo/ui/mocks'

import { useThemeState } from './use-theme-state'
import { SampleDialog } from './sample-dialog'
import { TokenPreviewChip } from './token-preview-chip'
import {
  PALETTE_STEPS,
  SEMANTIC_GROUPS,
  type IdentityTheme,
  type MotionDurationKey,
  type RadiusKey,
  type RawPalette,
  type SemanticTheme,
  type ShadowMemphisKey,
  type Theme,
  type ThemeMode,
  type TypographySizeKey,
} from './theme-state'
import { contrastLevel, contrastRatio } from './contrast'
import { type PresetName, PRESET_NAMES } from './presets'
import {
  buildCssExport,
  buildJsonExport,
  buildTailwindExport,
  type IncludeFlags,
} from './exporters'

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

type ThemeDispatch = ReturnType<typeof useThemeState>['dispatch']

type SceneTab = 'components' | 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
type ExportTab = 'css' | 'tailwind' | 'json'
type EditorTab = 'palette' | 'theme' | 'identity'
type EditMode = ThemeMode

type IncludeKey = keyof IncludeFlags

// ═══════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'selection', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = [
  'sm',
  'card',
  'md',
  'lg',
  'hover',
  'active',
]
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_CHOICES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'cubic-bezier(0.4, 1.3, 0.5, 1)', label: 'memphis (default)' },
  { value: 'cubic-bezier(0.2, 0.9, 0.3, 1)', label: 'out' },
  { value: 'linear', label: 'linear' },
  { value: 'ease', label: 'ease' },
  { value: 'ease-in', label: 'ease-in' },
  { value: 'ease-out', label: 'ease-out' },
]

type IncludeOption = { key: IncludeKey; labelKey: string }

const INCLUDE_OPTIONS: Record<'css' | 'tailwind', ReadonlyArray<IncludeOption>> = {
  css: [
    { key: 'rawPalette', labelKey: 'rawPalette' },
    { key: 'semanticLight', labelKey: 'semanticLight' },
    { key: 'semanticDark', labelKey: 'semanticDark' },
    { key: 'identity', labelKey: 'identity' },
    { key: 'foundations', labelKey: 'foundations' },
  ],
  tailwind: [
    { key: 'semanticLight', labelKey: 'tailwindSemantic' },
    { key: 'identity', labelKey: 'tailwindIdentity' },
    { key: 'foundations', labelKey: 'tailwindFoundations' },
  ],
}

const DEFAULT_INCLUDE: IncludeFlags = {
  rawPalette: true,
  semanticLight: true,
  semanticDark: true,
  identity: true,
  foundations: true,
}

// camelCase → "Title case" (Label component uppercases on render)
function humanize(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

// ═══════════════════════════════════════════════════════════
// Layout styles (inline, layout primitives only — no color)
// ═══════════════════════════════════════════════════════════

const pageStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  minHeight: '100vh',
  background: 'var(--background)',
  color: 'var(--foreground)',
}
const mainStyle: CSSProperties = { padding: '32px 48px 64px', minWidth: 0 }
const stackStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }
const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 }

const pairBlockStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  paddingBottom: 10,
  borderBottom: '1px solid var(--border)',
}

const pairHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
}

const pairRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const pairPrefixBaseStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--muted-foreground)',
  fontFamily: 'var(--font-mono)',
  flexShrink: 0,
}

const pairPrefixShortStyle: CSSProperties = { ...pairPrefixBaseStyle, width: 22 }

const pairPrefixWideStyle: CSSProperties = { ...pairPrefixBaseStyle, width: 48 }
const preBoxStyle: CSSProperties = {
  maxHeight: 360,
  overflow: 'auto',
  padding: 16,
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  background: 'var(--muted)',
  border: '2px solid var(--memphis-border-color)',
}
const previewHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
}

// ═══════════════════════════════════════════════════════════
// DivergenceIndicator — visual cue that a token's value differs
// between the light and dark variants. Wraps a ColorPicker so users
// can SEE that the per-mode toggle has produced separate values.
// ═══════════════════════════════════════════════════════════

interface DivergenceWrapperProps {
  token: string
  lightValue: string
  darkValue: string
  children: React.ReactNode
  /** When wrapping inside a flex row, set this so the wrapper itself stretches. */
  fillWidth?: boolean
}

function DivergenceWrapper({
  token,
  lightValue,
  darkValue,
  children,
  fillWidth = false,
}: DivergenceWrapperProps) {
  const diverged = lightValue !== darkValue
  return (
    <div
      data-token={token}
      style={{
        position: 'relative',
        ...(fillWidth ? { flex: 1, minWidth: 0 } : null),
      }}
    >
      {children}
      {diverged && (
        <span
          data-testid="divergence-indicator"
          aria-label={`Light/dark values diverge for ${token}`}
          title={`Light: ${lightValue} · Dark: ${darkValue}`}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '1px 5px',
            background: 'var(--warning)',
            color: 'var(--warning-foreground)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          ≠
        </span>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ContrastBadge
// ═══════════════════════════════════════════════════════════

function ContrastBadge({ fg, bg }: { fg: string; bg: string }) {
  const level = contrastLevel(fg, bg)
  const ratio = contrastRatio(fg, bg).toFixed(1)
  const bgForLevel: Record<typeof level, string> = {
    aaa: 'var(--success)',
    aa: 'var(--warning)',
    fail: 'var(--destructive)',
  }
  return (
    <span
      aria-label={`Contrast ${ratio}:1 (${level.toUpperCase()})`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        padding: '2px 6px',
        color: '#fff',
        background: bgForLevel[level],
        textTransform: 'uppercase',
        minWidth: 56,
        textAlign: 'center',
      }}
    >
      {level} {ratio}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════
// PaletteEditor
// ═══════════════════════════════════════════════════════════

interface PaletteEditorProps {
  palette: RawPalette
  otherPalette: RawPalette
  mode: EditMode
  dispatch: ThemeDispatch
}

function PaletteEditor({ palette, otherPalette, mode, dispatch }: PaletteEditorProps) {
  const t = useTranslations('themeGenerator.paletteEditor')
  return (
    <>
      <p
        style={{
          fontSize: 11,
          color: 'var(--muted-foreground)',
          marginBottom: 12,
          lineHeight: 1.5,
        }}
      >
        {t('helpText')}
      </p>
      <Accordion type="multiple" defaultValue={['ink', 'brand', 'paper']}>
        {(['ink', 'brand', 'paper'] as const).map((group) => (
          <AccordionItem key={group} value={group}>
            <AccordionTrigger>
              {t('groupHeader', { group, count: PALETTE_STEPS[group].length })}
            </AccordionTrigger>
            <AccordionContent>
              <div style={stackStyle}>
                {(PALETTE_STEPS[group] as ReadonlyArray<string>).map((step) => {
                  const groupMap = palette[group] as Readonly<Record<string, string>>
                  const otherGroupMap = otherPalette[group] as Readonly<Record<string, string>>
                  const value = groupMap[step] ?? '#000000'
                  const lightValue = mode === 'light' ? value : (otherGroupMap[step] ?? '#000000')
                  const darkValue = mode === 'dark' ? value : (otherGroupMap[step] ?? '#000000')
                  return (
                    <DivergenceWrapper
                      key={step}
                      token={`palette-${group}-${step}`}
                      lightValue={lightValue}
                      darkValue={darkValue}
                    >
                      <ColorPicker
                        label={`${group}-${step}`}
                        value={value}
                        onChange={(next) =>
                          dispatch({ type: 'SET_PALETTE_STEP', mode, group, step, value: next })
                        }
                      />
                    </DivergenceWrapper>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// ThemeEditor
// ═══════════════════════════════════════════════════════════

interface ThemeEditorProps {
  semantic: SemanticTheme
  otherSemantic: SemanticTheme
  mode: EditMode
  onChange: (key: keyof SemanticTheme, value: string) => void
}

// Maps SEMANTIC_GROUPS top-level keys (surfaces/intents/statuses/chrome/
// memphis/badges) → display title. Capitalised; not yet wired through the
// translation catalog because the SEMANTIC_GROUPS shape isn't symmetric
// across modes.
function semanticGroupTitle(groupKey: keyof typeof SEMANTIC_GROUPS): string {
  return groupKey.charAt(0).toUpperCase() + groupKey.slice(1)
}

// Maps the english label string of each SEMANTIC_GROUPS entry to its
// translation-catalog key under `themeGenerator.semanticGroups.*`. Hoisted
// so we don't rebuild the lookup every render and so TS catches missing
// labels at the use site.
const SEMANTIC_LABEL_TO_KEY: Readonly<Record<string, string>> = {
  Background: 'background',
  Card: 'card',
  Popover: 'popover',
  Muted: 'muted',
  Primary: 'primary',
  Secondary: 'secondary',
  Destructive: 'destructive',
  Success: 'success',
  Warning: 'warning',
  Info: 'info',
  Border: 'border',
  'Border strong': 'borderStrong',
  'Focus ring': 'focusRing',
  Shadow: 'shadow',
  Featured: 'featured',
}

function ThemeEditor({ semantic, otherSemantic, mode, onChange }: ThemeEditorProps) {
  const tGroups = useTranslations('themeGenerator.semanticGroups')
  const divPair = (key: keyof SemanticTheme): { lightValue: string; darkValue: string } => ({
    lightValue: mode === 'light' ? semantic[key] : otherSemantic[key],
    darkValue: mode === 'dark' ? semantic[key] : otherSemantic[key],
  })
  const tLabel = (label: string): string => {
    const key = SEMANTIC_LABEL_TO_KEY[label]
    return key ? tGroups(key) : label
  }
  return (
    <Accordion type="multiple" defaultValue={['surfaces', 'intents', 'statuses']}>
      {(Object.keys(SEMANTIC_GROUPS) as ReadonlyArray<keyof typeof SEMANTIC_GROUPS>).map(
        (groupKey) => (
          <AccordionItem key={groupKey} value={groupKey}>
            <AccordionTrigger>{semanticGroupTitle(groupKey)}</AccordionTrigger>
            <AccordionContent>
              <div style={{ ...stackStyle, gap: 12 }}>
                {SEMANTIC_GROUPS[groupKey].map((entry) => {
                  if ('bg' in entry && 'fg' in entry) {
                    const bgKey = entry.bg as keyof SemanticTheme
                    const fgKey = entry.fg as keyof SemanticTheme
                    const bgVal = semantic[bgKey]
                    const fgVal = semantic[fgKey]
                    const label = tLabel(entry.label)
                    return (
                      <div key={entry.label} style={pairBlockStyle}>
                        <div style={pairHeaderStyle}>
                          <Label>{label}</Label>
                          <ContrastBadge fg={fgVal} bg={bgVal} />
                        </div>
                        <div style={pairRowStyle}>
                          <span style={pairPrefixShortStyle}>BG</span>
                          <DivergenceWrapper
                            token={`semantic-${String(bgKey)}`}
                            {...divPair(bgKey)}
                            fillWidth
                          >
                            <ColorPicker
                              label={`${label} background`}
                              value={bgVal}
                              onChange={(v) => onChange(bgKey, v)}
                              showLabel={false}
                            />
                          </DivergenceWrapper>
                        </div>
                        <div style={pairRowStyle}>
                          <span style={pairPrefixShortStyle}>FG</span>
                          <DivergenceWrapper
                            token={`semantic-${String(fgKey)}`}
                            {...divPair(fgKey)}
                            fillWidth
                          >
                            <ColorPicker
                              label={`${label} foreground`}
                              value={fgVal}
                              onChange={(v) => onChange(fgKey, v)}
                              showLabel={false}
                            />
                          </DivergenceWrapper>
                        </div>
                      </div>
                    )
                  }
                  // Chrome / memphis primitives — single color, no foreground pair
                  const singleKey = entry.key as keyof SemanticTheme
                  const singleVal = semantic[singleKey]
                  const singleLabel = tLabel(entry.label)
                  return (
                    <DivergenceWrapper
                      key={entry.label}
                      token={`semantic-${String(singleKey)}`}
                      {...divPair(singleKey)}
                    >
                      <ColorPicker
                        label={singleLabel}
                        value={singleVal}
                        onChange={(v) => onChange(singleKey, v)}
                      />
                    </DivergenceWrapper>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ),
      )}
    </Accordion>
  )
}

// ═══════════════════════════════════════════════════════════
// IdentityEditor
// ═══════════════════════════════════════════════════════════

interface IdentityEditorProps {
  theme: Theme
  identity: IdentityTheme
  otherIdentity: IdentityTheme
  mode: EditMode
  dispatch: ThemeDispatch
}

function IdentityEditor({ theme, identity, otherIdentity, mode, dispatch }: IdentityEditorProps) {
  const t = useTranslations('themeGenerator.identity')
  return (
    <Accordion type="multiple" defaultValue={['medals']}>
      {/* Medals */}
      <AccordionItem value="medals">
        <AccordionTrigger>{t('medalsTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={{ ...stackStyle, gap: 12 }}>
            {(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).map((rank) => (
              <div key={rank} style={pairBlockStyle}>
                <Label>{t(`medalRanks.${rank}`)}</Label>
                {(['outer', 'inner', 'text'] as const).map((slot) => {
                  const lightVal =
                    mode === 'light'
                      ? identity.medals[rank][slot]
                      : otherIdentity.medals[rank][slot]
                  const darkVal =
                    mode === 'dark' ? identity.medals[rank][slot] : otherIdentity.medals[rank][slot]
                  return (
                    <div key={slot} style={pairRowStyle}>
                      <span style={pairPrefixWideStyle}>{t(`medalSlots.${slot}`)}</span>
                      <DivergenceWrapper
                        token={`medal-${rank}-${slot}`}
                        lightValue={lightVal}
                        darkValue={darkVal}
                        fillWidth
                      >
                        <ColorPicker
                          label={`${rank} ${slot}`}
                          value={identity.medals[rank][slot]}
                          onChange={(v) =>
                            dispatch({ type: 'SET_MEDAL', mode, rank, slot, value: v })
                          }
                          showLabel={false}
                        />
                      </DivergenceWrapper>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Charts */}
      <AccordionItem value="charts">
        <AccordionTrigger>{t('chartsTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['1', '2', '3', '4', '5'] as const).map((index) => {
              const lightVal =
                mode === 'light' ? identity.charts[index] : otherIdentity.charts[index]
              const darkVal = mode === 'dark' ? identity.charts[index] : otherIdentity.charts[index]
              return (
                <DivergenceWrapper
                  key={index}
                  token={`chart-${index}`}
                  lightValue={lightVal}
                  darkValue={darkVal}
                >
                  <ColorPicker
                    label={t('chartLabel', { index })}
                    value={identity.charts[index]}
                    onChange={(v) => dispatch({ type: 'SET_CHART', mode, index, value: v })}
                  />
                </DivergenceWrapper>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Nav on dark */}
      <AccordionItem value="nav-on-dark">
        <AccordionTrigger>{t('navOnDarkTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['accent', 'accentStrong', 'foreground', 'foregroundStrong'] as const).map((key) => {
              const lightVal =
                mode === 'light' ? identity.navOnDark[key] : otherIdentity.navOnDark[key]
              const darkVal =
                mode === 'dark' ? identity.navOnDark[key] : otherIdentity.navOnDark[key]
              return (
                <DivergenceWrapper
                  key={key}
                  token={`nav-on-dark-${key}`}
                  lightValue={lightVal}
                  darkValue={darkVal}
                >
                  <ColorPicker
                    label={humanize(key)}
                    value={identity.navOnDark[key]}
                    onChange={(v) => dispatch({ type: 'SET_NAV_ON_DARK', mode, key, value: v })}
                  />
                </DivergenceWrapper>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* App pattern */}
      <AccordionItem value="app-pattern">
        <AccordionTrigger>{t('appPatternTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['color1', 'color2', 'color3'] as const).map((key) => {
              const lightVal =
                identity.appPattern[key] === otherIdentity.appPattern[key]
                  ? identity.appPattern[key]
                  : mode === 'light'
                    ? identity.appPattern[key]
                    : otherIdentity.appPattern[key]
              const darkVal =
                identity.appPattern[key] === otherIdentity.appPattern[key]
                  ? identity.appPattern[key]
                  : mode === 'dark'
                    ? identity.appPattern[key]
                    : otherIdentity.appPattern[key]
              return (
                <DivergenceWrapper
                  key={key}
                  token={`app-pattern-${key}`}
                  lightValue={lightVal}
                  darkValue={darkVal}
                >
                  <ColorPicker
                    label={humanize(key)}
                    value={identity.appPattern[key]}
                    onChange={(v) =>
                      dispatch({ type: 'SET_APP_PATTERN_COLOR', mode, key, value: v })
                    }
                  />
                </DivergenceWrapper>
              )
            })}
            <DivergenceWrapper
              token="app-pattern-size"
              lightValue={String(theme.identity.light.appPattern.size)}
              darkValue={String(theme.identity.dark.appPattern.size)}
            >
              <Label>{t('appPatternSize', { px: identity.appPattern.size })}</Label>
              <Slider
                value={[identity.appPattern.size]}
                min={20}
                max={400}
                step={10}
                onValueChange={(v) => {
                  const n = v[0]
                  if (typeof n === 'number') {
                    dispatch({ type: 'SET_APP_PATTERN_SIZE', mode, value: n })
                  }
                }}
              />
            </DivergenceWrapper>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Typography */}
      <AccordionItem value="typography">
        <AccordionTrigger>{t('typographyTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(
              [
                {
                  id: 'tg-font-display',
                  slot: 'display',
                  field: 'fontDisplay',
                  labelKey: 'displayFont',
                },
                { id: 'tg-font-body', slot: 'body', field: 'fontBody', labelKey: 'bodyFont' },
                { id: 'tg-font-mono', slot: 'mono', field: 'fontMono', labelKey: 'monoFont' },
              ] as const
            ).map(({ id, slot, field, labelKey }) => {
              const label = t(labelKey)
              const lightVal = theme.typography.light[field]
              const darkVal = theme.typography.dark[field]
              return (
                <div key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <DivergenceWrapper
                    token={`typography-${field}`}
                    lightValue={lightVal}
                    darkValue={darkVal}
                  >
                    <Input
                      id={id}
                      value={theme.typography[mode][field]}
                      onChange={(e) =>
                        dispatch({ type: 'SET_TYPOGRAPHY_FONT', mode, slot, value: e.target.value })
                      }
                    />
                  </DivergenceWrapper>
                </div>
              )
            })}
            {SIZE_KEYS.map((k) => {
              const lightVal = String(theme.typography.light.sizes[k])
              const darkVal = String(theme.typography.dark.sizes[k])
              return (
                <div key={k}>
                  <Label>
                    {k} · {theme.typography[mode].sizes[k]}px
                  </Label>
                  <DivergenceWrapper token={`text-${k}`} lightValue={lightVal} darkValue={darkVal}>
                    <Slider
                      value={[theme.typography[mode].sizes[k]]}
                      min={10}
                      max={64}
                      step={1}
                      onValueChange={(v) => {
                        const n = v[0]
                        if (typeof n === 'number') {
                          dispatch({ type: 'SET_TYPOGRAPHY_SIZE', mode, key: k, value: n })
                        }
                      }}
                    />
                  </DivergenceWrapper>
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Radius */}
      <AccordionItem value="radius">
        <AccordionTrigger>{t('radiusTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {RADIUS_KEYS.map((k) => {
              const lightVal = String(theme.radius.light[k])
              const darkVal = String(theme.radius.dark[k])
              return (
                <div key={k}>
                  <div style={pairHeaderStyle}>
                    <Label>
                      {k} · {theme.radius[mode][k]}px
                    </Label>
                    <TokenPreviewChip variant="radius" tokenKey={k} />
                  </div>
                  <DivergenceWrapper
                    token={`radius-${k}`}
                    lightValue={lightVal}
                    darkValue={darkVal}
                  >
                    <Slider
                      value={[theme.radius[mode][k]]}
                      min={0}
                      max={k === 'pill' ? 1000 : 64}
                      step={1}
                      onValueChange={(v) => {
                        const n = v[0]
                        if (typeof n === 'number') {
                          dispatch({ type: 'SET_RADIUS', mode, key: k, value: n })
                        }
                      }}
                    />
                  </DivergenceWrapper>
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Shadow Memphis */}
      <AccordionItem value="shadow">
        <AccordionTrigger>{t('shadowTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={{ ...stackStyle, gap: 12 }}>
            <span className="eyebrow">{t('shadowMemphis')}</span>
            {SHADOW_MEMPHIS_KEYS.map((k) => {
              const lightSig = JSON.stringify(theme.shadowMemphis.light[k])
              const darkSig = JSON.stringify(theme.shadowMemphis.dark[k])
              const current = theme.shadowMemphis[mode][k]
              return (
                <DivergenceWrapper
                  key={k}
                  token={`shadow-memphis-${k}`}
                  lightValue={lightSig}
                  darkValue={darkSig}
                >
                  <div style={pairBlockStyle}>
                    <div style={pairHeaderStyle}>
                      <Label>{k}</Label>
                      <TokenPreviewChip variant="shadow-memphis" tokenKey={k} />
                    </div>
                    <div style={pairRowStyle}>
                      <span style={pairPrefixShortStyle}>X</span>
                      <Input
                        type="number"
                        aria-label={`${k} offset x`}
                        value={current.x}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_SHADOW_MEMPHIS',
                            mode,
                            key: k,
                            slot: 'x',
                            value: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                      <span style={pairPrefixShortStyle}>Y</span>
                      <Input
                        type="number"
                        aria-label={`${k} offset y`}
                        value={current.y}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_SHADOW_MEMPHIS',
                            mode,
                            key: k,
                            slot: 'y',
                            value: Number(e.target.value),
                          })
                        }
                        className="flex-1"
                      />
                    </div>
                    <ColorPicker
                      label={`${k} shadow color`}
                      value={current.color}
                      onChange={(next) =>
                        dispatch({
                          type: 'SET_SHADOW_MEMPHIS',
                          mode,
                          key: k,
                          slot: 'color',
                          value: next,
                        })
                      }
                      showLabel={false}
                    />
                  </div>
                </DivergenceWrapper>
              )
            })}
            <span className="eyebrow">{t('shadowSoft')}</span>
            <DivergenceWrapper
              token="shadow-soft-md"
              lightValue={String(theme.shadowSoft.light.md)}
              darkValue={String(theme.shadowSoft.dark.md)}
            >
              <Label>
                {t('shadowMdOpacity', { opacity: theme.shadowSoft[mode].md.toFixed(2) })}
              </Label>
              <Slider
                value={[Math.round(theme.shadowSoft[mode].md * 100)]}
                min={0}
                max={30}
                step={1}
                onValueChange={(v) => {
                  const n = v[0]
                  if (typeof n === 'number') {
                    dispatch({
                      type: 'SET_SHADOW_SOFT',
                      mode,
                      value: Number((n / 100).toFixed(2)),
                    })
                  }
                }}
              />
            </DivergenceWrapper>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Motion */}
      <AccordionItem value="motion">
        <AccordionTrigger>{t('motionTitle')}</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            <span className="eyebrow">{t('motionDurations')}</span>
            {DURATION_KEYS.map((k) => {
              const lightVal = String(theme.motion.light.durations[k])
              const darkVal = String(theme.motion.dark.durations[k])
              return (
                <div key={k}>
                  <Label htmlFor={`tg-dur-${k}`}>{k}</Label>
                  <DivergenceWrapper
                    token={`duration-${k}`}
                    lightValue={lightVal}
                    darkValue={darkVal}
                  >
                    <Input
                      id={`tg-dur-${k}`}
                      type="number"
                      value={theme.motion[mode].durations[k]}
                      onChange={(e) =>
                        dispatch({
                          type: 'SET_DURATION',
                          mode,
                          key: k,
                          value: Number(e.target.value),
                        })
                      }
                    />
                  </DivergenceWrapper>
                </div>
              )
            })}
            <span className="eyebrow">{t('motionEasings')}</span>
            {(['memphis', 'out'] as const).map((k) => {
              const lightVal = theme.motion.light.easings[k]
              const darkVal = theme.motion.dark.easings[k]
              return (
                <div key={k}>
                  <Label>{k}</Label>
                  <DivergenceWrapper
                    token={`easing-${k}`}
                    lightValue={lightVal}
                    darkValue={darkVal}
                  >
                    <Select
                      value={theme.motion[mode].easings[k]}
                      onValueChange={(v) =>
                        dispatch({ type: 'SET_EASING', mode, key: k, value: v })
                      }
                    >
                      <SelectTrigger aria-label={`easing ${k}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EASING_CHOICES.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DivergenceWrapper>
                </div>
              )
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

export default function ThemeGeneratorPage() {
  const t = useTranslations('themeGenerator')
  const { theme, dispatch } = useThemeState()

  const [editorTab, setEditorTab] = useState<EditorTab>('theme')
  const [editMode, setEditMode] = useState<EditMode>('light')
  const [sceneTab, setSceneTab] = useState<SceneTab>('components')
  const [exportTab, setExportTab] = useState<ExportTab>('css')
  const [previewPaneTab, setPreviewPaneTab] = useState<'preview' | 'export'>('preview')
  const [copyState, setCopyState] = useState<'copied' | 'error' | null>(null)
  const [includeFlags, setIncludeFlags] = useState<IncludeFlags>(DEFAULT_INCLUDE)

  const setIncludeFlag = (key: IncludeKey, value: boolean): void =>
    setIncludeFlags((prev) => ({ ...prev, [key]: value }))

  // Opt out of the global prefers-reduced-motion collapse while the user is
  // on this route — the editor PREVIEWS motion, so collapsing every
  // transition to 0.01ms makes generator edits invisible. Every other route
  // (and every consumer that lifts the stylesheet) keeps strict a11y.
  // See apps/web/app/styles/theme.css and AC-1 in
  // _bmad-output/test-artifacts/atdd-checklist-...md.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-motion-preview', '')
    return () => {
      document.documentElement.removeAttribute('data-motion-preview')
    }
  }, [])

  const otherMode: EditMode = editMode === 'light' ? 'dark' : 'light'
  const semantic = theme.semantic[editMode]
  const otherSemantic = theme.semantic[otherMode]
  const palette = theme.palette[editMode]
  const otherPalette = theme.palette[otherMode]
  const identity = theme.identity[editMode]
  const otherIdentity = theme.identity[otherMode]

  const filteredOutput = useMemo(() => {
    if (exportTab === 'json') return buildJsonExport(theme)
    if (exportTab === 'css') return buildCssExport(theme, includeFlags)
    if (exportTab === 'tailwind') return buildTailwindExport(theme, includeFlags)
    return ''
  }, [exportTab, theme, includeFlags])

  const downloadFilename =
    exportTab === 'css'
      ? 'theme.css'
      : exportTab === 'tailwind'
        ? 'theme.tailwind.css'
        : 'theme.json'

  async function handleCopy(content: string) {
    try {
      await navigator.clipboard.writeText(content)
      setCopyState('copied')
      window.setTimeout(() => setCopyState(null), 1600)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState(null), 2400)
    }
  }

  function handleDownload(content: string, filename: string) {
    const mime = filename.endsWith('.json') ? 'application/json' : 'text/css'
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={pageStyle}>
      {/* ─── Sidebar ──────────────────────────────────── */}
      <Sidebar aria-label={t('sidebar.aria')}>
        <SidebarHeader>
          <SidebarBrand>{t('sidebar.brand')}</SidebarBrand>
          <SidebarSubtitle>
            {BRAND.libName} · {t('sidebar.subtitle')}
          </SidebarSubtitle>
        </SidebarHeader>

        <SidebarBody>
          {/* Editor tabs: Palette / Theme / Identity */}
          <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as EditorTab)}>
            <TabsList>
              <TabsTrigger value="palette">{t('sidebar.tabs.palette')}</TabsTrigger>
              <TabsTrigger value="theme">{t('sidebar.tabs.theme')}</TabsTrigger>
              <TabsTrigger value="identity">{t('sidebar.tabs.identity')}</TabsTrigger>
            </TabsList>

            {/* Edit-mode toggle — Light / Dark (independent of preview).
                Shared across all editor tabs so palette and identity can
                also be customised per mode. */}
            <div style={{ marginTop: 12, marginBottom: 12 }}>
              <div style={rowStyle}>
                <Label>{t('sidebar.editingLabel')}</Label>
                <Button
                  variant={editMode === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('light')}
                  aria-pressed={editMode === 'light'}
                >
                  {t('sidebar.lightButton')}
                </Button>
                <Button
                  variant={editMode === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('dark')}
                  aria-pressed={editMode === 'dark'}
                >
                  {t('sidebar.darkButton')}
                </Button>
              </div>
              <div
                data-testid="editing-variant-header"
                style={{
                  marginTop: 8,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  background: editMode === 'dark' ? 'var(--ink-900)' : 'var(--paper-100)',
                  color: editMode === 'dark' ? 'var(--paper-50)' : 'var(--ink-900)',
                  border: '2px solid var(--memphis-border-color)',
                }}
              >
                {t('sidebar.editingHeader', { mode: editMode })}{' '}
                <code>data-theme=&quot;{editMode}&quot;</code>
              </div>
            </div>

            <TabsContent value="palette">
              <PaletteEditor
                palette={palette}
                otherPalette={otherPalette}
                mode={editMode}
                dispatch={dispatch}
              />
            </TabsContent>

            <TabsContent value="theme">
              <ThemeEditor
                semantic={semantic}
                otherSemantic={otherSemantic}
                mode={editMode}
                onChange={(key, value) =>
                  dispatch({ type: 'SET_SEMANTIC', mode: editMode, key, value })
                }
              />
            </TabsContent>

            <TabsContent value="identity">
              <IdentityEditor
                theme={theme}
                identity={identity}
                otherIdentity={otherIdentity}
                mode={editMode}
                dispatch={dispatch}
              />
            </TabsContent>
          </Tabs>
        </SidebarBody>

        <SidebarFooter>
          <Button
            variant="ghost"
            onClick={() => {
              const root = typeof document !== 'undefined' ? document.documentElement : null
              const attr = root?.getAttribute('data-palette') ?? ''
              const preset: PresetName = (PRESET_NAMES as readonly string[]).includes(attr)
                ? (attr as PresetName)
                : 'default'
              dispatch({ type: 'RESET', preset })
            }}
          >
            {t('sidebar.reset')}
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* ─── Main pane ────────────────────────────────── */}
      <main style={mainStyle}>
        <Tabs
          value={previewPaneTab}
          onValueChange={(v) => setPreviewPaneTab(v as 'preview' | 'export')}
        >
          <TabsList>
            <TabsTrigger value="preview">{t('preview.tab')}</TabsTrigger>
            <TabsTrigger value="export">{t('export.tab')}</TabsTrigger>
          </TabsList>

          {/* Preview tab */}
          <TabsContent value="preview">
            <div style={{ ...stackStyle, gap: 16, marginTop: 16 }}>
              <div style={previewHeaderStyle}>
                {/* Scene tabs */}
                <Tabs value={sceneTab} onValueChange={(v) => setSceneTab(v as SceneTab)}>
                  <TabsList>
                    <TabsTrigger value="components">{t('preview.scenes.components')}</TabsTrigger>
                    <TabsTrigger value="gallery">{t('preview.scenes.gallery')}</TabsTrigger>
                    <TabsTrigger value="auth">{t('preview.scenes.auth')}</TabsTrigger>
                    <TabsTrigger value="dashboard">{t('preview.scenes.dashboard')}</TabsTrigger>
                    <TabsTrigger value="profile">{t('preview.scenes.profile')}</TabsTrigger>
                    <TabsTrigger value="feed">{t('preview.scenes.feed')}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <SampleDialog />
              </div>

              {/* Scene preview */}
              <div
                style={{
                  padding: 32,
                  background: 'var(--background)',
                  border: '2px solid var(--memphis-border-color)',
                }}
              >
                {sceneTab === 'components' && <ComponentsPreview />}
                {sceneTab === 'gallery' && <GalleryPreview />}
                {sceneTab === 'auth' && <AuthPreview />}
                {sceneTab === 'dashboard' && <DashboardPreview />}
                {sceneTab === 'profile' && <ProfilePreview />}
                {sceneTab === 'feed' && <FeedPreview />}
              </div>
            </div>
          </TabsContent>

          {/* Export tab */}
          <TabsContent value="export">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
              {/* Section A: Format selector */}
              <section>
                <Label>{t('export.format')}</Label>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Button
                    variant={exportTab === 'css' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setExportTab('css')}
                  >
                    CSS
                  </Button>
                  <Button
                    variant={exportTab === 'tailwind' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setExportTab('tailwind')}
                  >
                    Tailwind
                  </Button>
                  <Button
                    variant={exportTab === 'json' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setExportTab('json')}
                  >
                    JSON
                  </Button>
                </div>
              </section>

              {/* Section B: Include toggles — only for CSS and Tailwind */}
              {(exportTab === 'css' || exportTab === 'tailwind') && (
                <section>
                  <Label>{t('export.include')}</Label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {INCLUDE_OPTIONS[exportTab].map((opt) => (
                      <label
                        key={opt.key}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                      >
                        <Checkbox
                          checked={includeFlags[opt.key]}
                          onCheckedChange={(v) => setIncludeFlag(opt.key, !!v)}
                        />
                        <span style={{ fontSize: 13 }}>
                          {t(`export.includeOptions.${opt.labelKey}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* Section C: Output preview */}
              <section>
                <Label>{t('export.output')}</Label>
                <pre style={{ ...preBoxStyle, marginTop: 8 }}>{filteredOutput}</pre>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button variant="primary" onClick={() => handleCopy(filteredOutput)}>
                    {copyState === 'copied'
                      ? t('export.copied')
                      : copyState === 'error'
                        ? t('export.copyFailed')
                        : t('export.copy')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(filteredOutput, downloadFilename)}
                  >
                    {t('export.download')}
                  </Button>
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
