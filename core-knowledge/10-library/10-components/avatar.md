# Avatar

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/avatar/{avatar.tsx,index.ts}`.

## Summary

Compound component built on `@radix-ui/react-avatar` plus a hand-rolled
`AvatarGroup` for stacked-overlap displays. 4 exports total. Two visual
axes (`size`, `shape`) on the root, with a fallback that is
inverted-colored display-font text.

## Public API

| Export             | Kind |
|--------------------|------|
| `Avatar`           | `forwardRef<…, AvatarProps>` — Radix Root + cva |
| `AvatarImage`      | `forwardRef<…, AvatarPrimitive.Image props>` — styled image |
| `AvatarFallback`   | `forwardRef<…, AvatarPrimitive.Fallback props>` — styled fallback |
| `AvatarGroup`      | `forwardRef<HTMLDivElement, AvatarGroupProps>` — stacked overlap |

| `AvatarProps`      | Type                                                              | Default |
|--------------------|-------------------------------------------------------------------|---------|
| `size`             | `'sm' \| 'md' \| 'lg' \| 'xl'`                                    | `'md'`  |
| `shape`            | `'circle' \| 'square'`                                            | `'circle'` |
| …Radix             | `ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>`           | —       |

| `AvatarGroupProps` | Type                              | Default |
|--------------------|-----------------------------------|---------|
| `max`              | `number`                          | —       |
| `children`         | `ReactNode`                       | (req)   |
| …native            | `HTMLAttributes<HTMLDivElement>`  | —       |

### Sizes

| Size | Dimensions    | Text  |
|------|---------------|-------|
| `sm` | `h-8 w-8`     | `text-xs`   |
| `md` | `h-10 w-10`   | `text-sm`   |
| `lg` | `h-14 w-14`   | `text-base` |
| `xl` | `h-20 w-20`   | `text-lg`   |

### Shapes

| Shape    | Classes |
|----------|---------|
| `circle` | `rounded-full` |
| `square` | `rounded-none border-2 border-memphis` |

## Internal architecture

### Avatar root (cva)

```
relative inline-flex shrink-0 overflow-hidden items-center justify-center select-none
+ size + shape
```

`overflow-hidden` so the image doesn't bleed past the round/square
clip. `select-none` so dragging the initial doesn't select text.

### AvatarImage

```
aspect-square h-full w-full object-cover
```

Forces square aspect and covers the box. If the source image isn't
square, it's center-cropped.

### AvatarFallback

```
flex h-full w-full items-center justify-center
bg-foreground text-background font-semibold font-display tracking-wide
```

Inverted color slab with display-font text. Shown by Radix when the
image fails to load (or while it's loading, depending on `delayMs`).

### AvatarGroup — stacked overlap

```jsx
<div className="inline-flex items-center -space-x-2">
  {shown.map(child => <div className="ring-2 ring-bg rounded-full">{child}</div>)}
  {restCount > 0 && (
    <div className="ring-2 ring-bg rounded-full">
      <Avatar><AvatarFallback>+{restCount}</AvatarFallback></Avatar>
    </div>
  )}
</div>
```

- `-space-x-2` overlaps each subsequent avatar 8px to the left.
- Each avatar wrapped in a `ring-2 ring-bg` — but ⚠️ **`ring-bg` is
  not a valid token** in the lib's theme.css. Likely intent was
  `ring-background`. See Open questions.
- `max` caps visible avatars; overflow becomes a `+N` fallback
  avatar at the end (always rendered as a circle with
  AvatarFallback's inverted slab).
- `children` is normalized to an array via `Array.isArray` —
  passing a single `<Avatar>` works.

## Notes & gotchas

1. **`ring-bg` likely broken.** No `--color-bg` token in theme.css;
   `ring-bg` doesn't resolve. The intended outline (a ring around
   each avatar matching the page background) probably renders as
   the Tailwind default ring color or nothing. Fix:
   `ring-background`. See Open questions.

2. **AvatarGroup's overflow `+N` is a circle by default.** No way
   to make it match a `square`-shape group; consumers needing
   square groups override.

3. **`AvatarImage` is `aspect-square object-cover`** — non-square
   images get cropped, not letterboxed. Suitable for portraits,
   surprising for logos.

4. **`square` shape adds `border-2 border-memphis`** but `circle`
   does not. Mixed-shape groups will look uneven.

5. **`size: xl`** is 80×80 — uncommonly large. Reserve for hero
   profile blocks.

## How to consume (shadcn-style copy)

1. Copy `avatar.tsx` and `index.ts`.
2. Add `@radix-ui/react-avatar` as a runtime dep.
3. Replace `ring-bg` → `ring-background` (see Open questions).
4. Tokens: `--foreground`, `--background`, `--memphis-border-color`,
   `--font-display`.

## Open questions

1. **`ring-bg` token broken.** Same kind of class-name typo as the
   Tabs `border-b-base`. Easy fix to `ring-background`.
2. **`AvatarGroup` is hand-rolled** — not Radix-backed. Could be
   replaced with a `flex` container expectation in the consumer.
3. **No `status` indicator** (online/offline dot) — common avatar
   feature. Today consumers compose with absolutely-positioned
   children inside the Avatar.
4. **`AvatarImage` vs `AvatarFallback` ordering** is Radix-driven;
   the lib doesn't enforce. Consumers should always render both
   for graceful degradation.
