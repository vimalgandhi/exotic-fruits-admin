"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Truck,
  Check,
  X,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { logger } from "@/lib/logger";
import type { Order } from "@/hooks/useAdminOrders";

// Normalize API response to Order interface
const normalizeOrder = (apiOrder: any): Order => {
  return {
    id: apiOrder.id || apiOrder._id || "",
    orderNumber:
      apiOrder.orderNumber || apiOrder.order_number || `#${apiOrder.id}`,
    customer:
      apiOrder.customer ||
      apiOrder.customerName ||
      apiOrder.customer_name ||
      "Unknown",
    total: Number(
      apiOrder.total || apiOrder.totalAmount || apiOrder.total_amount || 0,
    ),
    status: apiOrder.status || "pending",
    date:
      apiOrder.date ||
      apiOrder.createdAt ||
      apiOrder.created_at ||
      new Date().toISOString(),
    // Additional fields from actual API
    user_id: apiOrder.user_id,
    delivery_address: apiOrder.delivery_address,
    payment_method: apiOrder.payment_method,
    customer_email: apiOrder.customer_email,
    customer_phone: apiOrder.customer_phone,
    tamper_detected: apiOrder.tamper_detected,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    items: apiOrder.items,
  };
};

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: <Package className="h-4 w-4" />,
  },
  shipped: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    icon: <Truck className="h-4 w-4" />,
  },
  delivered: {
    bg: "bg-green-50",
    text: "text-green-700",
    icon: <Check className="h-4 w-4" />,
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    icon: <X className="h-4 w-4" />,
  },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { getOrder, updateStatus } = useAdminOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrder(orderId);
      const normalized = normalizeOrder(data);
      setOrder(normalized);
      setOrderDetails(data);
      setSelectedStatus(normalized.status);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load order details";
      logger.error("OrderDetailsPage/loadOrderDetails", message, err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || newStatus === order.status) return;

    try {
      setUpdating(true);
      await updateStatus(String(order.id), newStatus);
      setOrder({ ...order, status: newStatus });
      setSelectedStatus(newStatus);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update status";
      logger.error("OrderDetailsPage/handleStatusUpdate", message, err);
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Order Details
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <p className="text-center text-gray-500 animate-pulse">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Order Details
          </h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">{error || "Order not found"}</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const statusColor =
    STATUS_COLORS[order.status.toLowerCase()] || STATUS_COLORS.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-gray-600 text-sm mt-1">Order {order.id}</p>
          </div>
        </div>
      </div>

      {/* Status Update Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            <div className={`${statusColor.bg} rounded-lg p-4 mb-4`}>
              <div className="flex items-center gap-2">
                {statusColor.icon}
                <span className={`font-semibold ${statusColor.text}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Status Update */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Update Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || status === order.status}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                      status === selectedStatus
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            {orderDetails?.items &&
            Array.isArray(orderDetails.items) &&
            orderDetails.items.length > 0 ? (
              <div className="space-y-4">
                {orderDetails.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    {/* Product Image */}
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.name || "Product"}
                      </h3>
                      {/* <p className="text-sm text-gray-600 mt-1">
                        Category: {item.product?.category?.name || "N/A"}
                      </p> */}
                      
                      {/* Quantity and Unit Size */}
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          Quantity: <span className="font-semibold text-gray-900">{item.quantity || 1}</span>
                        </p>
                        {item.selected_unit?.unitSize && (
                          <p className="text-sm text-gray-600">
                            × <span className="font-semibold text-gray-900">{item.selected_unit.unitSize}</span>
                          </p>
                        )}
                      </div>

                      {/* Price Details */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">
                            Unit Price: <span className="font-semibold text-gray-900">₹{Number(item.selected_unit?.unitPrice || item.unit_price || 0).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-gray-900">
                        ₹{Number(item.subtotal || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Subtotal</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No items in this order</p>
            )}
          </div>

          {/* Timeline (if available) */}
          {orderDetails?.timeline && Array.isArray(orderDetails.timeline) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Timeline
              </h2>
              <div className="space-y-4">
                {orderDetails.timeline.map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      {idx < orderDetails.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.status || "Event"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.timestamp)}
                      </p>
                      {event.note && (
                        <p className="text-sm text-gray-700 mt-1">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium text-gray-900">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {formatDate(order.date)}
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹
                  {(typeof order.total === "number" ? order.total : 0).toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Address
            </h2>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {orderDetails?.delivery_address ? (
                  <p className="text-gray-900 text-sm whitespace-pre-wrap">
                    {orderDetails.delivery_address}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">No address available</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment & Status Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment & Status
            </h2>
            <div className="space-y-4">
              {orderDetails?.payment_method && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Payment Method
                  </p>
                  <p className="text-gray-900 font-medium capitalize">
                    {orderDetails.payment_method}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Tamper Detection
                </p>
                <div className="flex items-center gap-2">
                  {orderDetails?.tamper_detected ? (
                    <>
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 font-medium text-sm">
                        Tampered
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium text-sm">
                        Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Name
                  </p>
                  <p className="text-gray-900 font-medium">
                    {orderDetails?.customer_name || order?.customer}
                  </p>
                </div>
              </div>

              {orderDetails?.customer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${orderDetails.customer_email}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {orderDetails.customer_email}
                    </a>
                  </div>
                </div>
              )}

              {orderDetails?.customer_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${orderDetails.customer_phone}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {orderDetails.customer_phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dates</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Order Created
                  </p>
                  <p className="text-gray-900">
                    {formatDate(orderDetails?.createdAt || order.date)}
                  </p>
                </div>
              </div>

              {orderDetails?.updatedAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Last Updated
                    </p>
                    <p className="text-gray-900">
                      {formatDate(orderDetails.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
