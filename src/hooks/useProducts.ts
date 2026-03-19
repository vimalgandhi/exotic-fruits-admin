import { useState, useCallback } from 'react'
import * as api from '@/lib/api'

export interface ProductsState {
  products: unknown[]
  total: number
  page: number
  loading: boolean
  error: string | null
}

export function useProducts() {
  const [products, setProducts] = useState<unknown[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'An error occurred'
    setError(message)
    throw err
  }

  const getAllProducts = useCallback(
    async (
      page = 1,
      search = '',
      category = '',
      sortBy = 'name',
      order: 'asc' | 'desc' = 'asc',
      limit = 10
    ) => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.getAllProducts(
          page,
          limit,
          search,
          category,
          sortBy,
          order
        ) as { products?: unknown[]; total?: number; data?: unknown[] }
        const items = data.products ?? data.data ?? []
        setProducts(items as unknown[])
        setTotal(data.total ?? (items as unknown[]).length)
        return data
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getProduct = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      return await api.getProduct(id)
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.searchProducts(query) as { products?: unknown[]; data?: unknown[] }
      const items = data.products ?? data.data ?? []
      setProducts(items as unknown[])
      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const filterByCategory = useCallback(
    async (categoryId: string, page = 1, limit = 10) => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.filterByCategory(categoryId, page, limit) as { products?: unknown[]; data?: unknown[] }
        const items = data.products ?? data.data ?? []
        setProducts(items as unknown[])
        return data
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const filterByPrice = useCallback(
    async (min: number, max: number, page = 1, limit = 10) => {
      setLoading(true)
      setError(null)
      try {
        const data = await api.filterByPrice(min, max, page, limit) as { products?: unknown[]; data?: unknown[] }
        const items = data.products ?? data.data ?? []
        setProducts(items as unknown[])
        return data
      } catch (err) {
        handleError(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      return await api.getCategories()
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    products,
    total,
    loading,
    error,
    getAllProducts,
    getProduct,
    searchProducts,
    filterByCategory,
    filterByPrice,
    getCategories,
  }
}
