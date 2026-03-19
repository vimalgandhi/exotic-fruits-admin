import { useState, useCallback } from 'react';
import { getAdminOrders, getAdminOrderById, updateOrderStatus } from '@/lib/api';
import { logger } from '@/lib/logger';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (page = 1, status = '', search = '') => {
    try {
      setLoading(true);
      const data = (await getAdminOrders(page, status, search)) as { data: Order[] };
      setOrders(data.data ?? []);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      logger.error('useAdminOrders/fetchOrders', message, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrder = useCallback(async (id: string) => {
    try {
      const data = (await getAdminOrderById(id)) as { data: Order };
      return data.data;
    } catch (err) {
      logger.error('useAdminOrders/getOrder', `Failed to fetch order id=${id}`, err);
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch order');
    }
  }, []);

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      try {
        setLoading(true);
        const data = await updateOrderStatus(id, status);
        setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
        setError(null);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update order status';
        logger.error('useAdminOrders/updateStatus', `Failed to update status for order id=${id}`, err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [orders]
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    updateStatus,
  };
}
