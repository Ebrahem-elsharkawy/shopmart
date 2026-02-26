import { API_URL } from "@/lib/api";
import { BrandI } from "@/interface/brands";

export async function getAllBrands(): Promise<{ data: BrandI[] }> {
  const response = await fetch(`${API_URL}/brands`);
  const data = await response.json();
  return data;
}

export async function getBrandById(id: string): Promise<{ data: BrandI }> {
  const response = await fetch(`${API_URL}/brands/${id}`);
  const data = await response.json();
  return data;
}
