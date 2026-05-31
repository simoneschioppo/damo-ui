/**
 * damo-ui registry generator.
 *
 * Walks `packages/ui/src` and emits a shadcn-compatible registry under
 * `apps/web/public/r/`, so the docs site doubles as the registry endpoint:
 *
 *   r/registry.json        — index of every item
 *   r/ui/<name>.json       — one file per component (+ the icon set)
 *   r/lib/<name>.json      — shared utilities (cn, i18n, …)
 *   r/hooks/<name>.json    — shared hooks
 *   r/themes/base.json     — global token / theme CSS
 *
 * Component source is rewritten so workspace-relative imports become the
 * `@/`-aliased form a copy-paste consumer expects. Internal references
 * (other components, libs, hooks, icons) are resolved transitively and
 * surfaced as `registryDependencies` (absolute URLs against REGISTRY_URL),
 * while third-party imports become pinned npm `dependencies`.
 *
 * Run: `node scripts/build-registry/build.mjs` (from packages/ui).
 * Override the base URL with `REGISTRY_URL=http://localhost:3000/r`.
 */
import { existsSync, mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, posix as P, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { classifySpecifier, extractImports, rewriteSource } from './specifiers.mjs'
import { readText, sourceFiles, walkFiles } from './fsutil.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const UI_ROOT = resolve(HERE, '../..') // packages/ui
const SRC = join(UI_ROOT, 'src')
const OUT = resolve(UI_ROOT, '../../apps/web/public/r')
const BASE_URL = (process.env.REGISTRY_URL || 'https://damo-ui.com/r').replace(/\/+$/, '')

const SCHEMA_REGISTRY = 'https://ui.shadcn.com/schema/registry.json'
const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json'

/** npm `name -> version` map taken from the library's own dependencies. */
const NPM_VERSIONS = JSON.parse(readText(join(UI_ROOT, 'package.json'))).dependencies ?? {}

/** Title-case a kebab component name (`article-card` -> `Article Card`). */
const title = (name) =>
  name
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const url = {
  component: (n) => `${BASE_URL}/ui/${n}.json`,
  lib: (n) => `${BASE_URL}/lib/${n}.json`,
  hook: (n) => `${BASE_URL}/hooks/${n}.json`,
  icons: () => `${BASE_URL}/ui/icons.json`,
}

/**
 * Collect dependencies for a set of source files: pinned npm packages and
 * the transitive workspace references (components/libs/hooks/icons).
 *
 * Dependency analysis runs against the *original* source — after rewriting,
 * `../../lib/cn` becomes `@/lib/cn` and would be misread as an npm package.
 *
 * @param {{ original: string, fileDir: string }[]} files
 * @param {string} ownerKey registry-item key of these files
 * @returns {{ npm: Set<string>, registry: Set<string>, refs: {kind: string, name?: string}[] }}
 */
function collectDeps(files, ownerKey) {
  const npm = new Set()
  const registry = new Set()
  /** @type {{kind: string, name?: string}[]} */
  const refs = []
  for (const { original, fileDir } of files) {
    for (const spec of extractImports(original)) {
      const c = classifySpecifier(spec, fileDir, ownerKey)
      switch (c.kind) {
        case 'npm': {
          const version = NPM_VERSIONS[c.pkg]
          npm.add(version ? `${c.pkg}@${version}` : c.pkg)
          break
        }
        case 'component':
          registry.add(url.component(c.name))
          refs.push({ kind: 'component', name: c.name })
          break
        case 'lib':
          registry.add(url.lib(c.name))
          refs.push({ kind: 'lib', name: c.name })
          break
        case 'hook':
          registry.add(url.hook(c.name))
          refs.push({ kind: 'hook', name: c.name })
          break
        case 'icons':
          registry.add(url.icons())
          refs.push({ kind: 'icons' })
          break
        default:
          break
      }
    }
  }
  return { npm, registry, refs }
}

/**
 * Load the shippable source files of a folder, keeping the original content,
 * its `src/`-relative directory (for import resolution), and the rewritten,
 * copy-paste-ready content under its target path.
 *
 * @param {string} absDir absolute folder to read
 * @param {string} targetPrefix destination root in the consumer project
 * @param {string} fileType shadcn file type
 * @param {string} ownerKey registry-item key these files belong to
 * @param {string[] | null} names explicit relative file list (single-file modules)
 */
function loadFiles(absDir, targetPrefix, fileType, ownerKey, names = null) {
  const srcRelBase = relative(SRC, absDir).split(/[\\/]/).join('/')
  const rels = names ?? sourceFiles(absDir)
  return rels.map((rel) => {
    const original = readText(join(absDir, rel))
    const fileDir = P.normalize(P.join(srcRelBase, P.dirname(rel)))
    const content = rewriteSource(original, fileDir, ownerKey)
    const target = `${targetPrefix}/${rel}`
    return { rel, original, fileDir, content, file: { path: target, type: fileType, target } }
  })
}

/** Build a registry-item object (sorted deps for deterministic output). */
function makeItem({ name, type, files, npm, registry, description }) {
  const item = {
    $schema: SCHEMA_ITEM,
    name,
    type,
    title: title(name),
    ...(description ? { description } : {}),
  }
  if (npm.size) item.dependencies = [...npm].sort()
  if (registry.size) item.registryDependencies = [...registry].sort()
  item.files = files.map((f) => ({ ...f.file, content: f.content }))
  return item
}

function buildComponent(name) {
  const ownerKey = `component:${name}`
  const dir = join(SRC, 'components', name)
  const files = loadFiles(dir, `components/ui/${name}`, 'registry:ui', ownerKey)
  const { npm, registry, refs } = collectDeps(files, ownerKey)
  return {
    item: makeItem({ name, type: 'registry:ui', files, npm, registry }),
    refs,
  }
}

function buildIcons() {
  const dir = join(SRC, 'icons')
  const files = loadFiles(dir, 'components/ui/icons', 'registry:ui', 'icons')
  const { npm, registry, refs } = collectDeps(files, 'icons')
  return {
    item: makeItem({ name: 'icons', type: 'registry:ui', files, npm, registry }),
    refs,
  }
}

/** A lib reference is either a single file (`lib/safe-href.ts`) or a folder (`lib/i18n/`). */
function buildShared(kind, name) {
  const ownerKey = `${kind}:${name}`
  const baseDir = join(SRC, kind === 'hook' ? 'hooks' : 'lib')
  const folder = join(baseDir, name)
  const targetRoot = kind === 'hook' ? 'hooks' : 'lib'
  const fileType = kind === 'hook' ? 'registry:hook' : 'registry:lib'

  let files
  if (existsSync(folder) && statSync(folder).isDirectory()) {
    files = loadFiles(folder, `${targetRoot}/${name}`, fileType, ownerKey)
  } else {
    // Single-file module: find the matching <name>.ts(x).
    const rel = ['.ts', '.tsx'].map((e) => `${name}${e}`).find((f) => existsSync(join(baseDir, f)))
    if (!rel) throw new Error(`Cannot resolve shared ${kind} "${name}" under ${baseDir}`)
    files = loadFiles(baseDir, targetRoot, fileType, ownerKey, [rel])
  }
  const { npm, registry, refs } = collectDeps(files, ownerKey)
  const type = kind === 'hook' ? 'registry:hook' : 'registry:lib'
  return { item: makeItem({ name, type, files, npm, registry }), refs }
}

function buildThemeBase() {
  const stylesDir = join(SRC, 'styles')
  const cssFiles = walkFiles(stylesDir).filter((f) => f.endsWith('.css'))
  const files = cssFiles.map((rel) => {
    const target = `styles/${rel}`
    return {
      rel,
      content: readText(join(stylesDir, rel)),
      file: { path: target, type: 'registry:file', target },
    }
  })
  return makeItem({
    name: 'base',
    type: 'registry:style',
    files,
    npm: new Set(),
    registry: new Set(),
    description: 'Memphis design tokens, theme variables and global styles.',
  })
}

function writeJson(relPath, data) {
  const abs = join(OUT, relPath)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, JSON.stringify(data, null, 2) + '\n')
}

function listComponentNames() {
  const componentsDir = join(SRC, 'components')
  return walkFiles(componentsDir)
    .map((f) => f.split('/')[0])
    .filter((n, i, arr) => arr.indexOf(n) === i)
    .sort()
}

function build() {
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })

  /** @type {Map<string, object>} key `kind:name` -> item; also drives the index. */
  const emitted = new Map()
  const indexItems = []

  const componentNames = listComponentNames()
  const queue = componentNames.map((name) => ({ kind: 'component', name }))
  const seen = new Set()

  while (queue.length) {
    const ref = queue.shift()
    const key = ref.kind === 'icons' ? 'icons' : `${ref.kind}:${ref.name}`
    if (seen.has(key)) continue
    seen.add(key)

    let built
    if (ref.kind === 'component') built = buildComponent(ref.name)
    else if (ref.kind === 'icons') built = buildIcons()
    else built = buildShared(ref.kind, ref.name)

    emitted.set(key, built.item)
    for (const next of built.refs) queue.push(next)
  }

  // Emit each item under the path implied by its type.
  for (const [key, item] of emitted) {
    const sub =
      item.type === 'registry:hook' ? 'hooks' : item.type === 'registry:lib' ? 'lib' : 'ui'
    writeJson(`${sub}/${item.name}.json`, item)
    indexItems.push({
      name: item.name,
      type: item.type,
      title: item.title,
      ...(item.description ? { description: item.description } : {}),
    })
  }

  // Theme base (not part of the component closure).
  const themeBase = buildThemeBase()
  writeJson('themes/base.json', themeBase)
  indexItems.push({ name: themeBase.name, type: themeBase.type, title: themeBase.title })

  indexItems.sort((a, b) => a.name.localeCompare(b.name))
  writeJson('registry.json', {
    $schema: SCHEMA_REGISTRY,
    name: 'damo-ui',
    homepage: 'https://damo-ui.com',
    items: indexItems,
  })

  const counts = indexItems.reduce((acc, i) => ((acc[i.type] = (acc[i.type] ?? 0) + 1), acc), {})
  console.log(`[build-registry] wrote ${indexItems.length} items to ${OUT}`)
  console.log(`[build-registry] base URL: ${BASE_URL}`)
  for (const [type, n] of Object.entries(counts)) console.log(`  ${type}: ${n}`)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  build()
}

export { build }
