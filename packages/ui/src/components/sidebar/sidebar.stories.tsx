import {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
} from './sidebar'
import { Button } from '../button/button'
import { NavItem } from '../nav-item/nav-item'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion/accordion'
import { HomeIcon, SearchIcon, CogIcon, TrophyIcon } from '../../icons'

const frameStyle = {
  height: 560,
  width: 320,
  border: '2px solid var(--border-memphis)',
  // Provide a fallback for stories since --header-height lives on the playground layout.
  ['--header-height' as string]: '0px',
} as const

const wideFrame = { ...frameStyle, width: 360 } as const

export const Default = () => (
  <div style={frameStyle}>
    <Sidebar sticky={false}>
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>DESIGN SYSTEM</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>
        <nav className="flex flex-col gap-0.5">
          <NavItem href="#" icon={<HomeIcon size={18} />} active>
            Home
          </NavItem>
          <NavItem href="#" icon={<SearchIcon size={18} />}>
            Cerca
          </NavItem>
          <NavItem href="#" icon={<TrophyIcon size={18} />}>
            Classifica
          </NavItem>
          <NavItem href="#" icon={<CogIcon size={18} />}>
            Impostazioni
          </NavItem>
        </nav>
      </SidebarBody>
    </Sidebar>
  </div>
)

export const WithFooter = () => (
  <div style={wideFrame}>
    <Sidebar sticky={false}>
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>THEME GENERATOR</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>
        <Accordion type="multiple" defaultValue={['colors']}>
          <AccordionItem value="colors">
            <AccordionTrigger>Colors</AccordionTrigger>
            <AccordionContent>Palette editor…</AccordionContent>
          </AccordionItem>
          <AccordionItem value="typography">
            <AccordionTrigger>Typography</AccordionTrigger>
            <AccordionContent>Fonts & sizes…</AccordionContent>
          </AccordionItem>
          <AccordionItem value="radius">
            <AccordionTrigger>Radius</AccordionTrigger>
            <AccordionContent>Radius scale…</AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarBody>
      <SidebarFooter>
        <Button variant="ghost" fullWidth>
          Reset
        </Button>
        <Button fullWidth>Export</Button>
      </SidebarFooter>
    </Sidebar>
  </div>
)

export const NoBorder = () => (
  <div style={{ ...frameStyle, borderRight: 'none' }}>
    <Sidebar sticky={false} border="none">
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>TOC</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>
        <nav className="flex flex-col gap-0.5">
          <NavItem href="#a">01 · Colori</NavItem>
          <NavItem href="#b" active>
            02 · Tipografia
          </NavItem>
          <NavItem href="#c">03 · Bottoni</NavItem>
        </nav>
      </SidebarBody>
    </Sidebar>
  </div>
)

export const BorderLeft = () => (
  <div style={frameStyle}>
    <Sidebar sticky={false} border="left">
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>INSPECTOR</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>Panel annidato a destra.</SidebarBody>
    </Sidebar>
  </div>
)

export const CustomWidth = () => (
  <div style={{ ...frameStyle, width: 280 }}>
    <Sidebar sticky={false} width={280}>
      <SidebarHeader>
        <SidebarBrand>DAMO · UI</SidebarBrand>
        <SidebarSubtitle>COMPACT</SidebarSubtitle>
      </SidebarHeader>
      <SidebarBody>Stretta.</SidebarBody>
    </Sidebar>
  </div>
)
