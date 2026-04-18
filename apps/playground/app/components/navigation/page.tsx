'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Container,
  Box,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  NavItem,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  Badge,
  HomeIcon,
  SearchIcon,
  CogIcon,
  TrophyIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 40,
  paddingBottom: 28,
  borderBottom: '1px solid var(--border)',
}
const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 28,
  margin: '0 0 12px',
} as const

export default function NavigationPage() {
  const [page, setPage] = useState(1)

  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Navigation
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          6 componenti: Tabs, DropdownMenu, ContextMenu, NavItem, Breadcrumbs, Pagination.
        </p>

        {/* Tabs */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Tabs</h2>
          <div style={{ maxWidth: 480 }}>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Dettagli</TabsTrigger>
                <TabsTrigger value="history">Storia</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Contenuto Overview della partita.</TabsContent>
              <TabsContent value="details">Contenuto Dettagli — statistiche.</TabsContent>
              <TabsContent value="history">Contenuto Storia — partite recenti.</TabsContent>
            </Tabs>
          </div>
        </section>

        {/* DropdownMenu */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>DropdownMenu</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Azioni</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profilo <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Impostazioni <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Esci</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        {/* ContextMenu */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>ContextMenu (right-click)</h2>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 320,
                  height: 140,
                  border: '2px dashed var(--border-strong)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--ink-muted)',
                  userSelect: 'none',
                }}
              >
                Right-click qui
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>Azioni</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>Copia</ContextMenuItem>
              <ContextMenuItem>Incolla</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Elimina</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </section>

        {/* NavItem */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>NavItem</h2>
          <Box direction="row" gap={4}>
            <nav
              style={{
                width: 240,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: 8,
              }}
            >
              <NavItem href="#" icon={<HomeIcon size={18} />} active>
                Home
              </NavItem>
              <NavItem href="#" icon={<SearchIcon size={18} />}>
                Cerca
              </NavItem>
              <NavItem href="#" icon={<TrophyIcon size={18} />} endAdornment={<Badge>12</Badge>}>
                Classifica
              </NavItem>
              <NavItem href="#" icon={<CogIcon size={18} />}>
                Impostazioni
              </NavItem>
            </nav>
            <nav
              style={{
                width: 240,
                background: 'var(--plum-900)',
                padding: 8,
              }}
            >
              <NavItem href="#" tone="onDark" icon={<HomeIcon size={18} />} active>
                Home
              </NavItem>
              <NavItem href="#" tone="onDark" icon={<SearchIcon size={18} />}>
                Cerca
              </NavItem>
              <NavItem href="#" tone="onDark" icon={<TrophyIcon size={18} />}>
                Classifica
              </NavItem>
              <NavItem href="#" tone="onDark" icon={<CogIcon size={18} />}>
                Impostazioni
              </NavItem>
            </nav>
          </Box>
        </section>

        {/* Breadcrumbs */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Breadcrumbs</h2>
          <Breadcrumbs>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Partite</BreadcrumbItem>
            <BreadcrumbItem href="#">Classic 8×8</BreadcrumbItem>
            <BreadcrumbItem current>Partita #1842</BreadcrumbItem>
          </Breadcrumbs>
        </section>

        {/* Pagination */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Pagination</h2>
          <Box direction="column" gap={4}>
            <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
            <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
            <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />
          </Box>
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
