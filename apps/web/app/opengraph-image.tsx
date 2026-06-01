import { ImageResponse } from 'next/og'

// Social preview card (Open Graph / Twitter). Memphis-flavoured: a white card
// with a thick black border + offset purple shadow on a tinted background.
// Plain colours/text only (no external fonts/images) so it renders reliably.

export const alt = 'damo-ui — Memphis-inspired React components you copy & own'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        background: '#f3ecfb',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          border: '8px solid #111111',
          boxShadow: '18px 18px 0 #7a3980',
          padding: '56px 64px',
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, color: '#111111', letterSpacing: -2 }}>
          damo-ui
        </div>
        <div style={{ fontSize: 38, color: '#444444', marginTop: 14 }}>
          Memphis-style React components you copy &amp; own
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: '#7a3980',
            marginTop: 40,
            fontFamily: 'monospace',
          }}
        >
          npx damo-ui add button
        </div>
      </div>
    </div>,
    { ...size },
  )
}
