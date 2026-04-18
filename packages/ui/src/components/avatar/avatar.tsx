import * as AvatarPrimitive from '@radix-ui/react-avatar'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const avatarVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden items-center justify-center select-none',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-base',
        xl: 'h-20 w-20 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-none border-2 border-border-memphis',
      },
    },
    defaultVariants: { size: 'md', shape: 'circle' },
  },
)

type AvatarVariants = VariantProps<typeof avatarVariants>

export interface AvatarProps
  extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, AvatarVariants {}

export const Avatar = forwardRef<ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  function Avatar({ className, size, shape, ...rest }, ref) {
    return (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size, shape }), className)}
        {...rest}
      />
    )
  },
)

export const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, ...rest }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...rest}
    />
  )
})

export const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(function AvatarFallback({ className, ...rest }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center',
        'bg-plum-900 text-paper-50 font-semibold font-display tracking-wide',
        className,
      )}
      {...rest}
    />
  )
})

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  children: ReactNode
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, className, children, ...rest },
  ref,
) {
  const arr = Array.isArray(children) ? children : [children]
  const total = arr.length
  const shown = max && total > max ? arr.slice(0, max) : arr
  const restCount = max && total > max ? total - max : 0
  return (
    <div ref={ref} className={cn('inline-flex items-center -space-x-2', className)} {...rest}>
      {shown.map((child, idx) => (
        <div key={idx} className="ring-2 ring-bg rounded-full">
          {child}
        </div>
      ))}
      {restCount > 0 && (
        <div className="ring-2 ring-bg rounded-full">
          <Avatar>
            <AvatarFallback>+{restCount}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
})
