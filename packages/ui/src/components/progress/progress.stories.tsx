import { useEffect, useState } from 'react'
import { Progress } from './progress'

export const Basic = () => (
  <div style={{ width: 320 }}>
    <Progress value={40} />
  </div>
)

export const Levels = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
    {[10, 25, 50, 75, 100].map((v) => (
      <div key={v}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, marginBottom: 4 }}>{v}%</div>
        <Progress value={v} />
      </div>
    ))}
  </div>
)

export const Animated = () => {
  const [v, setV] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setV((x) => (x >= 100 ? 0 : x + 10))
    }, 600)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ width: 320 }}>
      <Progress value={v} />
    </div>
  )
}
