'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { SortOption } from '@/types'

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
]

export function ProductSort() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'newest') {
        params.delete('sort')
      } else {
        params.set('sort', value)
      }
      // Reset to page 1 when sort changes
      params.delete('page')
      router.push(`?${params.toString()}`)
    },
    [searchParams, router],
  )

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="shrink-0 text-sm font-medium text-gray-700"
      >
        Sort by:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Sort products"
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
