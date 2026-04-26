import { Container } from './container'

const Demo = ({ label }: { label: string }) => (
  <div
    style={{
      padding: 16,
      background: 'var(--brand-100)',
      border: '2px solid var(--memphis-border-color)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
    }}
  >
    {label}
  </div>
)

export const Default = () => (
  <Container>
    <Demo label="default (size=lg, padded=true)" />
  </Container>
)

export const Small = () => (
  <Container size="sm">
    <Demo label="size=sm" />
  </Container>
)

export const XL = () => (
  <Container size="xl">
    <Demo label="size=xl" />
  </Container>
)

export const Full = () => (
  <Container size="full" padded={false}>
    <Demo label="size=full, padded=false" />
  </Container>
)

export const WithPadding = () => (
  <Container size="md" padded>
    <Demo label="size=md, padded" />
  </Container>
)
