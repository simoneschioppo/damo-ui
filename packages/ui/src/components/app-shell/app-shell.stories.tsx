import { AppShell } from './app-shell'
import { NavItem } from '../nav-item/nav-item'
import { HomeIcon, SearchIcon, CogIcon, TrophyIcon } from '../../icons'

const brandStyle = {
  padding: '8px 4px 16px',
  marginBottom: 12,
  borderBottom: '1px solid var(--border)',
  fontFamily: 'var(--font-display)',
  fontSize: 18,
  letterSpacing: '0.12em',
} as const

function SidebarContent({ tone }: { tone: 'default' | 'onDark' }) {
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

const mainContent = (
  <div style={{ padding: 32 }}>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, margin: 0 }}>Benvenuto</h1>
    <p style={{ color: 'var(--ink-muted)', marginTop: 8 }}>Contenuto principale dell&apos;app.</p>
  </div>
)

export const Light = () => (
  <div style={{ height: 480, width: 720, border: '2px solid var(--border-memphis)' }}>
    <AppShell sidebar={<SidebarContent tone="default" />}>{mainContent}</AppShell>
  </div>
)

export const Dark = () => (
  <div style={{ height: 480, width: 720, border: '2px solid var(--border-memphis)' }}>
    <AppShell sidebarTone="onDark" sidebar={<SidebarContent tone="onDark" />}>
      {mainContent}
    </AppShell>
  </div>
)

export const WideSidebar = () => (
  <div style={{ height: 480, width: 840, border: '2px solid var(--border-memphis)' }}>
    <AppShell sidebarWidth={280} sidebar={<SidebarContent tone="default" />}>
      {mainContent}
    </AppShell>
  </div>
)
