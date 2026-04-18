import { Badge } from './badge'

export const Variants = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Badge>Default</Badge>
    <Badge variant="featured">NEW</Badge>
  </div>
)

export const Usage = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <span>Messaggi</span>
    <Badge>12</Badge>
    <span>Offerte</span>
    <Badge variant="featured">HOT</Badge>
  </div>
)
