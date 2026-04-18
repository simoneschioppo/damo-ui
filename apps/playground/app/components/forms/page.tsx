'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Box,
  Container,
  FormField,
  Input,
  Textarea,
  Label,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Slider,
  SegmentedControl,
  SegmentedControlItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DatePicker,
  Combobox,
  Button,
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

const COUNTRIES = [
  { value: 'it', label: 'Italia' },
  { value: 'fr', label: 'Francia' },
  { value: 'de', label: 'Germania' },
  { value: 'es', label: 'Spagna' },
  { value: 'jp', label: 'Giappone' },
]

export default function FormsPage() {
  const [volume, setVolume] = useState([50])
  const [mode, setMode] = useState('normal')
  const [country, setCountry] = useState('it')
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <Container size="xl">
      <div style={{ padding: '32px 0 64px' }}>
        <h1 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>
          Form Inputs
        </h1>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 32 }}>
          11 componenti Tier 2 Memphis soft: nativi (Input/Textarea/Label), Radix primitives
          (Checkbox/Radio/Switch/Slider/Select/Popover), composti
          (SegmentedControl/DatePicker/Combobox).
        </p>

        {/* Text inputs */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Text inputs</h2>
          <Box direction="column" gap={4} style={{ maxWidth: 420 }}>
            <FormField label="Email" description="Non verrà condivisa">
              <Input type="email" placeholder="you@damacchi.app" />
            </FormField>
            <FormField label="Password" error="Almeno 8 caratteri">
              <Input type="password" defaultValue="abc" invalid />
            </FormField>
            <FormField label="Bio" description="Max 200 caratteri">
              <Textarea placeholder="Racconta la tua strategia…" />
            </FormField>
          </Box>
        </section>

        {/* Toggles */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Toggles</h2>
          <Box direction="column" gap={3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accetto i termini di gioco</Label>
            </div>
            <RadioGroup defaultValue="normal" aria-label="Difficulty">
              {(['easy', 'normal', 'rage'] as const).map((v) => (
                <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RadioGroupItem value={v} id={`diff-${v}`} />
                  <Label htmlFor={`diff-${v}`}>{v}</Label>
                </div>
              ))}
            </RadioGroup>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch id="notifications" defaultChecked />
              <Label htmlFor="notifications">Notifiche push</Label>
            </div>
          </Box>
        </section>

        {/* Slider + Segmented */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Slider + SegmentedControl</h2>
          <Box direction="column" gap={5} style={{ maxWidth: 420 }}>
            <div>
              <Label>Volume: {volume[0]}</Label>
              <div style={{ marginTop: 8 }}>
                <Slider value={volume} onValueChange={setVolume} min={0} max={100} />
              </div>
            </div>
            <div>
              <Label>Board mode: {mode}</Label>
              <div style={{ marginTop: 8 }}>
                <SegmentedControl
                  value={mode}
                  onValueChange={(v) => v && setMode(v)}
                  aria-label="Board mode"
                >
                  <SegmentedControlItem value="easy">Easy</SegmentedControlItem>
                  <SegmentedControlItem value="normal">Normal</SegmentedControlItem>
                  <SegmentedControlItem value="rage">Rage</SegmentedControlItem>
                </SegmentedControl>
              </div>
            </div>
          </Box>
        </section>

        {/* Select + Combobox + DatePicker */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Select, Combobox, DatePicker</h2>
          <Box direction="column" gap={4} style={{ maxWidth: 420 }}>
            <FormField label="Modalità preferita">
              <Select defaultValue="classic8">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic8">Classic 8×8</SelectItem>
                  <SelectItem value="classic10">Classic 10×10</SelectItem>
                  <SelectItem value="rage">Rage</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Paese">
              <Combobox options={COUNTRIES} value={country} onValueChange={setCountry} />
            </FormField>
            <FormField label="Data di nascita">
              <DatePicker value={date} onValueChange={setDate} />
            </FormField>
          </Box>
        </section>

        <Box direction="row" gap={3}>
          <Button variant="ghost">Annulla</Button>
          <Button variant="accent">Salva</Button>
        </Box>

        <p style={{ marginTop: 32 }}>
          <Link href="/" style={{ fontWeight: 600, color: 'var(--accent)' }}>
            ← Home
          </Link>
        </p>
      </div>
    </Container>
  )
}
