'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/button'
import { Card } from '../../components/card'
import { Input } from '../../components/input'
import { Chip } from '../../components/chip'
import { Badge, type BadgeVariants } from '../../components/badge'

export type FeedPreviewProps = HTMLAttributes<HTMLDivElement>

type Filter = { key: string; label: string; dotColor: string }

const FILTERS: readonly Filter[] = [
  { key: 'all', label: 'Tutti', dotColor: 'var(--ink-500)' },
  { key: 'new', label: 'Nuovi', dotColor: 'var(--success)' },
  { key: 'top', label: 'Popolari', dotColor: 'var(--warning)' },
  { key: 'archive', label: 'Archiviati', dotColor: 'var(--destructive)' },
]

type Item = {
  id: string
  title: string
  author: string
  timestamp: string
  badgeLabel: string
  badgeVariant: NonNullable<BadgeVariants['variant']>
}

const ITEMS: readonly Item[] = [
  {
    id: 'a',
    title: 'Lancio della nuova piattaforma',
    author: 'Giulia Conte',
    timestamp: '2h fa',
    badgeLabel: 'Nuovo',
    badgeVariant: 'success',
  },
  {
    id: 'b',
    title: 'Report trimestrale disponibile',
    author: 'Marco Bianchi',
    timestamp: '1g fa',
    badgeLabel: 'In pausa',
    badgeVariant: 'warning',
  },
  {
    id: 'c',
    title: 'Manutenzione programmata',
    author: 'Team Ops',
    timestamp: '3g fa',
    badgeLabel: 'Chiuso',
    badgeVariant: 'destructive',
  },
]

export const FeedPreview = forwardRef<HTMLDivElement, FeedPreviewProps>(function FeedPreview(
  { className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn('flex flex-col gap-4 w-full', className)} {...rest}>
      <div className="flex items-center gap-3">
        <Input type="search" placeholder="Cerca…" aria-label="Cerca nel feed" className="flex-1" />
        <Button variant="outline">Filtri</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((filter, idx) => (
          <Chip key={filter.key} dotColor={filter.dotColor} active={idx === 0}>
            {filter.label}
          </Chip>
        ))}
      </div>

      <ul className="flex flex-col gap-3 m-0 p-0 list-none">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <Card
              variant="interactive"
              padding="sm"
              role="button"
              tabIndex={0}
              data-testid="feed-preview-item"
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="shrink-0 w-8 h-8 bg-secondary border-2 border-memphis"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base leading-tight text-foreground truncate">
                    {item.title}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {item.author} · {item.timestamp}
                  </div>
                </div>
                <Badge variant={item.badgeVariant}>{item.badgeLabel}</Badge>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
})
