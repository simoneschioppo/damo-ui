import { test } from 'node:test'
import assert from 'node:assert/strict'
import { subdir, filterComponents, formatItems } from './registry-client.mjs'

test('subdir maps registry types to namespaces', () => {
  assert.equal(subdir('registry:ui'), 'ui')
  assert.equal(subdir('registry:lib'), 'lib')
  assert.equal(subdir('registry:hook'), 'hooks')
  assert.equal(subdir('registry:style'), 'themes')
})

const ITEMS = [
  { name: 'button', type: 'registry:ui', title: 'Button' },
  { name: 'icon-button', type: 'registry:ui', title: 'Icon Button' },
  { name: 'cn', type: 'registry:lib', title: 'Cn' },
]

test('filterComponents matches name and title, case-insensitively', () => {
  assert.deepEqual(
    filterComponents(ITEMS, 'button').map((i) => i.name),
    ['button', 'icon-button'],
  )
  assert.deepEqual(
    filterComponents(ITEMS, 'BUTTON').map((i) => i.name),
    ['button', 'icon-button'],
  )
})

test('filterComponents returns all on empty query', () => {
  assert.equal(filterComponents(ITEMS, '').length, 3)
  assert.equal(filterComponents(ITEMS).length, 3)
})

test('formatItems renders sorted one-per-line', () => {
  const out = formatItems(ITEMS)
  assert.match(out, /- button \(registry:ui\) — Button/)
  assert.ok(out.indexOf('- button') < out.indexOf('- cn')) // sorted
})

test('formatItems handles the empty set', () => {
  assert.equal(formatItems([]), 'No matching components.')
})
