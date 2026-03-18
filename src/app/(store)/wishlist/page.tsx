'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, PackageOpen } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)

  function handleMoveToCart(productId: string) {
    const product = items.find((p) => p.id === productId)
    if (!product) return
    addToCart(product, 1)
    removeItem(productId)
    toast.success(`${product.name} moved to cart`)
  }

  function handleRemove(productId: string) {
    const product = items.find((p) => p.id === productId)
    removeItem(productId)
    if (product) toast.success(`${product.name} removed from wishlist`)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <PackageOpen size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-navy">Your wishlist is empty</h2>
        <p className="text-gray-500">
          Save your favourite products here and come back anytime.
        </p>
        <Link
          href="/products"
          className="mt-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart size={28} className="text-gold" />
          <h1 className="text-3xl font-bold text-navy">My Wishlist</h1>
          <span className="rounded-full bg-gold/10 px-3 py-0.5 text-sm font-medium text-gold">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <button
          onClick={() => {
            clearWishlist()
            toast.success('Wishlist cleared')
          }}
          className="text-sm font-medium text-error hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow transition-colors hover:bg-error hover:text-white"
                aria-label="Remove from wishlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <span className="text-xs font-medium text-gold">
                {product.category}
              </span>
              <h3 className="mt-1 font-semibold text-navy">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{product.origin}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-bold text-navy">
                  ₹{product.price}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    product.stock === 'In Stock'
                      ? 'bg-green-100 text-success'
                      : 'bg-red-100 text-error'
                  }`}
                >
                  {product.stock}
                </span>
              </div>
              <button
                onClick={() => handleMoveToCart(product.id)}
                disabled={product.stock !== 'In Stock'}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={16} />
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
