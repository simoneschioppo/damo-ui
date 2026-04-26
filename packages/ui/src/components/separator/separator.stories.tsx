import { Separator } from './separator'

const label = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--muted-foreground)',
}

export const HorizontalSolid = () => (
  <div style={{ width: 300 }}>
    <div style={label}>Above</div>
    <Separator />
    <div style={label}>Below</div>
  </div>
)

export const HorizontalDashed = () => (
  <div style={{ width: 300 }}>
    <div style={label}>Above</div>
    <Separator variant="dashed" />
    <div style={label}>Below</div>
  </div>
)

export const HorizontalMemphis = () => (
  <div style={{ width: 300 }}>
    <div style={label}>Above</div>
    <Separator variant="memphis-double" />
    <div style={label}>Below</div>
  </div>
)

export const VerticalSolid = () => (
  <div style={{ display: 'flex', height: 60, alignItems: 'center', gap: 12 }}>
    <span style={label}>Left</span>
    <Separator orientation="vertical" />
    <span style={label}>Right</span>
  </div>
)

export const VerticalMemphis = () => (
  <div style={{ display: 'flex', height: 60, alignItems: 'center', gap: 12 }}>
    <span style={label}>Left</span>
    <Separator orientation="vertical" variant="memphis-double" />
    <span style={label}>Right</span>
  </div>
)
