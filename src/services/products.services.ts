import { API_URL } from "@/lib/api";

export async function getAllProducts() {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json()
    return data
    
}

export async function getSpecificProduct(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to fetch product: ${response.status}`);
    return response.json();
}