'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProductFilters } from '@/hooks/useProductFilters'

const CATEGORIES = ['Tropical', 'Asian', 'Citrus', 'Berries']
const PRICE_MIN = 0
const PRICE_MAX = 1000

function FiltersPanel({
  onClose,
}: {
  onClose?: () => void
}) {
  const { priceMin, priceMax, categories, updateFilters, clearFilters } =
    useProductFilters()

  const [localMin, setLocalMin] = useState<number>(priceMin ?? PRICE_MIN)
  const [localMax, setLocalMax] = useState<number>(priceMax ?? PRICE_MAX)

  // Sync local state when URL params change
  useEffect(() => {
    setLocalMin(priceMin ?? PRICE_MIN)
    setLocalMax(priceMax ?? PRICE_MAX)
  }, [priceMin, priceMax])

  const hasActiveFilters =
    categories.length > 0 || priceMin !== null || priceMax !== null

  const handleCategoryChange = (cat: string, checked: boolean) => {
    const next = checked
      ? [...categories, cat]
      : categories.filter((c) => c !== cat)
    updateFilters({ categories: next })
  }

  const handleMinChange = (value: number) => {
    if (value < localMax) {
      setLocalMin(value)
      updateFilters({
        priceMin: value === PRICE_MIN ? null : value,
        priceMax: localMax === PRICE_MAX ? null : localMax,
      })
    }
  }

  const handleMaxChange = (value: number) => {
    if (value > localMin) {
      setLocalMax(value)
      updateFilters({
        priceMin: localMin === PRICE_MIN ? null : localMin,
        priceMax: value === PRICE_MAX ? null : value,
      })
    }
  }

  const handleClear = () => {
    setLocalMin(PRICE_MIN)
    setLocalMax(PRICE_MAX)
    clearFilters()
    onClose?.()
  }

  const minPercent = (localMin / PRICE_MAX) * 100
  const maxPercent = (localMax / PRICE_MAX) * 100

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="mb-3 font-semibold text-navy">Price Range (₹)</h3>

        {/* Current value display */}
        <div className="mb-4 flex justify-between text-sm font-semibold text-navy">
          <span>₹{localMin}</span>
          <span>₹{localMax}</span>
        </div>

        {/* Dual-handle slider */}
        <div className="relative h-2 rounded-full bg-gray-300">
          {/* Filled track between handles */}
          <div
            className="absolute h-full rounded-full bg-gold"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* Min range input */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={localMin}
            onChange={(e) => handleMinChange(parseInt(e.target.value, 10))}
            aria-label="Minimum price"
            className="slider-thumb absolute top-0 h-2 w-full appearance-none rounded-full bg-transparent"
            style={{ zIndex: localMin > PRICE_MAX / 2 ? 5 : 3 }}
          />

          {/* Max range input */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={localMax}
            onChange={(e) => handleMaxChange(parseInt(e.target.value, 10))}
            aria-label="Maximum price"
            className="slider-thumb absolute top-0 h-2 w-full appearance-none rounded-full bg-transparent"
            style={{ zIndex: localMax < PRICE_MAX / 2 ? 3 : 5 }}
          />
        </div>

        {/* Range labels */}
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>₹{PRICE_MIN}</span>
          <span>₹{PRICE_MAX}</span>
        </div>

        {/* Selected range summary */}
        <div className="mt-3 text-center text-sm font-semibold text-navy">
          Selected: ₹{localMin} – ₹{localMax}
        </div>
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
