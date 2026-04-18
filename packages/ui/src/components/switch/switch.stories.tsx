import { Switch } from './switch'
import { Label } from '../label/label'

export const Basic = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Switch id="sw1" />
    <Label htmlFor="sw1">Notifiche push</Label>
  </div>
)

export const Checked = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Switch id="sw2" defaultChecked />
    <Label htmlFor="sw2">Già attivo</Label>
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Switch id="sw3" disabled />
      <Label htmlFor="sw3">Disabilitato off</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Switch id="sw4" disabled defaultChecked />
      <Label htmlFor="sw4">Disabilitato on</Label>
    </div>
  </div>
)
