import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getCart(token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");

  const url = `${API_URL}/cart`;

  return apiCall<any>(url, {
    token,
    operation: "load cart",
    fallback: { status: "error", data: null },
  });
}

export async function addToCart(productId: string, quantity: number, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");
  if (!productId) throw new Error("Product ID is required");

  const url = `${API_URL}/cart`;

  return apiCall(url, {
    method: "POST",
    token,
    body: JSON.stringify({ productId, quantity }),
    operation: "add to cart",
  });
}

export async function updateCartItem(itemId: string, quantity: number, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");
  if (!itemId) throw new Error("Item ID is required");

  const url = `${API_URL}/cart/${itemId}`;

  return apiCall(url, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity }),
    operation: "update cart",
  });
}

export async function removeFromCart(itemId: string, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");
  if (!itemId) throw new Error("Item ID is required");

  const url = `${API_URL}/cart/${itemId}`;

  return apiCall(url, {
    method: "DELETE",
    token,
    operation: "remove from cart",
  });
}
