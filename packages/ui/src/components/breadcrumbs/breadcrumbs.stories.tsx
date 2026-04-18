import { Breadcrumbs, BreadcrumbItem } from './breadcrumbs'
import { HomeIcon } from '../../icons'

export const Basic = () => (
  <Breadcrumbs>
    <BreadcrumbItem href="#">Home</BreadcrumbItem>
    <BreadcrumbItem href="#">Profilo</BreadcrumbItem>
    <BreadcrumbItem current>Impostazioni</BreadcrumbItem>
  </Breadcrumbs>
)

export const WithIcon = () => (
  <Breadcrumbs>
    <BreadcrumbItem href="#">
      <HomeIcon size={14} style={{ marginRight: 4 }} />
      Home
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Partite</BreadcrumbItem>
    <BreadcrumbItem current>Classic 8×8</BreadcrumbItem>
  </Breadcrumbs>
)

export const CustomSeparator = () => (
  <Breadcrumbs separator={<span aria-hidden>›</span>}>
    <BreadcrumbItem href="#">Home</BreadcrumbItem>
    <BreadcrumbItem href="#">Shop</BreadcrumbItem>
    <BreadcrumbItem current>Set Gelo</BreadcrumbItem>
  </Breadcrumbs>
)

export const Long = () => (
  <Breadcrumbs>
    <BreadcrumbItem href="#">Root</BreadcrumbItem>
    <BreadcrumbItem href="#">Uno</BreadcrumbItem>
    <BreadcrumbItem href="#">Due</BreadcrumbItem>
    <BreadcrumbItem href="#">Tre</BreadcrumbItem>
    <BreadcrumbItem href="#">Quattro</BreadcrumbItem>
    <BreadcrumbItem current>Corrente</BreadcrumbItem>
  </Breadcrumbs>
)
