import { Icon, type IconProps } from './Icon'
export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </Icon>
  )
}
