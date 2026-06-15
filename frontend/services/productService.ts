import { apiFetch } from "./apiClient";
import { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>("/api/products");
}

export async function getProductById(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

