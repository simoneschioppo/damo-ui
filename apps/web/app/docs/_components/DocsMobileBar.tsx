'use client'

import { SidebarTrigger } from '@axologic/ui'
import { useTranslations } from 'next-intl'

/**
 * Mobile-only bar shown under the AppTopBar that opens the docs navigation in
 * a drawer (via the responsive Sidebar). Hidden at `lg`+, where the sticky
 * sidebar is visible instead. Sticks just below the header while scrolling.
 */
export function DocsMobileBar() {
  const t = useTranslations('docsSidebar')
  return (
    <div className="lg:hidden sticky top-[var(--header-height)] z-header flex items-center gap-3 border-b-2 border-memphis bg-background px-6 py-3">
      <SidebarTrigger />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {t('subtitle')}
      </span>
    </div>
  )
}
