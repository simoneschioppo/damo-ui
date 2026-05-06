# Container

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/container/{container.tsx,container.variants.ts,index.ts}`.

## Summary

Centered max-width wrapper for page content. Two axes: `size` (caps
max-width using Tailwind's `max-w-screen-*` scale plus `full`) and
`padded` (responsive horizontal padding).

## Public API

| Export        | Kind |
|---------------|------|
| `Container`   | `forwardRef<HTMLDivElement, ContainerProps>` |
| `ContainerProps` | `HTMLAttributes<HTMLDivElement> & ContainerVariants` |

| Prop      | Type                                            | Default |
|-----------|-------------------------------------------------|---------|
| `size`    | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'lg'`  |
| `padded`  | `boolean`                                       | `true`  |
| `className`| `string`                                       | —       |
| …native   | `HTMLAttributes<HTMLDivElement>`                | —       |

### Variants

```
base:   mx-auto w-full
size:   sm  → max-w-screen-sm
        md  → max-w-screen-md
        lg  → max-w-screen-lg
        xl  → max-w-screen-xl
        2xl → max-w-screen-2xl
        full → max-w-none
padded: true → px-4 md:px-6 lg:px-8
```

## Notes

- `size: 'lg'` (default) caps content at Tailwind's `screen-lg`
  breakpoint width (1024px in v3, configurable in v4).
- `padded: true` (default) adds responsive horizontal padding —
  16px on mobile, 24px on md, 32px on lg+.
- For full-bleed sections, pair `size="full" padded={false}`.
- No `as` prop — Container is always `<div>`. Use Box for
  polymorphic.

## How to consume (shadcn-style copy)

Single-folder copy. No external deps. Tailwind only.

## Open questions

1. The `size` scale is tied to Tailwind's screen breakpoints. If
   the consumer customises Tailwind breakpoints, Container's caps
   shift accordingly — usually desirable, occasionally surprising.
2. No vertical padding axis. If a consumer needs `py-*` defaults,
   they add via className.
