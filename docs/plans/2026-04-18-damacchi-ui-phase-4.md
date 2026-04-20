# Damo UI — Implementation Plan — Phase 4 Tier 1 Core

> Use superpowers:subagent-driven-development.

**Goal:** Implementare i componenti Tier 1 Memphis (hard): Button, IconButton, Card (5 varianti), Dialog, AlertDialog, Drawer, Banner. Questi incarnano il signature Memphis: bordo 2px nero + shadow offset 4px + micro-interazione click fisico.

**Architecture:** Ogni componente una cartella con `*.tsx`, `*.variants.ts` (CVA), `*.stories.tsx`, `*.test.tsx` se ha logica. Componenti Radix-based (Dialog, AlertDialog, Drawer) wrappano le primitive stilizzandole Memphis. Button è il componente signature.

**Tech Stack:** Radix aggiuntivi: `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`. Drawer usa Radix Dialog con content positioning laterale.

**Pattern di applicazione Memphis (Tier 1):**

```
base: border-base border-border-memphis shadow-memphis rounded-none
      transition-[transform,box-shadow] duration-snap
hover: -translate-x-px -translate-y-px shadow-m-hover
active: translate-x-[3px] translate-y-[3px] shadow-m-active
focus-visible: outline outline-2 outline-offset-2 outline-ring
disabled: opacity-50 pointer-events-none
```

---

## Task 1: Button

CVA con:

- `variant`: primary | accent | ghost | danger | link
- `size`: sm | md | lg | icon
- `fullWidth`: boolean

Memphis signature su tutte le variant tranne `link` (no border, no shadow).

Files: `packages/ui/src/components/button/{button.tsx,button.variants.ts,button.stories.tsx,index.ts}`.

## Task 2: IconButton

Variant di Button con `size="icon"` e accetta `icon` prop + `aria-label`. Wrapper sottile o riuso Button con preset.

Files: `packages/ui/src/components/icon-button/{icon-button.tsx,index.ts,icon-button.stories.tsx}`.

## Task 3: Card (5 varianti)

- `default` Tier 1 — bordo + shadow + radius
- `elevated` Tier 1 — shadow più grande
- `featured` Tier 1 — accent border + oro shadow
- `interactive` Tier 1 — hover/active/focus feedback
- `dark` Tier 2 — bordo 1px, shadow soft, superficie scura

Files: `packages/ui/src/components/card/{card.tsx,card.variants.ts,card.stories.tsx,index.ts}`.

## Task 4: Dialog (Radix)

Install `@radix-ui/react-dialog`.

Wrappers per Root/Trigger/Content/Title/Description/Close/Overlay. Content = Card Memphis centrata.

Files: `packages/ui/src/components/dialog/{dialog.tsx,dialog.stories.tsx,index.ts}`.

## Task 5: AlertDialog (Radix)

Install `@radix-ui/react-alert-dialog`.

Simile a Dialog ma con `Action` + `Cancel` buttons semantici. Variant `danger` per azioni distruttive.

Files: `packages/ui/src/components/alert-dialog/{alert-dialog.tsx,alert-dialog.stories.tsx,index.ts}`.

## Task 6: Drawer / Sheet

Usa Radix Dialog con content posizionato lateralmente (left/right/top/bottom).

Files: `packages/ui/src/components/drawer/{drawer.tsx,drawer.stories.tsx,index.ts}`.

## Task 7: Banner / Alert

CVA con `variant` (info/success/warning/danger/rage) + `dismissible` + icona. Full Memphis signature.

Files: `packages/ui/src/components/banner/{banner.tsx,banner.variants.ts,banner.stories.tsx,index.ts}`.

## Task 8: Barrel + playground showcase `/components/tier1` + e2e + push

Aggiorna `packages/ui/src/index.ts`. Crea page playground che mostra tutti i Tier 1 componenti. E2E smoke test per apertura Dialog + AlertDialog + Drawer + click Button.

---

## Self-review

- [ ] Pattern Memphis applicato consistentemente su tutti i Tier 1
- [ ] Varianti `link` (Button) e `dark` (Card) degradano correttamente a Tier 2
- [ ] Focus ring visibile su tutti i componenti interattivi
- [ ] CI verde
- [ ] E2E test per Dialog/AlertDialog/Drawer aperti correttamente
