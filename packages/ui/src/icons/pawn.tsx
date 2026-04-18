import { Icon, type IconProps } from './Icon'

export function PawnIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="6" r="3" />
      <path d="M9 9c0 1.5.7 3 2 4l-1 3h4l-1-3c1.3-1 2-2.5 2-4" />
      <path d="M7 20h10l-1-4H8z" />
    </Icon>
  )
}
