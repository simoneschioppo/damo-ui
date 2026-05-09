'use client'

import { useState } from 'react'
import { Pagination } from 'damo-ui'

export function PaginationBasicExample() {
  const [page, setPage] = useState(3)
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
}

export function PaginationLargeExample() {
  const [page, setPage] = useState(7)
  return <Pagination currentPage={page} totalPages={42} onPageChange={setPage} />
}

export function PaginationLocalisedExample() {
  const [page, setPage] = useState(1)
  return (
    <Pagination
      currentPage={page}
      totalPages={5}
      onPageChange={setPage}
      labels={{
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
        pageOf: (p, t) => `Page ${p} of ${t}`,
      }}
    />
  )
}
