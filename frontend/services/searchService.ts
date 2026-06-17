import { apiFetch } from "./apiClient";

import { Product } from "@/types";

// Backend returns the raw aggregation results (Product documents)
export type SemanticSearchResponse = Product[];

export async function semanticSearch(query: string): Promise<SemanticSearchResponse> {
  return apiFetch<SemanticSearchResponse>("/api/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}


