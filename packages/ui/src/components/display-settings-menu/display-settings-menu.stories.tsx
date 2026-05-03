import { DisplaySettingsMenu } from './display-settings-menu'

const PALETTE_OPTIONS = [
  { value: 'default', label: 'Plum+Gold' },
  { value: 'neon', label: 'Neon' },
  { value: 'sunset', label: 'Sunset' },
]

export const Default = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
    <DisplaySettingsMenu paletteOptions={PALETTE_OPTIONS} paletteDefaultValue="default" />
  </div>
)

export const CustomLabels = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
    <DisplaySettingsMenu
      paletteOptions={PALETTE_OPTIONS}
      paletteDefaultValue="default"
      triggerLabel="Impostazioni"
      themeLabel="Modalità"
      paletteLabel="Schema colore"
      densityLabel="Spaziatura"
    />
  </div>
)

export const CustomKeys = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
    <DisplaySettingsMenu
      paletteOptions={PALETTE_OPTIONS}
      paletteDefaultValue="default"
      themeStorageKey="story-theme"
      paletteStorageKey="story-palette"
      densityStorageKey="story-density"
      themeAttribute="data-story-theme"
      paletteAttribute="data-story-palette"
      densityAttribute="data-story-density"
    />
  </div>
)
