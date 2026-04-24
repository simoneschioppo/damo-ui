import {
  HomeIcon,
  SearchIcon,
  CloseIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  MenuIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CrownIcon,
  PawnIcon,
  TrophyIcon,
  UserIcon,
  HeartIcon,
  StarIcon,
  BoltIcon,
  BookmarkIcon,
  InfoIcon,
  CogIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  TargetIcon,
} from './index'

const ALL_ICONS = [
  { name: 'Home', Cmp: HomeIcon },
  { name: 'Search', Cmp: SearchIcon },
  { name: 'Close', Cmp: CloseIcon },
  { name: 'Check', Cmp: CheckIcon },
  { name: 'Plus', Cmp: PlusIcon },
  { name: 'Minus', Cmp: MinusIcon },
  { name: 'Menu', Cmp: MenuIcon },
  { name: 'ChevronUp', Cmp: ChevronUpIcon },
  { name: 'ChevronDown', Cmp: ChevronDownIcon },
  { name: 'ChevronLeft', Cmp: ChevronLeftIcon },
  { name: 'ChevronRight', Cmp: ChevronRightIcon },
  { name: 'Crown', Cmp: CrownIcon },
  { name: 'Pawn', Cmp: PawnIcon },
  { name: 'Trophy', Cmp: TrophyIcon },
  { name: 'User', Cmp: UserIcon },
  { name: 'Heart', Cmp: HeartIcon },
  { name: 'Star', Cmp: StarIcon },
  { name: 'Bolt', Cmp: BoltIcon },
  { name: 'Bookmark', Cmp: BookmarkIcon },
  { name: 'Info', Cmp: InfoIcon },
  { name: 'Cog', Cmp: CogIcon },
  { name: 'Edit', Cmp: EditIcon },
  { name: 'Trash', Cmp: TrashIcon },
  { name: 'Filter', Cmp: FilterIcon },
  { name: 'ExternalLink', Cmp: ExternalLinkIcon },
  { name: 'ArrowRight', Cmp: ArrowRightIcon },
  { name: 'Play', Cmp: PlayIcon },
  { name: 'Pause', Cmp: PauseIcon },
  { name: 'Clock', Cmp: ClockIcon },
  { name: 'Target', Cmp: TargetIcon },
]

export const AllIcons = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: 16,
    }}
  >
    {ALL_ICONS.map(({ name, Cmp }) => (
      <div
        key={name}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          padding: 16,
          border: '2px solid var(--memphis-border-color)',
          background: 'var(--card)',
          color: 'var(--foreground)',
        }}
      >
        <Cmp size={32} />
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{name}</span>
      </div>
    ))}
  </div>
)

AllIcons.storyName = 'All icons'

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    {[12, 16, 20, 24, 32, 48, 64].map((size) => (
      <div key={size} style={{ textAlign: 'center' }}>
        <StarIcon size={size} />
        <div style={{ fontSize: 10, marginTop: 4, fontFamily: 'var(--font-mono)' }}>{size}px</div>
      </div>
    ))}
  </div>
)

export const Colors = () => (
  <div style={{ display: 'flex', gap: 12, fontSize: 24 }}>
    <CrownIcon size={32} style={{ color: 'var(--gold-500)' }} />
    <HeartIcon size={32} style={{ color: 'var(--destructive)' }} />
    <BoltIcon size={32} style={{ color: 'var(--rage)' }} />
    <StarIcon size={32} style={{ color: 'var(--primary)' }} />
    <CheckIcon size={32} style={{ color: 'var(--success)' }} />
  </div>
)
