"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "@/components/SearchInput";
import { EmptyState } from "@/components/EmptyState";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductSort } from "@/components/ProductSort";
import { ProductPagination } from "@/components/ProductPagination";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import {
  getAllProducts,
  toggleWishlist,
  isAuthenticated,
  getCategories,
} from "@/lib/api";
import type { SortOptionValue } from "@/types";

const ITEMS_PER_PAGE = 6;

interface PriceOption {
  unitId: number;
  unitName: string;
  unitPrice: number;
  discountType: string;
  discount: string;
  afterDiscountPrice: number;
  isactive: boolean;
}

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  stock: string;
  stockStatus?: string;
  description: string;
  origin: string;
  pricelist?: PriceOption[];
  featured?: boolean;
  foodType?: string;
  status?: string;
  inWishlist?: boolean;
}

function normalizeProduct(p: any): ApiProduct {
  let pricelist: PriceOption[] = [];
  if (p.pricelist) {
    try {
      pricelist =
        typeof p.pricelist === "string" ? JSON.parse(p.pricelist) : p.pricelist;
    } catch {
      pricelist = [];
    }
  }

  const firstPrice =
    pricelist.length > 0
      ? pricelist[0].afterDiscountPrice
      : Number(p.price) || 0;

  return {
    id: p.id || p.productid || String(p._id || Math.random()),
    name: p.name || p.productName || "",
    slug: p.slug || p.id || p.productid || "",
    price: firstPrice,
    image: p.image || p.imageUrl || "",
    category: p.category?.name || p.category || p.categoryName || "",
    stock: p.stockStatus || p.stock || p.stkStatus || "In Stock",
    stockStatus: p.stockStatus || p.stock || "In Stock",
    description: p.description || "",
    origin: p.originCountry || p.origin || "",
    pricelist,
    featured: p.featured,
    foodType: p.foodType,
    status: p.status,
    inWishlist: p.inWishlist || false,
  };
}

function mapSortToApiParams(sort: SortOptionValue): {
  sortBy: string;
  order: string;
} {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "name-asc":
      return { sortBy: "name", order: "asc" };
    case "name-desc":
      return { sortBy: "name", order: "desc" };
    case "newest":
      return { sortBy: "createdAt", order: "desc" };
    case "popular":
      return { sortBy: "popular", order: "desc" };
    default:
      return { sortBy: "name", order: "asc" };
  }
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((s) => s.addItem);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryIdMap, setCategoryIdMap] = useState<{ [key: string]: string }>({});
  const [selectedPrices, setSelectedPrices] = useState<{
    [productId: string]: number;
  }>({});

  // Parse URL params
  const search = searchParams.get("search") || "";
  const sort = (searchParams.get("sort") || "newest") as SortOptionValue;
  const parseParam = (key: string): number | null => {
    const val = searchParams.get(key);
    if (val === null) return null;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : n;
  };
  const priceMin = parseParam("priceMin");
  const priceMax = parseParam("priceMax");
  const categoryParam = searchParams.get("category");
  const selectedCategories = categoryParam
    ? categoryParam.split(",").filter(Boolean)
    : [];
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1"));

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then((data) => {
        const categoryList = Array.isArray(data)
          ? data.map((cat: any) => ({
              id: cat.id || String(Math.random()),
              name: cat.name || cat,
            }))
          : [];
        
        setCategories(categoryList);
        
        // Create name -> id mapping
        const idMap: { [key: string]: string } = {};
        categoryList.forEach((cat) => {
          idMap[cat.name] = cat.id;
        });
        setCategoryIdMap(idMap);
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { sortBy, order } = mapSortToApiParams(sort);
        
        // Convert category names to IDs for API
        const categoryIds = selectedCategories
          .map((name) => categoryIdMap[name])
          .filter(Boolean)
          .join(",");
        
        const raw = await getAllProducts(
          currentPage,
          ITEMS_PER_PAGE,
          search,
          categoryIds,
          sortBy,
          order,
          priceMin ?? undefined,
          priceMax ?? undefined,
        );
        const items: any[] = Array.isArray(raw)
          ? raw
          : raw?.products || raw?.items || [];
        const pages: number =
          raw?.totalPages || raw?.pagination?.totalPages || 1;
        const total: number =
          raw?.totalItems ||
          raw?.pagination?.totalItems ||
          raw?.total ||
          items.length;
        setProducts(items.map(normalizeProduct));
        setTotalPages(pages);
        setTotalItems(total);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, sort, currentPage, categoryParam, priceMin, priceMax]);

  // Update product wishlist status
  const updateProductWishlist = (productId: string, inWishlist: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inWishlist } : p
      )
    );
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product: ApiProduct) => {
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

  const handleSearchChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.delete("page");
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handleAddToCart = (product: ApiProduct) => {
    const isOutOfStock =
      product.stockStatus === "Out of Stock" ||
      product.stock === "Out of Stock";
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    const selectedPriceIndex = selectedPrices[product.id] ?? 0;
    const selectedOption = product.pricelist?.[selectedPriceIndex];
    const cartPrice = selectedOption?.afterDiscountPrice ?? product.price;
    const cartUnit = selectedOption?.unitName ?? "Unit";

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: cartPrice,
        image: product.image,
        category: product.category || "",
        stock: (product.stockStatus || product.stock) as
          | "In Stock"
          | "Out of Stock",
        description: product.description,
        origin: product.origin,
      },
      1,
    );
    toast.success(`${product.name} (${cartUnit}) added to cart!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-2 md:py-8">
      <h1 className="mb-6 text-3xl font-bold text-navy">Our Products</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <ProductFilters variant="sidebar" categories={categories} categoryIdMap={categoryIdMap} />
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Top bar: mobile filters + search + sort */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile filter button (drawer) */}
              <div className="lg:hidden">
                <ProductFilters variant="mobile" categories={categories} categoryIdMap={categoryIdMap} />
              </div>
              <div className="flex-1">
                <SearchInput
                  placeholder="Search products..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <ProductSort />
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl bg-gray-200"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your search or filter criteria."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="relative">
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative h-48 overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gray-100 text-4xl">
                              🍑
                            </div>
                          )}
                          {product.stockStatus === "Out of Stock" ||
                          product.stock === "Out of Stock" ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="rounded bg-white px-3 py-1 text-sm font-medium text-error">
                                Out of Stock
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </Link>
                      {/* Heart / wishlist button */}
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        aria-label={
                          product.inWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow transition-transform duration-300 hover:scale-110 active:scale-125"
                      >
                        <Heart
                          size={18}
                          className={
                            product.inWishlist
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-gold">
                        {product.category}
                      </span>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="mt-1 font-semibold text-navy hover:text-gold">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.origin}
                      </p>
                      <div className="mt-3 flex flex-col gap-3">
                        {product.pricelist && product.pricelist.length > 0 ? (
                          <>
                            <select
                              value={selectedPrices[product.id] ?? 0}
                              onChange={(e) =>
                                setSelectedPrices({
                                  ...selectedPrices,
                                  [product.id]: parseInt(e.target.value),
                                })
                              }
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-navy focus:outline-none"
                            >
                              {product.pricelist.map((option, idx) => (
                                <option key={option.unitId} value={idx}>
                                  {option.unitName} - ₹
                                  {option.afterDiscountPrice}
                                  {option.discount &&
                                    ` (${option.discount}% off)`}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-navy">
                                ₹
                                {
                                  product.pricelist[
                                    selectedPrices[product.id] ?? 0
                                  ]?.afterDiscountPrice
                                }
                              </span>
                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={
                                  product.stockStatus === "Out of Stock" ||
                                  product.stock === "Out of Stock"
                                }
                                className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors disabled:opacity-50 hover:bg-blue-900"
                              >
                                <ShoppingCart size={14} />
                                Add
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-navy">
                              ₹{product.price}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={
                                product.stockStatus === "Out of Stock" ||
                                product.stock === "Out of Stock"
                              }
                              className="flex items-center gap-1 rounded bg-navy px-3 py-1.5 text-sm text-white transition-colors disabled:opacity-50 hover:bg-blue-900"
                            >
                              <ShoppingCart size={14} />
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
