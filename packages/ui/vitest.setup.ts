import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'

// Fail the suite on React / Radix runtime warnings that slip through. These
// are normally console.error in development builds (e.g. "Warning: Missing
// Description for DialogContent"). Letting them log silently lets real a11y
// regressions ship; promoting them to test failures forces a fix at the
// source. Consumers can opt out by mocking console.error in their own setup.
//
// The whitelist is intentionally tiny — only entries that the lib cannot
// reasonably suppress (e.g. async act() warnings from Radix internals during
// portal teardown). Extend with caution.
const CONSOLE_ERROR_ALLOWLIST: ReadonlyArray<RegExp> = [
  // Radix portals occasionally log an act() warning on teardown that's
  // benign for the test outcome. Tracked upstream.
  /not wrapped in act\(/,
]

let originalConsoleError: typeof console.error | undefined

beforeEach(() => {
  originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : ''
    if (CONSOLE_ERROR_ALLOWLIST.some((re) => re.test(message))) {
      originalConsoleError?.(...args)
      return
    }
    originalConsoleError?.(...args)
    throw new Error(`Unexpected console.error in test: ${message}`)
  }
})

afterEach(() => {
  if (originalConsoleError) {
    console.error = originalConsoleError
  }
})

// jsdom does not implement ResizeObserver, but several Radix primitives
// (Slider, Select, etc.) rely on it. Provide a minimal no-op shim so tests
// rendering those primitives do not crash.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverShim {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = ResizeObserverShim as unknown as typeof globalThis.ResizeObserver
}

// jsdom lacks PointerEvent capture APIs and scrollIntoView — Radix Select and
// other popover-style primitives call them during open/close and would crash.
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {}
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {}
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }
}
