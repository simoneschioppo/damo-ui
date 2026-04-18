import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from './dropdown-menu'
import { Button } from '../button/button'

export const Basic = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost">Azioni</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Profilo <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        Impostazioni <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Esci</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const WithCheckboxes = () => {
  const [sound, setSound] = useState(true)
  const [music, setMusic] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Audio</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Preferenze audio</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={sound} onCheckedChange={setSound}>
          Suoni di gioco
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={music} onCheckedChange={setMusic}>
          Musica
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const WithRadioGroup = () => {
  const [palette, setPalette] = useState('plum')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Palette: {palette}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Palette</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={palette} onValueChange={setPalette}>
          <DropdownMenuRadioItem value="plum">Plum</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="frost">Frost</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="circuit">Circuit</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const WithSubmenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost">Più opzioni</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Nuova partita</DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Modalità</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Classic 8×8</DropdownMenuItem>
            <DropdownMenuItem>Classic 10×10</DropdownMenuItem>
            <DropdownMenuItem>Rage</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
)
