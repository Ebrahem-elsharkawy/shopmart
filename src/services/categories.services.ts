import { API_URL } from "@/lib/api";
import { CategoryI } from "@/interface/categories";

export async function getAllCategories(): Promise<{ data: CategoryI[] }> {
  const response = await fetch(`${API_URL}/categories`);
  const data = await response.json();
  return data;
}

export async function getCategoryById(id: string): Promise<{ data: CategoryI }> {
  const response = await fetch(`${API_URL}/categories/${id}`);
  const data = await response.json();
  return data;
}
