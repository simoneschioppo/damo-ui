import { Icon, type IconProps } from './Icon'
export function InfoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h0" />
      <path d="M11 12h1v5" />
    </Icon>
  )
}
