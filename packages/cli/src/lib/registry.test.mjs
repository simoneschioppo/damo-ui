import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  subdirForType,
  isUrl,
  resolveItemUrl,
  collectClosure,
  aggregateNpmDeps,
} from './registry.mjs'

test('subdirForType maps registry types to namespaces', () => {
  assert.equal(subdirForType('registry:ui'), 'ui')
  assert.equal(subdirForType('registry:lib'), 'lib')
  assert.equal(subdirForType('registry:hook'), 'hooks')
  assert.equal(subdirForType('registry:style'), 'themes')
  assert.equal(subdirForType('registry:theme'), 'themes')
  assert.equal(subdirForType('registry:component'), 'ui')
})

test('isUrl detects absolute http(s) URLs', () => {
  assert.ok(isUrl('https://damo-ui.com/r/ui/button.json'))
  assert.ok(isUrl('http://localhost:3000/r/registry.json'))
  assert.ok(!isUrl('button'))
  assert.ok(!isUrl('./button.json'))
})

test('resolveItemUrl returns URLs unchanged', () => {
  const u = 'https://x.com/r/ui/button.json'
  assert.equal(resolveItemUrl(u, 'https://x.com/r', []), u)
})

test('resolveItemUrl uses the index to find a bare name type', () => {
  const index = [
    { name: 'button', type: 'registry:ui' },
    { name: 'cn', type: 'registry:lib' },
    { name: 'use-persisted-attr', type: 'registry:hook' },
  ]
  assert.equal(resolveItemUrl('button', 'https://x.com/r', index), 'https://x.com/r/ui/button.json')
  assert.equal(resolveItemUrl('cn', 'https://x.com/r', index), 'https://x.com/r/lib/cn.json')
  assert.equal(
    resolveItemUrl('use-persisted-attr', 'https://x.com/r', index),
    'https://x.com/r/hooks/use-persisted-attr.json',
  )
})

test('resolveItemUrl falls back to ui when the name is unknown', () => {
  assert.equal(resolveItemUrl('mystery', 'https://x.com/r', []), 'https://x.com/r/ui/mystery.json')
})

test('collectClosure follows registryDependencies transitively and de-dupes', async () => {
  const db = {
    'u/dialog': { name: 'dialog', type: 'registry:ui', registryDependencies: ['u/icons', 'l/cn'] },
    'u/icons': { name: 'icons', type: 'registry:ui', registryDependencies: ['l/cn'] },
    'l/cn': { name: 'cn', type: 'registry:lib' },
  }
  const fetched = []
  const fetchJson = async (url) => {
    fetched.push(url)
    return db[url]
  }
  const items = await collectClosure(['u/dialog'], fetchJson)
  assert.deepEqual(
    items.map((i) => i.name),
    ['dialog', 'icons', 'cn'],
  )
  // cn is referenced twice but fetched once.
  assert.equal(fetched.filter((u) => u === 'l/cn').length, 1)
})

test('collectClosure tolerates dependency cycles', async () => {
  const db = {
    a: { name: 'a', type: 'registry:ui', registryDependencies: ['b'] },
    b: { name: 'b', type: 'registry:ui', registryDependencies: ['a'] },
  }
  const items = await collectClosure(['a'], async (u) => db[u])
  assert.deepEqual(items.map((i) => i.name).sort(), ['a', 'b'])
})

test('aggregateNpmDeps unions and de-dupes by package name', () => {
  const items = [
    { dependencies: ['@radix-ui/react-slot@^1.2.4', 'class-variance-authority@^0.7.0'] },
    { dependencies: ['class-variance-authority@^0.7.0', 'clsx@^2.1.1'] },
    {},
  ]
  assert.deepEqual(aggregateNpmDeps(items), [
    '@radix-ui/react-slot@^1.2.4',
    'class-variance-authority@^0.7.0',
    'clsx@^2.1.1',
  ])
})
