import { Icon, type IconProps } from './Icon'
export function ExternalLinkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
      <path d="M14 4h6v6" />
      <path d="m20 4-8 8" />
    </Icon>
  )
}
