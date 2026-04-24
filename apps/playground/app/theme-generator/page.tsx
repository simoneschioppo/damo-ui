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
 * / Export (CSS | Tailwind | JSON | Figma sub-tabs).
 */

import { useMemo, useState, type CSSProperties } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
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
import { PRESET_LABELS, type PresetName } from './presets'
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
import {
  buildCssExport,
  buildFigmaExport,
  buildJsonExport,
  buildTailwindExport,
} from './exporters'

// ═══════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════

type ThemeDispatch = ReturnType<typeof useThemeState>['dispatch']

type SceneTab = 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
type ExportTab = 'css' | 'tailwind' | 'json' | 'figma'
type EditorTab = 'palette' | 'theme' | 'identity'
type EditMode = 'light' | 'dark'

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
const pairedRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 72px',
  gap: 8,
  alignItems: 'center',
}
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
    <Accordion type="multiple" defaultValue={['plum', 'gold', 'paper']}>
      {(['plum', 'gold', 'paper'] as const).map((group) => (
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
              <div style={stackStyle}>
                {SEMANTIC_GROUPS[groupKey].map((entry) => {
                  if ('bg' in entry && 'fg' in entry) {
                    const bgVal = semantic[entry.bg as keyof SemanticTheme]
                    const fgVal = semantic[entry.fg as keyof SemanticTheme]
                    return (
                      <div key={entry.label}>
                        <Label>{entry.label}</Label>
                        <div style={pairedRowStyle}>
                          <ColorPicker
                            label={`${entry.label} background`}
                            value={bgVal}
                            onChange={(v) => onChange(entry.bg as keyof SemanticTheme, v)}
                          />
                          <ColorPicker
                            label={`${entry.label} foreground`}
                            value={fgVal}
                            onChange={(v) => onChange(entry.fg as keyof SemanticTheme, v)}
                          />
                          <ContrastBadge fg={fgVal} bg={bgVal} />
                        </div>
                      </div>
                    )
                  }
                  // Chrome / memphis primitives — single color, no foreground pair
                  const singleVal = semantic[entry.key as keyof SemanticTheme]
                  return (
                    <div key={entry.label} style={rowStyle}>
                      <Label style={{ minWidth: 140 }}>{entry.label}</Label>
                      <ColorPicker
                        label={entry.label}
                        value={singleVal}
                        onChange={(v) => onChange(entry.key as keyof SemanticTheme, v)}
                      />
                    </div>
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
          <div style={stackStyle}>
            {(['bronze', 'silver', 'gold', 'master', 'grandmaster'] as const).map((rank) => (
              <div key={rank}>
                <Label style={{ textTransform: 'capitalize', display: 'block', marginBottom: 4 }}>
                  {rank}
                </Label>
                <div style={stackStyle}>
                  {(['outer', 'inner', 'text'] as const).map((slot) => (
                    <div key={slot} style={rowStyle}>
                      <Label style={{ minWidth: 60 }}>{slot}</Label>
                      <ColorPicker
                        label={`${rank} ${slot}`}
                        value={theme.identity.medals[rank][slot]}
                        onChange={(v) => dispatch({ type: 'SET_MEDAL', rank, slot, value: v })}
                      />
                    </div>
                  ))}
                </div>
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
                label={key}
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
          <div style={stackStyle}>
            <span className="eyebrow">Memphis</span>
            {SHADOW_MEMPHIS_KEYS.map((k) => (
              <div key={k} style={stackStyle}>
                <Label>{k}</Label>
                <div style={rowStyle}>
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
                  />
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
                  />
                </div>
                <ColorPicker
                  label={`${k} shadow color`}
                  value={theme.shadowMemphis[k].color}
                  onChange={(next) =>
                    dispatch({ type: 'SET_SHADOW_MEMPHIS', key: k, slot: 'color', value: next })
                  }
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
  const { theme, dispatch, previewMode, setPreviewMode } = useThemeState()

  const [editorTab, setEditorTab] = useState<EditorTab>('theme')
  const [editMode, setEditMode] = useState<EditMode>('light')
  const [sceneTab, setSceneTab] = useState<SceneTab>('gallery')
  const [exportTab, setExportTab] = useState<ExportTab>('css')
  const [previewPaneTab, setPreviewPaneTab] = useState<'preview' | 'export'>('preview')
  const [copyState, setCopyState] = useState<ExportTab | null>(null)

  // Best-effort active-preset detection via plum-500 sentinel value
  const [selectedPreset, setSelectedPreset] = useState<PresetName>('default')

  const semantic = theme.semantic[editMode]

  const exports = useMemo(
    () => ({
      css: buildCssExport(theme),
      tailwind: buildTailwindExport(theme),
      json: buildJsonExport(theme),
      figma: buildFigmaExport(theme),
    }),
    [theme],
  )

  async function handleCopy(tab: ExportTab) {
    try {
      await navigator.clipboard.writeText(exports[tab])
      setCopyState(tab)
      window.setTimeout(() => setCopyState(null), 1600)
    } catch {
      setCopyState(null)
    }
  }

  function handlePresetChange(name: string) {
    const preset = name as PresetName
    setSelectedPreset(preset)
    dispatch({ type: 'SET_PRESET', preset })
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
          {/* Preset selector */}
          <div style={{ ...stackStyle, marginBottom: 16 }}>
            <Label>Preset</Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger aria-label="Preset">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(PRESET_LABELS) as ReadonlyArray<PresetName>).map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRESET_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              dispatch({ type: 'RESET' })
              setSelectedPreset('default')
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

                {/* Preview-mode toggle (independent of edit mode) */}
                <div style={rowStyle} aria-label="Preview theme toggle">
                  <Label>Preview:</Label>
                  <Button
                    variant={previewMode === 'light' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('light')}
                  >
                    Light
                  </Button>
                  <Button
                    variant={previewMode === 'dark' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('dark')}
                  >
                    Dark
                  </Button>
                </div>
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
            <div style={{ marginTop: 16 }}>
              <Tabs value={exportTab} onValueChange={(v) => setExportTab(v as ExportTab)}>
                <TabsList>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="figma">Figma</TabsTrigger>
                </TabsList>
                {(['css', 'tailwind', 'json', 'figma'] as const).map((t) => (
                  <TabsContent key={t} value={t}>
                    <div style={{ ...stackStyle, gap: 16, marginTop: 12 }}>
                      <pre style={preBoxStyle}>{exports[t]}</pre>
                      <div style={rowStyle}>
                        <Button onClick={() => handleCopy(t)}>
                          {copyState === t ? 'Copied ✓' : 'Copy'}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
