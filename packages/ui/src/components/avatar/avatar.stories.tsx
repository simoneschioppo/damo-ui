import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from './avatar'

export const Basic = () => (
  <Avatar>
    <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Andrea" />
    <AvatarFallback>A</AvatarFallback>
  </Avatar>
)

export const Fallback = () => (
  <Avatar>
    <AvatarFallback>DM</AvatarFallback>
  </Avatar>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Avatar size="sm">
      <AvatarFallback>S</AvatarFallback>
    </Avatar>
    <Avatar size="md">
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
    <Avatar size="lg">
      <AvatarFallback>L</AvatarFallback>
    </Avatar>
    <Avatar size="xl">
      <AvatarFallback>XL</AvatarFallback>
    </Avatar>
  </div>
)

export const Square = () => (
  <div style={{ display: 'flex', gap: 12 }}>
    <Avatar shape="square">
      <AvatarFallback>DM</AvatarFallback>
    </Avatar>
    <Avatar shape="square" size="lg">
      <AvatarFallback>K</AvatarFallback>
    </Avatar>
  </div>
)

export const Group = () => (
  <AvatarGroup max={4}>
    <Avatar>
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>B</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>C</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>D</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>E</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>F</AvatarFallback>
    </Avatar>
  </AvatarGroup>
)
