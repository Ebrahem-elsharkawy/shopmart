import { API_URL } from "@/lib/api";

export async function getAllCategories() {
  const response = await fetch(`${API_URL}/categories`);
  const data = await response.json();
  return data;
}

export async function getCategoryById(id: string) {
  const response = await fetch(`${API_URL}/categories/${id}`);
  const data = await response.json();
  return data;
}
