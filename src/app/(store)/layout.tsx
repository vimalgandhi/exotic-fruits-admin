import { Navbar } from '@/components/Navbar'
import Link from 'next/link'

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy-600 py-8 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-3 gap-8 ">
          <div>
            <p className="text-lg font-bold">🥭 Exotic Fruits</p>
            <p className="mt-1 text-sm text-gray-300">
              Premium exotic fruits delivered fresh.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm ">
            <p className="font-semibold text-white">Quick Links</p>
            <Link href="/products" className="text-gray-300 hover:text-gold-500">Products</Link>
            <Link href="/wishlist" className="text-gray-300 hover:text-gold-500">Wishlist</Link>
            <Link href="/about" className="text-gray-300 hover:text-gold-500">About Us</Link>
            <Link href="/contact" className="text-gray-300 hover:text-gold-500">Contact</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <p className="font-semibold text-white">Legal</p>
            <Link href="/terms" className="text-gray-300 hover:text-gold-500">Terms &amp; Conditions</Link>
            <Link href="/privacy" className="text-gray-300 hover:text-gold-500">Privacy Policy</Link>
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
