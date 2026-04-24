import { useState } from 'react'
import { SegmentedControl, SegmentedControlItem } from './segmented-control'

export const Basic = () => (
  <SegmentedControl defaultValue="normal" aria-label="Density">
    <SegmentedControlItem value="compact">Compact</SegmentedControlItem>
    <SegmentedControlItem value="normal">Normal</SegmentedControlItem>
    <SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
  </SegmentedControl>
)

export const Controlled = () => {
  const [v, setV] = useState('md')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
        Current: {v}
      </span>
      <SegmentedControl value={v} onValueChange={(val) => val && setV(val)} aria-label="Size">
        <SegmentedControlItem value="sm">SM</SegmentedControlItem>
        <SegmentedControlItem value="md">MD</SegmentedControlItem>
        <SegmentedControlItem value="lg">LG</SegmentedControlItem>
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
