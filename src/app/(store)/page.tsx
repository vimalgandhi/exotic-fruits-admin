import Link from 'next/link'
import Image from 'next/image'

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Dragon Fruit',
    slug: 'dragon-fruit',
    price: 299,
    image: 'https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=400',
    category: 'Tropical',
    stock: 'In Stock' as const,
    description: 'Beautiful pink dragon fruit with white flesh.',
    origin: 'Vietnam',
  },
  {
    id: '2',
    name: 'Passion Fruit',
    slug: 'passion-fruit',
    price: 199,
    image: 'https://images.unsplash.com/photo-1501746877-14782df58970?w=400',
    category: 'Tropical',
    stock: 'In Stock' as const,
    description: 'Sweet and tangy passion fruit.',
    origin: 'Brazil',
  },
  {
    id: '3',
    name: 'Star Fruit',
    slug: 'star-fruit',
    price: 149,
    image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400',
    category: 'Tropical',
    stock: 'In Stock' as const,
    description: 'Crispy and refreshing star fruit.',
    origin: 'Malaysia',
  },
  {
    id: '4',
    name: 'Rambutan',
    slug: 'rambutan',
    price: 249,
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400',
    category: 'Tropical',
    stock: 'In Stock' as const,
    description: 'Sweet rambutan with juicy white flesh.',
    origin: 'Thailand',
  },
]

export default function HomePage() {
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
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
