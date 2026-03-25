'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Star, Truck, Heart, CheckCircle } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useWishlistStore } from '@/store/wishlistStore'
import { toast } from 'sonner'
import { notFound } from 'next/navigation'
import { getProduct, getAllProducts, toggleWishlist } from '@/lib/api'
import type { Product } from '@/types'

interface PriceOption {
  unitId: number
  unitName: string
  unitPrice: number
  discountType: string
  discount: string
  afterDiscountPrice: number
  isactive: boolean
}

interface ProductData {
  id: string
  name: string
  slug: string
  price?: number
  image: string
  category?: string
  stock?: string
  stockStatus?: string
  description: string
  origin: string
  originCountry?: string
  pricelist?: PriceOption[]
  seoMetaTitle?: string
  seoMetaDescription?: string
  seoAlt?: string
  featured?: boolean
  foodType?: string
  status?: string
  inWishlist?: boolean
}

function normalizeProduct(p: any): ProductData {
  let pricelist: PriceOption[] = []
  if (p.pricelist) {
    try {
      pricelist = typeof p.pricelist === 'string' ? JSON.parse(p.pricelist) : p.pricelist
    } catch {
      pricelist = []
    }
  }

  const firstPrice = pricelist.length > 0 ? pricelist[0].afterDiscountPrice : Number(p.price) || 0

  return {
    id: p.id || p.productid || String(p._id || ''),
    name: p.name || p.productName || '',
    slug: p.slug || p.id || p.productid || '',
    price: firstPrice,
    image: p.image || p.imageUrl || '',
    category: p.category?.name || p.category || p.categoryName || '',
    stock: p.stockStatus || p.stock || p.stkStatus || 'In Stock',
    stockStatus: p.stockStatus || p.stock || 'In Stock',
    description: p.description || '',
    origin: p.originCountry || p.origin || '',
    originCountry: p.originCountry,
    pricelist,
    seoMetaTitle: p.seoMetaTitle,
    seoMetaDescription: p.seoMetaDescription,
    seoAlt: p.seoAlt,
    featured: p.featured,
    foodType: p.foodType,
    status: p.status,
    inWishlist: p.inWishlist || false,
  }
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  const [product, setProduct] = useState<ProductData | null>(null)
  const [related, setRelated] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const data = await getProduct(slug)
        if (!data) {
          notFound()
          return
        }
        const normalized = normalizeProduct(data)
        setProduct(normalized)
        setInWishlist(normalized.inWishlist || false)

        // Fetch related products from the same category
        try {
          const relatedData = await getAllProducts(1, 4, '', normalized.category)
          const rawRelated: any[] = Array.isArray(relatedData)
            ? relatedData
            : relatedData?.products || relatedData?.items || []
          setRelated(
            rawRelated
              .map(normalizeProduct)
              .filter((p) => p.id !== normalized.id)
              .slice(0, 3),
          )
        } catch {
          // Related products are optional
        }
      } catch {
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    const isOutOfStock = product.stockStatus === 'Out of Stock' || product.stock === 'Out of Stock'
    if (isOutOfStock) {
      toast.error('Product is out of stock')
      return
    }

    try {
      setIsAdding(true)
      const selectedPrice = product.pricelist?.[selectedPriceIndex]
      await addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: selectedPrice?.afterDiscountPrice || product.price || 0,
          image: product.image,
          category: product.category || '',
          stock: (product.stockStatus || product.stock) as 'In Stock' | 'Out of Stock',
          description: product.description,
          origin: product.origin,
        },
        quantity,
        selectedPrice as any,
      )
      // addItem already shows success toast
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-12 w-1/3 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-navy-600"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-96 overflow-hidden rounded-xl lg:h-[500px]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-6xl">
              🍑
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="rounded-full bg-gold-500 bg-opacity-10 px-3 py-1 text-sm font-medium text-gold-500">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-navy-600">{product.name}</h1>
          <p className="mt-1 text-gray-500">Origin: {product.origin}</p>

          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} className="fill-gold-500 text-gold-500" />
            ))}
            <span className="text-sm text-gray-500">(4.8 / 5.0)</span>
          </div>

          {/* Pricing Section */}
          {product.pricelist && product.pricelist.length > 0 ? (
            <div className="mt-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.pricelist.map((option, idx) => (
                  <button
                    key={option.unitId}
                    onClick={() => setSelectedPriceIndex(idx)}
                    className={`rounded-lg border-2 p-4 transition-all ${
                      selectedPriceIndex === idx
                        ? 'border-navy-600 bg-navy-600 bg-opacity-5'
                        : 'border-gray-200 hover:border-navy-600'
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-600">
                        {option.unitName}
                      </p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-navy-600">
                          ₹{option.afterDiscountPrice}
                        </span>
                        {option.discount && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₹{option.unitPrice}
                            </span>
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                              {option.discount}% off
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-4xl font-bold text-navy-600">₹{product.price}</p>
          )}

          <div className="mt-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                product.stockStatus === 'In Stock' || product.stock === 'In Stock'
                  ? 'bg-success-50 text-success-600'
                  : 'bg-error-50 text-error-500'
              }`}
            >
              {product.stockStatus || product.stock}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-gray-600">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={
                isAdding ||
                product.stockStatus === 'Out of Stock' ||
                product.stock === 'Out of Stock'
              }
              className="flex flex-1 items-center justify-center gap-2 btn-primary"
            >
              <ShoppingCart size={20} />
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={async () => {
                setInWishlist(!inWishlist)
                
                // Update Zustand store optimistically
                if (inWishlist) {
                  useWishlistStore.setState((state) => ({
                    items: state.items.filter((item) => item.id !== product.id),
                  }));
                } else {
                  const productToAdd: Product = {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price ?? 0,
                    image: product.image,
                    category: product.category || '',
                    stock: product.stock === 'Out of Stock' ? 'Out of Stock' : 'In Stock',
                    description: product.description || '',
                    origin: product.origin || '',
                  }
                  useWishlistStore.setState((state) => ({
                    items: [...state.items, productToAdd],
                  }));
                }
                
                try {
                  await toggleWishlist(product.id)
                } catch {
                  setInWishlist(inWishlist)
                  toast.error('Failed to update wishlist')
                }
              }}
              aria-label={
                inWishlist
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
              className="rounded-lg border border-gray-300 px-4 py-3 transition-transform duration-300 hover:scale-110 active:scale-125 hover:border-red-400"
            >
              <Heart
                size={22}
                className={
                  inWishlist
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }
              />
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Truck size={20} className="text-gold-500" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">Orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <CheckCircle size={20} className="text-gold-500" />
              <div>
                <p className="text-sm font-medium">Fresh Guarantee</p>
                <p className="text-xs text-gray-500">100% fresh or refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-navy-600">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100 text-3xl">
                      🍑
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy-600">{p.name}</h3>
                  <p className="mt-1 text-lg font-bold text-gold-500">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
