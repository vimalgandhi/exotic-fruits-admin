'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
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
  const { clearWishlist, addItem: addToWishlistStore } = useWishlistStore()
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

        // Sync with Zustand store
        clearWishlist()
        parsedItems.forEach((item) => {
          addToWishlistStore(item.product)
        })

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
      useWishlistStore.setState((state) => ({
        items: state.items.filter((item) => item.id !== productId),
      }))
      toast.success(`${productName} removed from wishlist`)
    } catch (err) {
      console.error('Failed to remove item:', err)
      toast.error('Failed to remove item')
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all items?')) return

    try {
      await Promise.all(
        wishlistItems.map((item) => toggleWishlist(item.product.id))
      )
      setWishlistItems([])
      clearWishlist()
      toast.success('Wishlist cleared')
    } catch (err) {
      console.error('Failed to clear wishlist:', err)
      toast.error('Failed to clear wishlist')
    }
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <EmptyState
            title="Please login to view your wishlist"
            description="Sign in to your account to see your saved items."
            actionLabel="Go to Login"
            onAction={() => window.location.assign('/login')}
            icon={<Heart size={64} className="text-slate-300" />}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 md:py-8">
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Saved Items</h1>
            <p className="mt-1 text-sm md:text-base text-gray-600">Loading...</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <EmptyState
            title="Your wishlist is empty"
            description="Save your favourite exotic fruits here to buy them later."
            actionLabel="Start Browsing"
            onAction={() => window.location.assign('/products')}
            icon={<Heart size={64} className="text-slate-300" />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 md:py-8">
        {/* Modern Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-navy to-blue-600 bg-clip-text">
                Saved Items
              </h1>
              {/* <p className="mt-1 text-sm md:text-base text-gray-600">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p> */}
            </div>
            {/* {wishlistItems.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={loading}
                className="self-start sm:self-auto rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:shadow-md disabled:opacity-50"
              >
                Clear All
              </button>
            )} */}
          </div>
        </div>

        {/* Products Grid - Optimized for Tablet */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {wishlistItems.map((item) => {
            const product = item.product
            const selectedPriceIdx = selectedPrices[item.id] ?? 0
            const pricelist = Array.isArray(product.pricelist) ? product.pricelist : []
            const selectedOption = pricelist?.[selectedPriceIdx]
            const displayPrice = selectedOption?.afterDiscountPrice ?? product.price ?? 0

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg bg-gray-50">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-3xl sm:text-4xl">
                          🍑
                        </div>
                      )}
                      {product.stock === 'Out of Stock' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <span className="rounded bg-white px-2 py-1 text-xs sm:text-sm font-medium text-red-600">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Wishlist Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id, product.id, product.name)}
                    disabled={loading}
                    aria-label="Remove from wishlist"
                    className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 hover:shadow-xl"
                  >
                    <Heart
                      size={16}
                      className="fill-red-500 text-red-500"
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-1 flex-col p-3">
                  {/* Category Badge */}
                  <span className="text-xs font-semibold text-gold-500 bg-gold-50 rounded-full px-2 py-0.5 w-fit">
                    {product.category}
                  </span>

                  {/* Product Name */}
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-2 font-semibold text-navy-600 text-sm sm:text-base line-clamp-2 group-hover:text-gold-500 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Origin */}
                  <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                    {product.origin}
                  </p>

                  {/* Price and Actions */}
                  <div className="mt-auto flex flex-col gap-2 pt-3">
                    {pricelist && pricelist.length > 0 ? (
                      <>
                        <select
                          value={selectedPrices[item.id] ?? 0}
                          onChange={(e) =>
                            setSelectedPrices({
                              ...selectedPrices,
                              [item.id]: parseInt(e.target.value),
                            })
                          }
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs font-medium focus:border-navy-600 focus:outline-none transition-colors"
                        >
                          {pricelist.map((option, idx) => (
                            <option key={option.unitId} value={idx}>
                              {option.unitName} - ₹{option.afterDiscountPrice}
                              {option.discount && ` (-${option.discount}%)`}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : null}

                    {/* Price Display with Add Button */}
                    <div className="flex items-center justify-between gap-2 pt-3">
                      <span className="font-bold text-navy-600 text-base">
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
                        disabled={product.stock === 'Out of Stock'}
                        className="btn-primary flex-shrink-0 p-2"
                        title="Add to cart"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
