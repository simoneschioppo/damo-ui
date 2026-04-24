import { Spinner } from './spinner'

export const Basic = () => <Spinner />

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    {[16, 20, 28, 40, 64].map((s) => (
      <Spinner key={s} size={s} />
    ))}
  </div>
)

export const Colors = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Spinner size={32} style={{ color: 'var(--plum-500)' }} />
    <Spinner size={32} style={{ color: 'var(--gold-500)' }} />
    <Spinner size={32} style={{ color: 'var(--destructive)' }} />
    <Spinner size={32} style={{ color: 'var(--success)' }} />
  </div>
)
