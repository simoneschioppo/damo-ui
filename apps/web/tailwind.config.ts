import type { Config } from 'tailwindcss'
import damo from '@axologic/ui/tailwind.preset'

const config: Config = {
  presets: [damo as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/dist/**/*.js'],
}

export default config
