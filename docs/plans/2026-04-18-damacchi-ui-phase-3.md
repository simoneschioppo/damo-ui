# Damacchi UI — Implementation Plan — Phase 3 Foundations

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Implementare le Foundations Tier 3 della lib: Icon system (~30 icone), Box (layout primitive), Container, AspectRatio, ScrollArea, Separator, Ornament, FormField. Esposte via barrel + Ladle stories + showcase nel playground.

**Architecture:** Ogni componente una cartella con `*.tsx`, `*.variants.ts` (CVA se ha varianti), `*.stories.tsx` (Ladle), `index.ts`. Componenti Radix-based (AspectRatio, ScrollArea, Separator) wrappano le primitive. Box è custom con CVA. FormField è TDD (ha logica di validazione display).

**Tech Stack:** Radix primitives aggiuntivi (`@radix-ui/react-aspect-ratio`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`).

**Rif. spec:** `docs/specs/2026-04-18-damacchi-ui-design.md` sezioni 3 (Memphis Tier 3), 10 (Inventory), 11 (Testing).

---

## File Structure

```
packages/ui/src/
├─ icons/
│  ├─ Icon.tsx              ← generic wrapper con prop size/className
│  ├─ crown.tsx · pawn.tsx · ... (~30 single-icon components)
│  └─ index.ts              ← barrel
├─ components/
│  ├─ box/
│  │  ├─ box.tsx · box.variants.ts · box.stories.tsx · index.ts
│  ├─ container/
│  │  ├─ container.tsx · container.stories.tsx · index.ts
│  ├─ aspect-ratio/
│  │  ├─ aspect-ratio.tsx · aspect-ratio.stories.tsx · index.ts
│  ├─ scroll-area/
│  │  ├─ scroll-area.tsx · scroll-area.stories.tsx · index.ts
│  ├─ separator/
│  │  ├─ separator.tsx · separator.stories.tsx · index.ts
│  ├─ ornament/
│  │  ├─ ornament.tsx · ornament.stories.tsx · index.ts
│  └─ form-field/
│     ├─ form-field.tsx · form-field.test.tsx · form-field.stories.tsx · index.ts
└─ index.ts                 ← export barrel aggiornato
```

Deps da installare: `@radix-ui/react-aspect-ratio`, `@radix-ui/react-scroll-area`, `@radix-ui/react-separator`.

---

## Task 1: Icon wrapper + prima wave (15 icone core)

**Files:**
- Create: `packages/ui/src/icons/Icon.tsx`
- Create: `packages/ui/src/icons/{home,search,close,check,plus,minus,menu,chevron-up,chevron-down,chevron-left,chevron-right,crown,pawn,trophy,user}.tsx`

- [ ] **Step 1: `Icon.tsx` generic wrapper**

```tsx
import { forwardRef, type SVGProps } from 'react'
import { cn } from '../lib/cn'

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size = 20, className, children, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={cn('inline-block', className)}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
})
```

- [ ] **Step 2: 15 icone (home, search, close, check, plus, minus, menu, chevron-up/down/left/right, crown, pawn, trophy, user)**

Ogni file: componente minimal che rende `<Icon>...</Icon>` con i path SVG corretti.

Esempio `home.tsx`:
```tsx
import { Icon, type IconProps } from './Icon'

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10.5V20h13V10.5" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  )
}
```

Commit: `feat(ui): add Icon wrapper + 15 core icons`

## Task 2: 15 extended icons

**Files:**
- Create: `packages/ui/src/icons/{heart,star,bolt,bookmark,info,cog,edit,trash,filter,external-link,arrow-right,play,pause,clock,target}.tsx`
- Create/Update: `packages/ui/src/icons/index.ts` — barrel con tutti i 30+

- [ ] Step 1: scrivere 15 componenti extended
- [ ] Step 2: barrel `icons/index.ts`:

```ts
export { Icon, type IconProps } from './Icon'
export { HomeIcon } from './home'
export { SearchIcon } from './search'
// ... tutti i 30
```

- [ ] Step 3: storie Ladle `icons/icons.stories.tsx` che mostra tutte in griglia

Commit: `feat(ui): complete icon set (30 icons) + barrel + stories`

## Task 3: Box component (CVA)

**Files:**
- Create: `packages/ui/src/components/box/{box.tsx,box.variants.ts,box.stories.tsx,index.ts}`

Box è primitivo di layout: prop `direction` (row/column), `gap`, `align`, `justify`, `wrap`, `as`.

- [ ] Step 1: `box.variants.ts` con CVA
- [ ] Step 2: `box.tsx`
- [ ] Step 3: `box.stories.tsx` con 5-8 story (basic row, column, gap levels, align center, wrap, custom `as`)
- [ ] Step 4: commit

## Task 4: Container component

**Files:**
- Create: `packages/ui/src/components/container/{container.tsx,container.stories.tsx,index.ts}`

Container: wrapper con max-width responsive (`sm/md/lg/xl/full`), padding orizzontale.

## Task 5: AspectRatio (Radix)

Install `@radix-ui/react-aspect-ratio`.

- [ ] Create: `packages/ui/src/components/aspect-ratio/{aspect-ratio.tsx,aspect-ratio.stories.tsx,index.ts}`

Wrapper di `@radix-ui/react-aspect-ratio`, prop `ratio` (es. 16/9).

## Task 6: ScrollArea (Radix + Memphis styling)

Install `@radix-ui/react-scroll-area`.

- [ ] Create: `packages/ui/src/components/scroll-area/{scroll-area.tsx,scroll-area.stories.tsx,index.ts}`

Wrapper con custom scrollbar Memphis (bordo nero + thumb solid).

## Task 7: Separator (Radix)

Install `@radix-ui/react-separator`.

- [ ] Create: `packages/ui/src/components/separator/{separator.tsx,separator.stories.tsx,index.ts}`

Wrapper di Radix Separator con varianti: `orientation` (horizontal/vertical), `variant` (solid/dashed/memphis-double).

## Task 8: Ornament (custom)

Divisore decorativo con SVG centrato tra due linee sfumate (preso dal DS esistente).

- [ ] Create: `packages/ui/src/components/ornament/{ornament.tsx,ornament.stories.tsx,index.ts}`

## Task 9: FormField (TDD)

Componente con logica: combina Label + input slot + error message + description. Gestisce `aria-describedby`, `aria-invalid`.

**Test cases (scritti PRIMA):**
- renders label and children (input slot)
- renders description when provided
- renders error and sets aria-invalid
- generates unique id and wires label htmlFor
- accepts a custom id
- aria-describedby includes description id when description provided
- aria-describedby includes error id when error provided
- aria-describedby combines both when both provided

- [ ] Step 1: `form-field.test.tsx` FIRST
- [ ] Step 2: Verify FAIL
- [ ] Step 3: `form-field.tsx` implement
- [ ] Step 4: Verify PASS
- [ ] Step 5: `form-field.stories.tsx`
- [ ] Step 6: commit

## Task 10: Barrel + Playground showcase + push + CI

- [ ] Update `packages/ui/src/index.ts` — esporta tutte le foundations
- [ ] Create playground page `app/components/foundations/page.tsx` con grid di tutti i componenti
- [ ] Aggiornare la home del playground per linkare `/components/foundations`
- [ ] Run all tests + build locally
- [ ] Push
- [ ] Attendere CI verde

---

## Self-review checklist

- [ ] `pnpm test` — tutti i test passano (7 cn + 5 usePersistedAttr + 8 FormField = 20)
- [ ] `pnpm build` — success
- [ ] `pnpm typecheck` — clean su ui e playground
- [ ] `pnpm dev` — Ladle mostra 30+ icone, 7 componenti con stories
- [ ] Playground `/components/foundations` renderizza tutti i componenti
- [ ] CI verde
