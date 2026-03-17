'use client';

import React, { useState } from 'react';

const mockCategories = [
  { id: 1, name: 'Tropical Fruits', slug: 'tropical-fruits', description: 'Fruits from tropical regions', productCount: 12, status: 'active' },
  { id: 2, name: 'Citrus Fruits', slug: 'citrus-fruits', description: 'Citrus family fruits', productCount: 8, status: 'active' },
  { id: 3, name: 'Stone Fruits', slug: 'stone-fruits', description: 'Fruits with a pit or stone', productCount: 6, status: 'active' },
  { id: 4, name: 'Berries', slug: 'berries', description: 'Small pulpy fruits', productCount: 10, status: 'inactive' },
  { id: 5, name: 'Melons', slug: 'melons', description: 'Large juicy fruits', productCount: 5, status: 'active' },
  { id: 6, name: 'Exotic Fruits', slug: 'exotic-fruits', description: 'Rare and exotic varieties', productCount: 9, status: 'active' },
  { id: 7, name: 'Temperate Fruits', slug: 'temperate-fruits', description: 'Fruits from temperate climates', productCount: 7, status: 'active' },
  { id: 8, name: 'Dried Fruits', slug: 'dried-fruits', description: 'Sun-dried and dehydrated fruits', productCount: 4, status: 'inactive' },
  { id: 9, name: 'Seasonal Fruits', slug: 'seasonal-fruits', description: 'Fruits available by season', productCount: 11, status: 'active' },
  { id: 10, name: 'Organic Fruits', slug: 'organic-fruits', description: 'Certified organic fruits', productCount: 15, status: 'active' },
  { id: 11, name: 'Imported Fruits', slug: 'imported-fruits', description: 'Fruits imported from abroad', productCount: 3, status: 'inactive' },
];

export default function CategoryList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(mockCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 mt-1">{mockCategories.length} categories total</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Products</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category) => (
              <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{category.productCount}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Items Per Page */}
          <div className="flex items-center gap-3">
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
          </div>

          {/* Page Info */}
          <div className="text-sm font-medium text-gray-600">
            Page <span className="text-blue-600 font-bold">{currentPage}</span> of{' '}
            <span className="text-blue-600 font-bold">{totalPages}</span> | Showing{' '}
            <span className="text-blue-600 font-bold">{currentItems.length}</span> of{' '}
            <span className="text-blue-600 font-bold">{mockCategories.length}</span> categories
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-300">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`min-w-[32px] h-8 rounded font-semibold transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}