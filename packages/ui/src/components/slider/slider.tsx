import * as SliderPrimitive from '@radix-ui/react-slider'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(function Slider({ className, ...rest }, ref) {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...rest}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative grow overflow-hidden bg-surface',
          'border-2 border-border-memphis',
          'data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:w-3 data-[orientation=vertical]:h-full',
        )}
      >
        <SliderPrimitive.Range className="absolute bg-gold-500 data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          'block h-5 w-5 bg-paper-50 border-2 border-border-memphis',
          'cursor-grab active:cursor-grabbing',
          'transition-[transform,box-shadow] duration-snap ease-memphis',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:pointer-events-none',
        )}
      />
    </SliderPrimitive.Root>
  )
})
