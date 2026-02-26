import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getWishlist(token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");

  const url = `${API_URL}/wishlist`;

  return apiCall(url, {
    token,
    operation: "load wishlist",
    fallback: { wishlist: [], items: [] },
  });
}

export async function addToWishlist(productId: string, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");
  if (!productId) throw new Error("Product ID is required");

  const url = `${API_URL}/wishlist`;

  return apiCall(url, {
    method: "POST",
    token,
    body: JSON.stringify({ productId }),
    operation: "add to wishlist",
  });
}

export async function removeFromWishlist(productId: string, token: string) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  if (!token) throw new Error("Authentication token is missing");
  if (!productId) throw new Error("Product ID is required");

  const url = `${API_URL}/wishlist/${productId}`;

  return apiCall(url, {
    method: "DELETE",
    token,
    operation: "remove from wishlist",
  });
}
