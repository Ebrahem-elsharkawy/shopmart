/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getAllCategories(): Promise<any> {
  return apiCall<any>(`${API_URL}/categories`, {
    operation: "fetch all categories",
  });
}

export async function getCategoryById(id: string): Promise<any> {
  return apiCall<any>(`${API_URL}/categories/${id}`, {
    operation: "fetch category details",
  });
}
