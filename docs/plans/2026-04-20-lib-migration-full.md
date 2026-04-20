# Damo UI — Full Lib-First Migration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development with 3 Opus 4.7 agents (implementer + spec reviewer + code reviewer) per task. Every task uses tdd-workflow (RED → GREEN → REFACTOR).

**Goal:** Portare in `@damo/ui` tutti i componenti oggi implementati come styled div/span nelle pagine `/design-system` e `/theme-generator`. Dopo il refactor le pagine devono contenere SOLO: markup di layout (grid/flex), import di componenti `@damo/ui`, e import di icone. Nessuna classe/stile inline che descriva la pelle Memphis.

**Architecture:** Ogni componente rispetta 3 regole non negoziabili: (a) tutti i valori visuali arrivano da CSS custom properties — mai hex hardcoded (b) ogni componente usa `cva` + CSS vars per supportare customizzazione runtime stile shadcn (c) ogni file ≤ 400 righe, una responsabilità, export dal barrel `packages/ui/src/index.ts`.

**Tech Stack:** TypeScript strict, CVA (class-variance-authority), Tailwind v4 utility-first, Radix UI dove serve behavior, Vitest per unit test, Playwright per e2e smoke.

---

## Files we'll touch

**New lib components** (each = own folder):

- `packages/ui/src/components/color-scale/` — `<ColorScale>` (horizontal color bands, DS showcase)
- `packages/ui/src/components/token-swatch/` — `<TokenSwatch>` (semantic token card)
- `packages/ui/src/components/type-specimen/` — `<TypeSpecimen>` (typography sample)
- `packages/ui/src/components/player-card/` — `<PlayerCard>` (avatar + meta + clock)
- `packages/ui/src/components/mode-card/` — `<ModeCard>` (featured gold-shadow card)
- `packages/ui/src/components/info-card/` — `<InfoCard>` (tooltip-shaped card)
- `packages/ui/src/components/rule-card/` — `<RuleCard>` (neutral content card)
- `packages/ui/src/components/medal/` — `<Medal>` (octagonal medal with 5 ranks)
- `packages/ui/src/components/hint/` — `<Hint>` (numbered info callout)
- `packages/ui/src/components/pattern-swatch/` — `<PatternSwatch>` (Memphis pattern tile)
- `packages/ui/src/components/memphis-shape/` — `<MemphisShape>` (8 primitive shapes)
- `packages/ui/src/components/color-picker/` — `<ColorPicker>` (native swatch + hex input)
- `packages/ui/src/components/section-header/` — `<SectionHeader>` (doc section title)
- `packages/ui/src/components/sub-panel/` — `<SubPanel>` (dashed labeled group)
- `packages/ui/src/components/showcase-card/` — `<ShowcaseCard>` (labeled wrapper for DS page)

**Existing components — extensions:**

- `packages/ui/src/components/badge/badge.variants.ts` — add `copper|navy|win|loss|draw|rank|outline` flavors
- `packages/ui/src/components/chip/chip.tsx` + `chip.variants.ts` — add `dotColor?: string`, `active?: boolean`

**Tokens additions:**

- `packages/ui/src/styles/tokens.css` — add `--medal-{bronze|silver|gold|master|grandmaster}-outer/inner/text` semantic tokens

**Pages — final refactor:**

- `apps/playground/app/design-system/page.tsx` — rewrite using only lib components (~2500 → ~700 lines of layout)
- `apps/playground/app/theme-generator/page.tsx` — replace local `ColorPickerRow` with lib `<ColorPicker>`

**Exports:**

- `packages/ui/src/index.ts` — add 15 new exports

---

## Task breakdown

### Task 1: Extend `<Badge>` variants

**Files:**
- Modify: `packages/ui/src/components/badge/badge.variants.ts`
- Test: `packages/ui/src/components/badge/badge.test.tsx`

- [ ] **Step 1: Write failing test** asserting Badge rendering for each of the 8 flavors (default, featured, copper, navy, win, loss, draw, rank, outline) — test that each applies expected classes / CSS vars.

```tsx
import { render } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge variants', () => {
  const flavors = ['default', 'featured', 'copper', 'navy', 'win', 'loss', 'draw', 'rank', 'outline'] as const
  it.each(flavors)('renders %s flavor', (variant) => {
    const { container } = render(<Badge variant={variant}>X</Badge>)
    expect(container.firstChild).toHaveClass(`bg-`)
  })
})
```

- [ ] **Step 2: Run test — verify FAIL** (`pnpm -F @damo/ui test badge`)
- [ ] **Step 3: Extend cva** — add 7 new variants in `badge.variants.ts` using CSS-var colors:
  - `copper`: bg `var(--gold-500)` text `var(--black)` border-memphis shadow-memphis-sm
  - `navy`: bg `var(--plum-900)` text `var(--paper-50)` border-memphis shadow-memphis-sm
  - `win`: bg `color-mix(success 20%, surface)` text `var(--success)` border-success
  - `loss`: bg `color-mix(danger 20%, surface)` text `var(--danger)` border-danger
  - `draw`: bg `color-mix(warning 20%, surface)` text `var(--warning)` border-warning
  - `rank`: bg `var(--gold-200)` text `var(--plum-900)` border-memphis shadow-memphis-sm
  - `outline`: bg transparent text `var(--ink)` border-memphis
- [ ] **Step 4: Run test — verify PASS**
- [ ] **Step 5: Commit** `feat(ui): extend Badge with 7 domain flavors`

### Task 2: Extend `<Chip>` with dotColor + active state

**Files:**
- Modify: `packages/ui/src/components/chip/chip.tsx` + `chip.variants.ts`
- Test: `packages/ui/src/components/chip/chip.test.tsx`

- [ ] **Step 1: Write failing test** — `<Chip dotColor="var(--success)" active>Win</Chip>` must render a 6px dot span before children + active bg state.
- [ ] **Step 2: Verify FAIL**
- [ ] **Step 3: Add `dotColor?: string` + `active?: boolean` props**. When `dotColor` is set, prepend a `<span style={{ width:6, height:6, borderRadius:9999, background: dotColor }} />` inside the chip. When `active`, add `bg-surface-2 ring-1 ring-border-memphis` classes.
- [ ] **Step 4: Verify PASS**
- [ ] **Step 5: Commit** `feat(ui): add dotColor + active state to Chip`

### Task 3: Create `<Medal>` component

**Files:**
- Create: `packages/ui/src/components/medal/medal.tsx` + `medal.variants.ts` + `medal.test.tsx` + `index.ts`
- Modify: `packages/ui/src/styles/tokens.css` (add 15 medal CSS vars)
- Modify: `packages/ui/src/index.ts` (export)

- [ ] **Step 1: Add tokens** in tokens.css:
  ```css
  --medal-bronze-outer: #5a3f20;
  --medal-bronze-inner: #8a6236;
  --medal-bronze-text: #fff;
  --medal-silver-outer: #4a4a55;
  --medal-silver-inner: #8a8a9a;
  --medal-silver-text: #fff;
  --medal-gold-outer: var(--plum-900);
  --medal-gold-inner: var(--gold-500);
  --medal-gold-text: var(--plum-900);
  --medal-master-outer: var(--plum-900);
  --medal-master-inner: var(--plum-500);
  --medal-master-text: var(--paper-50);
  --medal-grandmaster-outer: #000;
  --medal-grandmaster-inner: var(--gold-500);
  --medal-grandmaster-text: var(--plum-900);
  ```
- [ ] **Step 2: Write failing test** — render each rank and verify SVG polygon + label exists.
- [ ] **Step 3: Implement** — SVG octagon with `--medal-${rank}-outer/inner/text` vars, optional `label`, optional `rank` prop (number) displayed inside.

```tsx
export interface MedalProps { rank: 'bronze'|'silver'|'gold'|'master'|'grandmaster'; label?: string; rankNumber?: number }
```

- [ ] **Step 4: Export + verify PASS**
- [ ] **Step 5: Commit** `feat(ui): add Medal component with 5 ranks`

### Task 4: Create `<Hint>` component

**Files:**
- Create: `packages/ui/src/components/hint/hint.tsx` + `hint.test.tsx` + `index.ts`

- [ ] **Step 1: Test** — `<Hint num={1} title="Title">body</Hint>` renders 40x40 icon with number, title, body. Background uses `color-mix(plum-500 22%, surface)`.
- [ ] **Step 2: Implement** with `HintProps { num: number; title: ReactNode; children: ReactNode }`. Uses semantic tokens `--surface`, `--ink`, `--plum-500`, `--shadow-memphis-color`.
- [ ] **Step 3: Test PASS + export + commit** `feat(ui): add Hint callout`

### Task 5: Create `<ColorPicker>` component

**Files:**
- Create: `packages/ui/src/components/color-picker/color-picker.tsx` + test + index

- [ ] **Step 1: Test** — `<ColorPicker label="Plum 500" value="#7a3980" onChange={fn} />` renders a label, a `input[type=color]` with the value, and a text Input mirroring the hex. Changing either triggers onChange.
- [ ] **Step 2: Implement** — composes `<Label>` + native `<input type="color">` + `<Input>` (lib). Props: `{ id?, label, value, onChange }`.
- [ ] **Step 3: Test PASS + export + commit** `feat(ui): add ColorPicker`

### Task 6: Create `<PatternSwatch>` + `<MemphisShape>`

**Files:**
- Create: `packages/ui/src/components/pattern-swatch/pattern-swatch.tsx` + test
- Create: `packages/ui/src/components/memphis-shape/memphis-shape.tsx` + test

- [ ] **Step 1: `<PatternSwatch>` test** — renders a div with a labeled header + body receiving arbitrary CSS `background`/`backgroundSize`/`backgroundColor`. All framing styles token-based.
- [ ] **Step 2: Implement** both components.
  - `PatternSwatchProps { name: string; background?: string; backgroundSize?: string; backgroundColor?: string; children?: ReactNode }`
  - `MemphisShapeProps { variant: 'diamond'|'circle'|'triangle'|'zigzag'|'blob'|'wave'|'star'|'lbar'; size?: number; color?: string }`
- [ ] **Step 3: Test PASS + export + commit** `feat(ui): add PatternSwatch + MemphisShape`

### Task 7: Create `<ColorScale>` + `<TokenSwatch>`

**Files:**
- Create: `packages/ui/src/components/color-scale/color-scale.tsx` + test
- Create: `packages/ui/src/components/token-swatch/token-swatch.tsx` + test
- Move: `useResolvedCssVars` hook from playground to `packages/ui/src/hooks/use-resolved-css-vars.ts` (exported)

- [ ] **Step 1: Lift hook** to lib so ColorScale can use it
- [ ] **Step 2: Test `<ColorScale>`** — accepts `{ name, token, desc, stops: Array<{k:number}> }`, renders horizontal band with live hex labels, contrast-aware text.
- [ ] **Step 3: Test `<TokenSwatch>`** — accepts `{ name, cssVar, usage }`, renders a 44px swatch + meta.
- [ ] **Step 4: Implement both**
- [ ] **Step 5: Test PASS + export + commit** `feat(ui): add ColorScale, TokenSwatch, useResolvedCssVars hook`

### Task 8: Create `<TypeSpecimen>` + `<SectionHeader>` + `<SubPanel>` + `<ShowcaseCard>`

**Files:**
- Create: `packages/ui/src/components/type-specimen/` + `section-header/` + `sub-panel/` + `showcase-card/` (each with component + test + index)

- [ ] **Step 1: Tests for all 4** (structure + tokens)
- [ ] **Step 2: Implement 4 components** with their documented Props interfaces
- [ ] **Step 3: Test PASS + export + commit** `feat(ui): add doc-primitives (SectionHeader, SubPanel, ShowcaseCard, TypeSpecimen)`

### Task 9: Create domain cards (`<PlayerCard>`, `<ModeCard>`, `<InfoCard>`, `<RuleCard>`)

**Files:**
- Create: `packages/ui/src/components/player-card/` + `mode-card/` + `info-card/` + `rule-card/`

- [ ] **Step 1: Define props**
  - `PlayerCardProps { name: string; elo: number; mode: string; clock: string; avatar?: ReactNode }`
  - `ModeCardProps { title: string; icon?: ReactNode; meta?: ReactNode; accent?: 'gold'|'plum' }`
  - `InfoCardProps { label: string; value: string; accent?: ReactNode }`
  - `RuleCardProps { label?: string; title: string; children: ReactNode }`
- [ ] **Step 2: Tests** — each renders expected structure + uses token CSS vars (no hardcoded hex)
- [ ] **Step 3: Implement** — compose internally `<Card>` primitives where possible
- [ ] **Step 4: Test PASS + export + commit** `feat(ui): add 4 domain cards (Player/Mode/Info/Rule)`

### Task 10: Refactor `/theme-generator` to use `<ColorPicker>`

**Files:**
- Modify: `apps/playground/app/theme-generator/page.tsx`

- [ ] **Step 1: Delete local ColorPickerRow** and import `ColorPicker` from lib
- [ ] **Step 2: Verify visual parity** via Playwright screenshot
- [ ] **Step 3: Commit** `refactor(playground): theme-generator uses ColorPicker from lib`

### Task 11: Refactor `/design-system` to use only lib components

**Files:**
- Modify: `apps/playground/app/design-system/page.tsx`

- [ ] **Step 1: Replace section 01** inline ColorBand/SemanticBlock with `<ColorScale>` + `<TokenSwatch>`
- [ ] **Step 2: Replace section 02** type specimens with `<TypeSpecimen>`
- [ ] **Step 3: Replace section 04** Player/Mode/Info/Content cards with lib equivalents
- [ ] **Step 4: Replace section 05** DsCard wrappers with `<ShowcaseCard>`
- [ ] **Step 5: Replace section 06** raw badge/chip spans with extended `<Badge variant="copper|navy|win|loss|draw|rank|outline">` + `<Chip dotColor active>`
- [ ] **Step 6: Replace section 08** medals with `<Medal rank>`
- [ ] **Step 7: Replace section 10** patterns with `<PatternSwatch>` + `<MemphisShape>`
- [ ] **Step 8: Replace section 11** Hint divs with `<Hint>`
- [ ] **Step 9: Replace `SectionHeader`, `SubPanel`, `DsCard`** helper functions with lib equivalents; delete local definitions.
- [ ] **Step 10: Verify** — grep for `style={{` in page.tsx should return only layout (grid/flex/margin/padding) — no `border:`, `boxShadow:`, `background:` other than `var(--bg)` / `var(--surface)` / `inherit`.
- [ ] **Step 11: Playwright screenshot diff** against baseline `f16f749` commit
- [ ] **Step 12: Commit** `refactor(playground): design-system page rebuilt on lib primitives`

### Task 12: E2E + code-review + security pass

- [ ] **Step 1:** Run `pnpm --filter e2e test` — all scenarios pass (/ecc:e2e)
- [ ] **Step 2:** Dispatch `everything-claude-code:code-reviewer` across the new lib components
- [ ] **Step 3:** Dispatch `everything-claude-code:security-reviewer` focused on color-picker input sanitization (hex validation) and medal SVG rendering
- [ ] **Step 4:** Final screenshot comparison suite (6 combos × 3 sections = 18 screenshots)
- [ ] **Step 5:** Commit + push final: `chore: lib-first migration complete`

---

## Definition of Done

1. `grep -E "border:|boxShadow:|background:" apps/playground/app/design-system/page.tsx | wc -l` must be ≤ 10 (layout-only allowed)
2. All CI green (`pnpm -r typecheck && pnpm -r lint && pnpm -r test`)
3. E2E smoke passes on Chromium + WebKit
4. Playwright visual snapshots across 6 theme × palette combos match or diff explained
5. Security review flags zero critical/high issues
6. `packages/ui/src/index.ts` exports all 15 new components
