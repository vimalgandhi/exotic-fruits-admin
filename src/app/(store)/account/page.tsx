'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { User, Package, Settings, Mail, Calendar } from 'lucide-react'

export default function AccountPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) return null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-navy-600">My Account</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Avatar & Name */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-600 text-3xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-xl font-bold text-navy-600">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
          <Link
            href="/settings"
            className="mt-4 inline-block btn-secondary-sm"
          >
            Edit Profile
          </Link>
        </div>

        {/* Account Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:col-span-2">
          <h3 className="mb-4 text-lg font-bold text-navy-600">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gold-500" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-navy-600">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gold-500" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium text-navy-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gold-500" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium text-navy-600">March 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 md:col-span-3">
          <h3 className="mb-4 text-lg font-bold text-navy-600">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Link
              href="/orders"
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center hover:border-gold-500 hover:bg-gold-50"
            >
              <Package size={24} className="text-gold-500" />
              <span className="text-sm font-medium text-navy-600">My Orders</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center hover:border-gold-500 hover:bg-gold-50"
            >
              <Settings size={24} className="text-gold-500" />
              <span className="text-sm font-medium text-navy-600">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
