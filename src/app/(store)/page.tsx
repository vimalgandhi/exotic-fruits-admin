'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts } from '@/lib/api'

interface FeaturedProduct {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
  stock: string
  origin: string
}

function normalizeFeaturedProduct(p: any): FeaturedProduct {
  return {
    id: p.id || p.productid || String(Math.random()),
    name: p.name || p.productName || '',
    slug: p.slug || p.id || p.productid || '',
    price: p.price ?? 0,
    image: p.image || p.imageUrl || '',
    category: p.category || p.categoryName || '',
    stock: p.stock || p.stkStatus || 'In Stock',
    origin: p.origin || p.originCountry || '',
  }
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    getAllProducts(1, 4)
      .then((data) => {
        const raw: any[] = Array.isArray(data)
          ? data
          : data?.products || data?.items || []
        setFeaturedProducts(raw.slice(0, 4).map(normalizeFeaturedProduct))
      })
      .catch((err) => console.error('Failed to fetch featured products:', err))
      .finally(() => setLoadingProducts(false))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy to-blue-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Discover the World&#39;s
            <span className="text-gold"> Finest Exotic Fruits</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Hand-picked premium exotic fruits from around the globe. Fresh,
            organic, and delivered straight to your doorstep.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="rounded-lg bg-gold px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-yellow-600"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-navy"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders over ₹999' },
              { icon: '🌿', title: '100% Organic', desc: 'Certified organic produce' },
              { icon: '⭐', title: 'Premium Quality', desc: 'Hand-picked by experts' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-4 rounded-lg border border-gray-100 p-4">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-navy">{f.title}</p>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-navy">Featured Products</h2>
            <p className="mt-3 text-gray-500">
              Explore our handpicked selection of exotic fruits
            </p>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-200" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div className="relative h-48 overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100 text-4xl">
                          🍑
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-gold">
                        {product.category}
                      </span>
                      <h3 className="mt-1 font-semibold text-navy">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.origin}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-navy">
                          ₹{product.price}
                        </span>
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-success">
                          {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured products available.</p>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-block rounded-lg bg-navy px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
