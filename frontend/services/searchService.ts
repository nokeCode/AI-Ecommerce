import { apiFetch } from "./apiClient";

import { Product } from "@/types";

export type SemanticSearchResponse = Array<Product & { _id?: string }>;

const normalizeProduct = (product: any): Product => ({
  id: product.id || product._id || "",
  name: product.name || "",
  price: typeof product.price === "number" ? product.price : 0,
  originalPrice: typeof product.originalPrice === "number" ? product.originalPrice : undefined,
  description: product.description || "",
  longDescription: product.longDescription || "",
  category: typeof product.category === "string" ? product.category : String(product.category || ""),
  rating: typeof product.rating === "number" ? product.rating : 0,
  reviews: typeof product.reviews === "number" ? product.reviews : 0,
  inStock: typeof product.inStock === "number" ? product.inStock : 0,
  image: product.image || "",
  images: Array.isArray(product.images) ? product.images : [],
  features: Array.isArray(product.features) ? product.features : [],
  specs: product.specs || {},
});

export async function semanticSearch(query: string): Promise<SemanticSearchResponse> {
  const result = await apiFetch<SemanticSearchResponse>("/api/search", {
    method: "POST",
    body: { query },
  });

  return Array.isArray(result)
    ? result.map((product) => normalizeProduct(product))
    : [];
}


