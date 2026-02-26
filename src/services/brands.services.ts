/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getAllBrands(): Promise<any> {
  return apiCall<any>(`${API_URL}/brands`, {
    operation: "fetch all brands",
  });
}

export async function getBrandById(id: string): Promise<any> {
  return apiCall<any>(`${API_URL}/brands/${id}`, {
    operation: "fetch brand details",
  });
}
