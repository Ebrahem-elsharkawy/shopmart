import { API_URL } from "@/lib/api";
import { ProductI } from "@/interface/products";

export async function getAllProducts(params: { brand?: string; category?: string; limit?: number; page?: number } = {}): Promise<{ data: ProductI[] }> {
    const query = new URLSearchParams();
    if (params.brand) query.set("brand", params.brand);
    if (params.category) query.set("category", params.category);
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.page) query.set("page", params.page.toString());

    const queryString = query.toString();
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function getSpecificProduct(id: string): Promise<{ data: ProductI }> {
    const response = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
    return response.json();
}
