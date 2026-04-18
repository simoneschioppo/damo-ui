import { Textarea } from './textarea'

export const Basic = () => (
  <div style={{ width: 360 }}>
    <Textarea placeholder="Racconta la tua strategia…" />
  </div>
)

export const Disabled = () => (
  <div style={{ width: 360 }}>
    <Textarea disabled defaultValue="Campo disattivato." />
  </div>
)

export const Invalid = () => (
  <div style={{ width: 360 }}>
    <Textarea invalid defaultValue="troppo corto" />
  </div>
)
