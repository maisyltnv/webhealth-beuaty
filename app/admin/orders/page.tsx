"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ExternalLink,
  Eye,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore, Order } from "@/lib/store";
import { formatLAK, formatDateLao } from "@/lib/format";

const statusOptions = [
  { id: "all", label: "ທັງໝົດ" },
  { id: "pending", label: "ລໍຖ້າ" },
  { id: "processing", label: "ກຳລັງດຳເນີນ" },
  { id: "shipped", label: "ສົ່ງແລ້ວ" },
  { id: "delivered", label: "ສຳເລັດ" },
];

const statusConfig: Record<
  Order["status"],
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: "ລໍຖ້າ", color: "orange", icon: Clock },
  processing: { label: "ກຳລັງດຳເນີນ", color: "blue", icon: Package },
  shipped: { label: "ສົ່ງແລ້ວ", color: "purple", icon: Truck },
  delivered: { label: "ສຳເລັດ", color: "green", icon: CheckCircle },
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">ຈັດການຄຳສັ່ງຊື້</h1>
        <p className="text-muted-foreground">
          ຕິດຕາມ ແລະ ຈັດການຄຳສັ່ງຊື້ຈາກລູກຄ້າ
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ຄົ້ນຫາຕາມເລກທີ່, ຊື່, ຫຼື ເບີໂທ..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {statusOptions.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === status.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredOrders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-muted/30 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          status.color === "orange"
                            ? "bg-orange-100"
                            : status.color === "blue"
                            ? "bg-blue-100"
                            : status.color === "purple"
                            ? "bg-purple-100"
                            : "bg-green-100"
                        }`}
                      >
                        <StatusIcon
                          className={`h-5 w-5 ${
                            status.color === "orange"
                              ? "text-orange-600"
                              : status.color === "blue"
                              ? "text-blue-600"
                              : status.color === "purple"
                              ? "text-purple-600"
                              : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{order.id}</p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              status.color === "orange"
                                ? "bg-orange-100 text-orange-600"
                                : status.color === "blue"
                                ? "bg-blue-100 text-blue-600"
                                : status.color === "purple"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.customerInfo.name} |{" "}
                          {order.customerInfo.province}
                        </p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="font-medium text-primary">
                        {formatLAK(order.totalLAK)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} ລາຍການ |{" "}
                        {formatDateLao(order.createdAt)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {orders.length === 0
                ? "ຍັງບໍ່ມີຄຳສັ່ງຊື້"
                : "ບໍ່ພົບຄຳສັ່ງຊື້ທີ່ຄົ້ນຫາ"}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={() => setSelectedOrder(null)}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-background border-l border-border z-50 overflow-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold">ລາຍລະອຽດຄຳສັ່ງຊື້</h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Order ID & Status */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">ເລກທີ່ຄຳສັ່ງ</p>
                <p className="text-xl font-bold">{selectedOrder.id}</p>
              </div>

              {/* Status Selector */}
              <div>
                <p className="text-sm font-medium mb-2">ສະຖານະ</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["pending", "processing", "shipped", "delivered"] as const
                  ).map((status) => {
                    const config = statusConfig[status];
                    return (
                      <button
                        key={status}
                        onClick={() =>
                          handleStatusChange(selectedOrder.id, status)
                        }
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                          selectedOrder.status === status
                            ? config.color === "orange"
                              ? "bg-orange-500 text-white"
                              : config.color === "blue"
                              ? "bg-blue-500 text-white"
                              : config.color === "purple"
                              ? "bg-purple-500 text-white"
                              : "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <config.icon className="h-3.5 w-3.5" />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm font-medium mb-3">ຂໍ້ມູນລູກຄ້າ</p>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">ຊື່:</span>{" "}
                    {selectedOrder.customerInfo.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">ເບີໂທ:</span>{" "}
                    {selectedOrder.customerInfo.phone}
                  </p>
                  <p>
                    <span className="text-muted-foreground">ແຂວງ:</span>{" "}
                    {selectedOrder.customerInfo.province}
                  </p>
                  <p>
                    <span className="text-muted-foreground">ທີ່ຢູ່:</span>{" "}
                    {selectedOrder.customerInfo.address}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <p className="text-sm font-medium mb-3">ສິນຄ້າທີ່ສັ່ງ</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.nameLao}
                        className="w-14 h-14 rounded-lg object-cover"
                        crossOrigin="anonymous"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.nameLao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity} |{" "}
                          {formatLAK(item.product.priceLAK * item.quantity)}
                        </p>
                      </div>
                      {item.product.sourceUrl && (
                        <a
                          href={item.product.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                          title="ໄປຫາແຫຼ່ງສິນຄ້າ"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm font-medium mb-3">ການຊຳລະເງິນ</p>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">ວິທີຊຳລະ:</span>
                  <span>
                    {selectedOrder.paymentMethod === "bcel"
                      ? "BCEL One"
                      : "ເກັບເງິນປາຍທາງ"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>ລວມທັງໝົດ:</span>
                  <span className="text-primary">
                    {formatLAK(selectedOrder.totalLAK)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  ປິດ
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // Go to source links for all items
                    selectedOrder.items.forEach((item) => {
                      if (item.product.sourceUrl) {
                        window.open(item.product.sourceUrl, "_blank");
                      }
                    });
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  ໄປສັ່ງຊື້
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
