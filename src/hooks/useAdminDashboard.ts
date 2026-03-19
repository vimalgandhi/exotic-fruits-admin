import { useState, useEffect, useCallback } from "react";
import { getDashboardStats, getAnalyticsData } from "@/lib/api";
import { logger } from "@/lib/logger";

interface DashboardStats {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    salesData: unknown[];
    topProducts: unknown[];
  };
  recentOrders: unknown[];
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
      const message =
        err instanceof Error ? err.message : "Failed to fetch dashboard stats";
      logger.error("useAdminDashboard/fetchDashboardStats", message, err);
      setError(message);
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
      const data = (await getAnalyticsData(startDate, endDate)) as {
        data: unknown;
      };
      return data.data;
    } catch (err) {
      logger.error(
        "useAdminDashboard/getAnalytics",
        "Failed to fetch analytics data",
        err,
      );
      throw new Error(
        err instanceof Error ? err.message : "Failed to fetch analytics",
      );
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
