# @damo/ui — Publication Readiness Checklist

Updated 2026-05-05 after the cycle 9 unification. The library does **not** publish itself; this document is the snapshot you read before pressing the Release button.

## Snapshot

| Metric                                 | Value                                                                |
| -------------------------------------- | -------------------------------------------------------------------- |
| Library version                        | 0.3.0 (see `packages/ui/package.json`)                               |
| Public components                      | 54                                                                   |
| Documented components                  | 54 (100%) — IconButton co-documented under `/docs/components/button` |
| Library unit tests                     | 323 / 323 ✓ (29 files)                                               |
| ESLint (root)                          | 0 errors, 0 warnings                                                 |
| `node scripts/check-docs-sync.mjs`     | ✓ 54/54 in sync (ALLOWLIST host-page check active)                   |
| `pnpm --filter @damo/ui build`         | ✓ ESM + DTS + CSS + Tailwind preset                                  |
| `pnpm --filter web build`              | ✓ static export, 54 routes, 1 SSG dynamic catch-all                  |
| Playwright e2e (chromium, --workers=1) | 71 / 71 ✓                                                            |

## What changed in cycle 9

Round-3 user feedback led to a tighter API and a few targeted fixes:

### U1 — Table row hover removed

- `TableRow` no longer applies `hover:bg-muted` by default. Tables aren't always interactive, and the hover tint was bleeding into header rows. Consumers that render clickable rows can opt in via className.
- `data-state=selected` highlight is preserved.

### U2 — AlertDialog folded into Dialog

- Removed `AlertDialog`, `AlertDialogContent`, `AlertDialogTrigger`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel` from the public API.
- `DialogContent` now accepts two new orthogonal props:
  - `severity?: 'default' | 'alert'` — `alert` flips `role` to `alertdialog`, blocks overlay-click dismiss, and hides the X close button so the user must use a footer action.
  - `tone?: 'default' | 'danger'` — `danger` swaps the Memphis offset shadow to the destructive token.
- 9 new dialog.test.tsx cases cover severity, tone, hideClose, and the orthogonality of the two props.
- Dropped `@radix-ui/react-alert-dialog` dependency.
- `apps/web/app/docs/components/dialog/page.tsx` rewritten as a single Dialog narrative with a dedicated severity-alert subsection.

### U3 — Memphis Popover + SettingsMenu removed

- `PopoverContent` repainted with the same Memphis chrome as DropdownMenu / Dialog (`border-2 border-memphis shadow-memphis rounded-none` + open/close animations). Same chrome flows automatically into `DatePicker` and `Combobox` (which use Popover internally) so all floating surfaces feel consistent.
- `PopoverContent` now correctly forwards `forceMount` to its underlying Radix Portal, fixing the case where a force-mounted popover's children unmounted with the Portal.
- `SettingsMenu` and all its types removed from the public API. Consumers compose Popover with whatever content they need.
- `apps/web/app/_components/DocsPreferencesMenu.tsx` (new, docs-site-private): wraps an `IconButton` in a `Popover` with three `AttrToggleGroup` instances (theme / palette / density). Three invisible `PersistAttrProbe` helpers run the `usePersistedAttr` hook on first paint so persisted preferences are restored even before the cog is opened.
- All `apps/web/app/docs/**` cross-links and prev/next chains repaired; "Display Settings" sidebar entry replaced with "Attribute-bound primitives → AttrToggleGroup".

### U4 — Coherence audit

- `getting-started/page.tsx`: code snippet and prose rewritten away from the removed Theme/Palette/Density Switchers; example uses `AttrToggleGroup` directly.
- `toast/page.tsx`: link `/docs/components/alert-dialog` → `/docs/components/dialog` (with `severity="alert"` callout).
- `tooltip/page.tsx`: link `/docs/components/icon-button` → `/docs/components/button`.
- ALLOWLIST in `scripts/check-docs-sync.mjs` reduced to a single entry (`icon-button` → `button`).

## Open advisories — not blocking

1. **devDeps audit**: `pnpm audit` still flags moderate CVEs in `esbuild`, `vite`, `postcss` reaching the project transitively through `next@15.5.15`. None are bundled into `packages/ui/dist` — build-time only.
2. **e2e under high concurrency**: `home-hero` and one webkit `display-settings-menu` test occasionally flake under unrestricted-worker contention. Pinning to `--workers=1` is sufficient and stable.

## Pre-publish checklist (manual — you do this)

Before `pnpm --filter @damo/ui publish`:

- [ ] Bump `packages/ui/package.json` version. **MAJOR (1.0.0)** — removing AlertDialog, SettingsMenu, the four theme presets (cycle 8), and the 8 showcase widgets (cycle 8) is a breaking change. Migration callouts: replace AlertDialog with `<DialogContent severity="alert" tone="danger">`; replace SettingsMenu with Popover + AttrToggleGroup composition; replace ThemeSwitcher / PaletteSwitcher / DensitySwitcher / DisplaySettingsMenu with AttrToggleGroup directly.
- [ ] Update `CHANGELOG.md` with the migration paths above.
- [ ] Verify `packages/ui/files` includes only `dist`, `README.md`.
- [ ] Run `pnpm --filter @damo/ui build` once more and inspect `dist/`.
- [ ] Tag the commit: `git tag @damo/ui@<version>`.
- [ ] Publish: `pnpm --filter @damo/ui publish` (uses GitHub Packages per the `.npmrc` workspace config).
- [ ] Push tags: `git push --tags`.

## Re-running the readiness checks

```bash
pnpm install
pnpm test                         # 323 unit tests
pnpm lint                         # eslint + docs-sync guardrail
pnpm --filter @damo/ui build
pnpm --filter web build
pnpm --filter @damo/e2e test -- --project=chromium --workers=1
node scripts/check-docs-sync.mjs
```

All green = ship-ready.
