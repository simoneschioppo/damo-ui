import { Icon, type IconProps } from './Icon'

export function TrophyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5.5H4.5v1.5a3 3 0 0 0 3 3" />
      <path d="M16 5.5h3.5v1.5a3 3 0 0 1-3 3" />
      <path d="M10 14.5h4M9 20h6M12 14.5V20" />
    </Icon>
  )
}
