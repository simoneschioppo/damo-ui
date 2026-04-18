import { Icon, type IconProps } from './Icon'
export function TrashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16" />
      <path d="M10 4h4v2h-4z" />
      <path d="M6 6v14h12V6" />
      <path d="M10 10v7M14 10v7" />
    </Icon>
  )
}
