/** Read/write the consumer's `components.json` and detect project layout. */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export const CONFIG_FILE = 'components.json'

/** shadcn-compatible default config, pointed at the damo-ui registry. */
export const DEFAULT_CONFIG = {
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'default',
  rsc: true,
  tsx: true,
  tailwind: {
    config: '',
    css: 'app/globals.css',
    baseColor: 'neutral',
    cssVariables: true,
  },
  aliases: {
    components: '@/components',
    ui: '@/components/ui',
    utils: '@/lib/utils',
    lib: '@/lib',
    hooks: '@/hooks',
  },
}

/** True when the project keeps source under `src/` (affects where `@/` points). */
export function detectSrcRoot(cwd) {
  return existsSync(join(cwd, 'src')) ? 'src' : ''
}

export function configPath(cwd) {
  return join(cwd, CONFIG_FILE)
}

export function hasConfig(cwd) {
  return existsSync(configPath(cwd))
}

export function readConfig(cwd) {
  if (!hasConfig(cwd)) return null
  try {
    return JSON.parse(readFileSync(configPath(cwd), 'utf8'))
  } catch (err) {
    throw new Error(`Invalid ${CONFIG_FILE}: ${err.message}`)
  }
}

export function writeConfig(cwd, config) {
  writeFileSync(configPath(cwd), JSON.stringify(config, null, 2) + '\n')
}
