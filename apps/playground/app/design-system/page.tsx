import { permanentRedirect } from 'next/navigation'

export default function DesignSystemRedirect(): never {
  permanentRedirect('/docs')
}
