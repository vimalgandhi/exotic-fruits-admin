import { Navbar } from '@/components/Navbar'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy py-8 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-lg font-bold">🥭 Exotic Fruits</p>
            <p className="mt-1 text-sm text-gray-300">
              Premium exotic fruits delivered fresh.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-gray-300">
            <a href="/products" className="hover:text-gold">
              Products
            </a>
            <a href="/about" className="hover:text-gold">
              About
            </a>
            <a href="/contact" className="hover:text-gold">
              Contact
            </a>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Exotic Fruits. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
