/**
 * `damo-ui codemod migrate-from-npm [--dry-run]`
 *
 * Migrate a project off the classic `damo-ui` npm package onto the
 * copy-paste model: rewrite `from 'damo-ui'` imports/re-exports to
 * `@/components/ui/<name>`, copy each used component via `add`, and drop
 * `damo-ui` from package.json. ts-morph keeps the rewrite TypeScript-aware
 * (handles type-only, aliased and mixed imports). Idempotent; `--dry-run`
 * prints the plan without writing.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { hasConfig, readConfig, detectSrcRoot } from '../lib/config.mjs'
import { fetchJson } from '../lib/http.mjs'
import { groupSpecsByComponent, componentImportPath, relativeImportPath } from '../lib/migrate.mjs'
import { add } from './add.mjs'
import { init } from './init.mjs'
import { c, log } from '../lib/log.mjs'

const OLD_PACKAGE = 'damo-ui'

/** Does the project declare an `@/*` path alias in tsconfig? */
function hasPathAlias(cwd) {
  for (const f of ['tsconfig.json', 'jsconfig.json']) {
    const p = join(cwd, f)
    if (!existsSync(p)) continue
    try {
      const json = JSON.parse(readFileSync(p, 'utf8').replace(/\/\/.*$/gm, ''))
      const paths = json.compilerOptions?.paths ?? {}
      if (Object.keys(paths).some((k) => k.startsWith('@/'))) return true
    } catch {
      /* ignore malformed tsconfig */
    }
  }
  return false
}

/** Pull {name, alias, isTypeOnly} from a ts-morph named import/export node. */
function specOf(node) {
  return {
    name: node.getName(),
    alias: node.getAliasNode()?.getText(),
    isTypeOnly: typeof node.isTypeOnly === 'function' ? node.isTypeOnly() : false,
  }
}

/** Remove `damo-ui` from dependencies/devDependencies; return whether it changed. */
function stripPackageDep(cwd, dryRun) {
  const p = join(cwd, 'package.json')
  if (!existsSync(p)) return false
  const json = JSON.parse(readFileSync(p, 'utf8'))
  let changed = false
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
    if (json[field]?.[OLD_PACKAGE]) {
      changed = true
      if (!dryRun) delete json[field][OLD_PACKAGE]
    }
  }
  if (changed && !dryRun) writeFileSync(p, JSON.stringify(json, null, 2) + '\n')
  return changed
}

/** @param {string[]} args  @param {object} opts { cwd, registry, deps, dryRun } */
export async function codemod(args, opts) {
  const [sub] = args
  if (sub && sub !== 'migrate-from-npm') {
    throw new Error(`Unknown codemod: ${sub}. Available: migrate-from-npm`)
  }
  const { cwd, registry, dryRun } = opts
  const tag = dryRun ? c.yellow('[dry-run] ') : ''

  if (!hasConfig(cwd)) {
    if (dryRun) log.info(`${tag}would run \`init\` (no components.json yet)`)
    else await init(opts)
  }
  const config = readConfig(cwd) ?? {}
  const aliases = config.aliases ?? {}
  const srcRoot = detectSrcRoot(cwd)
  const useAlias = hasPathAlias(cwd)

  const exportMap = await fetchJson(`${registry}/exports.json`)

  const { Project } = await import('ts-morph')
  const project = new Project({ skipAddingFilesFromTsConfig: true })
  project.addSourceFilesAtPaths([
    join(cwd, '**/*.{ts,tsx,mts,cts}'),
    `!${join(cwd, 'node_modules/**')}`,
    `!${join(cwd, '**/*.d.ts')}`,
  ])

  const usedComponents = new Set()
  const unmappedAll = new Set()
  const edits = [] // { sourceFile, decl, kind, groups }
  let fileCount = 0

  for (const sf of project.getSourceFiles()) {
    const decls = [
      ...sf.getImportDeclarations().map((d) => ({ d, kind: 'import' })),
      ...sf.getExportDeclarations().map((d) => ({ d, kind: 'export' })),
    ].filter(({ d }) => d.getModuleSpecifierValue?.() === OLD_PACKAGE)
    if (!decls.length) continue
    fileCount++

    for (const { d, kind } of decls) {
      const members = kind === 'import' ? d.getNamedImports() : d.getNamedExports()
      if (kind === 'import' && (d.getDefaultImport() || d.getNamespaceImport())) {
        log.warn(
          `default/namespace import of '${OLD_PACKAGE}' in ${relative(cwd, sf.getFilePath())} — rewrite manually`,
        )
      }
      const specs = members.map(specOf)
      const { groups, unmapped } = groupSpecsByComponent(specs, exportMap)
      unmapped.forEach((u) => unmappedAll.add(u))
      groups.forEach((_v, comp) => usedComponents.add(comp))
      edits.push({ sf, decl: d, kind, groups, declTypeOnly: d.isTypeOnly?.() ?? false })
    }
  }

  if (!usedComponents.size && !fileCount) {
    log.success(`Nothing to migrate — no \`${OLD_PACKAGE}\` imports found.`)
    return
  }

  log.step(
    `${tag}${usedComponents.size} component(s) used across ${fileCount} file(s): ${[...usedComponents].sort().join(', ')}`,
  )
  if (unmappedAll.size) {
    log.warn(`Symbols not found in the registry (left untouched): ${[...unmappedAll].join(', ')}`)
  }

  if (dryRun) {
    log.info(`${tag}would run: damo-ui add ${[...usedComponents].sort().join(' ')}`)
    log.info(`${tag}would rewrite ${edits.length} \`${OLD_PACKAGE}\` statement(s)`)
    if (stripPackageDep(cwd, true))
      log.info(`${tag}would remove \`${OLD_PACKAGE}\` from package.json`)
    log.info(`\n${tag}No files written.`)
    return
  }

  // 1. Copy the used components (+ their deps) into the project.
  if (usedComponents.size) {
    await add([...usedComponents], { ...opts, overwrite: false })
  }

  // 2. Rewrite the imports/exports.
  for (const { sf, decl, kind, groups, declTypeOnly } of edits) {
    const fileRel = relative(cwd, sf.getFilePath())
    for (const [comp, specs] of groups) {
      const moduleSpecifier = useAlias
        ? componentImportPath(comp, aliases)
        : relativeImportPath(fileRel, comp, srcRoot)
      const named = specs.map((s) => ({
        name: s.name,
        alias: s.alias && s.alias !== s.name ? s.alias : undefined,
        isTypeOnly: declTypeOnly ? false : s.isTypeOnly,
      }))
      if (kind === 'import') {
        sf.addImportDeclaration({ moduleSpecifier, namedImports: named, isTypeOnly: declTypeOnly })
      } else {
        sf.addExportDeclaration({ moduleSpecifier, namedExports: named, isTypeOnly: declTypeOnly })
      }
    }
    decl.remove()
  }
  await project.save()

  // 3. Drop the old package dependency.
  const removed = stripPackageDep(cwd, false)

  log.info('')
  log.success(`Migrated ${edits.length} statement(s) across ${fileCount} file(s).`)
  if (removed)
    log.success(`Removed \`${OLD_PACKAGE}\` from package.json — run your installer to prune it.`)
  log.info(c.dim('Review the diff, then run your formatter (Prettier/Biome) on the changed files.'))
}
