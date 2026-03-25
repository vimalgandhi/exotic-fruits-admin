"use client";

import { ChevronLeft, ChevronRight, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Order } from "@/hooks/useAdminOrders";
import StatCard from "@/components/common/stat-card";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  total?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onStatusFilter?: (status: string) => void;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
  processing: { bg: "bg-blue-50", text: "text-blue-700" },
  shipped: { bg: "bg-purple-50", text: "text-purple-700" },
  delivered: { bg: "bg-green-50", text: "text-green-700" },
  cancelled: { bg: "bg-red-50", text: "text-red-700" },
};

export default function OrderList({
  orders,
  isLoading,
  total = 0,
  page = 1,
  onPageChange = () => {},
  onStatusFilter = () => {},
}: OrderListProps) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      setStats({
        totalOrders: total,
        pending: orders.filter((o) => o.status === "pending").length,
        processing: orders.filter((o) => o.status === "processing").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
      });
    }
  }, [orders, total]);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize);

  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status.toLowerCase()] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Processing" value={stats.processing} />
        <StatCard title="Delivered" value={stats.delivered} />
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onStatusFilter("")}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            All Orders
          </button>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => onStatusFilter(status)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <p>Loading orders...</p>
          </div>
        ) : orders && orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const statusColor = getStatusColor(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                          ₹
                          {(typeof order.total === "number"
                            ? order.total
                            : 0
                          ).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.text}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
