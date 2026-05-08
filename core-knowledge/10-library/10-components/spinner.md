# Spinner

Status: documented · Last scan: 27c8471 · Sources:
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
| `label`   | `string`              | _resolved from `useI18n().spinner.label`_ |
| `className`| `string`             | —                |
| …native   | `SVGProps<SVGSVGElement>` | —              |

The `label` is exposed as `aria-label` on the SVG; `role="status"` is
also set so assistive tech announces the loading state.

## Notes

- **Locale-aware default.** When no `label` prop is passed, the
  component reads from `useI18n().spinner.label`. Bare trees (no
  `<I18nProvider>` mounted) fall back to the **English** dictionary
  (`'Loading…'`); under `<I18nProvider locale="it">` it resolves to
  `'Caricamento…'`. Caller-passed `label` always wins over the
  dictionary. See [16-i18n.md](../16-i18n.md) for the provider
  contract.
- `text-primary` is the default color via `currentColor` — pass
  `className="text-…"` to recolor.
- `width`/`height` are set both as SVG attributes (from `size`) for
  the intrinsic box and via class for layout — the SVG attrs are the
  source of truth.

## How to consume (shadcn-style copy)

Single file. The `animate-spin` keyframe is provided by Tailwind. The
default label resolution depends on `useI18n` from `lib/i18n/`. A
copy-paste consumer who lifts only this file should either pass
`label` explicitly or also lift `lib/i18n/` (or stub `useI18n` to
return a static dictionary).

## Open questions

1. No `variant` for color (e.g. `intent="success" | "destructive"`).
   Consumers recolor via `className`, which is fine but means
   "destructive spinner" is a visual recipe, not an API.

(The previous "Italian default label" open question was resolved by
PR #69: the lib now ships an i18n dictionary with EN as default.)
