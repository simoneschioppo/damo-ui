# AspectRatio

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/aspect-ratio/{aspect-ratio.tsx,index.ts}`.

## Summary

Pure pass-through wrapper around `@radix-ui/react-aspect-ratio`. No
styling, no defaults — only `forwardRef` plumbing. Used to lock a
container to a fixed `width:height` ratio (e.g. media frames, hero
images, video embeds).

## Public API

| Export             | Kind                                                         |
| ------------------ | ------------------------------------------------------------ |
| `AspectRatio`      | `forwardRef<HTMLDivElement, AspectRatioProps>`               |
| `AspectRatioProps` | `ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>` |

Props are exactly Radix's:

- `ratio`: `number` (e.g. `16 / 9`, `1`, `4 / 3`). Default 1 (square).

## Notes

- The lib adds **nothing** beyond Radix. Could be replaced with a
  direct Radix import in shadcn-style distribution.
- Children fill the box; typical pattern is to render an
  `<img>`/`<iframe>` with `className="h-full w-full object-cover"`.

## How to consume (shadcn-style copy)

1. Copy `aspect-ratio.tsx` and `index.ts`.
2. Add `@radix-ui/react-aspect-ratio` as a runtime dep.

Or skip the wrapper entirely and import Radix directly.

## Open questions

1. **Is the wrapper needed?** Adds zero value over `import * as
AspectRatio from '@radix-ui/react-aspect-ratio'`. For
   shadcn-style distribution, dropping the wrapper saves a file
   without losing functionality.
