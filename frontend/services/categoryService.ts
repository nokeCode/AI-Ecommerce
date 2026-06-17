import { apiFetch } from "./apiClient";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
};

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}

