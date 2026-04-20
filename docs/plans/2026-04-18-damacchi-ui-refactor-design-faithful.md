# Damo UI — Refactor Design-Faithful

**Obiettivo:** portare tutti i componenti + il playground ad essere graficamente identici al design originale in `/Users/simoneschioppo/Documents/damacchi-design/claude-design-system`.

**Riferimenti:** CSS originale in `design-system.css`, `styles.css`, `design-langs.css`, `palettes.css`. JSX originale in `design-system/sections.jsx`.

## Feedback utente (issue da fixare)

1. **Button** — nel design sono FILLED (copper bg + texto bianco), non outline-white. Ghost è outline-white con L-shadow GOLD (non nera).
2. **Colori (DS page)** — non griglia di swatch piccoli: grandi bande orizzontali con hex integrato nel label, titolo scala + descrizione a sinistra/destra.
3. **Tipografia** — differente. Specimen grandi, scala elencata.
4. **Cards** — layout 2x2 con Player/Mode/Info/Content card come varianti dominio.
5. **Select** — dropdown visualmente rotto, si vede il placeholder con overlap.
6. **Badge & Chip** — layout dedicato.
7. **Icone** — tutte 30 in grid con label.
8. **Altri elementi** — inputs/toggle/slider/segmented tutti da allineare al design.

## Decisioni strategiche

### Playground simplification

Tenere SOLO queste route:

- `/` → redirect a `/design-system`
- `/design-system` → unica pagina principale con TUTTE le sezioni
- `/theme-generator` → pagina stile shadcn-studio per generare temi custom

RIMUOVERE queste pagine:

- `/tokens`, `/components/foundations`, `/components/tier1`, `/components/forms`, `/components/feedback`, `/components/navigation`, `/components/data`, `/components/layout`

### TopBar semplificata

Solo:

- Logo DAMACCHI · UI a sinistra
- 2 link: "Design System" + "Theme Generator"
- 2 switcher: Theme (light/dark) + Palette (Plum+Gold/Frost/Circuit)
- Rimosso Density switcher (troppo granulare per main nav)

## Tasks tracciati

- [ ] T1: Cleanup pagine playground + TopBar simplificata
- [ ] T2: Refactor Button a stile design (primary=copper filled, ghost=outline con gold L-shadow, no variant "outline" ridondante)
- [ ] T3: Rewrite DS page — Sezione 01 Colori (bande orizzontali)
- [ ] T4: Rewrite DS page — Sezione 02 Tipografia (specimen + scale)
- [ ] T5: Rewrite DS page — Sezione 03 Bottoni (primary filled con 5 stati + ghost outline con 5 stati + sizes)
- [ ] T6: Rewrite DS page — Sezione 04 Cards (Player/Mode/Info/Content come da design)
- [ ] T7: Rewrite DS page — Sezione 05 Inputs (textfield/select/segmented/toggle/slider)
- [ ] T8: Rewrite DS page — Sezione 06 Badge & Chip
- [ ] T9: Rewrite DS page — Sezione 07 Icone (grid 30)
- [ ] T10: Rewrite DS page — Sezione 08 Avatar & Medaglie
- [ ] T11: Rewrite DS page — Sezione 09 Mascotte Damo (placeholder block)
- [ ] T12: Rewrite DS page — Sezione 10 Pattern Memphis (mostrare i pattern)
- [ ] T13: Rewrite DS page — Sezione 11 Export → Figma (nota tecnica)
- [ ] T14: Fix Select dropdown rendering
- [ ] T15: Fix Toggle visual
- [ ] T16: Implementare Theme Generator page stile shadcn-studio
- [ ] T17: Aggiornare e2e tests (rimuovere spec delle pagine eliminate, aggiungere nuovi spec)
- [ ] T18: Verify CI green + final screenshot confronto

## Note tecniche

- **Stylesheet di riferimento principale:** `design-system.css` nel claude-design-system originale
- **Button filled:** bg copper-500, text white/ink, border 2.5px nero, shadow 4px 4px 0 nero
- **Button ghost:** bg white, text nero, border 2.5px nero, shadow 4px 4px 0 copper-500 (GOLD, non nero)
- **Active state:** translate(3px, 3px), shadow 1px
- **Hover:** translate(-1px, -1px), shadow 5px

## Loop autonomo

Lavoro in tick, ognuno con subagent dispatched su gruppo di task. Fine loop quando CI verde + playground rende come design.
