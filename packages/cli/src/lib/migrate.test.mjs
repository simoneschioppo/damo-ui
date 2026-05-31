import { test } from 'node:test'
import assert from 'node:assert/strict'
import { groupSpecsByComponent, componentImportPath, relativeImportPath } from './migrate.mjs'

const MAP = { Button: 'button', ButtonProps: 'button', Card: 'card', DialogContent: 'dialog' }

test('groupSpecsByComponent buckets symbols by component', () => {
  const { groups, unmapped } = groupSpecsByComponent(
    [{ name: 'Button' }, { name: 'ButtonProps', isTypeOnly: true }, { name: 'Card' }],
    MAP,
  )
  assert.deepEqual([...groups.keys()].sort(), ['button', 'card'])
  assert.equal(groups.get('button').length, 2)
  assert.deepEqual(unmapped, [])
})

test('groupSpecsByComponent collects unknown symbols', () => {
  const { groups, unmapped } = groupSpecsByComponent([{ name: 'Button' }, { name: 'Mystery' }], MAP)
  assert.deepEqual([...groups.keys()], ['button'])
  assert.deepEqual(unmapped, ['Mystery'])
})

test('componentImportPath uses the default ui alias', () => {
  assert.equal(componentImportPath('button'), '@/components/ui/button')
})

test('componentImportPath honours a custom ui alias', () => {
  assert.equal(componentImportPath('button', { ui: '@/ui' }), '@/ui/button')
})

test('relativeImportPath computes a relative specifier (no src root)', () => {
  // file at app/page.tsx -> components/ui/button
  assert.equal(relativeImportPath('app/page.tsx', 'button', ''), '../components/ui/button')
})

test('relativeImportPath under a src/ layout', () => {
  assert.equal(
    relativeImportPath('src/app/dashboard/page.tsx', 'card', 'src'),
    '../../components/ui/card',
  )
})

test('relativeImportPath from a sibling components dir prefixes ./', () => {
  assert.equal(relativeImportPath('components/widget.tsx', 'button', ''), './ui/button')
})
