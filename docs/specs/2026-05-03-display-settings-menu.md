# DisplaySettingsMenu — Spec

Date: 2026-05-03
Status: Implemented
Author: damacchi-ui team

## Motivation

The site topbar currently exposes three sibling controls — `ThemeSwitcher`,
`PaletteSwitcher`, `DensitySwitcher` — each consuming horizontal space and
each carrying its own eyebrow label. On viewports below ~1280px the actions
slot wraps to a second row, breaking the topbar's clean horizontal rhythm.

`DisplaySettingsMenu` collapses the three concerns into a single icon button
that opens a labelled dropdown menu, freeing the topbar for branding, primary
nav, and any high-priority CTA without losing access to the underlying
preferences.

## API

```ts
export interface DisplaySettingsOption {
  value: string
  label: string
}

export interface DisplaySettingsMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  // Palette is required (no implicit default), matching PaletteSwitcher.
  paletteOptions: ReadonlyArray<DisplaySettingsOption>
  paletteDefaultValue?: string
  paletteStorageKey?: string   // default: 'palette'
  paletteAttribute?: string    // default: 'data-palette'

  themeOptions?: ReadonlyArray<DisplaySettingsOption>   // default: Light/Dark
  themeDefaultValue?: string   // default: 'light'
  themeStorageKey?: string     // default: 'theme'
  themeAttribute?: string      // default: 'data-theme'

  densityOptions?: ReadonlyArray<DisplaySettingsOption> // default: Compatta/Normale/Ampia
  densityDefaultValue?: string // default: 'normal'
  densityStorageKey?: string   // default: 'density'
  densityAttribute?: string    // default: 'data-density'

  triggerLabel?: string        // default: 'Display settings'
  themeLabel?: string          // default: 'Theme'
  paletteLabel?: string        // default: 'Palette'
  densityLabel?: string        // default: 'Density'
}
```

Flat props (rather than nested config objects) are intentional: they mirror
the existing per-axis switchers' API so consumers familiar with one are
immediately at home with the other.

## Composition

```
DisplaySettingsMenu
└─ DropdownMenu (Radix)
   ├─ DropdownMenuTrigger asChild
   │  └─ IconButton variant="ghost" aria-label
   │     └─ CogIcon
   └─ DropdownMenuContent align="end"
      ├─ DropdownMenuLabel "Theme"
      ├─ DropdownMenuRadioGroup (theme)
      │  └─ DropdownMenuRadioItem × N
      ├─ DropdownMenuSeparator
      ├─ DropdownMenuLabel "Palette"
      ├─ DropdownMenuRadioGroup (palette)
      │  └─ DropdownMenuRadioItem × N
      ├─ DropdownMenuSeparator
      ├─ DropdownMenuLabel "Density"
      └─ DropdownMenuRadioGroup (density)
         └─ DropdownMenuRadioItem × N
```

All three radio groups are always visible. Submenus would add an unnecessary
click for 2-3 options per group and degrade keyboard ergonomics.

## Persistence

Internally re-implements the wiring of the three legacy switchers using the
existing `usePersistedAttr` hook three times — one per axis. The defaults
match the legacy components verbatim (`storageKey` / `attribute` per axis),
so users with persisted preferences keep them after the migration.

For `palette`, the same sanitization effect from `PaletteSwitcher` is
preserved: an unknown persisted value (e.g. from a removed option) is
rewritten to the configured default and the dropdown shows the default as
checked.

## Tokens consumed

- `bg-card`, `border-memphis`, `shadow-memphis` — Memphis chrome on the
  popover panel (inherited from the base `DropdownMenu` styles, which were
  also realigned to the Memphis identity in this change).
- `bg-secondary` / `text-secondary-foreground` — RadioItem chrome on the
  active selection and on focused items.
- `text-primary`, `font-mono` — group labels rendered as eyebrow text.
- `--memphis-shadow-color` — IconButton ghost variant on the trigger.

## Styling notes

The shared `DropdownMenu` primitives (`Content`, `Item`, `RadioItem`,
`CheckboxItem`, `Label`, `Separator`, `SubContent`, `SubTrigger`) are
restyled with the Memphis identity (thick black border, offset shadow,
square corners, mono uppercase labels) so any consumer of the dropdown —
not just `DisplaySettingsMenu` — picks up the same look automatically.

## Accessibility

- Trigger has explicit `aria-label` (default: "Display settings"; overridable
  via `triggerLabel`).
- Radio groups expose `role="group"` (Radix). Each group is preceded by a
  `DropdownMenuLabel` (rendered as a non-interactive label element).
- Keyboard: `Tab` to trigger → `Enter`/`Space` opens menu → `Arrow` keys
  navigate within and across groups → `Enter`/`Space` selects, closes menu,
  returns focus to trigger.
- Screen readers announce `menuitemradio` items with `aria-checked`.

## Backwards compatibility

- Default storage keys and `data-*` attributes match the legacy switchers, so
  visitors with persisted preferences keep their selections after the topbar
  migrates from three sibling switchers to the consolidated menu.
- The legacy `ThemeSwitcher`, `PaletteSwitcher`, `DensitySwitcher` continue
  to be exported from `@damo/ui`. Consumers can pick whichever fits the
  surface (toolbar with abundant horizontal real estate vs. compact navbar).

## Security

- All option values, labels, and storage keys are dev-provided. No untrusted
  input is read from the DOM or rendered as HTML.
- Persisted values are sanitized against the option list at mount; an
  attacker who managed to set localStorage to an unrecognized value would
  see it overwritten with the default at first paint.

## Out of scope

- Saving preferences server-side (cookie / account preference) — current
  scope is the same localStorage-only persistence as the existing switchers.
- Theming the menu chrome itself (e.g. width, density of items) — uses the
  shared `DropdownMenu` styles.

## File map

- `packages/ui/src/components/display-settings-menu/display-settings-menu.tsx`
- `packages/ui/src/components/display-settings-menu/display-settings-menu.test.tsx`
- `packages/ui/src/components/display-settings-menu/display-settings-menu.stories.tsx`
- `packages/ui/src/components/display-settings-menu/index.ts`
- `packages/ui/src/index.ts` — barrel re-export
- `apps/web/app/layout.tsx` — site usage
- `apps/web/app/docs/components/display-settings-menu/page.tsx` — internal docs
- `apps/web/app/docs/_components/DocsSidebar.tsx` — nav entry
- `e2e/tests/scenarios/display-settings-menu.spec.ts` — E2E coverage
- `e2e/tests/scenarios/density-effect.spec.ts` — updated to drive new menu
- `e2e/tests/scenarios/smoke.spec.ts` — assert trigger present
