'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavItem,
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarHeader,
  SidebarSubtitle,
} from '@damo/ui'
import { BRAND } from '../../../lib/brand'

export interface DocsNavEntry {
  readonly slug: string
  readonly label: string
  readonly status?: 'beta' | 'stub'
}

export interface DocsNavGroup {
  readonly title: string
  readonly entries: ReadonlyArray<DocsNavEntry>
}

export const DOCS_NAV: ReadonlyArray<DocsNavGroup> = [
  {
    title: 'Getting Started',
    entries: [{ slug: '/docs/getting-started', label: 'Introduction' }],
  },
  {
    title: 'Foundations',
    entries: [
      { slug: '/docs/foundations/tokens', label: 'Tokens' },
      { slug: '/docs/foundations/theming', label: 'Theming' },
      { slug: '/docs/foundations/colors', label: 'Colors' },
      { slug: '/docs/foundations/typography', label: 'Typography' },
      { slug: '/docs/foundations/patterns', label: 'Patterns' },
    ],
  },
  {
    title: 'Components',
    entries: [
      { slug: '/docs/components/button', label: 'Button' },
      { slug: '/docs/components/card', label: 'Card' },
      { slug: '/docs/components/dialog', label: 'Dialog' },
      { slug: '/docs/components/input', label: 'Input' },
      { slug: '/docs/components/app-top-bar', label: 'AppTopBar' },
      { slug: '/docs/components/sidebar', label: 'Sidebar' },
      { slug: '/docs/components/theme-switcher', label: 'Theme Switchers' },
      { slug: '/docs/components/display-settings-menu', label: 'Display Settings' },
    ],
  },
]

const groupTitleClass =
  'font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground px-3 mt-4 mb-2'

// Keep docs density tighter than NavItem's default (px-3 py-2.5 text-sm) — the
// docs sidebar lists many entries per group, so the smaller padding/text reads
// better here. NavItem still owns the selection chrome (gradient + outline +
// accent bar via tone="default").
const docsNavItemClass = 'px-3 py-1.5 text-[13px]'

const stubBadgeClass =
  'ml-2 inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.1em] border border-memphis text-muted-foreground'

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar aria-label="Documentation navigation">
      <SidebarHeader>
        <SidebarBrand>{BRAND.libName}</SidebarBrand>
        <SidebarSubtitle>DOCS</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>
        {DOCS_NAV.map((group) => (
          <div key={group.title}>
            <div className={groupTitleClass}>{group.title}</div>
            <nav aria-label={group.title} className="flex flex-col gap-px">
              {group.entries.map((entry) => {
                const isActive = pathname === entry.slug
                return (
                  <NavItem
                    key={entry.slug}
                    as={Link}
                    href={entry.slug}
                    active={isActive}
                    className={docsNavItemClass}
                    endAdornment={
                      entry.status === 'stub' ? (
                        <span className={stubBadgeClass}>SOON</span>
                      ) : undefined
                    }
                  >
                    {entry.label}
                  </NavItem>
                )
              })}
            </nav>
          </div>
        ))}
      </SidebarBody>
    </Sidebar>
  )
}
