# Tabs

Status: documented · Last scan: 43a7a02 · Sources:
`packages/ui/src/components/tabs/{tabs.tsx,index.ts,tabs.test.tsx}`.

## Summary

Wrapper around `@radix-ui/react-tabs` with a "underlined active tab"
pattern: a 2px Memphis bottom rule across the TabsList, with the
active trigger overlapping a 3px primary bar that visually replaces
the rule for that segment.

## Public API

| Export        | Pass-through to               | Styled? |
| ------------- | ----------------------------- | ------- |
| `Tabs`        | `TabsPrimitive.Root`          | no      |
| `TabsList`    | styled — bottom-bordered row  | yes     |
| `TabsTrigger` | styled — underlined-on-active | yes     |
| `TabsContent` | styled — top-padded content   | yes     |

`Tabs` props are Radix's: `value`, `defaultValue`, `onValueChange`,
`orientation`, `dir`, `activationMode`.

## Internal architecture

### TabsList

```
inline-flex items-center gap-1 border-b-2 border-memphis
```

The 2px Memphis bottom rule spans the full TabsList width. (Earlier
versions used the unresolved `border-b-base` class — fixed in commit
0519728.)

### TabsTrigger

```
inline-flex items-center justify-center px-4 py-2 text-sm font-semibold
text-muted-foreground cursor-pointer relative -mb-[2px]
transition-colors duration-fast
hover:text-foreground
data-[state=active]:text-foreground data-[state=active]:border-b-[3px] data-[state=active]:border-primary
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
disabled:opacity-50 disabled:pointer-events-none
```

The `-mb-[2px]` is **load-bearing**: it shifts the trigger 2px down
so its bottom border overlaps the TabsList's bottom border. When the
trigger is active, its 3px primary bar visually "replaces" the 2px
black rule for that segment (3px primary covers the 2px black behind
it).

With the 2px list border now in place, the math holds: the active
trigger's 3px primary bar covers the 2px black rule for its segment.

### TabsContent

`pt-4 focus-visible:outline-none` — minimal: top padding to separate
from the list, no focus ring (Radix manages focus on the trigger,
not the panel).

## Notes & gotchas

1. **`-mb-[2px]` matters.** Without it, the active bar would sit
   above (not on) the list rule.

2. **No vertical orientation styling.** Radix supports
   `orientation="vertical"` but the lib's classes assume horizontal.
   Vertical tabs need consumer overrides.

3. **No size variant.** `text-sm px-4 py-2` is the only size.

## How to consume (shadcn-style copy)

1. Copy `tabs.tsx` and `index.ts`.
2. Add `@radix-ui/react-tabs` as a runtime dep.

## Open questions

1. No "pill" / "boxed" alternate variant. The underline style is
   the only look.
