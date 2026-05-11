// `useSanitizedPersistedAttr` is intentionally NOT exported from the public
// API. It is an internal helper used only by `AttrToggleGroup`. Keeping it
// out of the public surface prevents consumers from depending on an
// implementation detail that may evolve independently of the public hooks.
export {
  AttrToggleGroup,
  type AttrToggleGroupProps,
  type AttrToggleGroupVariant,
  type AttrToggleOption,
} from './attr-toggle-group'
