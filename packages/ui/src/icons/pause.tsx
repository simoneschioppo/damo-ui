import { Icon, type IconProps } from './Icon'
export function PauseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 4h4v16H7z" />
      <path d="M13 4h4v16h-4z" />
    </Icon>
  )
}
