'use client';

import React, { useState } from 'react';

const mockProducts = [
  { id: 1, name: 'Mango', category: 'Tropical', price: 5.99, stock: 50 },
  { id: 2, name: 'Banana', category: 'Tropical', price: 2.99, stock: 100 },
  { id: 3, name: 'Apple', category: 'Temperate', price: 3.99, stock: 75 },
  { id: 4, name: 'Orange', category: 'Citrus', price: 4.99, stock: 60 },
  { id: 5, name: 'Papaya', category: 'Tropical', price: 6.99, stock: 40 },
  { id: 6, name: 'Pineapple', category: 'Tropical', price: 7.99, stock: 35 },
  { id: 7, name: 'Strawberry', category: 'Berries', price: 4.99, stock: 80 },
  { id: 8, name: 'Blueberry', category: 'Berries', price: 6.99, stock: 45 },
  { id: 9, name: 'Watermelon', category: 'Melon', price: 8.99, stock: 25 },
  { id: 10, name: 'Grapes', category: 'Berries', price: 5.99, stock: 55 },
  { id: 11, name: 'Dragon Fruit', category: 'Exotic', price: 9.99, stock: 30 },
  { id: 12, name: 'Kiwi', category: 'Exotic', price: 3.99, stock: 70 },
  { id: 13, name: 'Guava', category: 'Tropical', price: 4.99, stock: 50 },
  { id: 14, name: 'Passion Fruit', category: 'Exotic', price: 7.99, stock: 40 },
  { id: 15, name: 'Pomegranate', category: 'Temperate', price: 6.99, stock: 35 },
  { id: 16, name: 'Coconut', category: 'Tropical', price: 5.99, stock: 60 },
  { id: 17, name: 'Lemon', category: 'Citrus', price: 2.99, stock: 90 },
  { id: 18, name: 'Lime', category: 'Citrus', price: 2.99, stock: 85 },
  { id: 19, name: 'Peach', category: 'Temperate', price: 4.99, stock: 15 },
  { id: 20, name: 'Plum', category: 'Temperate', price: 3.99, stock: 65 },
];

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(mockProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mockProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const getStockColor = (stock: number) => {
    if (stock > 50) return 'bg-green-100 text-green-800';
    if (stock >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 mt-1">{mockProducts.length} products total</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStockColor(product.stock)}`}>
                    {product.stock} units
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
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page Info */}
          <div className="text-sm font-medium text-gray-600">
            Page <span className="text-blue-600 font-bold">{currentPage}</span> of{' '}
            <span className="text-blue-600 font-bold">{totalPages}</span> | Showing{' '}
            <span className="text-blue-600 font-bold">{currentItems.length}</span> of{' '}
            <span className="text-blue-600 font-bold">{mockProducts.length}</span> products
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