import { IconButton } from './icon-button'
import { HomeIcon, SearchIcon, TrashIcon, CogIcon, PlayIcon, PauseIcon } from '../../icons'

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <IconButton aria-label="Home">
      <HomeIcon size={20} />
    </IconButton>
    <IconButton variant="secondary" aria-label="Search">
      <SearchIcon size={20} />
    </IconButton>
    <IconButton variant="ghost" aria-label="Settings">
      <CogIcon size={20} />
    </IconButton>
    <IconButton variant="destructive" aria-label="Delete">
      <TrashIcon size={20} />
    </IconButton>
  </div>
)

export const Toggle = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <IconButton aria-label="Play">
      <PlayIcon size={20} />
    </IconButton>
    <IconButton variant="secondary" aria-label="Pause">
      <PauseIcon size={20} />
    </IconButton>
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <IconButton aria-label="Home" disabled>
      <HomeIcon size={20} />
    </IconButton>
    <IconButton variant="ghost" aria-label="Search" disabled>
      <SearchIcon size={20} />
    </IconButton>
  </div>
)
