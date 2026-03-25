"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { getAllProducts, toggleWishlist, isAuthenticated } from "@/lib/api";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import type { Product } from "@/types";

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
  const { addItem, items } = useCart();
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
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
      prev.map((p) => (p.id === productId ? { ...p, inWishlist } : p)),
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
      // Optimistic update local state
      updateProductWishlist(product.id, !isCurrentlyInWishlist);
      // Update Zustand store optimistically
      if (isCurrentlyInWishlist) {
        useWishlistStore.setState((state) => ({
          items: state.items.filter((item) => item.id !== product.id),
        }));
      } else {
        const productToAdd: Product = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price ?? 0,
          image: product.image,
          category:
            typeof product.category === "string"
              ? product.category
              : product.category?.name || "",
          stock:
            product.stockStatus === "Out of Stock"
              ? "Out of Stock"
              : "In Stock",
          description: "",
          origin: "",
        };
        useWishlistStore.setState((state) => ({
          items: [...state.items, productToAdd],
        }));
      }
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
      <section className="bg-gradient-to-br from-navy-600 to-navy-700 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl text-gray-200">
            Discover the World&#39;s
            <span className="text-gold-500"> Finest Exotic Fruits</span>
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
            <h2 className="text-3xl font-bold text-navy-600">
              Featured Products
            </h2>
            <p className="mt-3 text-gray-500">
              Explore our handpicked selection of exotic fruits
            </p>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featuredProducts.map((product) => {
                const selected = selectedUnits[product.id];
                const inWishlist = product.inWishlist || false;

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold-300"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-50">
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-square overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-3xl sm:text-4xl">
                              🍑
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Wishlist Heart Button */}
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl"
                        aria-label={
                          inWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        disabled={loadingProducts}
                      >
                        <Heart
                          size={16}
                          className={
                            inWishlist
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-3">
                      {/* Product Name */}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-navy-600 text-sm sm:text-base line-clamp-2 group-hover:text-gold-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Stock Status */}
                      <p className="mt-1 text-xs text-success-600 font-medium">
                        {product.stockStatus}
                      </p>

                      {/* Price and Dropdown */}
                      <div className="mt-auto flex flex-col gap-2 pt-3">
                        {product.pricelist && product.pricelist.length > 0 && (
                          <select
                            className="w-full rounded border border-gray-200 px-2 py-1.5 text-xs font-medium focus:border-navy-600 focus:outline-none transition-colors"
                            value={selectedUnits[product.id]?.unitId || ""}
                            onChange={(e) => {
                              const selectedItem = product.pricelist?.find(
                                (item) =>
                                  item.unitId === Number(e.target.value),
                              );

                              if (selectedItem) {
                                setSelectedUnits((prev) => ({
                                  ...prev,
                                  [product.id]: selectedItem,
                                }));
                              }
                            }}
                          >
                            {product.pricelist &&
                              product.pricelist.map((item) => (
                                <option key={item.unitId} value={item.unitId}>
                                  {item.unitName} - ₹{item.afterDiscountPrice}
                                </option>
                              ))}
                          </select>
                        )}

                        {/* Price Display and Add to Cart */}
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <p className="font-bold text-navy-600 text-sm sm:text-base">
                            ₹
                            {selected
                              ? selected.afterDiscountPrice
                              : product.price}
                          </p>
                          <button
                            className="p-2 rounded bg-gold-500 text-white hover:bg-gold-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                            onClick={() =>
                              addItem(
                                {
                                  id: product.id,
                                  name: product.name,
                                  slug: product.slug,
                                  price: product.price ?? 0,
                                  image: product.image,
                                  category:
                                    typeof product.category === "string"
                                      ? product.category
                                      : product.category?.name || "",
                                  stock:
                                    product.stockStatus === "Out of Stock"
                                      ? "Out of Stock"
                                      : "In Stock",
                                  description: "",
                                  origin: "",
                                  originCountry: product.originCountry,
                                  pricelist: product.pricelist?.map((item) => ({
                                    unitId: String(item.unitId),
                                    unitName: item.unitName,
                                    unitValue: 1,
                                    unitPrice: item.unitPrice,
                                    discountType: item.discountType as
                                      | "Percentage"
                                      | "Fixed",
                                    discount: Number(item.discount),
                                    afterDiscountPrice: item.afterDiscountPrice,
                                    isactive: true,
                                    createdon: "",
                                    updatedon: "",
                                  })),
                                },
                                1,
                                selected as any, // Cast to PriceListItem, since types differ but structure is compatible for addItem
                              )
                            }
                            disabled={product.stockStatus === "Out of Stock"}
                            aria-label="Add to Cart"
                            title="Add to Cart"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
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
