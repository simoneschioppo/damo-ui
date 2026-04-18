'use client'

import Link from 'next/link'
import {
  Container,
  Box,
  AppShell,
  PageHeader,
  NavItem,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  HomeIcon,
  SearchIcon,
  CogIcon,
  TrophyIcon,
  PlusIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 40,
  paddingBottom: 28,
  borderBottom: '1px solid var(--border)',
}
const h2Style = { fontFamily: 'var(--font-display)', fontSize: 28, margin: '0 0 12px' } as const

const brandStyle = {
  padding: '8px 4px 16px',
  marginBottom: 12,
  borderBottom: '1px solid var(--border)',
  fontFamily: 'var(--font-display)',
  fontSize: 18,
  letterSpacing: '0.12em',
} as const

function Sidebar({ tone }: { tone: 'default' | 'onDark' }) {
  return (
    <>
      <div style={brandStyle}>DAMACCHI</div>
      <NavItem href="#" tone={tone} icon={<HomeIcon size={18} />} active>
        Home
      </NavItem>
      <NavItem href="#" tone={tone} icon={<SearchIcon size={18} />}>
        Cerca
      </NavItem>
      <NavItem href="#" tone={tone} icon={<TrophyIcon size={18} />}>
        Classifica
      </NavItem>
      <NavItem href="#" tone={tone} icon={<CogIcon size={18} />}>
        Impostazioni
      </NavItem>
    </>
  )
}

function DemoContent() {
  return (
    <div style={{ padding: 32 }}>
      <PageHeader
        eyebrow="Dashboard"
        title="Panoramica"
        description="Riepilogo delle tue ultime partite."
        actions={
          <Button size="sm">
            <PlusIcon size={16} /> Nuova partita
          </Button>
        }
      />
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 16 }}
      >
        <Card variant="default">
          <CardHeader>
            <CardTitle>Ultima partita</CardTitle>
            <CardDescription>Vittoria · 4:12</CardDescription>
          </CardHeader>
          <CardBody>Testo di esempio della card.</CardBody>
        </Card>
        <Card variant="featured">
          <CardHeader>
            <CardTitle>Risultato stagione</CardTitle>
            <CardDescription>+42 ELO</CardDescription>
          </CardHeader>
          <CardBody>Progresso del mese.</CardBody>
        </Card>
      </div>
    </div>
  )
}

export default function LayoutPage() {
  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Layout
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          2 componenti: AppShell (sidebar + main) e PageHeader.
        </p>

        {/* PageHeader */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>PageHeader</h2>
          <Box direction="column" gap={6}>
            <PageHeader title="Classifica" description="Top players del mese." />
            <PageHeader
              eyebrow="Shop"
              title="Set di pezzi"
              description="Sblocca nuovi set."
              actions={
                <>
                  <Button variant="ghost" size="sm">
                    <SearchIcon size={16} /> Cerca
                  </Button>
                  <Button size="sm">
                    <PlusIcon size={16} /> Nuovo
                  </Button>
                </>
              }
            />
          </Box>
        </section>

        {/* AppShell light */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>AppShell · light</h2>
          <div
            style={{
              height: 520,
              width: '100%',
              border: '2px solid var(--border-memphis)',
              overflow: 'hidden',
              background: 'var(--bg)',
            }}
          >
            <AppShell sidebar={<Sidebar tone="default" />}>
              <DemoContent />
            </AppShell>
          </div>
        </section>

        {/* AppShell dark */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>AppShell · onDark sidebar</h2>
          <div
            style={{
              height: 520,
              width: '100%',
              border: '2px solid var(--border-memphis)',
              overflow: 'hidden',
              background: 'var(--bg)',
            }}
          >
            <AppShell sidebarTone="onDark" sidebar={<Sidebar tone="onDark" />}>
              <DemoContent />
            </AppShell>
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
