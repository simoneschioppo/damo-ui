'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/button'
import { Badge } from '../../components/badge'
import { Chip } from '../../components/chip'
import { UserCard } from '../../components/user-card'
import { Medal, type MedalRank } from '../../components/medal'

export interface ProfilePreviewProps extends HTMLAttributes<HTMLDivElement> {}

type Achievement = { rank: MedalRank; value: string; label: string }

const ACHIEVEMENTS: readonly Achievement[] = [
  { rank: 'bronze', value: '1', label: 'Primo progetto' },
  { rank: 'silver', value: '2', label: 'Dieci progetti' },
  { rank: 'gold', value: '3', label: 'Team leader' },
  { rank: 'master', value: 'M', label: 'Mentor' },
]

const INTERESTS = ['Design', 'Typography', 'UX', 'Frontend'] as const

export const ProfilePreview = forwardRef<HTMLDivElement, ProfilePreviewProps>(
  function ProfilePreview({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex flex-col gap-5 w-full', className)} {...rest}>
        <UserCard
          name="Marina Rossi"
          meta="marina@acme.io · utente da 2024"
          trailing={
            <Button variant="ghost" size="sm">
              Modifica
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="copper">PRO</Badge>
          <Badge variant="default">Early adopter</Badge>
          <Badge variant="default">42 progetti</Badge>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted m-0">
            Riconoscimenti
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((a) => (
              <Medal key={a.rank} rank={a.rank} value={a.value} label={a.label} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted m-0">
            Interessi
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {INTERESTS.map((interest) => (
              <Chip key={interest}>{interest}</Chip>
            ))}
          </div>
        </section>
      </div>
    )
  },
)
