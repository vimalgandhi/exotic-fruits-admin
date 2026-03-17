'use client';

import { Package, Tag, ShoppingCart, DollarSign } from 'lucide-react';
import { MOCK_DASHBOARD_STATS } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';

const stats = [
  {
    label: 'Total Products',
    value: MOCK_DASHBOARD_STATS.totalProducts,
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    label: 'Categories',
    value: MOCK_DASHBOARD_STATS.totalCategories,
    icon: Tag,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    label: 'Total Orders',
    value: MOCK_DASHBOARD_STATS.totalOrders,
    icon: ShoppingCart,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  {
    label: 'Total Revenue',
    value: formatCurrency(MOCK_DASHBOARD_STATS.totalRevenue),
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Exotic Fruits Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
          <div className="space-y-3">
            {MOCK_DASHBOARD_STATS.recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Categories</h2>
          <div className="space-y-3">
            {MOCK_DASHBOARD_STATS.recentCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{category.productCount} products</p>
                  <p className="text-xs text-gray-400">{formatDate(category.updatedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
