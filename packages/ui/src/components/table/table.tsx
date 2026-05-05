'use client'

import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(function Table(
  { className, ...rest },
  ref,
) {
  return (
    <div className="w-full overflow-x-auto border-2 border-memphis rounded-none">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...rest} />
    </div>
  )
})

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...rest }, ref) {
  return (
    <thead
      ref={ref}
      className={cn(
        'bg-foreground text-background',
        '[&_tr]:border-b [&_tr]:border-memphis',
        className,
      )}
      {...rest}
    />
  )
})

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...rest} />
})

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...rest }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('bg-muted font-semibold border-t-2 border-memphis', className)}
      {...rest}
    />
  )
})

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  function TableRow({ className, ...rest }, ref) {
    // No default hover effect — tables aren't always clickable, and the hover
    // tint was bleeding into the header row in particular. Consumers that
    // render interactive rows can re-add `hover:bg-muted` via className. The
    // explicit `data-state=selected` highlight is preserved so controlled
    // selection still gets a visible state.
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b border-border transition-colors',
          'data-[state=selected]:bg-muted',
          className,
        )}
        {...rest}
      />
    )
  },
)

export const TableHead = forwardRef<HTMLTableCellElement, ThHTMLAttributes<HTMLTableCellElement>>(
  function TableHead({ className, ...rest }, ref) {
    return (
      <th
        ref={ref}
        className={cn(
          'h-11 px-4 text-left align-middle',
          'font-mono text-xs font-semibold uppercase tracking-wider',
          className,
        )}
        {...rest}
      />
    )
  },
)

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(
  function TableCell({ className, ...rest }, ref) {
    return <td ref={ref} className={cn('px-4 py-3 align-middle', className)} {...rest} />
  },
)

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...rest }, ref) {
  // Symmetric vertical padding so the caption reads vertically centered
  // inside the strip the browser draws below the table (caption-bottom).
  return (
    <caption ref={ref} className={cn('py-3 text-sm text-muted-foreground', className)} {...rest} />
  )
})
