'use client'

import { useState } from 'react'
import { ColorPicker } from '@damo/ui'

export function ColorPickerBasicExample() {
  const [color, setColor] = useState('#7a3980')
  return <ColorPicker label="Accent" value={color} onChange={setColor} />
}

export function ColorPickerNoInputExample() {
  const [color, setColor] = useState('#d5a845')
  return <ColorPicker label="Accent" value={color} onChange={setColor} showInput={false} />
}

export function ColorPickerNoLabelExample() {
  const [color, setColor] = useState('#16a34a')
  return <ColorPicker label="Background" value={color} onChange={setColor} showLabel={false} />
}
