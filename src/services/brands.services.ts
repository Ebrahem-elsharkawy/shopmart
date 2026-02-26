import { API_URL } from "@/lib/api";

export async function getAllBrands() {
  const response = await fetch(`${API_URL}/brands`);
  const data = await response.json();
  return data;
}

export async function getBrandById(id: string) {
  const response = await fetch(`${API_URL}/brands/${id}`);
  const data = await response.json();
  return data;
}
