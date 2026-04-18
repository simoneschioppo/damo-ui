import { useState } from 'react'
import { Pagination } from './pagination'

export const Basic = () => {
  const [page, setPage] = useState(1)
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
}

export const Many = () => {
  const [page, setPage] = useState(10)
  return <Pagination currentPage={page} totalPages={50} onPageChange={setPage} />
}

export const AtStart = () => {
  const [page, setPage] = useState(1)
  return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
}

export const AtEnd = () => {
  const [page, setPage] = useState(20)
  return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
}

export const CustomLabels = () => {
  const [page, setPage] = useState(3)
  return (
    <Pagination
      currentPage={page}
      totalPages={10}
      onPageChange={setPage}
      labels={{
        previous: 'Prev',
        next: 'Next',
        page: 'Page',
        pageOf: (p, t) => `${p}/${t}`,
      }}
    />
  )
}

export const Disabled = () => (
  <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} disabled />
)
