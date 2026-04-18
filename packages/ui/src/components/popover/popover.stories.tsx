import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from '../button/button'

export const Basic = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost">Apri popover</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div style={{ fontSize: 14 }}>Contenuto popover.</div>
    </PopoverContent>
  </Popover>
)
