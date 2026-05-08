'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../lib/i18n'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { computePageWindow, type PageItem } from './pagination-math'

export interface PaginationLabels {
  previous: string
  next: string
  page: string
  pageOf: (page: number, total: number) => string
}

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  currentPage: number
  totalPages: number
  maxVisible?: number
  onPageChange: (page: number) => void
  labels?: Partial<PaginationLabels>
  disabled?: boolean
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { currentPage, totalPages, maxVisible, onPageChange, labels, disabled, className, ...rest },
  ref,
) {
  const i18n = useI18n()
  const L: PaginationLabels = { ...i18n.pagination, ...labels }
  const items = computePageWindow({ currentPage, totalPages, maxVisible })
  const isPrevDisabled = disabled || currentPage <= 1
  const isNextDisabled = disabled || currentPage >= totalPages

  return (
    <nav
      ref={ref}
      aria-label="Pagination"
      className={cn('flex items-center gap-1', className)}
      {...rest}
    >
      <button
        type="button"
        aria-label={L.previous}
        disabled={isPrevDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center',
          'border-2 border-memphis rounded-none bg-card text-foreground',
          'transition-colors duration-fast cursor-pointer',
          'hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <ChevronLeftIcon size={16} />
      </button>

      {items.map((item: PageItem, idx) =>
        item === '…' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`${L.page} ${item}`}
            aria-current={item === currentPage ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onPageChange(item)}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center px-3',
              'border-2 border-memphis rounded-none bg-card text-foreground',
              'font-mono text-sm cursor-pointer',
              'transition-colors duration-fast',
              'hover:bg-muted',
              'aria-[current=page]:bg-foreground aria-[current=page]:text-background aria-[current=page]:border-memphis',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              'disabled:opacity-50 disabled:pointer-events-none',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label={L.next}
        disabled={isNextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center',
          'border-2 border-memphis rounded-none bg-card text-foreground',
          'transition-colors duration-fast cursor-pointer',
          'hover:bg-muted',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <ChevronRightIcon size={16} />
      </button>

      <span className="ml-3 text-xs text-muted-foreground font-mono">
        {L.pageOf(currentPage, totalPages)}
      </span>
    </nav>
  )
})
