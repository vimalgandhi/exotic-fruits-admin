'use client'

import { Suspense, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { SearchInput } from '@/components/SearchInput'
import { EmptyState } from '@/components/EmptyState'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductSort } from '@/components/ProductSort'
import { ProductPagination } from '@/components/ProductPagination'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { Product } from '@/types'
import {
  filterByPrice,
  filterByCategory,
  sortProducts,
  paginateProducts,
} from '@/lib/productFilters'
import type { SortOptionValue } from '@/types'

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragon Fruit',
    slug: 'dragon-fruit',
    price: 299,
    image: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400',
    category: 'Tropical',
    stock: 'In Stock',
    description: 'Beautiful pink dragon fruit with white flesh and delicate flavor.',
    origin: 'Vietnam',
  },
  {
    id: '2',
    name: 'Passion Fruit',
    slug: 'passion-fruit',
    price: 199,
    image: 'https://images.unsplash.com/photo-1501746877-14782df58970?w=400',
    category: 'Tropical',
    stock: 'In Stock',
    description: 'Sweet and tangy passion fruit bursting with tropical flavor.',
    origin: 'Brazil',
  },
  {
    id: '3',
    name: 'Star Fruit',
    slug: 'star-fruit',
    price: 149,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400',
    category: 'Tropical',
    stock: 'In Stock',
    description: 'Crispy and refreshing star-shaped fruit with mild sweet taste.',
    origin: 'Malaysia',
  },
  {
    id: '4',
    name: 'Rambutan',
    slug: 'rambutan',
    price: 249,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
    category: 'Tropical',
    stock: 'In Stock',
    description: 'Sweet rambutan with juicy white flesh and a hairy red skin.',
    origin: 'Thailand',
  },
  {
    id: '5',
    name: 'Jackfruit',
    slug: 'jackfruit',
    price: 399,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    category: 'Tropical',
    stock: 'In Stock',
    description: 'Large tropical fruit with sweet yellow pods.',
    origin: 'India',
  },
  {
    id: '6',
    name: 'Mangosteen',
    slug: 'mangosteen',
    price: 499,
    image: 'https://images.unsplash.com/photo-1604491637479-ce95ee0fc9cf?w=400',
    category: 'Tropical',
    stock: 'Out of Stock',
    description: 'The queen of fruits with sweet white segments.',
    origin: 'Thailand',
  },
  {
    id: '7',
    name: 'Lychee',
    slug: 'lychee',
    price: 349,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    category: 'Asian',
    stock: 'In Stock',
    description: 'Sweet and juicy lychee with fragrant white flesh.',
    origin: 'China',
  },
  {
    id: '8',
    name: 'Durian',
    slug: 'durian',
    price: 799,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400',
    category: 'Asian',
    stock: 'In Stock',
    description: 'The king of fruits with creamy, rich custard-like flesh.',
    origin: 'Malaysia',
  },
]

const ITEMS_PER_PAGE = 12

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addItem = useCartStore((s) => s.addItem)

  // Parse URL params
  const search = searchParams.get('search') || ''
  const sort = (searchParams.get('sort') || 'newest') as SortOptionValue
  const parseParam = (key: string): number | null => {
    const val = searchParams.get(key)
    if (val === null) return null
    const n = parseInt(val, 10)
    return Number.isNaN(n) ? null : n
  }
  const priceMin = parseParam('priceMin')
  const priceMax = parseParam('priceMax')
  const categoryParam = searchParams.get('category')
  const selectedCategories = categoryParam
    ? categoryParam.split(',').filter(Boolean)
    : []
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1'))

  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.delete('page')
      router.replace(`?${params.toString()}`)
    },
    [searchParams, router],
  )

  const handlePageChange = useCallback(
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

  // Filter, sort, and paginate products
  const processedProducts = useMemo(() => {
    let result = ALL_PRODUCTS

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    result = filterByPrice(result, priceMin, priceMax)
    result = filterByCategory(result, selectedCategories)
    result = sortProducts(result, sort)

    return result
  }, [search, sort, priceMin, priceMax, selectedCategories])

  const { items: paginated, totalPages, totalItems } = paginateProducts(
    processedProducts,
    currentPage,
    ITEMS_PER_PAGE,
  )

  const handleAddToCart = (product: Product) => {
    if (product.stock === 'Out of Stock') {
      toast.error('Product is out of stock')
      return
    }
    addItem(product, 1)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-navy">Our Products</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <ProductFilters variant="sidebar" />
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Top bar: mobile filters + search + sort */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile filter button (drawer) */}
              <div className="lg:hidden">
                <ProductFilters variant="mobile" />
              </div>
              <div className="flex-1">
                <SearchInput
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <ProductSort />
          </div>

          {/* Product grid */}
          {paginated.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginated.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {product.stock === 'Out of Stock' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="rounded bg-white px-3 py-1 text-sm font-medium text-error">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <span className="text-xs font-medium text-gold">
                        {product.category}
                      </span>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="mt-1 font-semibold text-navy hover:text-gold">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">{product.origin}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-navy">
                          ₹{product.price}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 'Out of Stock'}
                          className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors disabled:opacity-50 hover:bg-blue-900"
                        >
                          <ShoppingCart size={14} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  )
}

