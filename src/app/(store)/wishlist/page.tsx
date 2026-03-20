'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { EmptyState } from '@/components/EmptyState'
import { toast } from 'sonner'
import { getWishlist, toggleWishlist, isAuthenticated } from '@/lib/api'

interface WishlistProduct {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price?: number
    image: string
    category?: string
    stock?: string
    description: string
    origin: string
    pricelist?: string | {
      unitId: number
      unitName: string
      unitPrice: number
      discountType: string
      discount: string
      afterDiscountPrice: number
      isactive: boolean
    }[]
  }
}

export default function WishlistPage() {
  const { addItem } = useCartStore()
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrices, setSelectedPrices] = useState<{ [key: string]: number }>({})

  // Load wishlist from API on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }

    setLoading(true)
    getWishlist()
      .then((data) => {
        const items = Array.isArray(data) ? data : []
        
        // Parse pricelist from JSON string if needed
        const parsedItems = items.map((item) => {
          let pricelist = item.product.pricelist
          if (typeof pricelist === 'string') {
            try {
              pricelist = JSON.parse(pricelist)
            } catch {
              pricelist = []
            }
          }
          return {
            ...item,
            product: {
              ...item.product,
              pricelist: Array.isArray(pricelist) ? pricelist : [],
            },
          }
        })

        setWishlistItems(parsedItems)

        // Initialize selected prices (first option by default)
        const prices: { [key: string]: number } = {}
        parsedItems.forEach((item) => {
          if (item.product.pricelist && item.product.pricelist.length > 0) {
            prices[item.id] = 0
          }
        })
        setSelectedPrices(prices)
      })
      .catch((err) => {
        console.error('Failed to load wishlist:', err)
        toast.error('Failed to load wishlist')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleRemoveItem = async (itemId: string, productId: string, productName: string) => {
    try {
      await toggleWishlist(productId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success(`${productName} removed from wishlist`)
    } catch (err) {
      console.error('Failed to remove item:', err)
      toast.error('Failed to remove item')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all items?')) return

    try {
      // Remove all items using toggle endpoint with productId
      await Promise.all(
        wishlistItems.map((item) => toggleWishlist(item.product.id))
      )
      setWishlistItems([])
      toast.success('Wishlist cleared')
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
      toast.error('Failed to clear wishlist')
    }
  }

  if (!isAuthenticated()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Please login to view your wishlist"
          description="Sign in to your account to see your saved items."
          actionLabel="Go to Login"
          onAction={() => window.location.assign('/login')}
          icon={<Heart size={64} className="text-gray-300" />}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          title="Your wishlist is empty"
          description="Save your favourite exotic fruits here to buy them later."
          actionLabel="Browse Products"
          onAction={() => window.location.assign('/products')}
          icon={<Heart size={64} className="text-gray-300" />}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-navy">My Wishlist</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleClearAll}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-error hover:text-error disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlistItems.map((item) => {
          const product = item.product
          const selectedPriceIdx = selectedPrices[item.id] ?? 0
          const pricelist = Array.isArray(product.pricelist) ? product.pricelist : []
          const selectedOption = pricelist?.[selectedPriceIdx]
          const displayPrice = selectedOption?.afterDiscountPrice ?? product.price ?? 0

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-4xl">
                        🍑
                      </div>
                    )}
                    {product.stock === 'Out of Stock' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded bg-white px-3 py-1 text-sm font-medium text-error">
                          Out of Stock
                        </span>
                      </div>
                    ) : null}
                  </div>
                </Link>
                {/* Heart / wishlist button */}
                <button
                  onClick={() => handleRemoveItem(item.id, product.id, product.name)}
                  disabled={loading}
                  aria-label="Remove from wishlist"
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow transition-transform duration-300 hover:scale-110 active:scale-125 disabled:opacity-50"
                >
                  <Heart
                    size={18}
                    className="fill-red-500 text-red-500"
                  />
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-gold">
                  {product.category}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="mt-1 font-semibold text-navy hover:text-gold">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  {product.origin}
                </p>

                {/* Pricing Dropdown */}
                {pricelist && pricelist.length > 0 ? (
                  <div className="mt-3 flex flex-col gap-3">
                    <select
                      value={selectedPrices[item.id] ?? 0}
                      onChange={(e) =>
                        setSelectedPrices({
                          ...selectedPrices,
                          [item.id]: parseInt(e.target.value),
                        })
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
                    >
                      {pricelist.map((option, idx) => (
                        <option key={option.unitId} value={idx}>
                          {option.unitName} - ₹{option.afterDiscountPrice}
                          {option.discount && ` (${option.discount}% off)`}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-navy">
                        ₹{displayPrice}
                      </span>
                      <button
                        onClick={() => {
                          addItem(
                            {
                              id: product.id,
                              name: product.name,
                              slug: product.slug,
                              price: displayPrice,
                              image: product.image,
                              category: product.category || '',
                              stock: (product.stock || 'In Stock') as 'In Stock' | 'Out of Stock',
                              description: product.description,
                              origin: product.origin,
                            },
                            1
                          )
                          toast.success(`${product.name} added to cart`)
                        }}
                        className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-900"
                      >
                        <ShoppingCart size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-navy">
                      ₹{displayPrice}
                    </span>
                    <button
                      onClick={() => {
                        addItem(
                          {
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            price: displayPrice,
                            image: product.image,
                            category: product.category || '',
                            stock: (product.stock || 'In Stock') as 'In Stock' | 'Out of Stock',
                            description: product.description,
                            origin: product.origin,
                          },
                          1
                        )
                        toast.success(`${product.name} added to cart`)
                      }}
                      className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-900"
                    >
                      <ShoppingCart size={14} />
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
