import { AttrToggleGroup } from './attr-toggle-group'

const TONE_OPTIONS = [
  { value: 'soft', label: 'Soft' },
  { value: 'bold', label: 'Bold' },
  { value: 'mono', label: 'Mono' },
]

const PALETTE_OPTIONS = [
  { value: 'plum', label: 'Plum' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
]

export const Segmented = () => (
  <div style={{ padding: 24 }}>
    <AttrToggleGroup
      label="Tone"
      variant="segmented"
      options={TONE_OPTIONS}
      storageKey="story-attr-tone"
      attribute="data-story-tone"
      defaultValue="soft"
    />
  </div>
)

export const SegmentedNoLabel = () => (
  <div style={{ padding: 24 }}>
    <AttrToggleGroup
      variant="segmented"
      options={TONE_OPTIONS}
      storageKey="story-attr-tone"
      attribute="data-story-tone"
      defaultValue="soft"
    />
  </div>
)

export const SelectVariant = () => (
  <div style={{ padding: 24 }}>
    <AttrToggleGroup
      label="Palette"
      variant="select"
      options={PALETTE_OPTIONS}
      storageKey="story-attr-palette"
      attribute="data-story-palette"
      defaultValue="plum"
    />
  </div>
)

export const TwoSegmentedAxes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
    <AttrToggleGroup
      label="Tone"
      variant="segmented"
      options={TONE_OPTIONS}
      storageKey="story-attr-tone"
      attribute="data-story-tone"
      defaultValue="soft"
    />
    <AttrToggleGroup
      label="Palette"
      variant="select"
      options={PALETTE_OPTIONS}
      storageKey="story-attr-palette"
      attribute="data-story-palette"
      defaultValue="plum"
    />
  </div>
)
