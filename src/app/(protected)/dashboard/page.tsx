'use client';

import { Package, Tag, ShoppingCart, DollarSign } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { stats, loading } = useAdminDashboard();

  const statCards = [
    {
      label: 'Total Products',
      value: loading ? '—' : String(stats?.totalProducts ?? 0),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Total Orders',
      value: loading ? '—' : String(stats?.totalOrders ?? 0),
      icon: ShoppingCart,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      label: 'Total Users',
      value: loading ? '—' : String(stats?.totalUsers ?? 0),
      icon: Tag,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Total Revenue',
      value: loading ? '—' : formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Exotic Fruits Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (stats?.topProducts ?? []).length === 0 ? (
            <p className="text-sm text-gray-400">No data available</p>
          ) : (
            <div className="space-y-3">
              {(stats?.topProducts ?? []).map((item: unknown, i: number) => {
                const product = item as Record<string, unknown>;
                return (
                  <div key={String(product.id ?? i)} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{String(product.name ?? '')}</p>
                      <p className="text-xs text-gray-500">{String(product.category ?? '')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(Number(product.price ?? 0))}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (stats?.recentOrders ?? []).length === 0 ? (
            <p className="text-sm text-gray-400">No data available</p>
          ) : (
            <div className="space-y-3">
              {(stats?.recentOrders ?? []).map((item: unknown, i: number) => {
                const order = item as Record<string, unknown>;
                return (
                  <div key={String(order.id ?? i)} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{String(order.orderNumber ?? order.id ?? '')}</p>
                      <p className="text-xs text-gray-500">{String(order.customer ?? '')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(Number(order.total ?? 0))}</p>
                      <p className="text-xs text-gray-400">{order.date ? formatDate(String(order.date)) : ''}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
