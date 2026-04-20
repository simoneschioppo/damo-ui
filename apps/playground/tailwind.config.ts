import type { Config } from 'tailwindcss'
import damacchi from '@simoneschioppo/damo-ui/tailwind.preset'

const config: Config = {
  presets: [damacchi as Config],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', '../../packages/ui/dist/**/*.js'],
}

export default config
