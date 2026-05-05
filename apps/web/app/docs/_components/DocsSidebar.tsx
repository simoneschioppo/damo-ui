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
import { DOCS_NAV } from './docs-nav'

export type { DocsNavEntry, DocsNavGroup } from './docs-nav'
export { DOCS_NAV } from './docs-nav'

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
