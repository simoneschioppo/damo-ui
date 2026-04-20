'use client'

/**
 * /theme-generator — Full token editor.
 *
 * Lets the user author a complete theme (colors, typography, radius,
 * shadow, spacing, motion), switch between curated presets, and preview
 * the result on five stock scenes (Gallery / Auth / Dashboard / Profile /
 * Feed) sourced from `@damo/ui/mocks`. The theme can be
 * exported as CSS custom properties, a Tailwind preset, flat JSON, or
 * Figma Tokens Studio JSON.
 *
 * All UI surfaces come from `@damo/ui`. Inline styles are
 * only used for layout primitives (grid, flex, gap).
 */

import { useMemo, useState, type CSSProperties } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ColorPicker,
  Container,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import { COLOR_GROUPS, type TypographySizeKey, type RadiusKey } from './theme-state'
import {
  buildCssExport,
  buildFigmaExport,
  buildJsonExport,
  buildTailwindExport,
} from './exporters'

// ═══════════════════════════════════════════════════════════
// Layout (inline styles, layout only — no color/border/shadow)
// ═══════════════════════════════════════════════════════════

const pageStyle: CSSProperties = { padding: '32px 0 64px' }
const layoutStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: 32,
  alignItems: 'start',
  marginTop: 32,
}
const sidebarStyle: CSSProperties = {
  position: 'sticky',
  top: 24,
  alignSelf: 'start',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}
const previewColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}
const previewHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
}
const stackStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 }
const rowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 }
const gapLgStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 16 }
const preBoxStyle: CSSProperties = {
  maxHeight: 360,
  overflow: 'auto',
  padding: 16,
  margin: 0,
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  background: 'var(--surface-2)',
  border: '2px solid var(--border-memphis)',
}

// ═══════════════════════════════════════════════════════════
// Page
// ═══════════════════════════════════════════════════════════

type SceneTab = 'gallery' | 'auth' | 'dashboard' | 'profile' | 'feed'
type ExportTab = 'css' | 'tailwind' | 'json' | 'figma'

const SIZE_KEYS: ReadonlyArray<TypographySizeKey> = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
]
const RADIUS_KEYS: ReadonlyArray<RadiusKey> = ['none', 'sm', 'md', 'lg', 'pill', 'full']
const SHADOW_MEMPHIS_KEYS = ['sm', 'md', 'lg', 'hover', 'active'] as const
const DURATION_KEYS = ['snap', 'fast', 'base', 'slow'] as const
const EASING_CHOICES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'cubic-bezier(0.4, 1.3, 0.5, 1)', label: 'memphis (default)' },
  { value: 'cubic-bezier(0.2, 0.9, 0.3, 1)', label: 'out' },
  { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'in-out' },
  { value: 'linear', label: 'linear' },
  { value: 'ease', label: 'ease' },
  { value: 'ease-in', label: 'ease-in' },
  { value: 'ease-out', label: 'ease-out' },
]

export default function ThemeGeneratorPage() {
  const {
    theme,
    activePreset,
    updateToken,
    loadPreset,
    reset,
    darkPreview,
    setDarkPreview,
  } = useThemeState()
  const [sceneTab, setSceneTab] = useState<SceneTab>('gallery')
  const [exportTab, setExportTab] = useState<ExportTab>('css')
  const [exportOpen, setExportOpen] = useState(false)
  const [copyState, setCopyState] = useState<ExportTab | null>(null)

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
    const valid: ReadonlyArray<PresetName> = ['plum-gold', 'neon', 'sunset']
    if (valid.includes(name as PresetName)) {
      loadPreset(name as PresetName)
    }
  }

  function handleThemePreviewChange(value: string) {
    setDarkPreview(value === 'dark')
  }

  return (
    <Container size="xl">
      <div style={pageStyle}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px', lineHeight: 1 }}>
          Theme Generator
        </h1>
        <p style={{ color: 'var(--ink-muted)', margin: '0 0 8px', maxWidth: 680 }}>
          Componi la tua palette, la tipografia, i radius, le ombre, la spaziatura e il
          motion. Scegli un preset, usa la preview dark e scarica il tema nel formato
          che preferisci.
        </p>

        <div style={layoutStyle}>
          {/* ─── Sidebar ─────────────────────────────────── */}
          <div style={sidebarStyle}>
            <Card variant="default" padding="md">
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
              </CardHeader>
              <CardBody>
                <Accordion type="multiple" defaultValue={['colors']}>
                  {/* Colors */}
                  <AccordionItem value="colors">
                    <AccordionTrigger>Colors</AccordionTrigger>
                    <AccordionContent>
                      <div style={stackStyle}>
                        {(Object.keys(COLOR_GROUPS) as Array<keyof typeof COLOR_GROUPS>).map(
                          (group) => (
                            <div key={group} style={stackStyle}>
                              <span className="eyebrow">{group}</span>
                              {COLOR_GROUPS[group].map((key) => (
                                <ColorPicker
                                  key={key}
                                  id={`cp-${key}`}
                                  label={key}
                                  value={theme.colors[key] ?? '#000000'}
                                  onChange={(next) =>
                                    updateToken(`colors.${key}`, next)
                                  }
                                />
                              ))}
                            </div>
                          ),
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Typography */}
                  <AccordionItem value="typography">
                    <AccordionTrigger>Typography</AccordionTrigger>
                    <AccordionContent>
                      <div style={stackStyle}>
                        <div>
                          <Label htmlFor="tg-font-display">Display</Label>
                          <Input
                            id="tg-font-display"
                            value={theme.typography.fontDisplay}
                            onChange={(e) =>
                              updateToken('typography.fontDisplay', e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tg-font-body">Body</Label>
                          <Input
                            id="tg-font-body"
                            value={theme.typography.fontBody}
                            onChange={(e) =>
                              updateToken('typography.fontBody', e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tg-font-mono">Mono</Label>
                          <Input
                            id="tg-font-mono"
                            value={theme.typography.fontMono}
                            onChange={(e) =>
                              updateToken('typography.fontMono', e.target.value)
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
                                  updateToken(`typography.sizes.${k}`, n)
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
                                  updateToken(`radius.${k}`, n)
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Shadow */}
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
                                  updateToken(
                                    `shadowMemphis.${k}.x`,
                                    Number(e.target.value),
                                  )
                                }
                              />
                              <Input
                                type="number"
                                aria-label={`${k} offset y`}
                                value={theme.shadowMemphis[k].y}
                                onChange={(e) =>
                                  updateToken(
                                    `shadowMemphis.${k}.y`,
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </div>
                            <ColorPicker
                              id={`cp-sh-${k}`}
                              label={`${k} color`}
                              value={theme.shadowMemphis[k].color}
                              onChange={(next) =>
                                updateToken(`shadowMemphis.${k}.color`, next)
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
                              max={50}
                              step={1}
                              onValueChange={(v) => {
                                const n = v[0]
                                if (typeof n === 'number') {
                                  updateToken(`shadowSoft.${k}`, Number((n / 100).toFixed(2)))
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
                        <Label>
                          Scale · {theme.spacing.scale.toFixed(2)}×
                        </Label>
                        <Slider
                          value={[Math.round(theme.spacing.scale * 100)]}
                          min={50}
                          max={200}
                          step={5}
                          onValueChange={(v) => {
                            const n = v[0]
                            if (typeof n === 'number') {
                              updateToken('spacing.scale', Number((n / 100).toFixed(2)))
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
                                updateToken(
                                  `motion.durations.${k}`,
                                  Number(e.target.value),
                                )
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
                              onValueChange={(v) =>
                                updateToken(`motion.easings.${k}`, v)
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
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>

            <Card variant="default" padding="md">
              <CardBody>
                <div style={stackStyle}>
                  <div>
                    <Label>Preset</Label>
                    <Select value={activePreset} onValueChange={handlePresetChange}>
                      <SelectTrigger aria-label="Preset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(PRESET_LABELS) as Array<PresetName>).map((key) => (
                          <SelectItem key={key} value={key}>
                            {PRESET_LABELS[key]}
                          </SelectItem>
                        ))}
                        {activePreset === 'custom' ? (
                          <SelectItem value="custom" disabled>
                            Custom
                          </SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" onClick={reset} fullWidth>
                    Reset
                  </Button>
                  <Button onClick={() => setExportOpen(true)} fullWidth>
                    Export
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* ─── Preview ─────────────────────────────────── */}
          <div style={previewColStyle}>
            <div style={previewHeaderStyle}>
              <Tabs value={sceneTab} onValueChange={(v) => setSceneTab(v as SceneTab)}>
                <TabsList>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="profile">Profilo</TabsTrigger>
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                </TabsList>
              </Tabs>
              <div style={rowStyle} aria-label="Preview theme toggle">
                <span className="eyebrow">Preview</span>
                <Button
                  size="sm"
                  variant={darkPreview ? 'ghost' : 'primary'}
                  onClick={() => handleThemePreviewChange('light')}
                >
                  Light
                </Button>
                <Button
                  size="sm"
                  variant={darkPreview ? 'primary' : 'ghost'}
                  onClick={() => handleThemePreviewChange('dark')}
                >
                  Dark
                </Button>
              </div>
            </div>
            <div
              data-theme-preview={darkPreview ? 'dark' : 'light'}
              style={{ padding: 32, background: 'var(--bg)' }}
              className="border-2 border-border-memphis"
            >
              {sceneTab === 'gallery' && <GalleryPreview />}
              {sceneTab === 'auth' && <AuthPreview />}
              {sceneTab === 'dashboard' && <DashboardPreview />}
              {sceneTab === 'profile' && <ProfilePreview />}
              {sceneTab === 'feed' && <FeedPreview />}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Export dialog ─────────────────────────────── */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export theme</DialogTitle>
          </DialogHeader>
          <Tabs
            value={exportTab}
            onValueChange={(v) => setExportTab(v as ExportTab)}
            style={gapLgStyle}
          >
            <TabsList>
              <TabsTrigger value="css">CSS vars</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind preset</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="figma">Figma tokens</TabsTrigger>
            </TabsList>
            {(['css', 'tailwind', 'json', 'figma'] as const).map((t) => (
              <TabsContent key={t} value={t}>
                <div style={gapLgStyle}>
                  <pre style={preBoxStyle}>{exports[t]}</pre>
                  <div style={rowStyle}>
                    <Button onClick={() => handleCopy(t)}>
                      {copyState === t ? 'Copiato ✓' : 'Copia'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </Container>
  )
}
