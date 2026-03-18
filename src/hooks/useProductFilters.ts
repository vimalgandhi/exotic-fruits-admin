'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { ProductFilters } from '@/types'

export function useProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const priceParam = searchParams.get('price')
  const priceMin = priceParam ? parseInt(priceParam.split('-')[0]) : null
  const priceMax = priceParam ? parseInt(priceParam.split('-')[1]) : null
  const categoryParam = searchParams.get('category')
  const categories = categoryParam ? categoryParam.split(',').filter(Boolean) : []

  const updateFilters = useCallback(
    (filters: Partial<ProductFilters>) => {
      const params = new URLSearchParams(searchParams.toString())

      if ('priceMin' in filters || 'priceMax' in filters) {
        const min =
          filters.priceMin !== undefined ? filters.priceMin : priceMin
        const max =
          filters.priceMax !== undefined ? filters.priceMax : priceMax
        if (min !== null || max !== null) {
          params.set('price', `${min ?? ''}-${max ?? ''}`)
        } else {
          params.delete('price')
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
    params.delete('price')
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
