'use client'

import type { CSSProperties } from 'react'
import type { RadiusKey, ShadowMemphisKey } from './theme-state'

type RadiusChipProps = {
  variant: 'radius'
  tokenKey: RadiusKey
}

type ShadowChipProps = {
  variant: 'shadow-memphis'
  tokenKey: ShadowMemphisKey
}

export type TokenPreviewChipProps = RadiusChipProps | ShadowChipProps

const baseStyle: CSSProperties = {
  display: 'inline-block',
  width: 28,
  height: 28,
  flexShrink: 0,
  boxSizing: 'border-box',
}

function radiusStyle(k: RadiusKey): CSSProperties {
  return {
    ...baseStyle,
    background: 'var(--foreground)',
    borderRadius: `var(--radius-${k})`,
    // Breathing room from the slider track to the chip's right — the
    // 8px first pass still felt like the two read as a single control;
    // 16px gives the chip a clear "preview pane" silhouette of its own.
    marginRight: 16,
    // Pull the chip up to align with the row's title text instead of
    // the row's vertical centre.
    alignSelf: 'flex-start',
    // Vertical gap between the chip's bottom and the slider row that
    // follows. The chip is taller (28px) than the title text, so the
    // header row is sized to the chip — without margin, the chip's
    // bottom edge sits flush with the slider's top, reading as a
    // single welded control again. 8px recovers visual separation.
    marginBottom: 8,
  }
}

function shadowStyle(k: ShadowMemphisKey): CSSProperties {
  // Emitter quirk: the `md` shadow ships under the bare alias `--shadow-memphis`,
  // not `--shadow-memphis-md` (see use-theme-state.ts emitFoundationsVars).
  const cssVar = k === 'md' ? '--shadow-memphis' : `--shadow-memphis-${k}`
  return {
    ...baseStyle,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    boxShadow: `var(${cssVar})`,
    // The chip is 28×28 but its offset shadow extends up to 9px (lg
    // tier) down-right, beyond the flex bounding box. Reserve room so
    // the shadow doesn't bleed into the X/Y input row below or the
    // sidebar's right edge.
    marginRight: 12,
    marginBottom: 12,
  }
}

export function TokenPreviewChip(props: TokenPreviewChipProps) {
  if (props.variant === 'radius') {
    return (
      <span
        data-testid={`token-preview-chip-radius-${props.tokenKey}`}
        aria-label={`Radius preview for ${props.tokenKey}`}
        style={radiusStyle(props.tokenKey)}
      />
    )
  }
  return (
    <span
      data-testid={`token-preview-chip-shadow-memphis-${props.tokenKey}`}
      aria-label={`Shadow preview for memphis ${props.tokenKey}`}
      style={shadowStyle(props.tokenKey)}
    />
  )
}
