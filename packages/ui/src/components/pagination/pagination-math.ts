export type PageItem = number | '…'

export interface PageWindowOptions {
  currentPage: number
  totalPages: number
  maxVisible?: number
}

export function computePageWindow(opts: PageWindowOptions): PageItem[] {
  const { totalPages } = opts
  if (totalPages <= 0) return []
  const max = Math.max(5, opts.maxVisible ?? 7)
  const current = Math.max(1, Math.min(totalPages, opts.currentPage))

  if (totalPages <= max) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // `max` budgets the number of visible page numbers (first + last + middle);
  // ellipses are added on top. Middle numbers around current = max - 2 (excluding
  // first and last), so half-window = floor((max - 2 - 1) / 2).
  const half = Math.floor((max - 3) / 2)
  let start = Math.max(2, current - half)
  let end = Math.min(totalPages - 1, current + half)

  // When the window abuts the start, drop the leading ellipsis. Total items
  // become: first + (max - 3 middle nums) + "…" + last = max items.
  if (start <= 3) {
    start = 2
    end = Math.min(totalPages - 1, max - 2)
  }
  // Same treatment on the right: drop trailing ellipsis, pull `start` back.
  if (end >= totalPages - 2) {
    end = totalPages - 1
    start = Math.max(2, totalPages - (max - 2) + 1)
  }

  const items: PageItem[] = [1]
  if (start > 2) items.push('…')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < totalPages - 1) items.push('…')
  items.push(totalPages)
  return items
}
