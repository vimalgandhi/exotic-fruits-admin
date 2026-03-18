'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SearchInput } from '@/components/SearchInput'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/EmptyState'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'
import { Product } from '@/types'

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

const CATEGORIES = ['All', 'Tropical', 'Asian', 'Citrus', 'Berries']
const ITEMS_PER_PAGE = 6

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const filtered = ALL_PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
        {/* Sidebar */}
        <aside className="lg:w-64">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-navy">Categories</h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setCategory(cat)
                      setCurrentPage(1)
                    }}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      category === cat
                        ? 'bg-navy text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <SearchInput
              placeholder="Search products..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {paginated.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                          className="object-cover"
                        />
                        {product.stock === 'Out of Stock' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
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
                          className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-blue-900"
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
