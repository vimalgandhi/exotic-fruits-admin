import { useState, useCallback, useEffect } from 'react'
import {
  getAllProducts,
  getProduct,
  searchProducts,
  filterProductsByCategory,
  getCategories,
} from '@/lib/api'

export function useProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchProducts = useCallback(
    async (
      page = 1,
      search = '',
      category = '',
      sortBy = 'name',
      order = 'asc',
    ) => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllProducts(page, 12, search, category, sortBy, order)
        setProducts(data)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch products'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  const getProductDetail = useCallback(async (id: string) => {
    try {
      setLoading(true)
      const data = await getProduct(id)
      return data
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch product'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const search = useCallback(async (query: string, page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await searchProducts(query, page)
      setProducts(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const filterByCategory = useCallback(async (categoryId: string, page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const data = await filterProductsByCategory(categoryId, page)
      setProducts(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Filter failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    getProductDetail,
    search,
    filterByCategory,
  }
}
