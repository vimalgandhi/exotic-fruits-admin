import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, getAnalyticsData } from '@/lib/api';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: unknown[];
  salesData: unknown[];
  topProducts: unknown[];
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = (await getDashboardStats()) as { data: DashboardStats };
      setStats(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const getAnalytics = async (startDate: string, endDate: string) => {
    try {
      const data = (await getAnalyticsData(startDate, endDate)) as { data: unknown };
      return data.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch analytics');
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats,
    getAnalytics,
  };
}
