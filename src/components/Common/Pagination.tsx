import React from 'react'
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
} from '../ui/pagination'

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isLoading?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxButtons = 5
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)
      if (currentPage <= 3) {
        start = 1
        end = 5
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4
        end = totalPages
      }
      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-slate-600 text-center sm:text-left">
        <div className="tabular-nums">
          Menampilkan{' '}
          <span className="font-bold text-slate-900">
            {startItem}-{endItem}
          </span>{' '} dari{' '}
          <span className="font-bold text-slate-900">
            {totalCount.toLocaleString('id-ID')}
          </span>{' '}Armada
        </div>

        <span className="hidden sm:inline text-slate-300">|</span>

        <div className="text-slate-500 tabular-nums">
          Halaman <span className="font-semibold text-slate-800">{currentPage}</span> dari{' '}
          <span className="font-semibold text-slate-800">{totalPages} / {totalCount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="flex items-center space-x-1.5 text-xs text-slate-600">
          <label htmlFor="pageSizeSelect" className="font-medium whitespace-nowrap">
            Tampilkan:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            disabled={isLoading}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005DA6] cursor-pointer"
          >
            <option value={6}>6 per halaman</option>
            <option value={12}>12 per halaman</option>
            <option value={24}>24 per halaman</option>
            <option value={48}>48 per halaman</option>
          </select>
        </div>

        <ShadcnPagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || isLoading}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              />
            </PaginationItem>

            {pageNumbers.map((page, idx) => {
              if (page === '...') {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              const isCurrent = page === currentPage
              return (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    isActive={isCurrent}
                    onClick={() => onPageChange(Number(page))}
                    disabled={isLoading}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLast
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage >= totalPages || isLoading}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadcnPagination>
      </div>
    </div>
  )
}
