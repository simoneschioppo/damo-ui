import { Ornament } from './ornament'
import { CrownIcon } from '../../icons'

const text = {
  textAlign: 'center' as const,
  fontFamily: 'var(--font-display)',
  fontSize: 32,
  color: 'var(--foreground)',
}

export const Default = () => (
  <div style={{ width: 420 }}>
    <p style={text}>Damo UI</p>
    <Ornament />
    <p style={text}>Design System</p>
  </div>
)

export const CustomGlyph = () => (
  <div style={{ width: 420 }}>
    <p style={text}>Chapter 1</p>
    <Ornament>
      <CrownIcon size={22} />
    </Ornament>
    <p style={text}>Chapter 2</p>
  </div>
)

export const TextGlyph = () => (
  <div style={{ width: 420 }}>
    <p style={text}>Before</p>
    <Ornament>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.22em',
        }}
      >
        ★
      </span>
    </Ornament>
    <p style={text}>After</p>
  </div>
)
