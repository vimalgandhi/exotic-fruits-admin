"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { getAllProducts, toggleWishlist, isAuthenticated } from "@/lib/api";
import { toast } from "sonner";

interface PriceItem {
  unitId: number;
  unitName: string;
  unitPrice: number;
  discountType: string;
  discount: string;
  afterDiscountPrice: number;
}

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price?: number;
  image: string;
  category:
    | {
        name: string;
        status: string;
      }
    | string;
  stockStatus: string;
  originCountry: string;
  pricelist?: PriceItem[];
  inWishlist?: boolean;
}

function normalizeFeaturedProduct(p: any): FeaturedProduct {
  let parsedPriceList: PriceItem[] = [];

  try {
    parsedPriceList = p.pricelist ? JSON.parse(p.pricelist) : [];
  } catch (err) {
    console.error("Invalid pricelist JSON", err);
  }

  return {
    id: p.id || p.productid || String(Math.random()),
    name: p.name || p.productName || "",
    slug: p.slug || p.id || p.productid || "",
    price: p.price ?? 0,
    image: p.image || p.imageUrl || "",
    category: p.category?.name || p.categoryName || "",
    stockStatus: p.stock || p.stkStatus || "In Stock",
    originCountry: p.originCountry || "",
    pricelist: parsedPriceList,
    inWishlist: p.inWishlist || false,
  };
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>(
    [],
  );
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ✅ per-product selected unit
  const [selectedUnits, setSelectedUnits] = useState<Record<string, PriceItem>>(
    {},
  );

  // Load featured products
  useEffect(() => {
    getAllProducts(1, 4)
      .then((data) => {
        const raw: any[] = Array.isArray(data) ? data : [];

        const normalized = raw.slice(0, 4).map(normalizeFeaturedProduct);
        setFeaturedProducts(normalized);

        // ✅ Set default selected unit (first item)
        const defaultSelections: Record<string, PriceItem> = {};

        normalized.forEach((product) => {
          if (product.pricelist && product.pricelist.length > 0) {
            defaultSelections[product.id] = product.pricelist[0];
          }
        });

        setSelectedUnits(defaultSelections);
      })
      .catch((err) => console.error("Failed to fetch featured products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Update product wishlist status
  const updateProductWishlist = (productId: string, inWishlist: boolean) => {
    setFeaturedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inWishlist } : p
      )
    );
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product: FeaturedProduct) => {
    if (!isAuthenticated()) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const isCurrentlyInWishlist = product.inWishlist || false;
      
      // Optimistic update
      updateProductWishlist(product.id, !isCurrentlyInWishlist);
      
      // Call toggle endpoint
      await toggleWishlist(product.id);
      
      // Show appropriate toast message
      if (isCurrentlyInWishlist) {
        toast.success(`${product.name} removed from Wishlist`);
      } else {
        toast.success(`${product.name} added to Wishlist ❤️`);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      toast.error("Failed to update wishlist");
      // Revert optimistic update on error
      updateProductWishlist(product.id, product.inWishlist || false);
    }
  };

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
            Hand-picked premium exotic fruits from around the globe.
          </p>
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
          {loadingProducts ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const selected = selectedUnits[product.id];
                const inWishlist = product.inWishlist || false;

                return (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-xl border transition-shadow bg-white shadow-sm hover:shadow-md"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-48 overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100">
                            🍑
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow transition-transform duration-300 hover:scale-110 active:scale-125"
                      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                      disabled={loadingProducts}
                    >
                      <Heart
                        size={18}
                        className={
                          inWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }
                      />
                    </button>

                    <div className="p-4">
                      <h3 className="font-semibold text-navy">
                        {product.name}
                      </h3>

                      {/* ✅ Dropdown */}
                      {product.pricelist && product.pricelist.length > 0 && (
                        <select
                          className="mt-2 w-full rounded-md border p-2 text-sm"
                          value={selectedUnits[product.id]?.unitId || ""}
                          onChange={(e) => {
                            const selectedItem = product.pricelist?.find(
                              (item) => item.unitId === Number(e.target.value),
                            );

                            if (selectedItem) {
                              setSelectedUnits((prev) => ({
                                ...prev,
                                [product.id]: selectedItem,
                              }));
                            }
                          }}
                        >
                          {product.pricelist && product.pricelist.map((item) => (
                            <option key={item.unitId} value={item.unitId}>
                              {item.unitName} - ₹{item.afterDiscountPrice}
                            </option>
                          ))}
                        </select>
                      )}
                      {/* ✅ Price */}
                      <p className="mt-2 text-lg font-bold text-navy">
                        ₹{selected ? selected.afterDiscountPrice : product.price}
                      </p>

                      {/* Stock */}
                      <p className="mt-2 text-xs text-green-600">
                        {product.stockStatus}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
