# Damo UI — Implementation Plan — Phase 5 Form Inputs

> Use superpowers:subagent-driven-development.

**Goal:** 11 form input components: Input, Textarea, Label, Checkbox, Radio+RadioGroup, Switch, Slider, Select, Combobox, SegmentedControl, DatePicker. Tier 2 Memphis soft (bordo 1px soft + radius 4px + focus ring gold).

**Pattern Tier 2 (Memphis soft):**

```
base: border-thin border-border rounded-md bg-surface text-ink
      transition-colors duration-fast
hover: border-border-strong
focus-visible: border-accent outline outline-2 outline-offset-2 outline-ring
disabled: opacity-50 pointer-events-none
```

**Radix deps da installare:** `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-switch`, `@radix-ui/react-slider`, `@radix-ui/react-select`, `@radix-ui/react-popover`, `@radix-ui/react-toggle-group`, `cmdk`, `react-day-picker`, `date-fns`.

---

## Tasks

- [ ] **T1**: Input + Textarea + Label — tier 2 nativi stilizzati
- [ ] **T2**: Checkbox + Radio+RadioGroup + Switch — Radix primitives (trio toggle)
- [ ] **T3**: Slider + SegmentedControl — Radix Slider + Toggle Group
- [ ] **T4**: Select — Radix Select wrapper con viewport + items stilizzati Memphis
- [ ] **T5**: DatePicker + Combobox — react-day-picker + cmdk+popover
- [ ] **T6**: Barrel + /components/forms playground + e2e + push + CI verde

Ogni task include: implementazione + stories Ladle + typecheck + format + commit.
