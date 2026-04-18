import { Checkbox } from './checkbox'
import { Label } from '../label/label'

export const Basic = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Checkbox id="cb1" />
    <Label htmlFor="cb1">Accetto i termini</Label>
  </div>
)

export const Checked = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Checkbox id="cb2" defaultChecked />
    <Label htmlFor="cb2">Già accettato</Label>
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox id="cb3" disabled />
      <Label htmlFor="cb3">Disabled non checked</Label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox id="cb4" disabled defaultChecked />
      <Label htmlFor="cb4">Disabled checked</Label>
    </div>
  </div>
)
