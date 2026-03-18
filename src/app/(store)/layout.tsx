import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy py-8 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold">🥭 Exotic Fruits</p>
            <p className="mt-1 text-sm text-gray-300">
              Premium exotic fruits delivered fresh.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p className="font-semibold text-white">Quick Links</p>
            <Link href="/products" className="hover:text-gold">Products</Link>
            <Link href="/wishlist" className="hover:text-gold">Wishlist</Link>
            <Link href="/about" className="hover:text-gold">About Us</Link>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p className="font-semibold text-white">Legal</p>
            <Link href="/terms" className="hover:text-gold">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Exotic Fruits. All rights reserved.
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
