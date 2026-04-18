import { Label } from './label'
import { Input } from '../input/input'

export const Basic = () => (
  <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@damacchi.app" />
  </div>
)
