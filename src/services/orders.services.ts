import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getOrders(token: string): Promise<unknown> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  const url = `${API_URL}/orders`;

  return apiCall<unknown>(url, {
    token,
    operation: "load orders",
    cache: "no-store",
    fallback: [],
  });
}

export async function createOrder(
  token: string,
  payload: { paymentMethod: "cash" | "online" | "card"; shippingAddress?: string }
): Promise<unknown> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  const url = `${API_URL}/orders`;

  return apiCall<unknown>(url, {
    method: "POST",
    token,
    body: JSON.stringify(payload),
    operation: "create order",
  });
}
