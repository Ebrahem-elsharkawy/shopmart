/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/lib/api";
import { apiCall } from "@/lib/api-utils";

export async function getAllProducts(params: { brand?: string; category?: string; limit?: number; page?: number } = {}): Promise<any> {
    const query = new URLSearchParams();
    if (params.brand) query.set("brand", params.brand);
    if (params.category) query.set("category", params.category);
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.page) query.set("page", params.page.toString());

    const queryString = query.toString();
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;
    
    return apiCall<any>(url, {
        operation: "fetch all products",
    });
}

export async function getSpecificProduct(id: string): Promise<any> {
    const url = `${API_URL}/products/${id}`;

    return apiCall<any>(url, {
        operation: "fetch product details",
        cache: "no-store",
    });
}