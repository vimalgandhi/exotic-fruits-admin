import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true })

import {
  getAllProducts,
  getProduct,
  searchProducts,
  filterByCategory,
  filterByPrice,
} from '@/lib/api'

function mockOk(data: unknown) {
  return { ok: true, status: 200, json: async () => data } as Response
}

describe('Products API functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
  })

  it('getAllProducts: fetches with default params', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ products: [], total: 0 }))

    await getAllProducts()
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/products')
    expect(url).toContain('page=1')
    expect(url).toContain('limit=10')
  })

  it('getAllProducts: includes search and category params', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ products: [] }))

    await getAllProducts(2, 5, 'mango', 'tropical')
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('search=mango')
    expect(url).toContain('category=tropical')
    expect(url).toContain('page=2')
  })

  it('getProduct: fetches single product by id', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ id: 'p1', name: 'Mango' }))

    const result = await getProduct('p1') as { id: string; name: string }
    expect(result.name).toBe('Mango')
    expect(mockFetch.mock.calls[0][0]).toContain('/products/p1')
  })

  it('searchProducts: encodes query in URL', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ products: [] }))

    await searchProducts('dragon fruit')
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/products/search?q=dragon%20fruit')
  })

  it('filterByCategory: uses correct endpoint', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ products: [] }))

    await filterByCategory('cat1', 1, 5)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('/products/category/cat1')
    expect(url).toContain('page=1')
    expect(url).toContain('limit=5')
  })

  it('filterByPrice: includes price params', async () => {
    mockFetch.mockResolvedValueOnce(mockOk({ products: [] }))

    await filterByPrice(100, 1000)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('minPrice=100')
    expect(url).toContain('maxPrice=1000')
  })
})
