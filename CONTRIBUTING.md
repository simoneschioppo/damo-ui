# Contributing to Damo UI

Thanks for working on the library. The two rules below are non-negotiable:

## 1. Docs follow the lib

Every component exported from `packages/ui/src/index.ts` MUST have a dedicated
docs page at `apps/web/app/docs/components/<name>/page.tsx`. The convention is
checked by `node scripts/check-docs-sync.mjs` (also wired into `pnpm lint`).
Run it locally before opening a PR; CI will fail otherwise.

If you are intentionally landing a component without a docs page (rare — only
when a component is internal but happens to leak into the public surface for
one release), add the kebab-case name to the `ALLOWLIST` set inside
`scripts/check-docs-sync.mjs` with a comment explaining why.

When you change a component's API:

- Update the props table on its docs page.
- Update / add an Accessibility section if the change affects ARIA or keyboard.
- Update prev/next links if the docs sidebar order shifts.

The docs sidebar source of truth is `apps/web/app/docs/_components/docs-nav.ts`.
A new component must be added to one of the groups there.

## 2. Real components, not mockups

The docs site and the theme generator MUST mount the real `@axologic/ui`
components in their live previews. No hand-rolled JSX that replicates a
component's chrome. The only exceptions are:

- The token / colors / patterns Foundations pages, which intentionally use
  raw `<div>` + Tailwind utility classes to teach the consumer how to use the
  underlying tokens directly.
- Page-level layout primitives in the theme-generator that are bespoke to the
  editor and don't replicate any library component (e.g. `DivergenceWrapper`,
  `ContrastBadge`).

If you find yourself copying classes from a Card / Button / Banner into a
local div, stop and import the actual component instead.

## Workflow

```bash
pnpm install
pnpm dev               # Ladle (61000) + Next docs site (3000) in parallel

# Before opening a PR:
pnpm test              # unit tests must pass (lib + CLI + MCP, currently 679)
pnpm lint              # eslint + docs-sync guardrail
pnpm --filter @damo/web build
pnpm --filter @axologic/ui build
```

## CI strategy

- **PR runs** execute lint + unit tests + chromium-only e2e (~4–5 min). Docs-only PRs (markdown / `.gitignore`) skip the e2e job entirely.
- **Push to `main`** always runs the full PR pipeline (no skip).
- **Cross-browser coverage** (chromium + webkit) runs nightly via `.github/workflows/e2e-nightly.yml` at 03:00 UTC. Webkit-only regressions surface within 24h. Trigger manually via the Actions tab when investigating a suspected webkit issue.
- The first request to a docs page initializes a server-side Shiki singleton; `e2e/global-setup.ts` prewarms the heavy routes (`/docs/getting-started`, `/docs/foundations/patterns`, `/docs/foundations/tokens`) before tests run to avoid cold-start races on CI runners.

## Review policy

Pull requests targeting `main` require approval from a code owner before merging. The current code owner for the entire repository is `@simoneschioppo` — see [`.github/CODEOWNERS`](./.github/CODEOWNERS) for the source of truth.

The rule applies **only** to PRs whose base is `main`. Work freely on feature branches (push, force-push, rebase, squash — your branch, your rules) and only request review when ready to publish.

CI must also be green: `lint-and-test` always; `e2e` only when the change touches code paths (`packages/**`, `apps/**`, `e2e/**`, or workflow files) — see the `changes` job in `.github/workflows/ci.yml` for the exact filter.
