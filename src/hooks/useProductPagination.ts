'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useProductPagination(itemsPerPage: number = 12) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1'))

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (page <= 1) {
        params.delete('page')
      } else {
        params.set('page', page.toString())
      }
      router.push(`?${params.toString()}`)
    },
    [searchParams, router],
  )

  return {
    currentPage,
    itemsPerPage,
    setPage,
  }
}
