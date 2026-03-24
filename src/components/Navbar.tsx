"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { UserDropdown } from "./UserDropdown";
import { useCart } from "@/hooks/useCart";
import { useWishlistStore } from "@/store/wishlistStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const MENU_SECTIONS = [
  {
    title: "Shopping",
    items: [
      { href: "/products", label: "All Products" },
      { href: "/wishlist", label: "Wishlist" },
      { href: "/cart", label: "Shopping Cart" },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/account", label: "My Account" },
      { href: "/orders", label: "My Orders" },
      { href: "/settings", label: "Settings" },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { itemCount } = useCart();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileMenuOpen]);
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((s) => s !== sectionTitle)
        : [...prev, sectionTitle],
    );
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3 sm:gap-4 px-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 min-w-0"
          >
            <span className="text-base sm:text-lg md:text-xl font-bold text-navy whitespace-nowrap">
              🥭 Exotic Fruits
            </span>
          </Link>

          {/* Desktop Navigation - Tablet shows on md+ */}
          <div className="hidden sm:flex items-center gap-3 md:gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gold transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-navy" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy-700">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart
                size={22}
                className="text-navy"
              />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy-700">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Dropdown - Show on tablet and up */}
            <div className="hidden sm:block">
              <UserDropdown />
            </div>
            {/* Mobile menu button - Hide on tablet and up */}
            <button
              className="sm:hidden p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only on mobile */}
        {mobileMenuOpen && (
          <div className="border-t border-navy-600 bg-navy-600 text-white py-4 sm:hidden overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex flex-col">
              {/* Quick Navigation Links */}
              <div className="flex flex-col px-4 gap-2 pb-4 border-b border-navy-700">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-gray-100 hover:text-gold-500 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Accordion Sections */}
              <div className="flex flex-col">
                {MENU_SECTIONS.map((section) => (
                  <div key={section.title} className="border-b border-navy-700">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center justify-between px-4 py-4 hover:bg-navy-700 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-100 uppercase tracking-wide">
                        {section.title}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-gold-500 transition-transform duration-300 ${
                          expandedSections.includes(section.title)
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {/* Expanded Items */}
                    {expandedSections.includes(section.title) && (
                      <div className="bg-navy-700/50 flex flex-col">
                        {section.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="px-8 py-3 text-sm text-gray-200 hover:text-gold-500 hover:bg-navy-700 transition-all border-l-2 border-transparent hover:border-gold-500"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setExpandedSections([]);
                            }}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* User Dropdown for Mobile */}
              <div className="px-4 py-4 border-t border-navy-700">
                <UserDropdown />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
