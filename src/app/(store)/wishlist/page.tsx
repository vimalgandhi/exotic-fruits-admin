'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const { addItem } = useCartStore()

  if (items.length === 0) {
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
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => {
              clearWishlist()
              toast.info('Wishlist cleared')
            }}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-error hover:text-error"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Link href={`/products/${product.slug}`}>
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-navy hover:text-gold">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-gray-500">{product.origin}</p>
              <p className="mt-2 text-lg font-bold text-navy">
                {formatCurrency(product.price)}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    addItem(product, 1)
                    toast.success(`${product.name} added to cart`)
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    removeItem(product.id)
                    toast.info(`${product.name} removed from wishlist`)
                  }}
                  className="rounded-lg border border-gray-200 p-2 text-gray-400 transition-colors hover:border-error hover:text-error"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
