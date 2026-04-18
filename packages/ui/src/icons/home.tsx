import { Icon, type IconProps } from './Icon'

export function HomeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10.5V20h13V10.5" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  )
}
