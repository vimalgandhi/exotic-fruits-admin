'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlist } from '@/hooks/useWishlist'
import { toast } from 'sonner'
import { Product } from '@/types'
import { notFound } from 'next/navigation'

const ALL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragon Fruit',
    slug: 'dragon-fruit',
    price: 299,
    image: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800',
    category: 'Tropical',
    stock: 'In Stock',
    description:
      'The dragon fruit, also known as pitahaya, is a stunning tropical fruit with vibrant pink skin and speckled white or red flesh. Rich in antioxidants, vitamin C, and fiber, it offers a mildly sweet flavor with a refreshing texture. Perfect for smoothie bowls, fruit salads, or enjoyed fresh.',
    origin: 'Vietnam',
  },
  {
    id: '2',
    name: 'Passion Fruit',
    slug: 'passion-fruit',
    price: 199,
    image: 'https://images.unsplash.com/photo-1501746877-14782df58970?w=800',
    category: 'Tropical',
    stock: 'In Stock',
    description:
      'Passion fruit is a tropical delight with a distinctive tart-sweet flavor. The wrinkled purple skin hides intensely flavored golden pulp filled with crunchy seeds. High in vitamins A and C, great for juices, desserts, and cocktails.',
    origin: 'Brazil',
  },
  {
    id: '3',
    name: 'Star Fruit',
    slug: 'star-fruit',
    price: 149,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=800',
    category: 'Tropical',
    stock: 'In Stock',
    description:
      'Star fruit, or carambola, has a distinctive star shape when sliced. It offers a crisp texture and mildly sweet-tart flavor. Low in calories and high in vitamin C and fiber. Beautiful garnish for desserts and cocktails.',
    origin: 'Malaysia',
  },
  {
    id: '4',
    name: 'Rambutan',
    slug: 'rambutan',
    price: 249,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
    category: 'Tropical',
    stock: 'In Stock',
    description:
      'Rambutan is a Southeast Asian fruit closely related to lychee. Its hairy red exterior reveals juicy, translucent white flesh with a sweet, slightly acidic taste. Rich in iron, vitamin C, and copper.',
    origin: 'Thailand',
  },
  {
    id: '5',
    name: 'Jackfruit',
    slug: 'jackfruit',
    price: 399,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'Tropical',
    stock: 'In Stock',
    description:
      'The jackfruit is the largest tree fruit in the world. Its sweet yellow pods are rich in nutrients and fiber. When unripe, it has a meat-like texture perfect for savory dishes. When ripe, it offers a sweet tropical flavor.',
    origin: 'India',
  },
  {
    id: '6',
    name: 'Mangosteen',
    slug: 'mangosteen',
    price: 499,
    image: 'https://images.unsplash.com/photo-1604491637479-ce95ee0fc9cf?w=800',
    category: 'Tropical',
    stock: 'Out of Stock',
    description:
      'Known as the queen of fruits, mangosteen has a deep purple rind and sweet, creamy white segments inside. It has a delicate flavor combining sweetness with slight tartness. Rich in xanthones and antioxidants.',
    origin: 'Thailand',
  },
  {
    id: '7',
    name: 'Lychee',
    slug: 'lychee',
    price: 349,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800',
    category: 'Asian',
    stock: 'In Stock',
    description:
      'Lychee is a small tropical fruit with rough red skin that peels away to reveal sweet, juicy white flesh. It has a fragrant floral aroma and refreshing taste. High in vitamin C and B-complex vitamins.',
    origin: 'China',
  },
  {
    id: '8',
    name: 'Durian',
    slug: 'durian',
    price: 799,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800',
    category: 'Asian',
    stock: 'In Stock',
    description:
      'The king of fruits, durian is famous for its large size, distinctive odor, and custard-like flesh. It has a rich, complex flavor that is intensely sweet and savory. Highly nutritious with healthy fats and vitamins.',
    origin: 'Malaysia',
  },
]

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const product = ALL_PRODUCTS.find((p) => p.slug === slug)

  if (!product) {
    notFound()
  }

  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const { toggleWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = () => {
    if (product.stock === 'Out of Stock') {
      toast.error('Product is out of stock')
      return
    }
    addItem(product, quantity)
    toast.success(`${product.name} (×${quantity}) added to cart!`)
  }

  const related = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-96 overflow-hidden rounded-xl lg:h-[500px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <span className="rounded-full bg-gold bg-opacity-10 px-3 py-1 text-sm font-medium text-gold">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-navy">{product.name}</h1>
          <p className="mt-1 text-gray-500">Origin: {product.origin}</p>

          <div className="mt-2 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={16} className="fill-gold text-gold" />
            ))}
            <span className="text-sm text-gray-500">(4.8 / 5.0)</span>
          </div>

          <p className="mt-4 text-4xl font-bold text-navy">₹{product.price}</p>
          <p className="mt-1 text-sm text-gray-500">per 500g</p>

          <div className="mt-3">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                product.stock === 'In Stock'
                  ? 'bg-green-100 text-success'
                  : 'bg-red-100 text-error'
              }`}
            >
              {product.stock}
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
              disabled={product.stock === 'Out of Stock'}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy py-3 font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={
                isInWishlist(product.id)
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
              className="rounded-lg border border-gray-300 px-4 py-3 transition-transform duration-300 hover:scale-110 active:scale-125 hover:border-red-400"
            >
              <Heart
                size={22}
                className={
                  isInWishlist(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                }
              />
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Truck size={20} className="text-gold" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">Orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Shield size={20} className="text-gold" />
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
          <h2 className="mb-6 text-2xl font-bold text-navy">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy">{p.name}</h3>
                  <p className="mt-1 text-lg font-bold text-gold">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
