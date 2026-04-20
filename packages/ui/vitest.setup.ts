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
  globalThis.ResizeObserver =
    ResizeObserverShim as unknown as typeof globalThis.ResizeObserver
}

