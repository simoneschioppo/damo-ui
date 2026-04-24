import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from './select'

export const Basic = () => (
  <div style={{ width: 220 }}>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Scegli tema" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

export const WithGroups = () => (
  <div style={{ width: 240 }}>
    <Select defaultValue="navy">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Scuri</SelectLabel>
          <SelectItem value="navy">Navy</SelectItem>
          <SelectItem value="plum">Plum</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Chiari</SelectLabel>
          <SelectItem value="paper">Paper</SelectItem>
          <SelectItem value="gold">Gold</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
)

export const Disabled = () => (
  <div style={{ width: 220 }}>
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="Non selezionabile" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
      </SelectContent>
    </Select>
  </div>
)
