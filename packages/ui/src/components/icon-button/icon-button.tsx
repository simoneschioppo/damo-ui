'use client'

import { forwardRef, type ReactNode } from 'react'
import { Button, type ButtonProps } from '../button/button'

export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'children' | 'asChild'> {
  'aria-label': string
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, ...rest },
  ref,
) {
  return (
    <Button ref={ref} size="icon" {...rest}>
      {children}
    </Button>
  )
})
