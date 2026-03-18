'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { ProductFilters } from '@/types'

function parsePrice(s: string | null): number | null {
  if (s === null) return null
  const n = parseInt(s, 10)
  return Number.isNaN(n) ? null : n
}

export function useProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const priceMin = parsePrice(searchParams.get('priceMin'))
  const priceMax = parsePrice(searchParams.get('priceMax'))
  const categoryParam = searchParams.get('category')
  const categories = categoryParam ? categoryParam.split(',').filter(Boolean) : []

  const updateFilters = useCallback(
    (filters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      if ('priceMin' in filters) {
        const min = filters.priceMin !== undefined ? filters.priceMin : priceMin
        if (min !== null) {
          params.set('priceMin', min.toString())
        } else {
          params.delete('priceMin')
        }
      }

      if ('priceMax' in filters) {
        const max = filters.priceMax !== undefined ? filters.priceMax : priceMax
        if (max !== null) {
          params.set('priceMax', max.toString())
        } else {
          params.delete('priceMax')
        }
      }

      if ('categories' in filters) {
        if (filters.categories && filters.categories.length > 0) {
          params.set('category', filters.categories.join(','))
        } else {
          params.delete('category')
        }
      }

      // Reset to page 1 whenever filters change
      params.delete('page')
      router.push(`?${params.toString()}`)
    },
    [searchParams, router, priceMin, priceMax],
  )

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('priceMin')
    params.delete('priceMax')
    params.delete('category')
    params.delete('page')
    router.push(`?${params.toString()}`)
  }, [searchParams, router])

  return {
    priceMin,
    priceMax,
    categories,
    updateFilters,
    clearFilters,
  }
}
