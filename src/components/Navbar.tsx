'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { UserDropdown } from './UserDropdown'
import { useCart } from '@/hooks/useCart'
import { useWishlistStore } from '@/store/wishlistStore'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const wishlistCount = useWishlistStore((s) => s.items.length)

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-navy">🥭 Exotic Fruits</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-gold"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-gold"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gold"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-gold"
            >
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative">
              <Heart size={22} className="text-navy" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart size={22} className="text-navy" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs text-white">
                  {itemCount}
                </span>
              )}
            </Link>
            <div className="hidden md:block">
              <UserDropdown />
            </div>
            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <UserDropdown />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
