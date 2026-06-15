import { apiFetch } from "./apiClient";

export type SemanticSearchResponse = any;

export async function semanticSearch(query: string): Promise<SemanticSearchResponse> {
  return apiFetch<SemanticSearchResponse>("/api/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
}

