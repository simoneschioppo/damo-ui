import { Input } from './input'

export const Basic = () => (
  <div style={{ width: 280 }}>
    <Input placeholder="your@email.com" />
  </div>
)

export const Types = () => (
  <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Input type="text" placeholder="text" />
    <Input type="email" placeholder="email" />
    <Input type="password" placeholder="password" />
    <Input type="number" placeholder="number" />
    <Input type="search" placeholder="search" />
  </div>
)

export const States = () => (
  <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Input placeholder="default" />
    <Input placeholder="disabled" disabled />
    <Input placeholder="invalid" invalid defaultValue="bad@@@" />
    <Input placeholder="readonly" readOnly defaultValue="readonly value" />
  </div>
)
