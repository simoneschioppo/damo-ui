# Accordion

Status: documented · Last scan: d63afaf · Sources:
`packages/ui/src/components/accordion/{accordion.tsx,index.ts}`.

## Summary

Wrapper around `@radix-ui/react-accordion`. 4 exports following Radix's
shape (Root / Item / Trigger / Content). Subdued visual treatment —
1px bottom border between items, no Memphis chrome on the panel
itself. The trigger uses a chevron that **rotates 180° when its
section is open** via a CSS-only transform.

## Public API

| Export             | Pass-through to                            | Styled? |
| ------------------ | ------------------------------------------ | ------- |
| `Accordion`        | `AccordionPrimitive.Root`                  | no      |
| `AccordionItem`    | styled — bottom border per item            | yes     |
| `AccordionTrigger` | styled — flex header with rotating chevron | yes     |
| `AccordionContent` | styled — animated panel                    | yes     |

`Accordion` props are Radix's: `type` (`single` | `multiple`),
`value`, `defaultValue`, `onValueChange`, `collapsible`, `disabled`,
`dir`, `orientation`.

## Internal architecture

### AccordionItem

```
border-b border-border
```

Single soft 1px bottom rule. No background, no padding — items
stack visually as separated rows.

### AccordionTrigger

Wrapped in `<AccordionPrimitive.Header className="flex">` (the
`<h3>` per Radix; flex so the trigger fills the row).

```
flex flex-1 items-center justify-between py-4 text-left
font-semibold text-base text-foreground
transition-colors duration-fast cursor-pointer
hover:text-primary
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring
[&[data-state=open]>svg]:rotate-180
```

The trigger renders `{children}` followed by a `<ChevronDownIcon />`.
The selector `[&[data-state=open]>svg]:rotate-180` targets the SVG
descendant when the trigger has `data-state=open`, rotating it
180° (chevron-up). The chevron itself has `transition-transform
duration-base ease-memphis` so the rotation is smooth.

### AccordionContent

```
overflow-hidden text-sm text-muted-foreground
data-[state=open]:animate-in data-[state=open]:fade-in-0
data-[state=closed]:animate-out data-[state=closed]:fade-out-0
```

Inner `<div className="pb-4 pt-0">{children}</div>` provides bottom
padding. Without `overflow-hidden`, Radix's height animation would
clip awkwardly.

⚠️ Animation classes (`animate-in`, `fade-in-0`, `animate-out`,
`fade-out-0`) require `tailwindcss-animate` — see Dialog chapter
Open question 2.

## Notes & gotchas

1. **No Memphis chrome** — Accordion is the lib's quietest list
   primitive. Don't add Memphis styling without evaluating the visual
   density of long lists.

2. **`hover:text-primary`** on the trigger — primary color hover
   instead of `text-foreground` (which is the active state). Reads
   as "this is interactive (primary)" rather than "this is now
   active".

3. **`type="single" collapsible={false}`** is the strict-radio mode
   — one open at a time, must always have one open. Combine
   `type="single" collapsible={true}` for "one open at most"
   (the typical FAQ pattern).

4. **The chevron is rendered inside the trigger**, not as a separate
   slot. Custom indicators require overriding the whole trigger.

5. **No padding on AccordionItem** itself — only on the trigger
   (`py-4`) and content (`pb-4`). For a card-like accordion, wrap
   the whole thing.

6. **`overflow-hidden` on Content is mandatory** for the Radix
   height animation to clip properly.

## How to consume (shadcn-style copy)

1. Copy `accordion.tsx` and `index.ts`.
2. Add `@radix-ui/react-accordion` + `tailwindcss-animate`.
3. Replace `ChevronDownIcon` import.
4. Tokens: `--border`, `--foreground`, `--primary`,
   `--muted-foreground`.

## Open questions

1. **No height animation, only fade.** Radix exposes
   `--radix-accordion-content-height` for height animations; the
   lib uses fade only. A "smooth slide" mode is a common request.
2. Inherits the lib-wide `tailwindcss-animate` open question.
3. **Chevron is fixed.** No "plus/minus" alternative indicator;
   consumers replacing need to fork the trigger.
