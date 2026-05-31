import { test } from 'node:test'
import assert from 'node:assert/strict'
import { stripAlias, targetToProjectPath } from './paths.mjs'

const ALIASES = {
  components: '@/components',
  ui: '@/components/ui',
  utils: '@/lib/utils',
  lib: '@/lib',
  hooks: '@/hooks',
}

test('stripAlias removes @/ and ~/ prefixes', () => {
  assert.equal(stripAlias('@/components/ui'), 'components/ui')
  assert.equal(stripAlias('~/lib'), 'lib')
  assert.equal(stripAlias('components'), 'components')
})

test('maps a ui component target (no src root)', () => {
  assert.equal(
    targetToProjectPath('components/ui/button/button.tsx', { aliases: ALIASES, srcRoot: '' }),
    'components/ui/button/button.tsx',
  )
})

test('maps a ui component target under a src/ layout', () => {
  assert.equal(
    targetToProjectPath('components/ui/button/button.tsx', { aliases: ALIASES, srcRoot: 'src' }),
    'src/components/ui/button/button.tsx',
  )
})

test('maps lib and hooks targets', () => {
  assert.equal(targetToProjectPath('lib/cn.ts', { aliases: ALIASES }), 'lib/cn.ts')
  assert.equal(
    targetToProjectPath('hooks/use-persisted-attr.ts', { aliases: ALIASES }),
    'hooks/use-persisted-attr.ts',
  )
})

test('honours a custom ui alias', () => {
  assert.equal(
    targetToProjectPath('components/ui/button/button.tsx', {
      aliases: { ...ALIASES, ui: '@/ui' },
      srcRoot: '',
    }),
    'ui/button/button.tsx',
  )
})

test('keeps unknown namespaces (e.g. styles) as-is under srcRoot', () => {
  assert.equal(
    targetToProjectPath('styles/tokens.css', { aliases: ALIASES, srcRoot: 'src' }),
    'src/styles/tokens.css',
  )
})

test('falls back to defaults when aliases are missing', () => {
  assert.equal(
    targetToProjectPath('components/ui/card/card.tsx', { aliases: {}, srcRoot: '' }),
    'components/ui/card/card.tsx',
  )
})
