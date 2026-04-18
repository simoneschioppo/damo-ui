import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from '../label/label'

export const Basic = () => (
  <RadioGroup defaultValue="easy">
    {(['easy', 'normal', 'rage'] as const).map((v) => (
      <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RadioGroupItem value={v} id={`diff-${v}`} />
        <Label htmlFor={`diff-${v}`}>{v}</Label>
      </div>
    ))}
  </RadioGroup>
)

export const Disabled = () => (
  <RadioGroup defaultValue="a">
    {(['a', 'b', 'c'] as const).map((v) => (
      <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RadioGroupItem value={v} id={`rd-${v}`} disabled={v === 'b'} />
        <Label htmlFor={`rd-${v}`}>
          Option {v.toUpperCase()} {v === 'b' && '(disabled)'}
        </Label>
      </div>
    ))}
  </RadioGroup>
)
