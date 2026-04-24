import { Stat } from './stat'
import { TrophyIcon, TargetIcon, ClockIcon } from '../../icons'

export const Basic = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, width: 600 }}>
    <Stat label="Utenti attivi" value="1842" delta="+42 questa settimana" deltaTone="positive" />
    <Stat
      label="Conversioni"
      value="72"
      delta="70% rate"
      deltaTone="neutral"
      icon={<TrophyIcon size={14} />}
    />
    <Stat
      label="Tempo medio"
      value="4:12"
      delta="-18s"
      deltaTone="positive"
      icon={<ClockIcon size={14} />}
    />
  </div>
)

export const WithNegativeDelta = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, width: 400 }}>
    <Stat label="Errori" value="31" delta="+5 vs scorsa settimana" deltaTone="negative" />
    <Stat label="Pending" value="8" delta="stable" deltaTone="neutral" />
  </div>
)

export const LargeNumbers = () => (
  <div style={{ display: 'flex', gap: 32 }}>
    <Stat label="Eventi totali" value="12,847" />
    <Stat label="Interazioni" value="428K" icon={<TargetIcon size={14} />} />
  </div>
)
