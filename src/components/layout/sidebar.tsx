'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  Leaf,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen (<720px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 720);
    };

    checkMobile();

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Disable/enable body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Floating open button - mobile only, shown when sidebar is closed */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gray-900 text-white rounded-full hover:bg-gray-700 shadow-lg flex items-center justify-center transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay - mobile only, closes sidebar on click */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out',
          // Desktop: side-by-side, normal flow
          'md:relative md:min-h-screen md:translate-x-0',
          // Mobile: fixed overlay, slide in/out
          isMobile && 'fixed left-0 top-0 h-screen z-40 shadow-2xl',
          isMobile && !isOpen && '-translate-x-full',
          isMobile && isOpen && 'translate-x-0'
        )}
      >
        {/* Logo & Close button */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Exotic Fruits</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>

          {/* Close icon - mobile only, top-right of sidebar */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-gray-300" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <p className="px-3 text-xs text-gray-500">v1.0.0 Phase 1</p>
        </div>
      </aside>
    </>
  );
}
