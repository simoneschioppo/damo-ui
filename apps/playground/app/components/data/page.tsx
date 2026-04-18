'use client'

import Link from 'next/link'
import {
  Container,
  Box,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  Stat,
  TrophyIcon,
  ClockIcon,
  CrownIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 40,
  paddingBottom: 28,
  borderBottom: '1px solid var(--border)',
}
const h2Style = { fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 12px' } as const

const players = [
  { rank: 1, name: 'Korai', elo: 2150, wins: 124, losses: 18, country: '🇯🇵' },
  { rank: 2, name: 'MarinaChess', elo: 1987, wins: 98, losses: 24, country: '🇮🇹' },
  { rank: 3, name: 'Andrea', elo: 1842, wins: 72, losses: 31, country: '🇮🇹' },
  { rank: 4, name: 'Damo42', elo: 1610, wins: 45, losses: 29, country: '🇩🇪' },
  { rank: 5, name: 'Pezzomatto', elo: 1498, wins: 38, losses: 42, country: '🇫🇷' },
]

export default function DataPage() {
  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Data Display
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          5 componenti: Avatar, AvatarGroup, Accordion, Table, Stat.
        </p>

        {/* Avatar */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Avatar</h2>
          <Box direction="row" gap={4} align="center">
            <Avatar size="sm">
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <Avatar size="md">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <Avatar size="xl">
              <AvatarImage src="https://i.pravatar.cc/80?img=15" alt="Andrea" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar shape="square" size="lg">
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </Box>
          <div style={{ marginTop: 16 }}>
            <AvatarGroup max={4}>
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>K</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>X</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>Z</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>
        </section>

        {/* Stat */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Stat</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 32,
              maxWidth: 800,
            }}
          >
            <Stat label="ELO rating" value="1842" delta="+42" deltaTone="positive" />
            <Stat
              label="Vittorie"
              value="72"
              delta="70% win rate"
              deltaTone="neutral"
              icon={<TrophyIcon size={14} />}
            />
            <Stat
              label="Tempo medio"
              value="4:12"
              delta="-18s"
              deltaTone="positive"
              icon={<ClockIcon size={14} />}
            />
            <Stat
              label="Streak"
              value="8"
              delta="+3"
              deltaTone="positive"
              icon={<CrownIcon size={14} />}
            />
          </div>
        </section>

        {/* Accordion */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Accordion</h2>
          <div style={{ maxWidth: 520 }}>
            <Accordion type="single" collapsible defaultValue="rules">
              <AccordionItem value="rules">
                <AccordionTrigger>Regole base</AccordionTrigger>
                <AccordionContent>
                  Damacchi è una dama ibrida che diventa scacchi. Ogni pedina che raggiunge
                  l&apos;ultima riga promuove in un pezzo scacchistico.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="modes">
                <AccordionTrigger>Modalità di gioco</AccordionTrigger>
                <AccordionContent>
                  Classic 8×8, Classic 10×10, Rage. Ognuna con regole specifiche.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pieces">
                <AccordionTrigger>Pezzi e promozione</AccordionTrigger>
                <AccordionContent>
                  Cavallo, Alfiere, Torre, Regina. Promozione a esclusione sequenziale.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Table */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Table</h2>
          <div style={{ maxWidth: 800 }}>
            <Table>
              <TableCaption>Classifica top 5 — stagione 2026-Q1</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Paese</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>ELO</TableHead>
                  <TableHead>V</TableHead>
                  <TableHead>S</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((p) => (
                  <TableRow key={p.rank}>
                    <TableCell className="font-mono">{p.rank}</TableCell>
                    <TableCell style={{ fontSize: 18 }}>{p.country}</TableCell>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell className="font-mono">{p.elo}</TableCell>
                    <TableCell>{p.wins}</TableCell>
                    <TableCell>{p.losses}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Totale</TableCell>
                  <TableCell>377</TableCell>
                  <TableCell>144</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </section>

        <p style={{ marginTop: 32 }}>
          <Link href="/" style={{ fontWeight: 600, color: 'var(--accent)' }}>
            ← Home
          </Link>
        </p>
      </div>
    </Container>
  )
}
