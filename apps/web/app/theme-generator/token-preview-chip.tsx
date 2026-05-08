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
