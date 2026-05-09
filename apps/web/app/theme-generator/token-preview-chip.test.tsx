import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TokenPreviewChip } from './token-preview-chip'
import type { RadiusKey, ShadowMemphisKey } from './theme-state'

/**
 * Issue #64 — sidebar controls for `--radius-sm`, `--radius-selection`,
 * and `--shadow-memphis-card` had no consumer in the default `components`
 * preview scene. Pattern C: each radius and shadow-memphis sidebar
 * control gets an inline preview chip that reads the live CSS variable,
 * so users see immediate feedback as they edit.
 */

// `satisfies Record<Key, true>` makes TypeScript fail compile if the union
// gains a new key and this map isn't updated — keeps tests in lockstep.
const RADIUS_KEYS_MAP = {
  none: true,
  sm: true,
  md: true,
  selection: true,
  pill: true,
  full: true,
} as const satisfies Record<RadiusKey, true>

const SHADOW_KEYS_MAP = {
  sm: true,
  card: true,
  md: true,
  lg: true,
  hover: true,
  active: true,
} as const satisfies Record<ShadowMemphisKey, true>

const ALL_RADIUS_KEYS = Object.keys(RADIUS_KEYS_MAP) as ReadonlyArray<RadiusKey>
const ALL_SHADOW_KEYS = Object.keys(SHADOW_KEYS_MAP) as ReadonlyArray<ShadowMemphisKey>

describe('TokenPreviewChip — issue #64', () => {
  it('radius variant applies var(--radius-{k}) inline', () => {
    const { getByTestId } = render(<TokenPreviewChip variant="radius" tokenKey="sm" />)
    const el = getByTestId('token-preview-chip-radius-sm')
    expect(el.style.borderRadius).toBe('var(--radius-sm)')
  })

  it('shadow-memphis variant applies var(--shadow-memphis-{k}) inline', () => {
    const { getByTestId } = render(<TokenPreviewChip variant="shadow-memphis" tokenKey="card" />)
    const el = getByTestId('token-preview-chip-shadow-memphis-card')
    expect(el.style.boxShadow).toBe('var(--shadow-memphis-card)')
  })

  it('shadow-memphis "md" key reads the bare --shadow-memphis (matches emitter alias)', () => {
    // The token emitter at use-theme-state.ts:460 ships `md` under the
    // unsuffixed name `--shadow-memphis` (not `--shadow-memphis-md`). The
    // chip MUST honor that quirk or the `md` preview is silently empty.
    const { getByTestId } = render(<TokenPreviewChip variant="shadow-memphis" tokenKey="md" />)
    const el = getByTestId('token-preview-chip-shadow-memphis-md')
    expect(el.style.boxShadow).toBe('var(--shadow-memphis)')
  })

  it('renders a chip per RadiusKey with stable test ids', () => {
    ALL_RADIUS_KEYS.forEach((k) => {
      const { getByTestId, unmount } = render(<TokenPreviewChip variant="radius" tokenKey={k} />)
      expect(getByTestId(`token-preview-chip-radius-${k}`)).toBeTruthy()
      unmount()
    })
  })

  it('renders a chip per ShadowMemphisKey with stable test ids', () => {
    ALL_SHADOW_KEYS.forEach((k) => {
      const { getByTestId, unmount } = render(
        <TokenPreviewChip variant="shadow-memphis" tokenKey={k} />,
      )
      expect(getByTestId(`token-preview-chip-shadow-memphis-${k}`)).toBeTruthy()
      unmount()
    })
  })

  it('exposes a non-empty aria-label naming the token', () => {
    const { getByTestId } = render(<TokenPreviewChip variant="radius" tokenKey="selection" />)
    const el = getByTestId('token-preview-chip-radius-selection')
    const label = el.getAttribute('aria-label') ?? ''
    expect(label.length).toBeGreaterThan(0)
    expect(label).toMatch(/radius/i)
    expect(label).toMatch(/selection/i)
  })

  it('shadow chip aria-label names the shadow token', () => {
    const { getByTestId } = render(<TokenPreviewChip variant="shadow-memphis" tokenKey="card" />)
    const el = getByTestId('token-preview-chip-shadow-memphis-card')
    const label = el.getAttribute('aria-label') ?? ''
    expect(label).toMatch(/shadow/i)
    expect(label).toMatch(/card/i)
  })

  // Spacing regression — the chip's offset shadow (up to 9px on the lg
  // tier) used to bleed into the X/Y input row below it. Both variants
  // now reserve enough breathing room from neighbouring controls.
  describe('breathing-room margins', () => {
    it('shadow chip reserves room for the largest tier offset (12×12)', () => {
      const { getByTestId } = render(<TokenPreviewChip variant="shadow-memphis" tokenKey="lg" />)
      const el = getByTestId('token-preview-chip-shadow-memphis-lg')
      expect(el.style.marginRight).toBe('12px')
      expect(el.style.marginBottom).toBe('12px')
    })

    it('radius chip has horizontal breathing room from the slider/input', () => {
      const { getByTestId } = render(<TokenPreviewChip variant="radius" tokenKey="sm" />)
      const el = getByTestId('token-preview-chip-radius-sm')
      expect(el.style.marginRight).toBe('16px')
    })

    it('radius chip aligns to the top of its header row (not the centre)', () => {
      const { getByTestId } = render(<TokenPreviewChip variant="radius" tokenKey="sm" />)
      const el = getByTestId('token-preview-chip-radius-sm')
      expect(el.style.alignSelf).toBe('flex-start')
    })

    it('radius chip has bottom margin so it does not weld to the slider below', () => {
      const { getByTestId } = render(<TokenPreviewChip variant="radius" tokenKey="sm" />)
      const el = getByTestId('token-preview-chip-radius-sm')
      expect(el.style.marginBottom).toBe('8px')
    })
  })
})
