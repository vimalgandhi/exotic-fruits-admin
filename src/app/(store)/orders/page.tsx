"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> =
  {
    pending: {
      color: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
      icon: Clock,
    },
    confirmed: {
      color: "text-blue-700",
      bg: "bg-blue-50 border-blue-200",
      icon: CheckCircle,
    },
    processing: {
      color: "text-purple-700",
      bg: "bg-purple-50 border-purple-200",
      icon: Truck,
    },
    shipped: {
      color: "text-indigo-700",
      bg: "bg-indigo-50 border-indigo-200",
      icon: Truck,
    },
    delivered: {
      color: "text-green-700",
      bg: "bg-green-50 border-green-200",
      icon: CheckCircle,
    },
    cancelled: {
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
      icon: AlertCircle,
    },
  };

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "💵 Cash on Delivery",
  upi: "📱 UPI",
  card: "💳 Card Payment",
};

export default function OrdersPage() {
  const { isAuthenticated, hydrated, checkAuth } = useAuth();
  const router = useRouter();
  const { orders, loading: ordersLoading, error, fetchOrders } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Wait for hydration to complete before making auth decision
    if (!hydrated) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch orders if authenticated
    fetchOrders();
  }, [hydrated, isAuthenticated, router, fetchOrders]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-12">
            <h1 className="mb-2 text-4xl font-bold text-slate-900">
              My Orders
            </h1>
            <p className="text-slate-600">Track and manage your purchases</p>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-600">Track and manage your purchases</p>
        </div>

        {ordersLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
            <p className="text-red-700">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Start shopping to see your orders here."
            actionLabel="Browse Products"
            onAction={() => router.push("/products")}
            icon={<Package size={64} className="text-slate-300" />}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const orderId = (order.id || order._id).toString();
              const isExpanded = expandedOrder === orderId;
              const statusKey = (order.status || "pending").toLowerCase();
              const statusConfig =
                STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;
              const paymentMethod = order.payment_method || "card";
              const paymentLabel =
                PAYMENT_METHOD_LABELS[paymentMethod] || "Unknown";

              return (
                <div
                  key={orderId}
                  className={`overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-all duration-300 hover:shadow-lg ${statusConfig.bg}`}
                >
                  {/* Order Header */}
                  <button
                    onClick={() => toggleOrder(orderId)}
                    className="w-full px-6 py-6 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            Order #{order.order_number || order.id}
                          </h3>
                          <span
                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusConfig.color}`}
                          >
                            <StatusIcon size={16} />
                            {statusKey.charAt(0).toUpperCase() +
                              statusKey.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 md:grid-cols-4">
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">
                              Date
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">
                              Items
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {Array.isArray(order.items)
                                ? order.items.length
                                : 0}{" "}
                              Product
                              {Array.isArray(order.items) &&
                              order.items.length !== 1
                                ? "s"
                                : ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">
                              Payment
                            </p>
                            <p className="mt-1 font-medium text-slate-900">
                              {paymentLabel}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase">
                              Total
                            </p>
                            <p className="mt-1 text-xl font-bold text-slate-900">
                              {formatCurrency(
                                order.total_amount ||
                                  order.total ||
                                  order.totalAmount ||
                                  0,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronUp size={24} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={24} className="text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t-2 border-slate-200 px-6 py-6">
                      {/* Customer & Delivery Info */}
                      <div className="mb-6 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                            <Package size={18} />
                            Order Information
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-slate-500">Order Number</p>
                              <p className="font-mono font-medium text-slate-900">
                                {order.order_number || order.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Payment Status</p>
                              <p className="font-medium text-slate-900">
                                {order.paymentStatus ||
                                  (order.status === "confirmed"
                                    ? "✅ Paid"
                                    : "⏳ Pending")}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Order Total</p>
                              <p className="text-lg font-bold text-slate-900">
                                {formatCurrency(
                                  order.total_amount ||
                                    order.total ||
                                    order.totalAmount ||
                                    0,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                            <MapPin size={18} />
                            Delivery Address
                          </h4>
                          <div className="space-y-3 text-sm">
                            {order.customer_name && (
                              <div>
                                <p className="text-slate-500">Name</p>
                                <p className="font-medium text-slate-900">
                                  {order.customer_name}
                                </p>
                              </div>
                            )}
                            {order.delivery_address && (
                              <div>
                                <p className="text-slate-500">Address</p>
                                <p className="font-medium text-slate-900">
                                  {order.delivery_address}
                                </p>
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              {order.customer_phone && (
                                <div className="flex items-center gap-2">
                                  <Phone size={14} className="text-slate-400" />
                                  <p className="text-slate-700">
                                    {order.customer_phone}
                                  </p>
                                </div>
                              )}
                              {order.customer_email && (
                                <div className="flex items-center gap-2">
                                  <Mail size={14} className="text-slate-400" />
                                  <p className="text-slate-700">
                                    {order.customer_email}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {Array.isArray(order.items) && order.items.length > 0 && (
                        <div>
                          <h4 className="mb-6 font-semibold text-slate-900">
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {order.items.map((item: any, idx: number) => {
                              const itemName =
                                item.product?.name ||
                                item.name ||
                                item.productName ||
                                "Product";
                              const itemPrice =
                                item.unit_price ||
                                item.price ||
                                item.product?.price ||
                                0;
                              const itemQty = item.quantity || 1;
                              const itemSubtotal = itemPrice * itemQty;
                              const itemImage =
                                item.product?.image ||
                                item.image ||
                                item.productImage ||
                                null;
                              const itemCategory =
                                item.product?.category?.name ||
                                item.product?.category ||
                                item.category ||
                                null;
                              const itemDescription =
                                item.product?.description ||
                                item.description ||
                                null;

                              return (
                                <div
                                  key={idx}
                                  className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                                >
                                  {/* Image and Details Side by Side */}
                                  <div className="grid gap-4 p-4 md:grid-cols-2">
                                    {/* Left: Product Image */}
                                    <div className="flex items-center justify-center">
                                      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 shadow-md">
                                        {itemImage ? (
                                          <img
                                            src={itemImage}
                                            alt={itemName}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                          />
                                        ) : (
                                          <div className="flex h-full w-full items-center justify-center">
                                            <Package
                                              size={48}
                                              className="text-slate-400"
                                            />
                                          </div>
                                        )}
                                        {itemCategory && (
                                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                                            <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                                              {itemCategory}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Right: Product Details */}
                                    <div className="flex flex-col justify-between">
                                      <div>
                                        <h3 className="mb-1 text-base font-bold text-slate-900">
                                          {itemName}
                                        </h3>

                                        {itemDescription && (
                                          <p className="mb-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                                            {itemDescription}
                                          </p>
                                        )}

                                        {/* Pricing Details */}
                                        <div className="mb-2 space-y-1 rounded-lg bg-slate-50 p-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-600">
                                              Unit Price
                                            </span>
                                            <span className="text-sm font-bold text-slate-900">
                                              {formatCurrency(itemPrice)}
                                            </span>
                                          </div>
                                          <div className="border-t border-slate-200" />
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-600">
                                              Quantity
                                            </span>
                                            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                                              {itemQty} unit
                                              {itemQty > 1 ? "s" : ""}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Item Subtotal */}
                                        <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 p-3">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-emerald-700">
                                              Item Subtotal
                                            </span>
                                            <span className="text-xl font-bold text-emerald-600">
                                              {formatCurrency(itemSubtotal)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Order Summary - Below All Items */}
                          <div className="mt-3 rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 py-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-bold text-slate-900">
                                Order Total:
                              </span>
                              <span className="text-xl font-bold text-emerald-600">
                                {formatCurrency(
                                  order.total_amount ||
                                    order.total ||
                                    order.totalAmount ||
                                    0,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
