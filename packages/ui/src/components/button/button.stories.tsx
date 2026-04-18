import { Button } from './button'
import { PlayIcon, ArrowRightIcon, TrashIcon, CogIcon } from '../../icons'

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
    <Button variant="primary">Primary</Button>
    <Button variant="accent">Accent</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
    <Button variant="link">Link</Button>
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Settings">
      <CogIcon size={20} />
    </Button>
  </div>
)

export const WithIcon = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <Button>
      <PlayIcon size={18} /> Gioca
    </Button>
    <Button variant="ghost">
      Continua <ArrowRightIcon size={18} />
    </Button>
    <Button variant="danger">
      <TrashIcon size={18} /> Elimina
    </Button>
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    <Button disabled>Primary</Button>
    <Button variant="accent" disabled>
      Accent
    </Button>
    <Button variant="ghost" disabled>
      Ghost
    </Button>
    <Button variant="link" disabled>
      Link
    </Button>
  </div>
)

export const FullWidth = () => (
  <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Button fullWidth>Full width primary</Button>
    <Button variant="ghost" fullWidth>
      Full width ghost
    </Button>
  </div>
)

export const AllStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <section>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 8 }}>
        PRIMARY · hover, active, focus
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button>Default</Button>
        <Button>Hover me</Button>
        <Button>Click me</Button>
      </div>
    </section>
    <section>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 8 }}>
        GHOST · hover
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="ghost">Default</Button>
        <Button variant="ghost">Hover me</Button>
      </div>
    </section>
  </div>
)
