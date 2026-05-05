'use client'

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../../components/button'
import { IconButton } from '../../components/icon-button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from '../../components/card'
import { Banner } from '../../components/banner'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/dialog'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
} from '../../components/drawer'
import { Input } from '../../components/input'
import { Textarea } from '../../components/textarea'
import { Label } from '../../components/label'
import { Checkbox } from '../../components/checkbox'
import { RadioGroup, RadioGroupItem } from '../../components/radio-group'
import { Switch } from '../../components/switch'
import { Slider } from '../../components/slider'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '../../components/segmented-control/segmented-control'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/select/select'
import { Popover, PopoverContent, PopoverTrigger } from '../../components/popover/popover'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../components/tooltip'
import { Progress } from '../../components/progress'
import { Spinner } from '../../components/spinner'
import { Skeleton } from '../../components/skeleton'
import { Badge } from '../../components/badge'
import { Chip } from '../../components/chip'
import { Hint } from '../../components/hint'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/dropdown-menu'
import { NavItem } from '../../components/nav-item'
import { Breadcrumbs, BreadcrumbItem } from '../../components/breadcrumbs'
import { Pagination } from '../../components/pagination'
import { AttrToggleGroup } from '../../components/attr-toggle-group'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '../../components/avatar'
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
import { ColorPicker } from '../../components/color-picker'
import { MemphisShape } from '../../components/memphis-shape'
import { UserCard } from '../../components/user-card'
import { FeatureCard } from '../../components/feature-card'
import { ArticleCard } from '../../components/article-card'
import { Separator } from '../../components/separator'
import { Ornament } from '../../components/ornament'
import { FormField } from '../../components/form-field'
import { ScrollArea } from '../../components/scroll-area'
import { AspectRatio } from '../../components/aspect-ratio'
import { CrownIcon, EditIcon, HeartIcon, PlusIcon, SearchIcon, StarIcon } from '../../icons'

export type ComponentsPreviewProps = HTMLAttributes<HTMLDivElement>

// ─── Section primitive ───────────────────────────────────────

interface SectionProps {
  id: string
  title: string
  caption?: string
  children: ReactNode
}

function Section({ id, title, caption, children }: SectionProps) {
  return (
    <section id={id} className="flex flex-col gap-3 scroll-mt-4">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-memphis pb-1">
        <h3 className="font-display text-xl leading-none m-0">{title}</h3>
        {caption ? (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {caption}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </section>
  )
}

// ─── Categories ──────────────────────────────────────────────

function PaginationDemo() {
  const [page, setPage] = useState(3)
  return <Pagination currentPage={page} totalPages={9} onPageChange={setPage} />
}

const ROWS = [
  {
    id: '1',
    name: 'Mario Rossi',
    role: 'Admin',
    last: '2025-04-10',
    state: 'success' as const,
    statusLabel: 'Attivo',
  },
  {
    id: '2',
    name: 'Giulia Bianchi',
    role: 'Editor',
    last: '2025-03-22',
    state: 'warning' as const,
    statusLabel: 'In attesa',
  },
  {
    id: '3',
    name: 'Luca Verdi',
    role: 'Viewer',
    last: '2025-02-04',
    state: 'destructive' as const,
    statusLabel: 'Bloccato',
  },
]

/**
 * ComponentsPreview — kitchen-sink showcase that renders every public
 * component grouped by category. Used by the theme generator preview pane
 * to make every theme variable change visually verifiable in one scrollable
 * surface. Designed to be self-contained: no external state, no domain
 * fixtures (gallery / dashboard / etc. live in their own preview mocks).
 */
export const ComponentsPreview = forwardRef<HTMLDivElement, ComponentsPreviewProps>(
  function ComponentsPreview({ className, ...rest }, ref) {
    const [sliderValue, setSliderValue] = useState<number[]>([60])
    const [rangeValue, setRangeValue] = useState<number[]>([20, 80])
    const [progress, setProgress] = useState(54)
    const [tabValue, setTabValue] = useState('overview')
    const [segmented, setSegmented] = useState('week')
    const [selectValue, setSelectValue] = useState('it')
    const [color, setColor] = useState('#7a3980')

    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn('flex flex-col gap-10 w-full text-foreground', className)}
          {...rest}
        >
          {/* ─── Buttons ───────────────────────────────────── */}
          <Section id="buttons" title="Buttons" caption="ACTIONS">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button variant="primary">
                <PlusIcon size={14} />
                With icon
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <IconButton aria-label="Search">
                <SearchIcon />
              </IconButton>
              <IconButton aria-label="Edit" variant="outline">
                <EditIcon />
              </IconButton>
              <IconButton aria-label="More" variant="ghost">
                <PlusIcon />
              </IconButton>
              <IconButton aria-label="Like" variant="primary">
                <HeartIcon size={14} />
              </IconButton>
            </div>
          </Section>

          {/* ─── Cards ─────────────────────────────────────── */}
          <Section id="cards" title="Cards" caption="SURFACES">
            <Card variant="default" className="w-72">
              <CardHeader>
                <CardTitle>Default</CardTitle>
                <CardDescription>Standard Memphis frame.</CardDescription>
              </CardHeader>
              <CardBody>Body copy on the canonical card surface.</CardBody>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>
            <Card variant="featured" className="w-72">
              <CardHeader>
                <CardTitle>Featured</CardTitle>
                <CardDescription>Primary-tinted shadow.</CardDescription>
              </CardHeader>
              <CardBody>Highlighted version using --primary as shadow.</CardBody>
            </Card>
            <Card variant="elevated" className="w-72">
              <CardHeader>
                <CardTitle>Elevated</CardTitle>
                <CardDescription>Larger memphis shadow.</CardDescription>
              </CardHeader>
              <CardBody>Pulled forward with shadow-memphis-lg.</CardBody>
            </Card>
            <UserCard
              className="w-72"
              name="Lisa Conte"
              meta="Online · 2 min fa"
              avatar={
                <Avatar size="md">
                  <AvatarImage src="https://i.pravatar.cc/64?img=12" alt="" />
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
              }
              trailing={<Badge variant="success">Online</Badge>}
            />
            <FeatureCard
              className="w-72"
              title="Speed setup"
              desc="Pannelli pre-configurati per ridurre il time-to-first-deploy."
              meta="15+10"
              icon={<StarIcon size={14} />}
            />
            <ArticleCard className="w-[26rem]" label="REGOLA" title="Read me first">
              Questa è una scheda di articolo. Usata per regole, cambi di policy o nota visiva
              all&rsquo;interno della UI.
            </ArticleCard>
          </Section>

          {/* ─── Banners ───────────────────────────────────── */}
          <Section id="banners" title="Banners" caption="STATUS">
            <div className="flex flex-col gap-3 w-full max-w-xl">
              <Banner variant="info" title="Info">
                Lib + docs in dry-run mode. Pubblicazione manuale.
              </Banner>
              <Banner variant="success" title="Success">
                Tutto verde. Pronto al merge.
              </Banner>
              <Banner variant="warning" title="Warning">
                Token rimossi: assicurati di rebuildare il dist prima del typecheck.
              </Banner>
              <Banner variant="danger" title="Danger">
                Variabili breaking — leggi la migration.
              </Banner>
            </div>
          </Section>

          {/* ─── Dialog & Drawer ───────────────────────────── */}
          <Section id="overlays" title="Overlays" caption="DIALOG · DRAWER">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sample dialog</DialogTitle>
                  <DialogDescription>
                    Surface, bordo, ombra: tutto risponde al theme.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Cambia un token a sinistra: la modale qui sopra si aggiorna.
                </p>
                <DialogFooter>
                  <Button variant="outline">Annulla</Button>
                  <Button>Conferma</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Open alert dialog</Button>
              </DialogTrigger>
              <DialogContent severity="alert" tone="danger">
                <DialogHeader>
                  <DialogTitle>Eliminare definitivamente?</DialogTitle>
                  <DialogDescription>
                    Azione non reversibile. Ombra e role passano in modalità alert.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Annulla</Button>
                  <Button variant="destructive">Elimina</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost">Open drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer</DrawerTitle>
                  <DrawerDescription>Side surface · same token surface.</DrawerDescription>
                </DrawerHeader>
                <DrawerBody>
                  <p className="text-sm">Riflette --background, --border, --memphis-*.</p>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Section>

          {/* ─── Form inputs ───────────────────────────────── */}
          <Section id="form" title="Form inputs" caption="DATA ENTRY">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full max-w-3xl">
              <FormField label="Nome" description="Massimo 32 caratteri." id="cp-name">
                <Input placeholder="Mario Rossi" />
              </FormField>
              <FormField label="Email" error="Formato non valido" id="cp-email">
                <Input type="email" defaultValue="not-an-email" />
              </FormField>
              <FormField label="Note" id="cp-notes">
                <Textarea placeholder="Aggiungi una nota…" rows={3} />
              </FormField>
              <FormField label="Cerca" id="cp-search">
                <Input type="search" placeholder="Cerca…" />
              </FormField>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="cp-cb1" defaultChecked />
                <Label htmlFor="cp-cb1">Ricordami</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="cp-sw1" defaultChecked />
                <Label htmlFor="cp-sw1">Notifiche</Label>
              </div>
              <RadioGroup defaultValue="weekly" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="daily" id="cp-rg-d" />
                  <Label htmlFor="cp-rg-d">Daily</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="weekly" id="cp-rg-w" />
                  <Label htmlFor="cp-rg-w">Weekly</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xl">
              <div>
                <Label>Single thumb · {sliderValue[0]}</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                />
              </div>
              <div>
                <Label>
                  Range · {rangeValue[0]} – {rangeValue[1]}
                </Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={rangeValue}
                  onValueChange={setRangeValue}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SegmentedControl value={segmented} onValueChange={setSegmented}>
                <SegmentedControlItem value="day">Day</SegmentedControlItem>
                <SegmentedControlItem value="week">Week</SegmentedControlItem>
                <SegmentedControlItem value="month">Month</SegmentedControlItem>
              </SegmentedControl>

              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    <Label>Filtra</Label>
                    <Input placeholder="Termine…" />
                    <Button size="sm">Applica</Button>
                  </div>
                </PopoverContent>
              </Popover>

              <ColorPicker label="Colore" value={color} onChange={setColor} />
            </div>
          </Section>

          {/* ─── Feedback ──────────────────────────────────── */}
          <Section id="feedback" title="Feedback" caption="STATE">
            <div className="flex flex-wrap items-center gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip with soft shadow</TooltipContent>
              </Tooltip>
              <Spinner size={20} />
              <Spinner size={20} style={{ color: 'var(--success)' }} />
              <div className="w-40">
                <Progress value={progress} />
              </div>
              <Button size="sm" variant="ghost" onClick={() => setProgress((p) => (p + 10) % 110)}>
                +10%
              </Button>
              <div className="w-40">
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge>default</Badge>
              <Badge variant="featured">featured</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="destructive">destructive</Badge>
              <Badge variant="outline">outline</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Chip>default</Chip>
              <Chip variant="accent">accent</Chip>
              <Chip variant="brand">brand</Chip>
              <Chip variant="success">success</Chip>
              <Chip variant="warning">warning</Chip>
              <Chip variant="danger">danger</Chip>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-md">
              <Hint num={1} title="Token-driven">
                Questo callout reagisce a --secondary (sfondo) e --memphis-shadow-color.
              </Hint>
              <Hint num={2} title="Card shadow">
                Usa --shadow-memphis-card per la sua elevazione.
              </Hint>
            </div>
          </Section>

          {/* ─── Navigation ────────────────────────────────── */}
          <Section id="navigation" title="Navigation" caption="WAYFINDING">
            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full max-w-xl">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Overview content.</TabsContent>
              <TabsContent value="usage">Usage content.</TabsContent>
              <TabsContent value="api">API content.</TabsContent>
            </Tabs>

            <Breadcrumbs>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Foundations</BreadcrumbItem>
              <BreadcrumbItem current>Tokens</BreadcrumbItem>
            </Breadcrumbs>

            <PaginationDemo />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex flex-col gap-2 w-72 border-2 border-memphis p-3 bg-card">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                NavItem · default tone
              </span>
              <NavItem aria-current="page">
                <CrownIcon size={16} />
                Selected (default tone)
              </NavItem>
              <NavItem>
                <SearchIcon size={16} />
                Idle row
              </NavItem>
              <NavItem>
                <EditIcon size={16} />
                Idle row
              </NavItem>
            </div>
            <div
              className="flex flex-col gap-2 w-72 p-3"
              style={{ background: 'var(--ink-900, #1f1f23)' }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--nav-on-dark-foreground)]">
                NavItem · onDark tone
              </span>
              <NavItem tone="onDark" aria-current="page">
                <CrownIcon size={16} />
                Selected (onDark tone)
              </NavItem>
              <NavItem tone="onDark">
                <SearchIcon size={16} />
                Idle row
              </NavItem>
            </div>

            <AttrToggleGroup
              storageKey="components-preview-density"
              attribute="data-density"
              defaultValue="normal"
              label="Density"
              options={[
                { value: 'compact', label: 'Compact' },
                { value: 'normal', label: 'Normal' },
                { value: 'comfortable', label: 'Comfortable' },
              ]}
            />
          </Section>

          {/* ─── Data display ──────────────────────────────── */}
          <Section id="data" title="Data display" caption="LISTS · TABLES · METRICS">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 w-full max-w-3xl">
              <Stat label="Visite" value="12.4k" delta="+8.2%" deltaTone="positive" />
              <Stat label="Ordini" value="184" delta="-1.6%" deltaTone="negative" />
              <Stat label="Conv." value="3.1%" />
              <Stat label="MRR" value="€42k" delta="+24%" deltaTone="positive" />
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              <Medal rank="bronze" value="3" label="Bronze" size={64} />
              <Medal rank="silver" value="2" label="Silver" size={64} />
              <Medal rank="gold" value="1" label="Gold" size={64} />
              <Medal rank="master" value="M" label="Master" size={64} />
              <Medal rank="grandmaster" value="GM" label="GM" size={64} />
            </div>

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
                  {ROWS.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>{row.last}</TableCell>
                      <TableCell>
                        <Badge variant={row.state}>{row.statusLabel}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Totale</TableCell>
                    <TableCell>{ROWS.length}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>

            <AvatarGroup max={4}>
              <Avatar size="md">
                <AvatarImage src="https://i.pravatar.cc/40?img=1" alt="" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar size="md">
                <AvatarImage src="https://i.pravatar.cc/40?img=2" alt="" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar size="md">
                <AvatarImage src="https://i.pravatar.cc/40?img=3" alt="" />
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
          </Section>

          {/* ─── Layout primitives ─────────────────────────── */}
          <Section id="layout" title="Layout primitives" caption="STRUCTURE">
            <div className="w-full max-w-xl flex items-center gap-3">
              <span className="text-sm">Top</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm">Center</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm">Bottom</span>
            </div>
            <Separator className="w-full max-w-xl" />

            <div className="flex flex-wrap items-center gap-3">
              <Ornament />
              <MemphisShape variant="zigzag" size={48} color="var(--primary)" />
              <MemphisShape variant="blob" size={48} color="var(--secondary)" />
              <MemphisShape variant="diamond" size={32} color="var(--accent)" />
              <MemphisShape variant="circle" size={32} color="var(--success)" />
              <MemphisShape variant="triangle" size={32} color="var(--warning)" />
            </div>

            <div className="w-72 border-2 border-memphis p-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">
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
          </Section>
        </div>
      </TooltipProvider>
    )
  },
)
