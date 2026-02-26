import { API_URL } from "@/lib/api";

function headers(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getOrders(token: string) {
  const response = await fetch(`${API_URL}/orders`, { headers: headers(token), cache: "no-store" });
  const data = await response.json();
  return data;
}

export async function createOrder(
  token: string,
  payload: { paymentMethod: "cash" | "online" | "card"; shippingAddress?: string }
) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}
