import { Icon, type IconProps } from './Icon'

export function CrownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 18h18v2H3z" />
      <path d="M3 16l2-8 4 4 3-6 3 6 4-4 2 8H3z" />
    </Icon>
  )
}
