'use client'

import Link from 'next/link'
import {
  Button,
  IconButton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  Banner,
  Container,
  Box,
  CrownIcon,
  CogIcon,
  SearchIcon,
  TrashIcon,
  PlayIcon,
} from '@damacchi/ui'

const sectionStyle = {
  marginBottom: 48,
  paddingBottom: 32,
  borderBottom: '1px solid var(--border)',
}

const h2Style = {
  fontFamily: 'var(--font-display)',
  fontSize: 32,
  margin: '0 0 16px',
} as const

const noteStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--ink-muted)',
  marginBottom: 12,
} as const

export default function Tier1Page() {
  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Tier 1 Core
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          Componenti con signature Memphis hard: bordo 2px nero + shadow offset 4px +
          micro-interazione click fisico.
        </p>

        {/* Button */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Button</h2>
          <div style={noteStyle}>variants</div>
          <Box direction="row" gap={3} wrap="wrap" align="center" style={{ marginBottom: 20 }}>
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </Box>
          <div style={noteStyle}>sizes</div>
          <Box direction="row" gap={3} align="center" style={{ marginBottom: 20 }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Box>
          <div style={noteStyle}>disabled</div>
          <Box direction="row" gap={3}>
            <Button disabled>Primary</Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
          </Box>
        </section>

        {/* IconButton */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>IconButton</h2>
          <Box direction="row" gap={3} align="center">
            <IconButton aria-label="Search">
              <SearchIcon size={20} />
            </IconButton>
            <IconButton variant="accent" aria-label="Settings">
              <CogIcon size={20} />
            </IconButton>
            <IconButton variant="ghost" aria-label="Play">
              <PlayIcon size={20} />
            </IconButton>
            <IconButton variant="danger" aria-label="Delete">
              <TrashIcon size={20} />
            </IconButton>
          </Box>
        </section>

        {/* Card */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Card — 5 variants</h2>
          <Box direction="row" gap={4} wrap="wrap">
            {(['default', 'elevated', 'featured', 'interactive', 'dark'] as const).map((v) => (
              <Card
                key={v}
                variant={v}
                tabIndex={v === 'interactive' ? 0 : undefined}
                style={{ width: 240 }}
              >
                <CardHeader>
                  <CardTitle style={{ color: v === 'dark' ? 'var(--paper-50)' : undefined }}>
                    {v}
                  </CardTitle>
                  <CardDescription style={{ color: v === 'dark' ? 'var(--paper-100)' : undefined }}>
                    variant={v}
                  </CardDescription>
                </CardHeader>
                <CardBody>Testo nel body della card {v}.</CardBody>
                <CardFooter>
                  <Button variant="ghost" size="sm">
                    OK
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </Box>
        </section>

        {/* Dialog */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Apri dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Memphis</DialogTitle>
                <DialogDescription>
                  Modale centrato con bordo nero e shadow offset.
                </DialogDescription>
              </DialogHeader>
              <div style={{ fontSize: 14 }}>
                Usa Radix Dialog primitives sotto, focus trap automatico, esc per chiudere.
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Annulla</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="accent">Ok</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* AlertDialog */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>AlertDialog</h2>
          <Box direction="row" gap={3}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost">Conferma</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Termina la partita?</AlertDialogTitle>
                  <AlertDialogDescription>Sarà contata come sconfitta.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="ghost">Annulla</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button>Conferma</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="danger">
                  <TrashIcon size={16} /> Elimina
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent tone="danger">
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminare il profilo?</AlertDialogTitle>
                  <AlertDialogDescription>Azione irreversibile.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="ghost">No</Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="danger">Elimina</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Box>
        </section>

        {/* Drawer */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Drawer — 4 sides</h2>
          <Box direction="row" gap={3} wrap="wrap">
            {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
              <Drawer key={side}>
                <DrawerTrigger asChild>
                  <Button variant="ghost">{side}</Button>
                </DrawerTrigger>
                <DrawerContent side={side}>
                  <DrawerHeader>
                    <DrawerTitle>Drawer {side}</DrawerTitle>
                    <DrawerDescription>side={side}</DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody>Contenuto drawer.</DrawerBody>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="ghost">Chiudi</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ))}
          </Box>
        </section>

        {/* Banner */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Banner — 5 variants</h2>
          <Box direction="column" gap={3} style={{ maxWidth: 640 }}>
            <Banner variant="info" title="Nuova versione">
              Aggiorna per ottenere le ultime feature.
            </Banner>
            <Banner variant="success" title="Partita salvata" dismissible>
              Puoi riprenderla quando vuoi.
            </Banner>
            <Banner variant="warning" title="Connessione instabile">
              La partita potrebbe essere interrotta.
            </Banner>
            <Banner variant="danger" title="Errore critico">
              Impossibile contattare il server.
            </Banner>
            <Banner variant="rage" title="Rage attivo!" icon={<CrownIcon size={20} />}>
              I tuoi pezzi non hanno più cooldown.
            </Banner>
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
