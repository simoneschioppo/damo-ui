// Apps/web private showcase components.
//
// These were originally part of damo-ui but were narrow to design-system
// documentation surfaces, so they were moved here in cycle 8 to keep the
// public lib API focused on general-purpose web components. They live with
// the docs site that actually consumes them.

export { ShowcaseCard, type ShowcaseCardProps } from './showcase-card/showcase-card'
export { SubPanel, type SubPanelProps } from './sub-panel/sub-panel'
export { SectionHeader, type SectionHeaderProps } from './section-header/section-header'
export {
  TypeSpecimen,
  type TypeSpecimenProps,
  type TypeSpecimenScaleRow,
} from './type-specimen/type-specimen'
export { ColorScale, type ColorScaleProps, type ColorStop } from './color-scale/color-scale'
export { TokenSwatch, type TokenSwatchProps } from './token-swatch/token-swatch'
export { PatternSwatch, type PatternSwatchProps } from './pattern-swatch/pattern-swatch'
export { TooltipCard, type TooltipCardProps } from './tooltip-card/tooltip-card'
