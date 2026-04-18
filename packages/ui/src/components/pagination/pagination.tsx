import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { computePageWindow, type PageItem } from './pagination-math'

export interface PaginationLabels {
  previous: string
  next: string
  page: string
  pageOf: (page: number, total: number) => string
}

const DEFAULT_LABELS: PaginationLabels = {
  previous: 'Precedente',
  next: 'Successivo',
  page: 'Pagina',
  pageOf: (p, t) => `Pagina ${p} di ${t}`,
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
  const L = { ...DEFAULT_LABELS, ...labels }
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
          'border-base border-border-memphis rounded-none bg-surface text-ink',
          'transition-colors duration-fast cursor-pointer',
          'hover:bg-surface-2',
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
            className="inline-flex h-9 w-9 items-center justify-center text-ink-muted"
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
              'border-base border-border-memphis rounded-none bg-surface text-ink',
              'font-mono text-sm cursor-pointer',
              'transition-colors duration-fast',
              'hover:bg-surface-2',
              'aria-[current=page]:bg-plum-900 aria-[current=page]:text-paper-50 aria-[current=page]:border-border-memphis',
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
          'border-base border-border-memphis rounded-none bg-surface text-ink',
          'transition-colors duration-fast cursor-pointer',
          'hover:bg-surface-2',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <ChevronRightIcon size={16} />
      </button>

      <span className="ml-3 text-xs text-ink-muted font-mono">
        {L.pageOf(currentPage, totalPages)}
      </span>
    </nav>
  )
})
