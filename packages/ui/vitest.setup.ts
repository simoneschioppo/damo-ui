import '@testing-library/jest-dom/vitest'

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
