import { Skeleton } from './skeleton'

export const Line = () => <Skeleton style={{ height: 16, width: 280 }} />

export const Card = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
    <Skeleton style={{ height: 160, width: '100%' }} />
    <Skeleton style={{ height: 20, width: '60%' }} />
    <Skeleton style={{ height: 16, width: '80%' }} />
    <Skeleton style={{ height: 16, width: '40%' }} />
  </div>
)

export const List = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton style={{ height: 40, width: 40, borderRadius: 'var(--radius-full)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton style={{ height: 14, width: '70%' }} />
          <Skeleton style={{ height: 12, width: '50%' }} />
        </div>
      </div>
    ))}
  </div>
)
