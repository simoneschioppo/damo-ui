import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip'
import { Button } from '../button/button'
import { InfoIcon } from '../../icons'

export const Basic = () => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Sono un tooltip</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export const OnIcon = () => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button aria-label="Info" style={{ cursor: 'help' }}>
          <InfoIcon size={20} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">Informazione aggiuntiva</TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

export const Sides = () => (
  <TooltipProvider delayDuration={200}>
    <div style={{ display: 'flex', gap: 16 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Side: {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  </TooltipProvider>
)
