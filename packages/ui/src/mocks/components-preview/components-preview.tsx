'use client'

import { forwardRef, useState, type HTMLAttributes } from 'react'
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
import { DatePicker } from '../../components/date-picker/date-picker'
import { Combobox } from '../../components/combobox/combobox'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../components/tooltip'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '../../components/toast'
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../components/context-menu'
import { NavItem } from '../../components/nav-item'
import { Breadcrumbs, BreadcrumbItem } from '../../components/breadcrumbs'
import { Pagination } from '../../components/pagination'
import { AttrToggleGroup } from '../../components/attr-toggle-group'
import { Avatar, AvatarFallback } from '../../components/avatar'
import { ColorPicker } from '../../components/color-picker'
import { UserCard } from '../../components/user-card'
import { FeatureCard } from '../../components/feature-card'
import { ArticleCard } from '../../components/article-card'
import { FormField } from '../../components/form-field'
import {
  CogIcon,
  EditIcon,
  HeartIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from '../../icons'
import { Section, Subgroup } from './_helpers'
import { DataSection, LayoutSection } from './sections-data-layout'

export type ComponentsPreviewProps = HTMLAttributes<HTMLDivElement>

// `Section` and `Subgroup` live in `./_helpers` so the extracted
// `sections-data-layout.tsx` (audit H-19 split) can share them. Local
// demos (PaginationDemo, ToastDemo, TABLE_ROWS) that are only used by
// sections still living in this file stay local.

// ─── Local helpers ────────────────────────────────────────────

function PaginationDemo() {
  const [page, setPage] = useState(3)
  return <Pagination currentPage={page} totalPages={9} onPageChange={setPage} />
}

function ToastDemo() {
  const [open, setOpen] = useState(false)
  return (
    <ToastProvider>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Show toast
      </Button>
      <Toast open={open} onOpenChange={setOpen}>
        <div className="flex-1">
          <ToastTitle>Modifiche salvate</ToastTitle>
          <ToastDescription>Il tuo theme è stato applicato.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  )
}

// `TABLE_ROWS` moved to `./_helpers` for the Data section (now in
// `./sections-data-layout`).

// ─── Component ────────────────────────────────────────────────

/**
 * ComponentsPreview — kitchen-sink showcase that renders every public
 * component grouped by category, with each category split into clearly
 * labelled subgroups so the page reads top-to-bottom. Used by the theme
 * generator preview pane to make every theme variable visually verifiable
 * in one scrollable surface. Self-contained — no external state, no remote
 * assets (avatars use initials, never network images).
 */
export const ComponentsPreview = forwardRef<HTMLDivElement, ComponentsPreviewProps>(
  function ComponentsPreview({ className, ...rest }, ref) {
    const [single, setSingle] = useState<number[]>([60])
    const [range, setRange] = useState<number[]>([20, 80])
    const [progress, setProgress] = useState(54)
    const [tabValue, setTabValue] = useState('overview')
    const [segmented, setSegmented] = useState('week')
    const [selectValue, setSelectValue] = useState('it')
    const [color, setColor] = useState('#7a3980')

    return (
      <TooltipProvider>
        <div
          ref={ref}
          className={cn('flex flex-col gap-12 w-full text-foreground', className)}
          {...rest}
        >
          {/* ─── Buttons ─────────────────────────────────── */}
          <Section id="buttons" title="Buttons" caption="ACTIONS">
            <Subgroup label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Subgroup>
            <Subgroup label="Sizes & states">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <PlusIcon size={14} />
                With icon
              </Button>
            </Subgroup>
            <Subgroup label="Icon buttons">
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
                <HeartIcon />
              </IconButton>
            </Subgroup>
          </Section>

          {/* ─── Cards ───────────────────────────────────── */}
          <Section id="cards" title="Cards" caption="SURFACES">
            <Subgroup label="Card variants" inline={false}>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Default</CardTitle>
                    <CardDescription>Standard Memphis frame.</CardDescription>
                  </CardHeader>
                  <CardBody>Body copy on the canonical card surface.</CardBody>
                  <CardFooter>
                    <Button size="sm">Action</Button>
                  </CardFooter>
                </Card>
                <Card variant="featured">
                  <CardHeader>
                    <CardTitle>Featured</CardTitle>
                    <CardDescription>Primary-tinted shadow.</CardDescription>
                  </CardHeader>
                  <CardBody>Highlighted version using --primary as shadow colour.</CardBody>
                </Card>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated</CardTitle>
                    <CardDescription>Larger Memphis shadow.</CardDescription>
                  </CardHeader>
                  <CardBody>Pulled forward with shadow-memphis-lg.</CardBody>
                </Card>
              </div>
            </Subgroup>
            <Subgroup label="Product cards" inline={false}>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <UserCard
                  name="Lisa Conte"
                  meta="Online · 2 min fa"
                  avatar={
                    <Avatar size="md">
                      <AvatarFallback>LC</AvatarFallback>
                    </Avatar>
                  }
                  trailing={<Badge variant="success">Online</Badge>}
                />
                <FeatureCard
                  title="Speed setup"
                  desc="Pannelli pre-configurati per ridurre il time-to-first-deploy."
                  meta="15+10"
                  icon={<StarIcon size={14} />}
                />
                <ArticleCard label="REGOLA" title="Read me first">
                  Scheda neutra per regole, cambi di policy, note descrittive.
                </ArticleCard>
              </div>
            </Subgroup>
          </Section>

          {/* ─── Banners ─────────────────────────────────── */}
          <Section id="banners" title="Banners" caption="STATUS">
            <Subgroup label="All four tones" inline={false}>
              <div className="flex flex-col gap-3 w-full max-w-xl">
                <Banner variant="info" title="Info">
                  Lib + docs in dry-run mode. Pubblicazione manuale.
                </Banner>
                <Banner variant="success" title="Success">
                  Tutto verde. Pronto al merge.
                </Banner>
                <Banner variant="warning" title="Warning">
                  Token rimossi: rebuilda il dist prima del typecheck.
                </Banner>
                <Banner variant="danger" title="Danger">
                  Variabili breaking — leggi la migration.
                </Banner>
              </div>
            </Subgroup>
          </Section>

          {/* ─── Overlays ────────────────────────────────── */}
          <Section id="overlays" title="Overlays" caption="DIALOG · DRAWER · POPOVER">
            <Subgroup label="Triggers">
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
                    Cambia un token a sinistra: la modale si aggiorna.
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
                      Azione non reversibile. Ombra e role passano in alert.
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
                    <DrawerDescription>Side surface · stessi token.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerBody>
                    <p className="text-sm">Riflette --background, --border, --memphis-*.</p>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2 w-56">
                    <Label>Filtra</Label>
                    <Input placeholder="Termine…" />
                    <Button size="sm">Applica</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </Subgroup>
          </Section>

          {/* ─── Form inputs ─────────────────────────────── */}
          <Section id="form" title="Form inputs" caption="DATA ENTRY">
            <Subgroup label="Text fields" inline={false}>
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
            </Subgroup>

            <Subgroup label="Toggles">
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
            </Subgroup>

            <Subgroup label="Sliders" inline={false}>
              <div className="flex flex-col gap-4 w-full max-w-xl">
                <div>
                  <Label>Single thumb · {single[0]}</Label>
                  <Slider min={0} max={100} step={1} value={single} onValueChange={setSingle} />
                </div>
                <div>
                  <Label>
                    Range · {range[0]} – {range[1]}
                  </Label>
                  <Slider min={0} max={100} step={1} value={range} onValueChange={setRange} />
                </div>
              </div>
            </Subgroup>

            <Subgroup label="Selectors">
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
              <ColorPicker label="Colore" value={color} onChange={setColor} />
            </Subgroup>

            <Subgroup label="Date & autocomplete">
              <DatePicker placeholder="Seleziona una data" />
              <Combobox
                placeholder="Cerca lingua…"
                searchPlaceholder="Cerca…"
                emptyMessage="Nessun risultato"
                options={[
                  { value: 'it', label: 'Italiano' },
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'Français' },
                  { value: 'es', label: 'Español' },
                  { value: 'de', label: 'Deutsch' },
                ]}
              />
            </Subgroup>
          </Section>

          {/* ─── Feedback ────────────────────────────────── */}
          <Section id="feedback" title="Feedback" caption="STATE">
            <Subgroup label="Loaders & progress">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover for tooltip
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Tooltip · soft shadow</TooltipContent>
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
            </Subgroup>

            <Subgroup label="Badges">
              <Badge>default</Badge>
              <Badge variant="featured">featured</Badge>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="destructive">destructive</Badge>
              <Badge variant="outline">outline</Badge>
            </Subgroup>

            <Subgroup label="Chips">
              <Chip>default</Chip>
              <Chip variant="accent">accent</Chip>
              <Chip variant="brand">brand</Chip>
              <Chip variant="success">success</Chip>
              <Chip variant="warning">warning</Chip>
              <Chip variant="danger">danger</Chip>
            </Subgroup>

            <Subgroup label="Toast" inline={false}>
              <ToastDemo />
            </Subgroup>

            <Subgroup label="Hints" inline={false}>
              <div className="flex flex-col gap-3 w-full max-w-md">
                <Hint num={1} title="Token-driven">
                  Reagisce a --secondary (sfondo) e --memphis-shadow-color.
                </Hint>
                <Hint num={2} title="Card shadow">
                  Usa --shadow-memphis-card per la sua elevazione.
                </Hint>
              </div>
            </Subgroup>
          </Section>

          {/* ─── Navigation ──────────────────────────────── */}
          <Section id="navigation" title="Navigation" caption="WAYFINDING">
            <Subgroup label="Tabs" inline={false}>
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
            </Subgroup>

            <Subgroup label="Breadcrumbs & pagination" inline={false}>
              <div className="flex flex-col gap-3">
                <Breadcrumbs>
                  <BreadcrumbItem href="#">Home</BreadcrumbItem>
                  <BreadcrumbItem href="#">Foundations</BreadcrumbItem>
                  <BreadcrumbItem current>Tokens</BreadcrumbItem>
                </Breadcrumbs>
                <PaginationDemo />
              </div>
            </Subgroup>

            <Subgroup label="Dropdown menu">
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
            </Subgroup>

            <Subgroup label="Context menu" inline={false}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div
                    aria-label="Right-click for menu"
                    className="w-72 h-20 grid place-items-center border-2 border-dashed border-memphis bg-card text-sm text-muted-foreground select-none cursor-context-menu"
                  >
                    Right-click here
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>Riga selezionata</ContextMenuLabel>
                  <ContextMenuItem>Copia</ContextMenuItem>
                  <ContextMenuItem>Duplica</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Elimina</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Subgroup>

            <Subgroup label="NavItem · default + onDark tones" inline={false}>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 max-w-3xl">
                {/* Default tone — sits on a card-coloured surface */}
                <div className="flex flex-col gap-2 p-3 border-2 border-memphis bg-card">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    default tone
                  </span>
                  <div className="flex flex-col gap-1">
                    <NavItem aria-current="page">
                      <HomeIcon size={20} />
                      Home
                    </NavItem>
                    <NavItem>
                      <UserIcon size={20} />
                      Profile
                    </NavItem>
                    <NavItem>
                      <CogIcon size={20} />
                      Settings
                    </NavItem>
                  </div>
                </div>

                {/* onDark tone — sits on an ink-900 surface, the navbar context */}
                <div
                  className="flex flex-col gap-2 p-3 border-2 border-memphis"
                  style={{ background: 'var(--ink-900, #1f1f23)' }}
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: 'var(--nav-on-dark-foreground)' }}
                  >
                    onDark tone
                  </span>
                  <div className="flex flex-col gap-1">
                    <NavItem tone="onDark" aria-current="page">
                      <HomeIcon size={20} />
                      Home
                    </NavItem>
                    <NavItem tone="onDark">
                      <UserIcon size={20} />
                      Profile
                    </NavItem>
                    <NavItem tone="onDark">
                      <CogIcon size={20} />
                      Settings
                    </NavItem>
                  </div>
                </div>
              </div>
            </Subgroup>

            <Subgroup label="Attribute toggle" inline={false}>
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
            </Subgroup>
          </Section>

          {/* ─── Data display ────────────────────────────── */}
          <DataSection />

          {/* ─── Layout primitives ───────────────────────── */}
          <LayoutSection />
        </div>
      </TooltipProvider>
    )
  },
)
