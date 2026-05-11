'use client'

import * as SliderPrimitive from '@radix-ui/react-slider'
import { forwardRef, useRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  function Slider({ className, value, defaultValue, ...rest }, ref) {
    // Radix Slider expects exactly one <SliderPrimitive.Thumb /> per entry in
    // the value array. Rendering a single static thumb silently broke range
    // sliders (the second / third value was draggable but invisible).
    //
    // The count must be FROZEN against the initial render in uncontrolled mode
    // (Radix locks the thumb count internally on mount and ignores later
    // `defaultValue` changes). In controlled mode we follow `value.length` so
    // a parent that legitimately reshapes the value array gets a matching
    // number of thumbs, and Radix's controlled API tolerates the change.
    const initialUncontrolledCount = useRef(
      Array.isArray(defaultValue) ? Math.max(1, defaultValue.length) : 1,
    ).current
    const thumbCount = Array.isArray(value) ? Math.max(1, value.length) : initialUncontrolledCount

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          'relative flex touch-none select-none items-center',
          // Width / height are orientation-specific so vertical mode is not
          // squashed by an unconditional w-full applied to the horizontal axis.
          'data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:flex-col',
          'disabled:opacity-50 disabled:pointer-events-none',
          className,
        )}
        {...rest}
      >
        <SliderPrimitive.Track
          className={cn(
            'relative grow overflow-hidden bg-card',
            'border-2 border-memphis rounded-none',
            'data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:w-full',
            'data-[orientation=vertical]:w-3 data-[orientation=vertical]:h-full',
          )}
        >
          <SliderPrimitive.Range className="absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, idx) => (
          <SliderPrimitive.Thumb
            key={idx}
            className={cn(
              'block h-5 w-5 bg-background border-2 border-memphis rounded-none',
              'cursor-grab active:cursor-grabbing',
              'transition-[transform,box-shadow] duration-snap ease-memphis',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              'disabled:pointer-events-none',
            )}
          />
        ))}
      </SliderPrimitive.Root>
    )
  },
)
