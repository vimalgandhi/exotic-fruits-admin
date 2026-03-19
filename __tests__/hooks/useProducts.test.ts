import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('@/lib/api', () => ({
  getAllProducts: vi.fn(),
  getProduct: vi.fn(),
  searchProducts: vi.fn(),
  filterByCategory: vi.fn(),
  filterByPrice: vi.fn(),
  getCategories: vi.fn(),
}))

import * as apiModule from '@/lib/api'
import { useProducts } from '@/hooks/useProducts'

describe('useProducts hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllProducts: fetches products and updates state', async () => {
    const mockProducts = [{ id: '1', name: 'Mango' }, { id: '2', name: 'Papaya' }]
    vi.mocked(apiModule.getAllProducts).mockResolvedValue({
      products: mockProducts,
      total: 2,
    })

    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await result.current.getAllProducts()
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(result.current.total).toBe(2)
    expect(result.current.loading).toBe(false)
  })

  it('getProduct: returns a single product', async () => {
    vi.mocked(apiModule.getProduct).mockResolvedValue({ id: '1', name: 'Mango' })
    const { result } = renderHook(() => useProducts())

    let data: unknown
    await act(async () => {
      data = await result.current.getProduct('1')
    })

    expect(data).toEqual({ id: '1', name: 'Mango' })
    expect(apiModule.getProduct).toHaveBeenCalledWith('1')
  })

  it('searchProducts: updates products state with results', async () => {
    vi.mocked(apiModule.searchProducts).mockResolvedValue({
      products: [{ id: '3', name: 'Dragon fruit' }],
    })

    const { result } = renderHook(() => useProducts())
    await act(async () => {
      await result.current.searchProducts('dragon')
    })

    expect(result.current.products).toHaveLength(1)
    expect(apiModule.searchProducts).toHaveBeenCalledWith('dragon')
  })

  it('filterByCategory: filters products by category id', async () => {
    vi.mocked(apiModule.filterByCategory).mockResolvedValue({ products: [] })
    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await result.current.filterByCategory('cat1')
    })

    expect(apiModule.filterByCategory).toHaveBeenCalledWith('cat1', 1, 10)
  })

  it('filterByPrice: applies price range filter', async () => {
    vi.mocked(apiModule.filterByPrice).mockResolvedValue({ products: [] })
    const { result } = renderHook(() => useProducts())

    await act(async () => {
      await result.current.filterByPrice(100, 500)
    })

    expect(apiModule.filterByPrice).toHaveBeenCalledWith(100, 500, 1, 10)
  })

  it('getCategories: returns categories list', async () => {
    vi.mocked(apiModule.getCategories).mockResolvedValue([{ id: 'c1', name: 'Tropical' }])
    const { result } = renderHook(() => useProducts())

    let cats: unknown
    await act(async () => {
      cats = await result.current.getCategories()
    })

    expect(cats).toEqual([{ id: 'c1', name: 'Tropical' }])
  })
})
