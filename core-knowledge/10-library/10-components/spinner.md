# Spinner

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/spinner/{spinner.tsx,index.ts}`.

## Summary

Inline SVG spinner with a CSS-only `animate-spin` (Tailwind native).
Two-arc design: a faint full ring (opacity 0.25) plus a quarter-arc
that visually conveys rotation. Color follows `currentColor` and
defaults to `text-primary`.

## Public API

| Export        | Kind |
|---------------|------|
| `Spinner`     | `forwardRef<SVGSVGElement, SpinnerProps>` |
| `SpinnerProps`| `SVGProps<SVGSVGElement> & { size?: number \| string; label?: string }` |

| Prop      | Type                  | Default          |
|-----------|-----------------------|------------------|
| `size`    | `number \| string`    | `20`             |
| `label`   | `string`              | `'Caricamento…'` |
| `className`| `string`             | —                |
| …native   | `SVGProps<SVGSVGElement>` | —              |

The `label` is exposed as `aria-label` on the SVG; `role="status"` is
also set so assistive tech announces the loading state.

## Notes

- Default label is **Italian** (`'Caricamento…'`) — the only
  user-facing string in the lib's component surface that ships with
  an Italian default. Worth either flipping to English (lib default)
  or making the API explicit-required (no default). See Open
  questions.
- `text-primary` is the default color via `currentColor` — pass
  `className="text-…"` to recolor.
- `width`/`height` are set both as SVG attributes (from `size`) for
  the intrinsic box and via class for layout — the SVG attrs are the
  source of truth.

## How to consume (shadcn-style copy)

Single file. No deps beyond `cn`. The `animate-spin` keyframe is
provided by Tailwind (it's a built-in utility).

## Open questions

1. **Italian default `label`.** The library otherwise ships
   English-only defaults (`'Toggle'`, `'Close'`, etc.). This default
   should either be `'Loading…'` or be removed (force the consumer
   to pass `label`). i18n leakage in defaults is a mild smell.
2. No `variant` for color (e.g. `intent="success" | "destructive"`).
   Consumers recolor via `className`, which is fine but means
   "destructive spinner" is a visual recipe, not an API.
