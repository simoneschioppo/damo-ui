import { describe, it, expect } from 'vitest'
import { computePageWindow } from './pagination-math'

describe('computePageWindow', () => {
  it('returns full list when totalPages <= maxVisible', () => {
    expect(computePageWindow({ currentPage: 1, totalPages: 5, maxVisible: 7 })).toEqual([
      1, 2, 3, 4, 5,
    ])
  })

  it('returns window around current with leading ellipsis', () => {
    expect(computePageWindow({ currentPage: 10, totalPages: 20, maxVisible: 7 })).toEqual([
      1,
      '…',
      8,
      9,
      10,
      11,
      12,
      '…',
      20,
    ])
  })

  it('returns window at start without leading ellipsis', () => {
    expect(computePageWindow({ currentPage: 2, totalPages: 20, maxVisible: 7 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      '…',
      20,
    ])
  })

  it('returns window at end without trailing ellipsis', () => {
    expect(computePageWindow({ currentPage: 19, totalPages: 20, maxVisible: 7 })).toEqual([
      1,
      '…',
      16,
      17,
      18,
      19,
      20,
    ])
  })

  it('clamps currentPage below 1 to 1', () => {
    expect(computePageWindow({ currentPage: 0, totalPages: 5, maxVisible: 7 })).toEqual([
      1, 2, 3, 4, 5,
    ])
  })

  it('clamps currentPage above totalPages', () => {
    expect(computePageWindow({ currentPage: 99, totalPages: 5, maxVisible: 7 })).toEqual([
      1, 2, 3, 4, 5,
    ])
  })

  it('returns empty array when totalPages is 0', () => {
    expect(computePageWindow({ currentPage: 1, totalPages: 0, maxVisible: 7 })).toEqual([])
  })
})
