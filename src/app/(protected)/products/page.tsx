"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { formatDate } from "@/lib/utils";
import { getPriceRange } from "@/lib/utils/productUtils";
import type { Product } from "@/types";
import Button from "@/components/ui/button";
import Table from "@/components/ui/table";

export default function ProductsPage() {
  const router = useRouter();
  const { products, isLoading, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered products
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success(`"${name}" deleted successfully`);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Product",
      render: (_: unknown, row: Product) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.images[0]}
              alt={row.name}
              className="h-10 w-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category" },
    {
      key: "pricelist",
      header: "Sizes",
      render: (_: unknown, row: Product) => {
        const activeUnits = row.pricelist?.filter((u) => u.isactive) ?? [];
        if (activeUnits.length === 0)
          return <span className="text-gray-400 text-xs">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {activeUnits.map((u) => (
              <span
                key={u.unitId}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
              >
                {u.unitName}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "priceRange",
      header: "Price Range",
      render: (_: unknown, row: Product) => (
        <span className="text-sm font-medium text-gray-900">
          {getPriceRange(row.pricelist)}
        </span>
      ),
    },
    {
      key: "stockStatus",
      header: "Stock",
      render: (_: unknown, row: Product) => {
        const isInStock = !row.stockStatus || row.stockStatus === "In Stock";
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isInStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.stockStatus ?? "In Stock"}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (val: unknown) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            val === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {String(val)}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (val: unknown) => formatDate(val as string),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: unknown, row: Product) => (
        <div className="flex items-center gap-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            onClick={() => router.push(`/products/${row.id}`)}
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            onClick={() => handleDelete(row.id, row.name)}
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <Button onClick={() => router.push("/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <Table<Product>
          data={currentItems}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No products found"
        />
      </div>

      {/* Pagination */}
      <div className="">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Items Per Page */}
          {/* <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div> */}

          {/* Navigation */}
          <nav className="overflow-x-auto w-full">
            <ul className="flex items-center gap-1 px-3 py-2 justify-center rounded-lg whitespace-nowrap">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-blue-300 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition"
                >
                  &#8592; Previous
                </button>
              </li>
              {/* Page numbers with ellipsis */}
              {(() => {
                const pages = [];
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(
                      <li key={i}>
                        <button
                          onClick={() => paginate(i)}
                          className={`min-w-[32px] h-8 rounded font-semibold transition ${
                            currentPage === i
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      </li>,
                    );
                  }
                } else {
                  // Always show first page
                  pages.push(
                    <li key={1}>
                      <button
                        onClick={() => paginate(1)}
                        className={`min-w-[32px] h-8 rounded font-semibold transition ${
                          currentPage === 1
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                        }`}
                      >
                        1
                      </button>
                    </li>,
                  );
                  // Show ellipsis if needed
                  if (currentPage > 4) {
                    pages.push(
                      <li key="start-ellipsis" className="px-2">
                        ...
                      </li>,
                    );
                  }
                  // Show pages around current
                  for (
                    let i = Math.max(2, currentPage - 2);
                    i <= Math.min(totalPages - 1, currentPage + 2);
                    i++
                  ) {
                    pages.push(
                      <li key={i}>
                        <button
                          onClick={() => paginate(i)}
                          className={`min-w-[32px] h-8 rounded font-semibold transition ${
                            currentPage === i
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                          }`}
                        >
                          {i}
                        </button>
                      </li>,
                    );
                  }
                  // Show ellipsis if needed
                  if (currentPage < totalPages - 3) {
                    pages.push(
                      <li key="end-ellipsis" className="px-2">
                        ...
                      </li>,
                    );
                  }
                  // Always show last page
                  pages.push(
                    <li key={totalPages}>
                      <button
                        onClick={() => paginate(totalPages)}
                        className={`min-w-[32px] h-8 rounded font-semibold transition ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </li>,
                  );
                }
                return pages;
              })()}
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-blue-300 bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition"
                >
                  Next &#8594;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
