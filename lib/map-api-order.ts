import type { ApiOrder } from "@/lib/api-types";
import type { Order } from "@/lib/store";

function mapApiStatus(s?: string): Order["status"] {
  const v = (s ?? "").toLowerCase();
  if (v === "processing" || v === "confirmed") return "processing";
  if (v === "shipped" || v === "shipping") return "shipped";
  if (v === "delivered" || v === "completed" || v === "done") return "delivered";
  return "pending";
}

export function apiOrderToStoreOrder(o: ApiOrder): Order {
  const id = String(o.id);
  const total = Number(o.total_amount_lak ?? 0);
  const name =
    typeof o.customer_name === "string"
      ? o.customer_name
      : "ຄຳສັ່ງຈາກ API";
  const phone =
    typeof o.customer_phone === "string" ? o.customer_phone : "—";

  return {
    id,
    items: [],
    customerInfo: {
      name,
      phone,
      address: typeof o.shipping_address === "string" ? o.shipping_address : "—",
      province: typeof o.province === "string" ? o.province : "—",
    },
    paymentMethod: o.payment_receipt_url ? "ໂອນ / QR" : "COD / API",
    status: mapApiStatus(typeof o.status === "string" ? o.status : undefined),
    totalLAK: total,
    createdAt: o.created_at ? new Date(o.created_at) : new Date(),
  };
}
