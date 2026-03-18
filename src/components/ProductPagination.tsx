'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: ProductPaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
    const delta = 2
    const left = currentPage - delta
    const right = currentPage + delta
    let lastPushed = 0

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (lastPushed !== 0 && i - lastPushed > 1) {
          pages.push(i <= currentPage ? 'ellipsis-start' : 'ellipsis-end')
        }
        pages.push(i)
        lastPushed = i
      }
    }
    return pages
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Results counter */}
      <p className="text-sm text-gray-600">
        Showing{' '}
        <span className="font-medium text-navy">
          {startItem}–{endItem}
        </span>{' '}
        of <span className="font-medium text-navy">{totalItems}</span> products
      </p>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex items-center gap-1 rounded bg-navy px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 disabled:hover:bg-navy hover:bg-blue-900"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Desktop: numbered buttons */}
          <div className="hidden items-center gap-1 sm:flex">
            {getPageNumbers().map((item, idx) => {
              if (typeof item === 'string') {
                return (
                  <span key={`${item}-${idx}`} className="px-2 text-gray-500">
                    …
                  </span>
                )
              }
              return (
                <button
                  key={item}
                  onClick={() => onPageChange(item)}
                  aria-label={`Page ${item}`}
                  aria-current={currentPage === item ? 'page' : undefined}
                  className={`rounded px-3 py-2 text-sm transition-colors ${
                    currentPage === item
                      ? 'bg-gold font-medium text-white'
                      : 'bg-gray-100 text-navy hover:bg-gray-200'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>

          {/* Mobile: page counter */}
          <span className="px-3 text-sm text-gray-700 sm:hidden">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex items-center gap-1 rounded bg-navy px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 disabled:hover:bg-navy hover:bg-blue-900"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </nav>
      )}
    </div>
  )
}
