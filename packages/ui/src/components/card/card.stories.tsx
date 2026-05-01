import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from './card'
import { Button } from '../button/button'
import { CrownIcon, TrophyIcon } from '../../icons'

export const Default = () => (
  <Card style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>Default card</CardTitle>
      <CardDescription>Stile Memphis base.</CardDescription>
    </CardHeader>
    <CardBody>Testo nel body della card. Usa i semantic token per background e ink.</CardBody>
    <CardFooter>
      <Button variant="ghost" size="sm">
        Annulla
      </Button>
      <Button size="sm">Conferma</Button>
    </CardFooter>
  </Card>
)

export const Elevated = () => (
  <Card variant="elevated" style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>Elevated</CardTitle>
      <CardDescription>Shadow più pronunciata.</CardDescription>
    </CardHeader>
    <CardBody>Per elementi che devono staccarsi dalla pagina.</CardBody>
  </Card>
)

export const Featured = () => (
  <Card variant="featured" style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>
        <CrownIcon size={20} style={{ verticalAlign: '-4px', marginRight: 8 }} />
        Featured
      </CardTitle>
      <CardDescription>Shadow oro, per CTA o highlight.</CardDescription>
    </CardHeader>
    <CardBody>Si distingue dalle altre card della pagina.</CardBody>
  </Card>
)

export const Interactive = () => (
  <Card variant="interactive" tabIndex={0} style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>
        <TrophyIcon size={20} style={{ verticalAlign: '-4px', marginRight: 8 }} />
        Interactive
      </CardTitle>
      <CardDescription>Hover e click feedback Memphis.</CardDescription>
    </CardHeader>
    <CardBody>Provalo con mouse o keyboard (Tab + Enter).</CardBody>
  </Card>
)

export const Inverse = () => (
  <Card variant="inverse" style={{ width: 320 }}>
    <CardHeader>
      <CardTitle>Inverse</CardTitle>
      <CardDescription>Inverse of current theme — per panel scuri annidati.</CardDescription>
    </CardHeader>
    <CardBody>Bordo sottile e shadow diffusa.</CardBody>
  </Card>
)

export const PaddingScale = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
    {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
      <Card key={p} padding={p} style={{ width: 140 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>padding={p}</span>
      </Card>
    ))}
  </div>
)
