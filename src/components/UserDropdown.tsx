'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { User, Package, Settings, LogOut, Heart, ChevronDown } from 'lucide-react'

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <Link
          href="/login"
          className="w-full sm:w-auto text-center sm:text-left rounded px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white sm:text-navy-600 hover:text-gold-500 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="w-full sm:w-auto text-center btn-secondary-sm sm:btn-secondary-sm bg-gold-500 sm:bg-gold-500 text-navy-800 sm:text-navy-800 hover:bg-gold-600"
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full sm:w-auto items-center justify-between sm:justify-center gap-2 rounded-full border border-navy-700 sm:border-gray-200 bg-navy-700 sm:bg-white px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
      >
        <div className="flex h-6 sm:h-7 w-6 sm:w-7 items-center justify-center rounded-full bg-gold-500 text-xs sm:text-sm font-medium text-navy-800">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs sm:text-sm font-medium text-white sm:text-navy-600">
          {user?.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-gold-500 sm:text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-48 rounded-lg border border-navy-700 sm:border-gray-200 bg-navy-700 sm:bg-white py-1 shadow-lg z-50">
          <Link
            href="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-white sm:text-gray-700 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
          >
            <User size={16} />
            My Account
          </Link>
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-white sm:text-gray-700 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
          >
            <Package size={16} />
            My Orders
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-white sm:text-gray-700 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
          >
            <Heart size={16} />
            Wishlist
          </Link>
          <Link
            href="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-white sm:text-gray-700 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
          >
            <Settings size={16} />
            Settings
          </Link>
          <div className="my-1 border-navy-600 sm:border-gray-200 border-t" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-xs sm:text-sm text-gold-500 sm:text-error-500 hover:bg-navy-600 sm:hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
