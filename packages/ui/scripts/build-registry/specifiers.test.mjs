import { describe, it, expect } from 'vitest'
import {
  extractImports,
  npmPackageName,
  itemKey,
  classifySpecifier,
  rewriteSource,
} from './specifiers.mjs'

// Most components live at `components/<name>`; that is the default context.
const BTN = 'components/button'
const BTN_KEY = 'component:button'

describe('extractImports', () => {
  it('captures named, default, type-only and re-export specifiers', () => {
    const src = [
      "import { Slot } from '@radix-ui/react-slot'",
      "import { forwardRef, type ButtonHTMLAttributes } from 'react'",
      "import { cn } from '../../lib/cn'",
      "export { Button, type ButtonProps } from './button'",
      "import type { CardProps } from '../card'",
    ].join('\n')
    expect(extractImports(src).sort()).toEqual(
      ['../../lib/cn', '../card', './button', '@radix-ui/react-slot', 'react'].sort(),
    )
  })

  it('captures multiline import blocks', () => {
    expect(extractImports("import {\n  Box,\n  type BoxProps,\n} from '../box'")).toContain(
      '../box',
    )
  })

  it('captures side-effect imports', () => {
    expect(extractImports("import './tokens.css'")).toContain('./tokens.css')
  })

  it('dedupes repeated specifiers', () => {
    expect(extractImports("import { a } from 'x'\nimport { b } from 'x'")).toEqual(['x'])
  })
})

describe('npmPackageName', () => {
  it('keeps the scope for scoped packages', () => {
    expect(npmPackageName('@radix-ui/react-slot')).toBe('@radix-ui/react-slot')
  })
  it('collapses deep imports to the package root', () => {
    expect(npmPackageName('date-fns/locale')).toBe('date-fns')
  })
  it('returns plain package names unchanged', () => {
    expect(npmPackageName('clsx')).toBe('clsx')
  })
})

describe('itemKey', () => {
  it('keys components, libs, hooks and icons by their namespace', () => {
    expect(itemKey('components/button')).toBe('component:button')
    expect(itemKey('components/button/button.variants')).toBe('component:button')
    expect(itemKey('lib/i18n/dictionaries')).toBe('lib:i18n')
    expect(itemKey('hooks/use-persisted-attr')).toBe('hook:use-persisted-attr')
    expect(itemKey('icons/check')).toBe('icons')
    expect(itemKey('elsewhere/x')).toBeNull()
  })
})

describe('classifySpecifier', () => {
  it('treats react / react-dom as peer (react kind)', () => {
    expect(classifySpecifier('react', BTN, BTN_KEY).kind).toBe('react')
    expect(classifySpecifier('react-dom/client', BTN, BTN_KEY).kind).toBe('react')
  })

  it('treats bare specifiers as npm', () => {
    expect(classifySpecifier('class-variance-authority', BTN, BTN_KEY)).toEqual({
      kind: 'npm',
      pkg: 'class-variance-authority',
    })
  })

  it('treats same-item imports as shipped-together', () => {
    expect(classifySpecifier('./button.variants', BTN, BTN_KEY).kind).toBe('same')
  })

  it('rewrites a component lib import (depth ../../)', () => {
    expect(classifySpecifier('../../lib/cn', BTN, BTN_KEY)).toEqual({
      kind: 'lib',
      name: 'cn',
      rewrite: '@/lib/cn',
    })
  })

  it('rewrites the icons barrel', () => {
    expect(classifySpecifier('../../icons', BTN, BTN_KEY)).toEqual({
      kind: 'icons',
      rewrite: '@/components/ui/icons',
    })
  })

  it('rewrites a sibling component barrel', () => {
    expect(classifySpecifier('../card', BTN, BTN_KEY)).toEqual({
      kind: 'component',
      name: 'card',
      rewrite: '@/components/ui/card',
    })
  })

  it('rewrites a sibling component deep import', () => {
    expect(classifySpecifier('../popover/popover', BTN, BTN_KEY)).toEqual({
      kind: 'component',
      name: 'popover',
      rewrite: '@/components/ui/popover/popover',
    })
  })

  it('resolves a hook-depth lib import (../lib/cn from hooks/)', () => {
    // A file in hooks/ reaches lib with a single `../`, unlike a component.
    expect(classifySpecifier('../lib/cn', 'hooks', 'hook:use-persisted-attr')).toEqual({
      kind: 'lib',
      name: 'cn',
      rewrite: '@/lib/cn',
    })
  })

  it('treats an intra-folder lib import as same item', () => {
    expect(classifySpecifier('./dictionaries', 'lib/i18n', 'lib:i18n').kind).toBe('same')
  })

  it('treats a cross-lib import as a lib dependency', () => {
    expect(classifySpecifier('../cn', 'lib/i18n', 'lib:i18n')).toEqual({
      kind: 'lib',
      name: 'cn',
      rewrite: '@/lib/cn',
    })
  })
})

describe('rewriteSource', () => {
  it('rewrites all cross-item imports, leaving npm/react/same alone', () => {
    const src = [
      "import { Slot } from '@radix-ui/react-slot'",
      "import { forwardRef } from 'react'",
      "import { cn } from '../../lib/cn'",
      "import { Card } from '../card'",
      "import { buttonVariants } from './button.variants'",
    ].join('\n')
    const out = rewriteSource(src, BTN, BTN_KEY)
    expect(out).toContain("from '@radix-ui/react-slot'")
    expect(out).toContain("from 'react'")
    expect(out).toContain("from '@/lib/cn'")
    expect(out).toContain("from '@/components/ui/card'")
    expect(out).toContain("from './button.variants'")
    expect(out).not.toContain('../../lib/cn')
    expect(out).not.toContain("'../card'")
  })

  it('does not rewrite a specifier that is a prefix of another', () => {
    const src = "import { a } from '../card'\nimport { b } from '../card-grid'"
    const out = rewriteSource(src, BTN, BTN_KEY)
    expect(out).toContain("from '@/components/ui/card'")
    expect(out).toContain("from '@/components/ui/card-grid'")
  })

  it('supports double-quoted specifiers', () => {
    expect(rewriteSource('import { cn } from "../../lib/cn"', BTN, BTN_KEY)).toContain('"@/lib/cn"')
  })
})
