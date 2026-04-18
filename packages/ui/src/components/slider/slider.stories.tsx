import { useState } from 'react'
import { Slider } from './slider'
import { Label } from '../label/label'

export const Basic = () => (
  <div style={{ width: 320 }}>
    <Slider defaultValue={[50]} min={0} max={100} />
  </div>
)

export const WithValue = () => {
  const [value, setValue] = useState([35])
  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Label>Volume: {value[0]}</Label>
      <Slider value={value} onValueChange={setValue} min={0} max={100} />
    </div>
  )
}

export const Range = () => (
  <div style={{ width: 320 }}>
    <Slider defaultValue={[20, 80]} min={0} max={100} />
  </div>
)

export const Steps = () => (
  <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <Label>Step = 10</Label>
    <Slider defaultValue={[50]} min={0} max={100} step={10} />
  </div>
)

export const Disabled = () => (
  <div style={{ width: 320 }}>
    <Slider defaultValue={[50]} min={0} max={100} disabled />
  </div>
)

export const Vertical = () => (
  <div style={{ height: 200 }}>
    <Slider defaultValue={[50]} orientation="vertical" min={0} max={100} />
  </div>
)
