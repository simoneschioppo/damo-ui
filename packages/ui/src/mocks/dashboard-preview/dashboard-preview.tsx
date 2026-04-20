'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/button'
import { Card, CardHeader, CardTitle, CardBody } from '../../components/card'
import { Chip } from '../../components/chip'
import { Stat } from '../../components/stat'

export type DashboardPreviewProps = HTMLAttributes<HTMLDivElement>

type Bar = { height: number; highlight?: boolean; label: string }

const BARS: readonly Bar[] = [
  { height: 32, label: 'Lun' },
  { height: 56, label: 'Mar' },
  { height: 40, label: 'Mer' },
  { height: 72, label: 'Gio' },
  { height: 88, highlight: true, label: 'Ven' },
  { height: 48, label: 'Sab' },
  { height: 64, label: 'Dom' },
]

type Filter = { key: string; label: string; dotColor?: string }

const FILTERS: readonly Filter[] = [
  { key: 'all', label: 'Tutti', dotColor: 'var(--plum-500)' },
  { key: '7g', label: '7g', dotColor: 'var(--success)' },
  { key: '30g', label: '30g', dotColor: 'var(--warning)' },
  { key: '90g', label: '90g', dotColor: 'var(--danger)' },
]

export const DashboardPreview = forwardRef<HTMLDivElement, DashboardPreviewProps>(
  function DashboardPreview({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex flex-col gap-6 w-full', className)} {...rest}>
        <header className="flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl leading-tight text-ink m-0">Dashboard</h2>
          <Button variant="primary">+ Nuovo</Button>
        </header>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Stat label="Ricavi" value="€12,4k" delta="+8,2%" deltaTone="positive" />
          <Stat label="Utenti" value="1.284" delta="+214" deltaTone="positive" />
          <Stat label="Conversione" value="3,2%" delta="-0,4%" deltaTone="negative" />
        </div>

        <Card variant="default" padding="md">
          <CardHeader>
            <CardTitle>Attività settimanale</CardTitle>
          </CardHeader>
          <CardBody>
            <div
              className="flex items-end justify-between gap-3 w-full"
              style={{ height: 140 }}
            >
              {BARS.map((bar) => (
                <div
                  key={bar.label}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <div
                    data-testid="dashboard-bar"
                    className={cn(
                      'w-full border-2 border-border-memphis',
                      bar.highlight ? 'bg-gold-500' : 'bg-plum-500',
                    )}
                    style={{ height: bar.height }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter, idx) => (
            <Chip
              key={filter.key}
              dotColor={filter.dotColor}
              active={idx === 0}
            >
              {filter.label}
            </Chip>
          ))}
        </div>
      </div>
    )
  },
)
