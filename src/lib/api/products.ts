import type { Product, Pagination } from "@/lib/types";
import { get } from "./client";

export type SortKey = "popular" | "rated" | "low" | "high";

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: SortKey;
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
}

export function fetchProducts(query: ProductQuery, signal?: AbortSignal) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "" || value === false) continue;
    params.set(key, String(value));
  }
  return get<{ products: Product[]; pagination: Pagination }>(
    `/products?${params}`,
    { signal }
  );
}

export function fetchCategoryCounts(signal?: AbortSignal) {
  return get<{ total: number; categories: { id: string; count: number }[] }>(
    "/products/categories",
    { signal }
  );
}

export async function getProductById(
  id: string,
  signal?: AbortSignal
): Promise<Product> {
  const data = await get<{ product: Product }>(
    `/products/${encodeURIComponent(id)}`,
    { signal }
  );
  return data.product;
}

/** Same category, excluding the current product. */
export async function getRelatedProducts(
  category: string,
  excludeId: string,
  signal?: AbortSignal
): Promise<Product[]> {
  const { products } = await fetchProducts({ category, limit: 5 }, signal);
  return products.filter((p) => p._id !== excludeId).slice(0, 4);
}
