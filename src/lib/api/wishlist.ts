import { get, post, del } from "./client";

export interface WishlistProduct {
  _id: string;
  title: string;
  images: string[];
  category: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  size?: string;
  badge?: string;
}

interface WishlistResponse {
  products?: WishlistProduct[];
}

export async function getWishlist(token: string): Promise<WishlistProduct[]> {
  const res = await get<WishlistResponse>("/wishlist", { token });
  // guard against null/deleted products
  return (res?.products ?? []).filter((p) => p && p._id);
}

export function addToWishlist(productId: string, token: string) {
  return post<WishlistResponse>("/wishlist", { productId }, { token });
}

export function removeFromWishlist(productId: string, token: string) {
  return del<WishlistResponse>(`/wishlist/${encodeURIComponent(productId)}`, {
    token,
  });
}

/** Removes many; never throws. Returns which ids succeeded / failed. */
export async function removeManyFromWishlist(ids: string[], token: string) {
  const results = await Promise.allSettled(
    ids.map((id) => removeFromWishlist(id, token))
  );
  const succeeded: string[] = [];
  const failed: string[] = [];
  results.forEach((r, i) =>
    (r.status === "fulfilled" ? succeeded : failed).push(ids[i])
  );
  return { succeeded, failed };
}
