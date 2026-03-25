'use client';

import { useState, useEffect } from 'react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import OrderList from '@/components/orders/OrderList';
import type { Order } from '@/hooks/useAdminOrders';

// Normalize API response to Order interface
const normalizeOrder = (apiOrder: any): Order => {
  return {
    id: apiOrder.id || apiOrder._id || '',
    orderNumber: apiOrder.orderNumber || apiOrder.order_number || `#${apiOrder.id}`,
    customer: apiOrder.customer || apiOrder.customerName || apiOrder.customer_name || 'Unknown',
    total: Number(apiOrder.total || apiOrder.totalAmount || apiOrder.total_amount || 0),
    status: apiOrder.status || 'pending',
    date: apiOrder.date || apiOrder.createdAt || apiOrder.created_at || new Date().toISOString(),
  };
};

export default function OrdersPage() {
  const { orders, loading, error, fetchOrders } = useAdminOrders();
  const [normalisedOrders, setNormalisedOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = (await fetchOrders(page, status, search)) as any;
        setTotal(response?.total || response?.data?.length || 0);
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    };
    loadOrders();
  }, [page, status, search, fetchOrders]);

  useEffect(() => {
    // Normalize orders when they load
    if (orders && Array.isArray(orders)) {
      const normalized = orders.map(normalizeOrder);
      setNormalisedOrders(normalized);
    }
  }, [orders]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilter = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <OrderList
        orders={normalisedOrders}
        isLoading={loading}
        total={total}
        page={page}
        onPageChange={handlePageChange}
        onStatusFilter={handleStatusFilter}
      />
    </div>
  );
}
