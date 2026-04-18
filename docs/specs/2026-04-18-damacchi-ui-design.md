# Damacchi UI — Design Spec

**Repo target:** `simoneschioppo/damacchi-ui` (privato, GitHub Packages)
**Data:** 2026-04-18
**Owner:** Simone Schioppo

---

## 1. Obiettivo

Costruire una libreria di componenti UI React, portable come un pacchetto npm privato, che incarna il design language **Memphis** del prodotto Damacchi. La libreria è consumata dall'app principale (Next.js) e deve essere copiabile/installabile come `packages/ui` in un futuro monorepo senza rework.

**Ispirazione tecnica:** shadcn/ui. La customizzazione avviene tramite CSS variables; i componenti sono owned by consumer (copy-paste friendly) ma distribuiti come pacchetto versionato per comodità d'uso tra progetti.

---

## 2. Non-goals

- Internazionalizzazione interna ai componenti (niente i18n library dentro la lib — tutti i testi visibili sono props)
- RTL explicit support (ma uso di `margin-inline-*` dove naturale)
- Supporto browser legacy (IE, Safari <14)
- Animazioni di dominio gioco (Board, pezzi, rage aura): stanno nell'app consumer, non qui
- Componenti di dominio Damacchi (Board, PieceView, HUD, PlayerCard, MoveHistory): stanno nell'app consumer
- Publish pubblico su npm

---

## 3. Design Language — Memphis

Il Memphis è **applicato gerarchicamente** (decision utente: opzione "B").

### 3.1 Le 7 regole costitutive

1. **Bordo nero pieno** `2px solid #000` sui componenti Tier 1.
2. **Shadow offset "hard"** senza blur: `Npx Npx 0 #000` o colore brand.
3. **Micro-interazione "click fisico"**: `default → hover translate(-1,-1) + shadow +1px → active translate(3,3) + shadow 1px`.
4. **Radius quasi zero** di default (`--radius-md: 0`, `--radius-lg: 4px`), override permesso.
5. **Pattern di sfondo** con radial-gradient dots, configurabile on/off.
6. **Palette forte** (Plum + Gold + bianco + nero), no grigi caldi.
7. **Geometrie decorative** (triangoli/rombi/cerchi) come ornamenti.

### 3.2 Sistema a Tier

| Tier | Componenti | Applicazione |
|---|---|---|
| **Tier 1 — Memphis hard** | Button, IconButton, Card (default/elevated/featured/interactive), Dialog, AlertDialog, Drawer, Banner, NavItem attivo, Badge featured | Bordo 2px nero + shadow offset 4px + radius 0 + micro-interazione fisica |
| **Tier 2 — Memphis soft** | Input, Textarea, Checkbox, Radio, Switch, Slider, Select, Combobox, SegmentedControl, DatePicker, Tooltip, Popover, Toast, Progress, Spinner, Skeleton, Chip, Badge default, Tabs, Breadcrumbs, Pagination, DropdownMenu, ContextMenu, Accordion, Avatar, AvatarGroup, Card dark | Bordo 1px soft + radius 4px + focus ring gold, no shadow offset o `shadow-sm` |
| **Tier 3 — Pura struttura** | Typography utilities, Icon, Box (Stack/Flex via props), Container, AspectRatio, ScrollArea, Separator, FormField wrapper, PageHeader, Stat, Ornament, NavItem inattivo, Table rows | Solo tipografia e spacing |

---

## 4. Token System

Tutti i token sono **CSS variables** definite in `src/styles/tokens.css`. I componenti usano **solo token semantici**, mai raw colors.

### 4.1 Raw tokens — palette

**Plum (primario):** `--plum-{100,300,500,700,800,900}`
**Gold (accent):** `--gold-{100,200,300,400,500}`
**Paper (neutri):** `--paper-{50,100,200,300}` + `--white`, `--black`
**Status:** `--success`, `--danger`, `--warning`, `--rage`, `--info`

### 4.2 Semantic tokens (gli alias che i componenti leggono)

```
--bg, --surface, --surface-2
--ink, --ink-soft, --ink-muted
--border, --border-strong, --border-memphis
--accent, --accent-strong
--ring (focus ring)
```

### 4.3 Typography

**Font families:**
- `--font-display` → Audiowide
- `--font-body` → Exo 2
- `--font-mono` → Exo 2 (letter-spacing maggiore)

**Scale Tailwind-style** (sostituisce la scale named del DS attuale):
`text-xs 12 · text-sm 14 · text-base 16 · text-lg 18 · text-xl 20 · text-2xl 24 · text-3xl 32 · text-4xl 40 · text-5xl 48 · text-6xl 64 · text-7xl 80`

Weights: `400 / 500 / 600 / 700 / 800`

Tre classi utility semantiche aggiunte: `.display` (Audiowide, tracking 0.02em), `.mono` (Exo2 tracking 0.04em), `.eyebrow` (mono, 11px, uppercase, tracking 0.22em, color accent).

### 4.4 Radius

```
--radius-none  0        (Memphis default per Tier 1)
--radius-sm    2px
--radius-md    4px      (Tier 2 default)
--radius-lg    8px
--radius-pill  999px
--radius-full  50%
```

### 4.5 Shadow

Il colore del Memphis shadow è una var a sé — così un singolo override cambia tutte le dimensioni (es. sul ghost button si cambia in gold).

```
--shadow-none          none
--shadow-sm            0 1px 2px rgba(0,0,0,0.06)
--shadow-md            0 2px 8px rgba(0,0,0,0.08)
--shadow-lg            0 8px 24px rgba(0,0,0,0.12)

--shadow-memphis-color var(--black)                     ← override per varianti
--shadow-memphis-sm     2px 2px 0 var(--shadow-memphis-color)
--shadow-memphis        4px 4px 0 var(--shadow-memphis-color)   ← signature
--shadow-memphis-lg     6px 6px 0 var(--shadow-memphis-color)
--shadow-memphis-hover  5px 5px 0 var(--shadow-memphis-color)
--shadow-memphis-active 1px 1px 0 var(--shadow-memphis-color)
```

### 4.6 Spacing (4px grid)

`--space-{0,1,2,3,4,5,6,8,10,12,16,20}` → 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80

### 4.7 Border width

`--border-thin 1px`, `--border-base 2px` (Memphis default), `--border-thick 3px`

### 4.8 Motion

```
--duration-snap 80ms · --duration-fast 150ms
--duration-base 200ms · --duration-slow 300ms
--ease-memphis cubic-bezier(.4,1.3,.5,1)
--ease-out cubic-bezier(.2,.9,.3,1)
--ease-in-out cubic-bezier(.4,0,.2,1)
```

### 4.9 Z-index

```
--z-base 0 · --z-dropdown 100 · --z-sticky 200
--z-overlay 500 · --z-modal 1000 · --z-toast 2000 · --z-tooltip 3000
```

### 4.10 Density (hook trasversale)

Tre livelli implementati da subito:

```
[data-density="compact"]     padding/height ridotti (-25%)
[data-density="normal"]      default
[data-density="comfortable"] padding/height aumentati (+25%)
```

Applicato via attribute su `html` o container. Modifica `--density-scale-y` e `--density-scale-x` che ogni componente usa.

### 4.11 Pattern di sfondo (configurabile)

```
--app-pattern-enabled    1 | 0
--app-pattern-color-1 / -2 / -3
--app-pattern-size       140px
```

Applicato via `[data-app-pattern="on|off"]`. Default off, attivabile a livello pagina.

---

## 5. Dark mode e Multi-palette

### 5.1 Dark mode

Strategy: **`data-theme` attribute**.

```
:root, :root[data-theme="light"]  { /* light tokens */ }
:root[data-theme="dark"]          { /* dark tokens */ }
```

I raw tokens restano gli stessi (stessa palette). I **semantic** vengono riassegnati (es. `--bg: --plum-900` in dark).

### 5.2 Multi-palette

Strategy: **`data-palette` attribute**.

```
:root[data-palette="plum-gold"]  { /* default */ }
:root[data-palette="frost"]      { /* blu ghiaccio */ }
:root[data-palette="circuit"]    { /* neon cyber */ }
```

Ogni palette ridefinisce **solo i raw tokens**, i semantici restano costanti.

Combinabile con theme: `[data-theme="dark"][data-palette="circuit"]`.

---

## 6. Accessibility

Target: **WCAG 2.1 AA**.

- Focus visibile: outline `2px var(--ring)` solo su `:focus-visible`
- Contrasto testo ≥ 4.5:1 su tutti i background dei semantic
- Keyboard nav gratis via Radix Primitives
- `aria-*` corretti per ogni componente Radix-based
- `prefers-reduced-motion: reduce` → disabilita `translate` e riduce durations a `0.01ms`

---

## 7. Stati universali dei componenti

Ogni componente input/action gestisce: `default · hover · focus · focus-visible · active · disabled · loading · readonly · invalid`.

Pattern Memphis (Tier 1):

```css
.btn {
  border: var(--border-base) solid var(--border-memphis);
  box-shadow: var(--shadow-memphis);
  border-radius: var(--radius-none);
  transition: transform var(--duration-snap), box-shadow var(--duration-snap);
}
.btn:hover         { transform: translate(-1px,-1px); box-shadow: var(--shadow-memphis-hover); }
.btn:active        { transform: translate(3px,3px);   box-shadow: var(--shadow-memphis-active); }
.btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
.btn[disabled] { opacity: 0.5; pointer-events: none; }
```

---

## 8. Architettura del pacchetto

### 8.1 Folder structure

Il repo è un **pnpm workspace monorepo leggero**: la lib `@damacchi/ui` è l'unico pacchetto pubblicato. Playground Next.js e test e2e Playwright vivono nel repo ma non vengono rilasciati.

```
damacchi-ui/
├─ pnpm-workspace.yaml
├─ package.json                      ← root, dev deps condivise + script orchestration
├─ tsconfig.base.json                ← shared TS config
├─ .github/workflows/                ← CI (lint, test unit, test e2e, build, publish)
├─ packages/
│  └─ ui/                            ← LIB PUBBLICATA = @damacchi/ui
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ tsup.config.ts
│     ├─ tailwind.preset.ts          ← esportato ai consumer
│     ├─ tailwind.config.ts          ← solo per dev interno (Ladle)
│     ├─ .ladle/config.mjs
│     ├─ src/
│     │  ├─ styles/
│     │  │  ├─ tokens.css
│     │  │  ├─ themes.css
│     │  │  ├─ globals.css
│     │  │  └─ patterns.css
│     │  ├─ lib/
│     │  │  ├─ cn.ts
│     │  │  └─ types.ts
│     │  ├─ components/
│     │  │  ├─ button/
│     │  │  │  ├─ button.tsx
│     │  │  │  ├─ button.variants.ts
│     │  │  │  ├─ button.stories.tsx  ← Ladle
│     │  │  │  ├─ button.test.tsx     ← Vitest (solo se logica)
│     │  │  │  └─ index.ts
│     │  │  └─ ... (47 componenti, stessa struttura)
│     │  ├─ icons/
│     │  │  ├─ crown.tsx · pawn.tsx · ... (~30 icone)
│     │  │  └─ index.ts
│     │  └─ index.ts                  ← barrel root
│     └─ dist/                        ← build output (tsup)
├─ apps/
│  └─ playground/                     ← Next.js 15 showcase app (private)
│     ├─ package.json                 ← depends on: "@damacchi/ui": "workspace:*"
│     ├─ next.config.ts
│     ├─ tailwind.config.ts           ← estende tailwind.preset di @damacchi/ui
│     ├─ app/
│     │  ├─ layout.tsx                ← importa tokens.css/themes.css/globals.css
│     │  ├─ page.tsx                  ← landing dei showcase
│     │  ├─ dashboard/page.tsx        ← scenario: sidebar + cards + table
│     │  ├─ forms/page.tsx            ← scenario: tutti i form input insieme
│     │  ├─ overlays/page.tsx         ← scenario: Dialog + Drawer + Toast + Tooltip
│     │  ├─ typography/page.tsx       ← showcase scale + utilities
│     │  └─ tokens/page.tsx           ← showcase token (stile DS page attuale)
│     └─ components/                  ← ThemeSwitcher, PaletteSwitcher, DensitySwitcher locali
└─ e2e/
   ├─ package.json
   ├─ playwright.config.ts            ← Chromium + WebKit, no Firefox
   └─ tests/
      ├─ components/                  ← test atomici (button.spec, dialog.spec…)
      └─ scenarios/                   ← test di flow composto (form-submit, overlay-stack…)
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - "packages/*"
  - "apps/*"
  - "e2e"
```

### 8.2 Package exports (subpath + barrel)

```json
{
  "name": "@damacchi/ui",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./button": "./dist/components/button/index.js",
    "./dialog": "./dist/components/dialog/index.js",
    "./icons": "./dist/icons/index.js",
    "./styles/tokens.css": "./dist/styles/tokens.css",
    "./styles/themes.css": "./dist/styles/themes.css",
    "./styles/globals.css": "./dist/styles/globals.css",
    "./tailwind.preset": "./dist/tailwind.preset.js"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "tailwindcss": ">=4"
  }
}
```

Consumer usa entrambi gli stili:

```tsx
// Tree-shake friendly (subpath)
import { Button } from '@damacchi/ui/button'

// Barrel (comodità)
import { Button, Dialog } from '@damacchi/ui'

// Una tantum, in layout root
import '@damacchi/ui/styles/tokens.css'
import '@damacchi/ui/styles/themes.css'
import '@damacchi/ui/styles/globals.css'

// tailwind.config.ts
import damacchi from '@damacchi/ui/tailwind.preset'
export default { presets: [damacchi], content: [...] }
```

### 8.3 Build

- `tsup` per la build della lib (ESM + types puliti, no Vite per library)
- CSS copiato as-is in `dist/styles/`
- Tailwind preset esportato come file JS
- Playground è una Next app standalone (build Next)
- e2e è un set di test Playwright, nessuna build

### 8.4 Playground (`apps/playground`)

Next.js 15 mini-app con pagine showcase che compongono i componenti in scenari realistici. Serve a:
1. Vedere l'esperienza d'uso vera (composizione di più componenti insieme), cosa che Ladle non fa.
2. Sperimentare combinazioni `theme × palette × density` live via switcher in top bar.
3. Catturare regression visivi durante lo sviluppo (occhio umano, niente Chromatic in v1).
4. Fungere da target per i test Playwright (e2e punta a `apps/playground`).

**Pagine previste (v1):**
- `/` — indice dei showcase
- `/tokens` — scala colori, typography, radius, shadow, spacing (come DS page moderna)
- `/typography` — tutta la scala + utilities (`.display`, `.mono`, `.eyebrow`)
- `/forms` — tutti i form input insieme + FormField + stati
- `/overlays` — Dialog, Drawer, Popover, Tooltip, Toast aperti contemporaneamente
- `/dashboard` — scenario layout completo (AppShell + PageHeader + Cards + Table + Stats)
- `/components/[name]` — page dinamica per sfogliare singolarmente tutti i 47 componenti

**Top bar di switch:**
```
[◐ Theme: light | dark]  [🎨 Palette: plum-gold | frost | circuit]  [📏 Density: compact | normal | comfortable]
```

Stato persistito in `localStorage` per sessioni successive.

---

## 9. Stack tecnico

| Cosa | Versione / Tool |
|---|---|
| Monorepo | pnpm workspace |
| Package manager | pnpm |
| Node | ≥ 20 LTS |
| TypeScript | 5.5+, strict |
| React | 19 (peer 18+) |
| Tailwind | v4 |
| Radix UI | ultimo `@radix-ui/react-*` |
| Varianti | class-variance-authority |
| Classnames | clsx + tailwind-merge |
| Date picker | react-day-picker |
| Isolation playground | Ladle |
| Scenario playground | Next.js 15 app (`apps/playground`) |
| Unit / integration test | Vitest + @testing-library/react |
| E2E test | Playwright (Chromium + WebKit) |
| Visual regression | Rimandato a v2 (hook ready) |
| Linter | ESLint flat config + Prettier |
| Build lib | tsup |

---

## 10. Inventario componenti (47)

### Foundations (Tier 3) — 7 + utilities
Typography utilities (classi, non componenti) · **Icon** (+ ~30 icon components atomiche) · **Box** (con prop `as`/`direction` copre Stack/Flex) · **Container** · **AspectRatio** · **ScrollArea** · **Separator** · **Ornament**

### Form / Input
- **Button** (primary/accent/ghost/danger/link × sm/md/lg/icon) — Tier 1
- **IconButton** — Tier 1
- **Input** (text/email/password/number/search) — Tier 2
- **Textarea** — Tier 2
- **Label** — Tier 3
- **Checkbox** (Radix) — Tier 2
- **Radio + RadioGroup** (Radix) — Tier 2
- **Switch** (Radix) — Tier 2
- **Slider** (Radix) — Tier 2
- **Select** (Radix) — trigger Tier 2 · listbox aperta Tier 1
- **Combobox** (Radix + cmdk) — Tier 2
- **SegmentedControl** — Tier 2
- **DatePicker** (react-day-picker) — Tier 2
- **FormField** — Tier 3

### Feedback / Overlays
- **Dialog** (Radix) — Tier 1
- **AlertDialog** (Radix) — Tier 1 (default/danger)
- **Drawer / Sheet** (Radix) — Tier 1
- **Popover** (Radix) — Tier 2
- **Tooltip** (Radix) — Tier 2
- **Toast** (Radix) — Tier 2
- **Progress** (Radix) — Tier 2
- **Spinner** — Tier 2
- **Skeleton** — Tier 2
- **Badge** — `default` Tier 2 · `featured` Tier 1
- **Chip** (default/accent/brand/success/danger/warning) — Tier 2
- **Banner** / Alert (info/success/warning/danger/rage) — Tier 1

### Navigation
- **Tabs** (Radix) — Tier 2
- **NavItem** — Tier 1 attivo · Tier 3 inattivo
- **Breadcrumbs** — Tier 3
- **Pagination** — Tier 2
- **DropdownMenu** (Radix) — Tier 2
- **ContextMenu** (Radix) — Tier 2

### Data display
- **Card** — `default/elevated/featured/interactive` Tier 1 · `dark` Tier 2
- **Avatar** (Radix) — Tier 2
- **AvatarGroup** — Tier 2
- **Accordion** (Radix) — Tier 2
- **Table** — header Tier 1 · righe Tier 3
- **Stat** — Tier 3

### Layout
- **AppShell** — Tier 3
- **PageHeader** — Tier 3

---

## 11. Testing

Tre livelli, tutti obbligatori dal v1 tranne visual regression.

### 11.1 Isolation (Ladle)
- Una `*.stories.tsx` per **ogni** componente, dentro `packages/ui/src/components/*/`
- Copre tutte le varianti + tutti gli stati (default/hover/focus/active/disabled/loading/invalid)
- Serve sia come "sketchpad" durante lo sviluppo sia come documentazione viva

### 11.2 Unit / integration (Vitest)
- Eseguiti con `vitest` + `@testing-library/react` + `jsdom`
- Solo componenti con **logica propria** (non wrapping-only di Radix): `Slider` custom logic, `FormField` validation bridge, `SegmentedControl` keyboard nav, `Pagination` page math, ecc.
- **Snapshot test vietati** (fragili, testano markup non comportamento)
- Target: verifica comportamento + edge case, non rendering

### 11.3 End-to-end (Playwright)
- Config a root `/e2e/playwright.config.ts`
- Browser: **Chromium + WebKit** (Firefox escluso in v1 per velocità CI)
- Target: Next playground (`apps/playground` in dev server)
- Due categorie di test:
  - **`e2e/tests/components/`** — test atomici per singolo componente montato su una pagina dedicata del playground (`/components/button`, `/components/dialog`, ecc.)
  - **`e2e/tests/scenarios/`** — test di flow composto (form-submit completo, overlay stack con focus trap, dark-mode switch persiste)
- Artifact su fail: screenshot + video + trace
- Parallelizzazione: workers default Playwright
- CI gate: blocca merge se fallisce

### 11.4 Visual regression (rimandato a v2)
Non implementato in v1. Hook ready: la struttura Playwright permette l'aggiunta di `expect(page).toHaveScreenshot()` senza refactoring quando lo vorremo.

---

## 12. Delivery e consumo

### 12.1 Publish
Privato su **GitHub Packages** (`npm.pkg.github.com`). Semver rigoroso.

### 12.2 Consumo dal progetto damacchi

Nel progetto Next consumer:

```bash
# .npmrc
@damacchi:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# install
pnpm add @damacchi/ui
```

### 12.3 Release workflow
- GitHub Action on tag push `v*`: lint → test → build → publish
- Manual changelog prima del tag
- `pnpm changeset` come alternativa futura se la lib crescerà

---

## 13. Roadmap di sviluppo (alto livello)

| Phase | Contenuto | Esito atteso |
|---|---|---|
| **1 — Scaffold** | Repo monorepo pnpm, TS, Tailwind v4, tsup, CI base, Ladle vuoto in `packages/ui`, Next 15 vuoto in `apps/playground`, Playwright vuoto in `e2e/` | `pnpm dev` apre Ladle e playground, `pnpm e2e` gira (0 test) |
| **2 — Design system base** | tokens.css, themes.css (light/dark), patterns.css, globals.css, `cn()` util, tailwind.preset | Playground `/tokens` mostra tutte le scale, switch tema/palette/density funzionanti |
| **3 — Foundations** | Icon set (~30), Typography utilities, Box, Container, AspectRatio, Separator, ScrollArea, Ornament, FormField | Stories + pagine playground `/typography`, `/components/*` per foundations |
| **4 — Tier 1 core** | Button, IconButton, Card (5 var), Dialog, AlertDialog, Drawer, Banner | "Look Memphis" provato in stories + scenari playground |
| **5 — Form inputs** | Input, Textarea, Label, Checkbox, Radio, Switch, Slider, Select, Combobox, SegmentedControl, DatePicker | Playground `/forms` completo |
| **6 — Feedback** | Tooltip, Popover, Toast, Progress, Spinner, Skeleton, Badge, Chip | Playground `/overlays` popolato |
| **7 — Navigation** | Tabs, NavItem, Breadcrumbs, Pagination, DropdownMenu, ContextMenu | |
| **8 — Data display** | Avatar, AvatarGroup, Accordion, Table, Stat | |
| **9 — Layout** | AppShell, PageHeader + pagina `/dashboard` del playground | Scenario dashboard completo |
| **10 — E2E tests** | Playwright specs per ogni componente + scenari (form-submit, overlay-stack, theme-switch, keyboard-nav) | CI verde, e2e blocca merge |
| **11 — Polish & release** | A11y audit, dark mode audit, density audit, docs JSDoc, GitHub Action publish, `v0.1.0` | `@damacchi/ui@0.1.0` installabile da progetto consumer |

---

## 14. Rischi e mitigazioni

| Rischio | Mitigazione |
|---|---|
| Tailwind v4 è ancora giovane, tutorial shadcn puntano a v3 | Portiamo i pattern shadcn manualmente. v4 ha CSS-native config più vicino al nostro stile. |
| 47 componenti = tanto lavoro | Fasi incrementali; Phase 4 (8 componenti Tier 1) sblocca il 60% del look, il resto è aggiunta iterativa |
| Drift di token tra lib e app | Tutti i token definiti in lib, mai nell'app. L'app importa `@damacchi/ui/styles/tokens.css` e basta. |
| Radius/shadow/border override accidentali | Solo i componenti leggono raw tokens; le CSS vars di customizzazione vivono nel consumer in `:root` override |
| Manutenzione da solo | CI che fallisce su test/build/e2e. CHANGELOG disciplinato. Nessun publish manuale. |
| Monorepo aggiunge complessità | pnpm workspace è leggero (no Turborepo, no Nx). Solo 3 workspace: `ui`, `playground`, `e2e`. |
| E2E rallenta la CI | Chromium + WebKit soltanto (no Firefox). Parallelizzazione Playwright. Scenario test solo sui flow critici, component test nei PR che toccano quel componente. |
| Dual-track Ladle + Playground = doppio lavoro | Ogni componente ha **una** story Ladle e **una** section playground. Ladle è autogenerato dal pattern del componente; playground si estende solo quando servono scenari compositi. |

---

## 15. Decisioni chiuse in brainstorm

| # | Decisione | Valore |
|---|---|---|
| 1 | Rinomina palette | `--plum-*` + `--gold-*` |
| 2 | Scale tipografica | Tailwind-style (text-xs/sm/base/lg/xl/…) |
| 3 | Dark mode | Built-in via `[data-theme]` |
| 4 | Multi-palette | Built-in via `[data-palette]` |
| 5 | Spacing grid | 4px |
| 6 | Border Memphis | 2px (normalizzato da 2.5px) |
| 7 | Tailwind version | v4 |
| 8 | Export strategy | Subpath + barrel entrambi supportati |
| 9 | Density | 3 livelli (compact/normal/comfortable) subito |
| 10 | i18n | Fuori dalla lib, label come prop |
| 11 | Publish | Privato GitHub Packages |
| 12 | Command Cmd+K | Escluso dalla v1 |
| 13 | Shadow offset (colore) | Default nero, configurabile |
| 14 | Radius 0 default | Configurabile via token |
| 15 | Pattern di sfondo | Configurabile via `[data-app-pattern]` |
| 16 | Monorepo setup | pnpm workspace con `packages/ui`, `apps/playground`, `e2e/` |
| 17 | Playground dev | Next.js 15 app con pagine showcase + switcher theme/palette/density |
| 18 | Ladle | Mantenuto per isolamento componenti (dual-track con Playground) |
| 19 | E2E | Playwright con Chromium + WebKit (no Firefox) |
| 20 | Visual regression | Rimandato a v2 (hook ready in Playwright) |

---

## 16. Open questions

Nessuna. Tutto chiuso nel brainstorm del 2026-04-18.
