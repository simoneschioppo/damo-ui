# Spec — gh-100 Editor-style code blocks (Phase 2.5 docs polish)

**Issue:** [#100](https://github.com/simoneschioppo/damacchi-ui/issues/100) ·
**Parent:** #77 (publication readiness) · **Branch:**
`refactor/gh-100-editor-style-code-blocks` · **Author:** `simoneschioppo`

## Intent

Replace the current "MacOS terminal screenshot" code-block chrome (traffic
lights, hardcoded `#0d1117`, single dark theme) with an editor-style
presentation that:

- Reads as a **VS Code / shadcn-docs** code surface, not a terminal window.
- **Follows page `data-theme`** — light page ⇒ light syntax theme; dark
  page ⇒ dark syntax theme. No more permanent dark.
- Adds a **subtle line-numbers gutter** for multi-line snippets.
- Drives **every color** from semantic CSS vars (`--card`, `--muted`,
  `--foreground`, `--border`, `--muted-foreground`) so palette swaps
  (Cyberpunk, Forest, Sunset, default) inherit automatically.
- Preserves the existing **Memphis frame + shadow** outer chrome — it's
  the project's identity. Only the inner editor changes.

This is the last cosmetic polish before #80 (`git filter-repo` rewrite)
and #81 / #82 (public flip + npm publish).

## Repro of the "before" state

1. `pnpm --filter @damo/web dev`, open any docs page (e.g.
   `/docs/components/button`).
2. Switch theme to **light** via the preferences menu.
3. Code blocks remain visually **dark with a terminal traffic-light header**
   regardless of page theme — visually inconsistent with the surrounding UI.
4. Multi-line snippets have **no line numbers**; comments/active tokens
   share a near-identical contrast at small font sizes.
5. The hex `#0d1117` / `#161b22` / `#30363d` are hardcoded in
   `apps/web/app/docs/_components/Code.tsx` and `CopyButton.tsx`.

## Root cause / current architecture (snapshot)

Three files own all docs code rendering:

- `apps/web/app/docs/_components/highlight.ts`
  - `server-only` Shiki facade.
  - Single theme: `github-dark-default`.
  - Hardcoded for "always dark" output.
- `apps/web/app/docs/_components/Code.tsx`
  - Async RSC wrapper. Renders the Memphis frame, the traffic-light
    chrome, the language badge, and the copy button slot.
  - Hardcoded GitHub-dark hexes for chrome.
- `apps/web/app/docs/_components/CopyButton.tsx`
  - Client component. Hardcoded GitHub-dark hexes for hover/border.

Consumed by `apps/web/app/page.tsx` (3 Quick Install cards) + 71 docs
pages via `Code` and `Example`.

## Fix approach

### 1) Dual-theme Shiki output (`highlight.ts`)

Switch from `theme: 'github-dark-default'` to **dual theme**:

```ts
themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
defaultColor: false, // emit BOTH variants as CSS vars; no inline color
```

This produces `<span style="--shiki:#xxx;--shiki-dark:#yyy">…</span>`.
A small CSS rule then switches based on `[data-theme='dark']`.

Why **vitesse**: tested by the VueUse / Anthony Fu ecosystem, gentler
contrast at small sizes than `github-*`, and the light variant has a
proper paper background (closer to shadcn docs feel) while staying
legible on the project's plum/gold and forest light surfaces.

### 2) Custom line-numbers transformer

`@shikijs/transformers` doesn't ship a built-in `line-numbers` (notation /
diff / focus exist; numbering is left to userland). A ~15-line custom
transformer prepends a `<span class="line-number" aria-hidden="true">N</span>`
to each line and adds a `has-line-numbers` class to the `<pre>`. CSS:
fixed gutter width, `user-select: none`, `--muted-foreground` color,
hidden on single-line snippets.

### 3) Editor-style chrome (`Code.tsx`)

Replace traffic-lights with a tab-style header:

```
┌──────────────────────────────────────────────────────────┐
│ ┌────────────────┐                            tsx [Copy] │ ← header
│ │ app/page.tsx ▎ │                                       │
│ └────────────────┘                                       │
├──────────────────────────────────────────────────────────┤
│  1  import { Button } from 'damo-ui'                     │ ← code
│  2                                                       │
│  3  export function Page() {                             │
│  4    return <Button>Save</Button>                       │
│  5  }                                                    │
└──────────────────────────────────────────────────────────┘
```

- Filename tab: monospace, `--card-foreground`, with an active-tab bottom
  accent in `--primary` when `title` is provided. No tab if untitled.
- Right side: tiny lang badge + Copy button. Copy button uses
  `--border` / `--muted` / `--muted-foreground` hover (no GitHub greys).
- Wrapper background: `--card` (not `#0d1117`). Header background:
  `--muted`. Header border: `--border`.
- Outer Memphis frame: kept as-is when `embedded={false}`.

### 4) Theme-aware syntax + chrome via global stylesheet

Add `apps/web/app/styles/code-blocks.css` (imported from `globals.css`)
that:

- Sets `.shiki` and `.shiki span` to the light variant by default and
  overrides them under `[data-theme='dark']`.
- Styles the line-number gutter, the focused/highlight/diff classes
  (cheap polish — useful even if we don't use them widely yet).
- Uses **only CSS vars**, no hex literals — palette overrides cascade.

### 5) Stretch (deferred): tabs for npm/pnpm/yarn/bun

Out of scope for this PR. Not blocking #80. Can ship as a small
follow-up after publication.

## Code map

| File                                                        | Change                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `apps/web/app/docs/_components/highlight.ts`                | Dual-theme; line-numbers transformer; helper still single-export.                     |
| `apps/web/app/docs/_components/Code.tsx`                    | Editor chrome; CSS-var-only colors; remove traffic lights; pass `singleLine` opt-out. |
| `apps/web/app/docs/_components/CopyButton.tsx`              | Drop GitHub greys for `--border` / `--muted-foreground`; size unchanged.              |
| `apps/web/app/docs/_components/Example.tsx`                 | No structural change — still mounts `<Code embedded>`.                                |
| `apps/web/app/styles/code-blocks.css` (NEW)                 | Light/dark switch CSS vars + line-numbers gutter + transformer classes.               |
| `apps/web/app/globals.css`                                  | Single `@import './styles/code-blocks.css'`.                                          |
| `apps/web/app/docs/_components/__tests__/Code.test.tsx`     | Smoke: editor header rendered, no traffic lights, line numbers present multi-line.    |
| `apps/web/app/docs/_components/__tests__/highlight.test.ts` | Smoke: dual-theme HTML contains `--shiki-dark` CSS var; line-numbers attribute set.   |
| `apps/web/app/docs/foundations/theming/page.tsx`            | If the page references the old chrome screenshot or pattern — refresh.                |

## Acceptance criteria

1. **No traffic lights** in any docs page (`grep -r "ff5f57\|febc2e\|28c840" apps/web` → no hits).
2. **No hardcoded `#0d1117` / `#161b22` / `#30363d`** in `Code.tsx` /
   `CopyButton.tsx`.
3. **Light page ⇒ light syntax theme** — verified visually + via CSS-var
   read in e2e (background-color of `.shiki` matches expected light hex).
4. **Dark page ⇒ dark syntax theme** — same, with the dark expected hex.
5. **Line numbers** appear on multi-line snippets and **don't** appear on
   single-line snippets (e.g. `pnpm add damo-ui`).
6. **Filename tab** appears when `title` is provided; absent otherwise.
7. **Copy button** still works (1.5 s feedback unchanged).
8. **No console errors / hydration mismatches** on any page that mounts
   `<Code>` or `<Example>` — verified by e2e + smoke unit tests.
9. **`server-only` boundary preserved** — `highlight.ts` still throws on
   client import.
10. **Kipi queued** post-merge: `_bmad/agents/kipi/workflow-state.json`
    `update.queued[]` lists touched paths.

## Risks

| Risk                                              | Likelihood | Mitigation                                                                                                                                              |
| ------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Line-numbers transformer creates hydration drift  | Low        | Output is server-rendered HTML embedded via `dangerouslySetInnerHTML`; React doesn't hydrate inside it. Unit test asserts attribute on the wrapper.     |
| Light syntax theme readability on Sunset / Forest | Med        | Vitesse-light is paper-on-paper; verified against `--card` of all 4 palettes × light. If contrast fails on one, fall back to a per-palette CSS overlay. |
| Bundle size from second theme                     | Low        | Both themes are loaded once on the server (RSC). No client bundle impact (Shiki not shipped to the browser).                                            |
| Copy button color regression on dark              | Low        | Driven by `--muted-foreground` — already tested across all 4 palettes for the locale-switch theme work (gh-95, PR #96).                                 |
| `@shikijs/transformers` not yet a dep             | Low        | Added in this PR. Pinned to the same major as `shiki@^4`. Server-only.                                                                                  |

## Verification plan

**Local (pre-PR):**

- `pnpm --filter @damo/web exec tsc --noEmit`
- `pnpm --filter damo-ui exec tsc --noEmit`
- `pnpm lint`
- `pnpm format:check`
- `pnpm test` (vitest both packages)
- Visual sweep at `/`, `/docs/components/button`,
  `/docs/components/dialog`, `/docs/foundations/theming` × {light, dark}
  × {default, sunset, cyberpunk, forest}.

**E2E (added in this PR):**

- `e2e/tests/scenarios/code-blocks-editor-style.spec.ts`:
  - Cold reload in dark ⇒ `.shiki` background-color matches dark expected.
  - Toggle to light ⇒ `.shiki` background-color matches light expected.
  - Single-line snippet ⇒ no `.line-number` element.
  - Multi-line snippet ⇒ N `.line-number` elements.
  - Copy button click ⇒ "Copied" feedback present within 250 ms.
  - No `traffic-light`-class / `#ff5f57` / `#febc2e` / `#28c840` anywhere
    in the rendered HTML.
