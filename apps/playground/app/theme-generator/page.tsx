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

import { useMemo, useState, type CSSProperties } from 'react'
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
import {
  AuthPreview,
  DashboardPreview,
  FeedPreview,
  GalleryPreview,
  ProfilePreview,
} from '@damo/ui/mocks'

import { useThemeState } from './use-theme-state'
import {
  PALETTE_STEPS,
  SEMANTIC_GROUPS,
  type MotionDurationKey,
  type RadiusKey,
  type SemanticTheme,
  type ShadowMemphisKey,
  type Theme,
  type TypographySizeKey,
} from './theme-state'
import { contrastLevel, contrastRatio } from './contrast'
import { type PresetName } from './presets'
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

type SceneTab = 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
type ExportTab = 'css' | 'tailwind' | 'json'
type EditorTab = 'palette' | 'theme' | 'identity'
type EditMode = 'light' | 'dark'

type IncludeKey = keyof IncludeFlags

// ═══════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl']
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS: ReadonlyArray<ShadowMemphisKey> = ['sm', 'md', 'lg', 'hover', 'active']
const DURATION_KEYS: ReadonlyArray<MotionDurationKey> = ['snap', 'fast', 'base', 'slow']
const EASING_CHOICES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'cubic-bezier(0.4, 1.3, 0.5, 1)', label: 'memphis (default)' },
  { value: 'cubic-bezier(0.2, 0.9, 0.3, 1)', label: 'out' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'in-out' },
  { value: 'linear', label: 'linear' },
  { value: 'ease', label: 'ease' },
  { value: 'ease-in', label: 'ease-in' },
  { value: 'ease-out', label: 'ease-out' },
]

const INCLUDE_OPTIONS: Record<'css' | 'tailwind', ReadonlyArray<{ key: IncludeKey; label: string }>> = {
  css: [
    { key: 'rawPalette', label: 'Raw palette (ink / brand / paper)' },
    { key: 'semanticLight', label: 'Semantic — light' },
    { key: 'semanticDark', label: 'Semantic — dark' },
    { key: 'identity', label: 'Identity (medals / charts / nav-on-dark / pattern)' },
    { key: 'foundations', label: 'Foundations (typography / radius / shadow / spacing / motion)' },
  ],
  tailwind: [
    { key: 'semanticLight', label: 'Semantic colors' },
    { key: 'identity', label: 'Identity (charts / memphis aliases)' },
    { key: 'foundations', label: 'Foundations (typography / radius / shadow / spacing / motion / z-index)' },
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
  theme: Theme
  dispatch: ThemeDispatch
}

function PaletteEditor({ theme, dispatch }: PaletteEditorProps) {
  return (
    <>
      <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 12, lineHeight: 1.5 }}>
        Editing raw scales does not automatically update the Theme tab values.
        Use Reset to re-derive semantic tokens from the current palette.
      </p>
    <Accordion type="multiple" defaultValue={['ink', 'brand', 'paper']}>
      {(['ink', 'brand', 'paper'] as const).map((group) => (
        <AccordionItem key={group} value={group}>
          <AccordionTrigger>
            {group} ({PALETTE_STEPS[group].length} steps)
          </AccordionTrigger>
          <AccordionContent>
            <div style={stackStyle}>
              {(PALETTE_STEPS[group] as ReadonlyArray<string>).map((step) => {
                const palette = theme.palette[group] as Readonly<Record<string, string>>
                const value = palette[step] ?? '#000000'
                return (
                  <ColorPicker
                    key={step}
                    label={`${group}-${step}`}
                    value={value}
                    onChange={(next) =>
                      dispatch({ type: 'SET_PALETTE_STEP', group, step, value: next })
                    }
                  />
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
  onChange: (key: keyof SemanticTheme, value: string) => void
}

function ThemeEditor({ semantic, onChange }: ThemeEditorProps) {
  return (
    <Accordion type="multiple" defaultValue={['surfaces', 'intents', 'statuses']}>
      {(Object.keys(SEMANTIC_GROUPS) as ReadonlyArray<keyof typeof SEMANTIC_GROUPS>).map(
        (groupKey) => (
          <AccordionItem key={groupKey} value={groupKey}>
            <AccordionTrigger style={{ textTransform: 'capitalize' }}>
              {groupKey}
            </AccordionTrigger>
            <AccordionContent>
              <div style={{ ...stackStyle, gap: 12 }}>
                {SEMANTIC_GROUPS[groupKey].map((entry) => {
                  if ('bg' in entry && 'fg' in entry) {
                    const bgVal = semantic[entry.bg as keyof SemanticTheme]
                    const fgVal = semantic[entry.fg as keyof SemanticTheme]
                    return (
                      <div key={entry.label} style={pairBlockStyle}>
                        <div style={pairHeaderStyle}>
                          <Label>{entry.label}</Label>
                          <ContrastBadge fg={fgVal} bg={bgVal} />
                        </div>
                        <div style={pairRowStyle}>
                          <span style={pairPrefixShortStyle}>BG</span>
                          <ColorPicker
                            label={`${entry.label} background`}
                            value={bgVal}
                            onChange={(v) => onChange(entry.bg as keyof SemanticTheme, v)}
                            showLabel={false}
                            className="flex-1"
                          />
                        </div>
                        <div style={pairRowStyle}>
                          <span style={pairPrefixShortStyle}>FG</span>
                          <ColorPicker
                            label={`${entry.label} foreground`}
                            value={fgVal}
                            onChange={(v) => onChange(entry.fg as keyof SemanticTheme, v)}
                            showLabel={false}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )
                  }
                  // Chrome / memphis primitives — single color, no foreground pair
                  const singleVal = semantic[entry.key as keyof SemanticTheme]
                  return (
                    <ColorPicker
                      key={entry.label}
                      label={entry.label}
                      value={singleVal}
                      onChange={(v) => onChange(entry.key as keyof SemanticTheme, v)}
                    />
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
  dispatch: ThemeDispatch
}

function IdentityEditor({ theme, dispatch }: IdentityEditorProps) {
  return (
    <Accordion type="multiple" defaultValue={['medals']}>
      {/* Medals */}
      <AccordionItem value="medals">
        <AccordionTrigger>Medals</AccordionTrigger>
        <AccordionContent>
          <div style={{ ...stackStyle, gap: 12 }}>
            {(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).map((rank) => (
              <div key={rank} style={pairBlockStyle}>
                <Label>{rank}</Label>
                {(['outer', 'inner', 'text'] as const).map((slot) => (
                  <div key={slot} style={pairRowStyle}>
                    <span style={pairPrefixWideStyle}>{slot}</span>
                    <ColorPicker
                      label={`${rank} ${slot}`}
                      value={theme.identity.medals[rank][slot]}
                      onChange={(v) => dispatch({ type: 'SET_MEDAL', rank, slot, value: v })}
                      showLabel={false}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Charts */}
      <AccordionItem value="charts">
        <AccordionTrigger>Charts</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['1', '2', '3', '4', '5'] as const).map((index) => (
              <ColorPicker
                key={index}
                label={`Chart ${index}`}
                value={theme.identity.charts[index]}
                onChange={(v) => dispatch({ type: 'SET_CHART', index, value: v })}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Nav on dark */}
      <AccordionItem value="nav-on-dark">
        <AccordionTrigger>Nav on dark</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {(['accent', 'accentStrong', 'foreground', 'foregroundStrong'] as const).map((key) => (
              <ColorPicker
                key={key}
                label={humanize(key)}
                value={theme.identity.navOnDark[key]}
                onChange={(v) => dispatch({ type: 'SET_NAV_ON_DARK', key, value: v })}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Typography */}
      <AccordionItem value="typography">
        <AccordionTrigger>Typography</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            <div>
              <Label htmlFor="tg-font-display">Display font</Label>
              <Input
                id="tg-font-display"
                value={theme.typography.fontDisplay}
                onChange={(e) =>
                  dispatch({ type: 'SET_TYPOGRAPHY_FONT', slot: 'display', value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tg-font-body">Body font</Label>
              <Input
                id="tg-font-body"
                value={theme.typography.fontBody}
                onChange={(e) =>
                  dispatch({ type: 'SET_TYPOGRAPHY_FONT', slot: 'body', value: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tg-font-mono">Mono font</Label>
              <Input
                id="tg-font-mono"
                value={theme.typography.fontMono}
                onChange={(e) =>
                  dispatch({ type: 'SET_TYPOGRAPHY_FONT', slot: 'mono', value: e.target.value })
                }
              />
            </div>
            {SIZE_KEYS.map((k) => (
              <div key={k}>
                <Label>
                  {k} · {theme.typography.sizes[k]}px
                </Label>
                <Slider
                  value={[theme.typography.sizes[k]]}
                  min={10}
                  max={64}
                  step={1}
                  onValueChange={(v) => {
                    const n = v[0]
                    if (typeof n === 'number') {
                      dispatch({ type: 'SET_TYPOGRAPHY_SIZE', key: k, value: n })
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Radius */}
      <AccordionItem value="radius">
        <AccordionTrigger>Radius</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            {RADIUS_KEYS.map((k) => (
              <div key={k}>
                <Label>
                  {k} · {theme.radius[k]}px
                </Label>
                <Slider
                  value={[theme.radius[k]]}
                  min={0}
                  max={k === 'pill' ? 1000 : 64}
                  step={1}
                  onValueChange={(v) => {
                    const n = v[0]
                    if (typeof n === 'number') {
                      dispatch({ type: 'SET_RADIUS', key: k, value: n })
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Shadow Memphis */}
      <AccordionItem value="shadow">
        <AccordionTrigger>Shadow</AccordionTrigger>
        <AccordionContent>
          <div style={{ ...stackStyle, gap: 12 }}>
            <span className="eyebrow">Memphis</span>
            {SHADOW_MEMPHIS_KEYS.map((k) => (
              <div key={k} style={pairBlockStyle}>
                <Label>{k}</Label>
                <div style={pairRowStyle}>
                  <span style={pairPrefixShortStyle}>X</span>
                  <Input
                    type="number"
                    aria-label={`${k} offset x`}
                    value={theme.shadowMemphis[k].x}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_SHADOW_MEMPHIS',
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
                    value={theme.shadowMemphis[k].y}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_SHADOW_MEMPHIS',
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
                  value={theme.shadowMemphis[k].color}
                  onChange={(next) =>
                    dispatch({ type: 'SET_SHADOW_MEMPHIS', key: k, slot: 'color', value: next })
                  }
                  showLabel={false}
                />
              </div>
            ))}
            <span className="eyebrow">Soft</span>
            {(['sm', 'md', 'lg'] as const).map((k) => (
              <div key={k}>
                <Label>
                  {k} opacity · {theme.shadowSoft[k].toFixed(2)}
                </Label>
                <Slider
                  value={[Math.round(theme.shadowSoft[k] * 100)]}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={(v) => {
                    const n = v[0]
                    if (typeof n === 'number') {
                      dispatch({
                        type: 'SET_SHADOW_SOFT',
                        key: k,
                        value: Number((n / 100).toFixed(2)),
                      })
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Spacing */}
      <AccordionItem value="spacing">
        <AccordionTrigger>Spacing</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            <Label>Scale · {theme.spacing.scale.toFixed(2)}×</Label>
            <Slider
              value={[Math.round(theme.spacing.scale * 100)]}
              min={50}
              max={150}
              step={5}
              onValueChange={(v) => {
                const n = v[0]
                if (typeof n === 'number') {
                  dispatch({ type: 'SET_SPACING_SCALE', value: Number((n / 100).toFixed(2)) })
                }
              }}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Motion */}
      <AccordionItem value="motion">
        <AccordionTrigger>Motion</AccordionTrigger>
        <AccordionContent>
          <div style={stackStyle}>
            <span className="eyebrow">Durations (ms)</span>
            {DURATION_KEYS.map((k) => (
              <div key={k}>
                <Label htmlFor={`tg-dur-${k}`}>{k}</Label>
                <Input
                  id={`tg-dur-${k}`}
                  type="number"
                  value={theme.motion.durations[k]}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_DURATION',
                      key: k,
                      value: Number(e.target.value),
                    })
                  }
                />
              </div>
            ))}
            <span className="eyebrow">Easings</span>
            {(['memphis', 'out', 'in-out'] as const).map((k) => (
              <div key={k}>
                <Label>{k}</Label>
                <Select
                  value={theme.motion.easings[k]}
                  onValueChange={(v) => dispatch({ type: 'SET_EASING', key: k, value: v })}
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
              </div>
            ))}
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
  const { theme, dispatch } = useThemeState()

  const [editorTab, setEditorTab] = useState<EditorTab>('theme')
  const [editMode, setEditMode] = useState<EditMode>('light')
  const [sceneTab, setSceneTab] = useState<SceneTab>('gallery')
  const [exportTab, setExportTab] = useState<ExportTab>('css')
  const [previewPaneTab, setPreviewPaneTab] = useState<'preview' | 'export'>('preview')
  const [copyState, setCopyState] = useState<'copied' | 'error' | null>(null)
  const [includeFlags, setIncludeFlags] = useState<IncludeFlags>(DEFAULT_INCLUDE)

  const setIncludeFlag = (key: IncludeKey, value: boolean): void =>
    setIncludeFlags((prev) => ({ ...prev, [key]: value }))

  const semantic = theme.semantic[editMode]

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
      <Sidebar aria-label="Theme controls">
        <SidebarHeader>
          <SidebarBrand>Theme Generator</SidebarBrand>
          <SidebarSubtitle>Edit palette, theme and identity tokens</SidebarSubtitle>
        </SidebarHeader>

        <SidebarBody>
          {/* Editor tabs: Palette / Theme / Identity */}
          <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as EditorTab)}>
            <TabsList>
              <TabsTrigger value="palette">Palette</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
            </TabsList>

            <TabsContent value="palette">
              <PaletteEditor theme={theme} dispatch={dispatch} />
            </TabsContent>

            <TabsContent value="theme">
              {/* Edit-mode toggle — Light / Dark (independent of preview) */}
              <div style={{ ...rowStyle, marginBottom: 12 }}>
                <Label>Editing:</Label>
                <Button
                  variant={editMode === 'light' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('light')}
                >
                  Light
                </Button>
                <Button
                  variant={editMode === 'dark' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode('dark')}
                >
                  Dark
                </Button>
              </div>
              <ThemeEditor
                semantic={semantic}
                onChange={(key, value) =>
                  dispatch({ type: 'SET_SEMANTIC', mode: editMode, key, value })
                }
              />
            </TabsContent>

            <TabsContent value="identity">
              <IdentityEditor theme={theme} dispatch={dispatch} />
            </TabsContent>
          </Tabs>
        </SidebarBody>

        <SidebarFooter>
          <Button
            variant="ghost"
            onClick={() => {
              const root = typeof document !== 'undefined' ? document.documentElement : null
              const attr = root?.getAttribute('data-palette')
              const preset: PresetName = attr === 'neon' ? 'neon' : attr === 'sunset' ? 'sunset' : 'default'
              dispatch({ type: 'RESET', preset })
            }}
          >
            Reset
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
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Preview tab */}
          <TabsContent value="preview">
            <div style={{ ...stackStyle, gap: 16, marginTop: 16 }}>
              <div style={previewHeaderStyle}>
                {/* Scene tabs */}
                <Tabs value={sceneTab} onValueChange={(v) => setSceneTab(v as SceneTab)}>
                  <TabsList>
                    <TabsTrigger value="gallery">Gallery</TabsTrigger>
                    <TabsTrigger value="auth">Auth</TabsTrigger>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="feed">Feed</TabsTrigger>
                  </TabsList>
                </Tabs>

              </div>

              {/* Scene preview */}
              <div
                style={{
                  padding: 32,
                  background: 'var(--background)',
                  border: '2px solid var(--memphis-border-color)',
                }}
              >
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
                <Label>Format</Label>
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
                  <Label>Include</Label>
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
                        <span style={{ fontSize: 13 }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {/* Section C: Output preview */}
              <section>
                <Label>Output</Label>
                <pre style={{ ...preBoxStyle, marginTop: 8 }}>{filteredOutput}</pre>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button variant="primary" onClick={() => handleCopy(filteredOutput)}>
                    {copyState === 'copied' ? 'Copied!' : copyState === 'error' ? 'Copy failed' : 'Copy'}
                  </Button>
                  <Button variant="outline" onClick={() => handleDownload(filteredOutput, downloadFilename)}>
                    Download
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
