'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProductFilters } from '@/hooks/useProductFilters'

const CATEGORIES = ['Tropical', 'Asian', 'Citrus', 'Berries']

function FiltersPanel({
  onClose,
}: {
  onClose?: () => void
}) {
  const { priceMin, priceMax, categories, updateFilters, clearFilters } =
    useProductFilters()

  const [localMin, setLocalMin] = useState<string>(
    priceMin !== null ? priceMin.toString() : '',
  )
  const [localMax, setLocalMax] = useState<string>(
    priceMax !== null ? priceMax.toString() : '',
  )

  // Sync local state when URL params change
  useEffect(() => {
    setLocalMin(priceMin !== null ? priceMin.toString() : '')
    setLocalMax(priceMax !== null ? priceMax.toString() : '')
  }, [priceMin, priceMax])

  const hasActiveFilters =
    categories.length > 0 || priceMin !== null || priceMax !== null

  const handleCategoryChange = (cat: string, checked: boolean) => {
    const next = checked
      ? [...categories, cat]
      : categories.filter((c) => c !== cat)
    updateFilters({ categories: next })
  }

  const handlePriceApply = () => {
    const min = localMin !== '' ? parseInt(localMin) : null
    const max = localMax !== '' ? parseInt(localMax) : null
    updateFilters({ priceMin: min, priceMax: max })
    onClose?.()
  }

  const handleClear = () => {
    setLocalMin('')
    setLocalMax('')
    clearFilters()
    onClose?.()
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold text-navy">Price Range (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            min={0}
            aria-label="Minimum price"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
          <span className="shrink-0 text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            min={0}
            aria-label="Maximum price"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        </div>
        <button
          onClick={handlePriceApply}
          className="mt-2 w-full rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-900"
        >
          Apply Price
        </button>
      </div>

      {/* Category Checkboxes */}
      <div>
        <h3 className="mb-3 font-semibold text-navy">Category</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => {
            const checked = categories.includes(cat)
            return (
              <li key={cat}>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleCategoryChange(cat, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 accent-navy"
                    aria-label={`Filter by ${cat}`}
                  />
                  <span
                    className={
                      checked ? 'font-medium text-navy' : 'text-gray-700'
                    }
                  >
                    {cat}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="w-full rounded border border-navy px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}

interface ProductFiltersProps {
  variant?: 'sidebar' | 'mobile'
}

export function ProductFilters({ variant = 'sidebar' }: ProductFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { categories, priceMin, priceMax } = useProductFilters()
  const activeCount =
    categories.length + (priceMin !== null || priceMax !== null ? 1 : 0)

  if (variant === 'mobile') {
    return (
      <>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open filters"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-navy"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-xs text-white">
              {activeCount}
            </span>
          )}
        </button>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 flex"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
          >
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-80 max-w-full overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-navy">Filters</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded p-1 hover:bg-gray-100"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>
              <FiltersPanel onClose={() => setDrawerOpen(false)} />
              <button
                onClick={() => setDrawerOpen(false)}
                className="mt-6 w-full rounded bg-navy px-4 py-2 text-white hover:bg-blue-900"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // sidebar variant
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <FiltersPanel />
    </div>
  )
}
