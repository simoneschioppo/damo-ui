import { NavItem } from './nav-item'
import { HomeIcon, SearchIcon, CogIcon, TrophyIcon } from '../../icons'
import { Badge } from '../badge/badge'

export const Default = () => (
  <nav style={{ width: 240, background: 'var(--card)', padding: 12 }}>
    <NavItem href="#" icon={<HomeIcon size={18} />} active>
      Home
    </NavItem>
    <NavItem href="#" icon={<SearchIcon size={18} />}>
      Cerca
    </NavItem>
    <NavItem href="#" icon={<TrophyIcon size={18} />} endAdornment={<Badge>12</Badge>}>
      Traguardi
    </NavItem>
    <NavItem href="#" icon={<CogIcon size={18} />}>
      Impostazioni
    </NavItem>
  </nav>
)

export const OnDark = () => (
  <nav
    style={{
      width: 240,
      background: 'var(--ink-900)',
      padding: 12,
    }}
  >
    <NavItem href="#" tone="onDark" icon={<HomeIcon size={18} />} active>
      Home
    </NavItem>
    <NavItem href="#" tone="onDark" icon={<SearchIcon size={18} />}>
      Cerca
    </NavItem>
    <NavItem href="#" tone="onDark" icon={<TrophyIcon size={18} />}>
      Traguardi
    </NavItem>
    <NavItem href="#" tone="onDark" icon={<CogIcon size={18} />}>
      Impostazioni
    </NavItem>
  </nav>
)

export const AsButton = () => (
  <nav style={{ width: 240, background: 'var(--card)', padding: 12 }}>
    <NavItem as="button" type="button" icon={<HomeIcon size={18} />} active>
      Button Home
    </NavItem>
    <NavItem as="button" type="button" icon={<SearchIcon size={18} />}>
      Button Search
    </NavItem>
  </nav>
)
