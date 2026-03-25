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
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "sonner";
import { getAllProducts, toggleWishlist, getCategories } from "@/lib/api";
import type { SortOptionValue, Product } from "@/types";

const ITEMS_PER_PAGE = 6;

interface PriceOption {
  unitId: number;
  unitName: string;
  unitSize?: string;
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
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categoryIdMap, setCategoryIdMap] = useState<{ [key: string]: string }>(
    {},
  );
  const [selectedPrices, setSelectedPrices] = useState<{
    [productId: string]: number;
  }>({});
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

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
      prev.map((p) => (p.id === productId ? { ...p, inWishlist } : p)),
    );
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (product: ApiProduct) => {
    if (!isAuthenticated) {
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
          price:
            product.pricelist?.[selectedPrices[product.id] ?? 0]
              ?.afterDiscountPrice ??
            product.price ??
            0,
          image: product.image,
          category: product.category || "",
          stock:
            product.stockStatus === "Out of Stock"
              ? "Out of Stock"
              : "In Stock",
          description: product.description || "",
          origin: product.origin || "",
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

  const handleAddToCart = async (product: ApiProduct) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    const isOutOfStock =
      product.stockStatus === "Out of Stock" ||
      product.stock === "Out of Stock";
    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      setAddingProductId(product.id);
      const selectedPriceIndex = selectedPrices[product.id] ?? 0;
      const selectedOption = product.pricelist?.[selectedPriceIndex];

      await addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          category: product.category || "",
          stock: (product.stockStatus || product.stock) as
            | "In Stock"
            | "Out of Stock",
          description: product.description,
          origin: product.origin,
        },
        1,
        selectedOption as any,
      );
      // addItem already shows success toast
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-8">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold text-navy-600">
        Our Products
      </h1>

      <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <ProductFilters
            variant="sidebar"
            categories={categories}
            categoryIdMap={categoryIdMap}
          />
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Top bar: mobile filters + search + sort */}
          <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-3">
            {/* First row: Filters + Search */}
            <div className="flex items-center gap-2">
              {/* Mobile filter button (drawer) */}
              <div className="lg:hidden flex-shrink-0">
                <ProductFilters
                  variant="mobile"
                  categories={categories}
                  categoryIdMap={categoryIdMap}
                />
              </div>
              <div className="flex-1 min-w-0">
                <SearchInput
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {/* Second row: Sort (full width on mobile, flex on sm+) */}
            <div className="sm:flex sm:justify-end">
              <ProductSort />
            </div>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-gray-200"
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
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 sm:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gold-300"
                  >
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
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-2xl sm:text-3xl md:text-4xl">
                              🍑
                            </div>
                          )}
                          {product.stockStatus === "Out of Stock" ||
                          product.stock === "Out of Stock" ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                              <span className="rounded bg-white px-2 py-1 text-xs font-medium text-red-600">
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
                        className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 rounded-full bg-white p-1.5 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl"
                      >
                        <Heart
                          size={14}
                          className={`sm:size-4 ${
                            product.inWishlist
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col p-2 sm:p-3">
                      {/* Category Badge */}
                      <span className="text-xs font-semibold text-gold-500 bg-gold-50 rounded-full px-2 py-0.5 w-fit">
                        {product.category}
                      </span>

                      {/* Product Name */}
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="mt-1.5 sm:mt-2 font-semibold text-navy-600 text-xs sm:text-sm line-clamp-2 group-hover:text-gold-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Origin */}
                      <p className="mt-0.5 sm:mt-1 text-xs text-gray-500 line-clamp-1">
                        {product.origin}
                      </p>

                      {/* Price and Actions */}
                      <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:pt-3">
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
                              className="w-full rounded border border-gray-200 py-2 text-sm font-medium focus:border-navy focus:outline-none transition-colors"
                            >
                              {product.pricelist.map((option, idx) => (
                                <option key={option.unitId} value={idx}>
                                  {option.unitName}
                                  {option.unitSize} - ₹
                                  {option.afterDiscountPrice}
                                  {option.discount && ` (-${option.discount}%)`}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-bold text-navy-600 text-xs sm:text-lg">
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
                                  addingProductId === product.id ||
                                  product.stockStatus === "Out of Stock" ||
                                  product.stock === "Out of Stock"
                                }
                                aria-label="Add to cart"
                                className="ml-auto inline-flex items-center justify-center rounded-md bg-gradient-to-r from-navy to-blue-600 px-2 py-2 text-xs font-medium bg-gold-700 text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                              >
                                <ShoppingCart size={16} />
                                <span className="sr-only">Add to cart</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-bold text-navy-600 text-xs sm:text-lg">
                              ₹{product.price}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={
                                addingProductId === product.id ||
                                product.stockStatus === "Out of Stock" ||
                                product.stock === "Out of Stock"
                              }
                              aria-label="Add to cart"
                              className="ml-auto inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-navy to-blue-600 px-2 py-2 text-xs font-medium text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                              <ShoppingCart size={16} />
                              <span className="sr-only">Add to cart</span>
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-200" />
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
