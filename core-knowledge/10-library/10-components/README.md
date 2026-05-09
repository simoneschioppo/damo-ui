# Components

Status: 54/54 documented · Last scan: d63afaf

Per-component sub-chapters. Status legend: 🟢 documented · 🟡 pending.

Depth tiers (decided 2026-05-06): **FULL** = full template (Button as
canonical reference). **STANDARD** = Summary, Public API, Notes/Gotchas,
How to consume, Open questions. **THIN** = compact (Summary + API +
notes only).

## Primitives (batch C.1)

- 🟢 [Button](button.md) — FULL · canonical primitive
- 🟢 [IconButton](icon-button.md) — THIN
- 🟢 [Badge](badge.md) — STANDARD
- 🟢 [Chip](chip.md) — STANDARD
- 🟢 [Label](label.md) — THIN
- 🟢 [Separator](separator.md) — STANDARD
- 🟢 [Spinner](spinner.md) — THIN
- 🟢 [Skeleton](skeleton.md) — THIN

## Form controls — base inputs (batch C.2)

- 🟢 [Input](input.md) — STANDARD (focus shadow recipe canonical)
- 🟢 [Textarea](textarea.md) — STANDARD
- 🟢 [Checkbox](checkbox.md) — STANDARD
- 🟢 [RadioGroup](radio-group.md) — STANDARD (2 exports)
- 🟢 [Switch](switch.md) — STANDARD (density-aware translate)
- 🟢 [Select](select.md) — STANDARD (10 exports — first compound component)

## Form controls — advanced (batch C.3)

- 🟢 [Combobox](combobox.md) — FULL (cmdk + Popover, single-select)
- 🟢 [Slider](slider.md) — STANDARD (range mode via array value, density-aware)
- 🟢 [SegmentedControl](segmented-control.md) — STANDARD (Radix toggle-group single)
- 🟢 [AttrToggleGroup](attr-toggle-group.md) — FULL (html attr + localStorage, self-healing)
- 🟢 [ColorPicker](color-picker.md) — STANDARD (native swatch + hex Input)
- 🟢 [DatePicker](date-picker.md) — FULL (DayPicker + Popover, Italian locale)

## Form composition (batch C.4)

- 🟢 [FormField](form-field.md) — STANDARD (clone-and-merge child for a11y wiring)
- 🟢 [Hint](hint.md) — STANDARD (numbered callout, not a form helper)

## Overlays (batch C.5)

- 🟢 [Dialog](dialog.md) — FULL (severity/tone axes, AlertDialog consolidated here)
- 🟢 [Drawer](drawer.md) — STANDARD (4-side cva, Header/Body/Footer)
- 🟢 [Popover](popover.md) — STANDARD (forceMount Portal+Content)
- 🟢 [Tooltip](tooltip.md) — STANDARD (inverted, soft shadow exception)
- 🟢 [DropdownMenu](dropdown-menu.md) — FULL (11 exports, RadioItem selection chrome)
- 🟢 [ContextMenu](context-menu.md) — STANDARD (OS-style, soft chrome, no animations)
- 🟢 [Toast](toast.md) — FULL (variants tint bg + shadow, responsive viewport)

## Layout (batch C.6)

- 🟢 [Box](box.md) — STANDARD (polymorphic flex)
- 🟢 [Container](container.md) — THIN (max-width centerer)
- 🟢 [AspectRatio](aspect-ratio.md) — THIN (Radix passthrough)
- 🟢 [ScrollArea](scroll-area.md) — STANDARD (Radix wrap)
- 🟢 [AppShell](app-shell.md) — STANDARD (2-col grid layout)
- 🟢 [AppTopBar](app-top-bar.md) — STANDARD (header-height token consumer)
- 🟢 [Sidebar](sidebar.md) — FULL (5 exports, sticky body+footer)
- 🟢 [PageHeader](page-header.md) — STANDARD (responsive heading block)

## Navigation (batch C.7)

- 🟢 [Tabs](tabs.md) — STANDARD (underlined active)
- 🟢 [Breadcrumbs](breadcrumbs.md) — STANDARD (auto-injected separators)
- 🟢 [Pagination](pagination.md) — FULL (windowed math factored out)
- 🟢 [NavItem](nav-item.md) — FULL (selection chrome canonical)
- 🟢 [Accordion](accordion.md) — STANDARD (Radix wrap, fade only)

## Data display (batch C.8)

- 🟢 [Table](table.md) — STANDARD (8 exports, no default hover)
- 🟢 [Card](card.md) — FULL (5 variants × 4 sizes + 5 sub-parts)
- 🟢 [ArticleCard](article-card.md) — STANDARD (specialized 420px)
- 🟢 [FeatureCard](feature-card.md) — STANDARD (specialized 280px, primary-tinted shadow)
- 🟢 [UserCard](user-card.md) — STANDARD (avatar+name+meta+trailing)
- 🟢 [Avatar](avatar.md) — STANDARD (Radix wrap + AvatarGroup)
- 🟢 [Stat](stat.md) — STANDARD (typography-only KPI block)
- 🟢 [Progress](progress.md) — STANDARD (translate-based fill, soft chrome)

## Decorative (batch C.9)

- 🟢 [Banner](banner.md) — STANDARD (4 variants, self-managed dismiss)
- 🟢 [Medal](medal.md) — STANDARD (5 ranks, heptagon SVG)
- 🟢 [MemphisShape](memphis-shape.md) — STANDARD (8 decorative variants)
- 🟢 [Ornament](ornament.md) — THIN (decorative section divider)

## Cross-cutting patterns (established by Button)

The following are documented in [Button](button.md) and inherited by
all primitives unless explicitly overridden:

- Memphis idiom: `border-2 border-memphis shadow-memphis rounded-none`
- Press affordance: `:active` translate(3px) + `data-[state=open]` mirror
- `cn` merge order: variant base → consumer `className` (later wins)
- `forwardRef` + native attribute passthrough
- Focus ring: `focus-visible:outline-2 outline-offset-2 outline-ring`
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`
