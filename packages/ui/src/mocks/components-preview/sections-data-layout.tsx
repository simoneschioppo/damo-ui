'use client'

import { cn } from '../../lib/cn'
import { Avatar, AvatarFallback, AvatarGroup } from '../../components/avatar'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../components/accordion'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../../components/table'
import { Stat } from '../../components/stat'
import { Medal } from '../../components/medal'
import { Badge } from '../../components/badge'
import { Separator } from '../../components/separator'
import { Ornament } from '../../components/ornament'
import { MemphisShape } from '../../components/memphis-shape'
import { ScrollArea } from '../../components/scroll-area'
import { AspectRatio } from '../../components/aspect-ratio'
import { Section, Subgroup, TABLE_ROWS } from './_helpers'

/**
 * Data + Layout sections extracted from the monolithic
 * `components-preview.tsx` so the main file fits the 800-line coding-style
 * cap (audit H-19). Both sections are pure presentational — no internal
 * state — so they slot back into the orchestrator with zero behavioural
 * change.
 */
export function DataSection() {
  return (
    <Section id="data" title="Data display" caption="LISTS · TABLES · METRICS">
      <Subgroup label="Stats" inline={false}>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 w-full max-w-3xl">
          <Stat label="Visite" value="12.4k" delta="+8.2%" deltaTone="positive" />
          <Stat label="Ordini" value="184" delta="-1.6%" deltaTone="negative" />
          <Stat label="Conv." value="3.1%" />
          <Stat label="MRR" value="€42k" delta="+24%" deltaTone="positive" />
        </div>
      </Subgroup>

      <Subgroup label="Charts" inline={false}>
        {/* Mini bar chart — each bar consumes one --chart-N token via
            the bg-chart-N Tailwind utility so the Identity → Charts
            controls are visually verifiable. The container is tall
            enough for the largest bar + label without overflowing. */}
        <div
          className="flex flex-col gap-2 p-3 border-2 border-memphis bg-card w-fit"
          aria-label="Chart palette demo"
        >
          <div className="flex items-end gap-3 h-24">
            {([1, 2, 3, 4, 5] as const).map((i) => (
              <div
                key={i}
                data-chart-bar={i}
                className={cn(
                  'w-7 border-2 border-memphis',
                  i === 1 && 'bg-chart-1',
                  i === 2 && 'bg-chart-2',
                  i === 3 && 'bg-chart-3',
                  i === 4 && 'bg-chart-4',
                  i === 5 && 'bg-chart-5',
                )}
                style={{ height: `${28 + i * 12}px` }}
              />
            ))}
          </div>
          <div className="flex items-end gap-3">
            {([1, 2, 3, 4, 5] as const).map((i) => (
              <span key={i} className="w-7 text-center font-mono text-[10px] text-muted-foreground">
                {i}
              </span>
            ))}
          </div>
        </div>
      </Subgroup>

      <Subgroup label="App pattern" inline={false}>
        {/* Memphis app-pattern swatch — interpolates --app-pattern-color-1/2/3
            + --app-pattern-size, so the Identity → App pattern controls
            drive the live preview. Sized large enough that the default
            140px tile reads as an actual repeating pattern (≥4×2 reps),
            not as a handful of isolated dots. */}
        <div
          data-testid="app-pattern-swatch"
          aria-label="App pattern preview"
          className="w-full max-w-2xl h-44 border-2 border-memphis"
          style={{
            backgroundColor: 'var(--card)',
            backgroundImage:
              'radial-gradient(circle at 25% 25%, var(--app-pattern-color-1) 9%, transparent 10%), radial-gradient(circle at 75% 75%, var(--app-pattern-color-2) 9%, transparent 10%), radial-gradient(circle at 50% 50%, var(--app-pattern-color-3) 6%, transparent 7%)',
            backgroundSize: 'var(--app-pattern-size, 140px) var(--app-pattern-size, 140px)',
          }}
        />
      </Subgroup>

      <Subgroup label="Medals">
        <Medal rank="bronze" value="3" label="Bronze" size={64} />
        <Medal rank="silver" value="2" label="Silver" size={64} />
        <Medal rank="gold" value="1" label="Gold" size={64} />
        <Medal rank="master" value="M" label="Master" size={64} />
        <Medal rank="grandmaster" value="GM" label="GM" size={64} />
      </Subgroup>

      <Subgroup label="Avatars (initials only — no remote images)">
        <Avatar size="md">
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarFallback>GB</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarFallback>LV</AvatarFallback>
        </Avatar>
        <AvatarGroup max={4}>
          <Avatar size="md">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>B</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>D</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>E</AvatarFallback>
          </Avatar>
          <Avatar size="md">
            <AvatarFallback>F</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </Subgroup>

      <Subgroup label="Accordion" inline={false}>
        <Accordion type="single" collapsible className="w-full max-w-xl">
          <AccordionItem value="a">
            <AccordionTrigger>Sezione A</AccordionTrigger>
            <AccordionContent>Contenuto sezione A.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Sezione B</AccordionTrigger>
            <AccordionContent>Contenuto sezione B.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Subgroup>

      <Subgroup label="Table" inline={false}>
        <div className="w-full max-w-3xl">
          <Table>
            <TableCaption>Utenti recenti</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Ultimo accesso</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TABLE_ROWS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.last}</TableCell>
                  <TableCell>
                    <Badge variant={row.badge}>{row.label}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Totale</TableCell>
                <TableCell>{TABLE_ROWS.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Subgroup>
    </Section>
  )
}

export function LayoutSection() {
  return (
    <Section id="layout" title="Layout primitives" caption="STRUCTURE">
      <Subgroup label="Separators" inline={false}>
        <div className="flex flex-col gap-3 w-full max-w-xl">
          <div className="flex items-center gap-3">
            <span className="text-sm">Top</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm">Center</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm">Bottom</span>
          </div>
          <Separator />
        </div>
      </Subgroup>

      <Subgroup label="Decorative shapes">
        <Ornament />
        <MemphisShape variant="zigzag" size={48} color="var(--primary)" />
        <MemphisShape variant="blob" size={48} color="var(--secondary)" />
        <MemphisShape variant="diamond" size={32} color="var(--info)" />
        <MemphisShape variant="circle" size={32} color="var(--success)" />
        <MemphisShape variant="triangle" size={32} color="var(--warning)" />
      </Subgroup>

      <Subgroup label="Scroll & ratio containers">
        <div className="w-72 border-2 border-memphis p-2 bg-card">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground block mb-1">
            ScrollArea
          </span>
          <ScrollArea className="h-32 rounded-none">
            <div className="flex flex-col gap-1.5 pr-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="text-sm">
                  Riga numero {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-72 border-2 border-memphis bg-card">
          <AspectRatio ratio={16 / 9} className="bg-secondary text-secondary-foreground">
            <div className="flex items-center justify-center h-full font-mono text-xs uppercase tracking-[0.2em]">
              16 : 9
            </div>
          </AspectRatio>
        </div>
      </Subgroup>
    </Section>
  )
}
