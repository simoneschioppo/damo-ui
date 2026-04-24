'use client'

import { forwardRef, type HTMLAttributes } from 'react'
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
import { Badge } from '../../components/badge'
import { Chip } from '../../components/chip'
import { Input } from '../../components/input'
import { Label } from '../../components/label'
import { Switch } from '../../components/switch'
import { Slider } from '../../components/slider'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '../../components/segmented-control'
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '../../components/avatar'
import { PlusIcon } from '../../icons'

export type GalleryPreviewProps = HTMLAttributes<HTMLDivElement>

const SECTION_TITLE =
  'font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground'

const SectionHeading = ({ children }: { children: string }) => (
  <div className={SECTION_TITLE}>{children}</div>
)

export const GalleryPreview = forwardRef<HTMLDivElement, GalleryPreviewProps>(
  function GalleryPreview({ className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('flex flex-col gap-8 w-full', className)} {...rest}>
        <section className="flex flex-col gap-3">
          <SectionHeading>BUTTONS</SectionHeading>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="link">Link</Button>
            <IconButton aria-label="Aggiungi">
              <PlusIcon />
            </IconButton>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>CARDS</SectionHeading>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Progetto alpha</CardTitle>
                <CardDescription>Scheda standard</CardDescription>
              </CardHeader>
              <CardBody>Contenuto introduttivo della scheda.</CardBody>
              <CardFooter>
                <Button size="sm" variant="ghost">
                  Apri
                </Button>
              </CardFooter>
            </Card>
            <Card variant="featured">
              <CardHeader>
                <CardTitle>In evidenza</CardTitle>
                <CardDescription>Ombra dorata</CardDescription>
              </CardHeader>
              <CardBody>Contenuto mostrato con la variante featured.</CardBody>
              <CardFooter>
                <Button size="sm">Scopri</Button>
              </CardFooter>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevato</CardTitle>
                <CardDescription>Più in alto</CardDescription>
              </CardHeader>
              <CardBody>Layer visivamente sopraelevato.</CardBody>
              <CardFooter>
                <Button size="sm" variant="outline">
                  Dettagli
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>BADGES & CHIPS</SectionHeading>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default">default</Badge>
            <Badge variant="featured">featured</Badge>
            <Badge variant="copper">copper</Badge>
            <Badge variant="navy">navy</Badge>
            <Badge variant="win">win</Badge>
            <Badge variant="loss">loss</Badge>
            <Badge variant="draw">draw</Badge>
            <Badge variant="rank">rank</Badge>
            <Badge variant="outline">outline</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip dotColor="var(--success)">Attivo</Chip>
            <Chip dotColor="var(--destructive)">Errore</Chip>
            <Chip dotColor="var(--warning)">Attenzione</Chip>
            <Chip dotColor="var(--plum-500)">Brand</Chip>
            <Chip dotColor="var(--gold-500)">Accento</Chip>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>INPUTS</SectionHeading>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gallery-name">Nome</Label>
              <Input id="gallery-name" placeholder="Mario Rossi" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="gallery-notify" defaultChecked />
              <Label htmlFor="gallery-notify">Notifiche</Label>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Volume</Label>
              <Slider defaultValue={[40]} max={100} step={1} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Densità</Label>
              <SegmentedControl
                className="self-start"
                defaultValue="comoda"
                aria-label="Densità"
              >
                <SegmentedControlItem value="compatta">Compatta</SegmentedControlItem>
                <SegmentedControlItem value="comoda">Comoda</SegmentedControlItem>
                <SegmentedControlItem value="ampia">Ampia</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading>AVATARS</SectionHeading>
          <div className="flex flex-wrap items-center gap-6">
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>SB</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>GF</AvatarFallback>
              </Avatar>
            </AvatarGroup>
            <Avatar size="lg">
              <AvatarImage
                src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=160&h=160&fit=crop"
                alt="Ritratto demo"
              />
              <AvatarFallback>ND</AvatarFallback>
            </Avatar>
          </div>
        </section>
      </div>
    )
  },
)
