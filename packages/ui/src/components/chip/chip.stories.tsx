import { Chip } from './chip'

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    <Chip>Default</Chip>
    <Chip variant="accent">Accent</Chip>
    <Chip variant="brand">Brand</Chip>
    <Chip variant="success">Win</Chip>
    <Chip variant="danger">Loss</Chip>
    <Chip variant="warning">Draw</Chip>
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <Chip size="sm">Small</Chip>
    <Chip>Medium</Chip>
    <Chip size="lg">Large</Chip>
  </div>
)
