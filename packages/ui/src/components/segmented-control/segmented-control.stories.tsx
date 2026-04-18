import { useState } from 'react'
import { SegmentedControl, SegmentedControlItem } from './segmented-control'

export const Basic = () => (
  <SegmentedControl defaultValue="normal" aria-label="Mode">
    <SegmentedControlItem value="easy">Easy</SegmentedControlItem>
    <SegmentedControlItem value="normal">Normal</SegmentedControlItem>
    <SegmentedControlItem value="rage">Rage</SegmentedControlItem>
  </SegmentedControl>
)

export const Controlled = () => {
  const [v, setV] = useState('classic8')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
        Current: {v}
      </span>
      <SegmentedControl value={v} onValueChange={(val) => val && setV(val)} aria-label="Board mode">
        <SegmentedControlItem value="classic8">8×8</SegmentedControlItem>
        <SegmentedControlItem value="classic10">10×10</SegmentedControlItem>
        <SegmentedControlItem value="rage">Rage</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

export const Vertical = () => (
  <SegmentedControl defaultValue="a" orientation="vertical" aria-label="Vertical">
    <SegmentedControlItem value="a">Option A</SegmentedControlItem>
    <SegmentedControlItem value="b">Option B</SegmentedControlItem>
    <SegmentedControlItem value="c">Option C</SegmentedControlItem>
  </SegmentedControl>
)

export const Disabled = () => (
  <SegmentedControl defaultValue="b" aria-label="With disabled">
    <SegmentedControlItem value="a">A</SegmentedControlItem>
    <SegmentedControlItem value="b">B</SegmentedControlItem>
    <SegmentedControlItem value="c" disabled>
      C (off)
    </SegmentedControlItem>
  </SegmentedControl>
)
