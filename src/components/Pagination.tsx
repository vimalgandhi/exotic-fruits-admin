'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 rounded bg-navy px-3 py-2 text-white disabled:opacity-50 hover:bg-blue-900"
      >
        <ChevronLeft size={16} />
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded px-3 py-2 transition-colors ${
            currentPage === page
              ? 'bg-gold text-white'
              : 'bg-gray-200 text-navy hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded bg-navy px-3 py-2 text-white disabled:opacity-50 hover:bg-blue-900"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
