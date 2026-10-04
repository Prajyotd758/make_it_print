import type { Product } from "@/lib/types";
import { get, post, patch, del } from "./client";

export const MAX_QTY = 10;

export interface CartProduct {
  _id: string;
  title: string;
  price: number;
  mrp?: number;
  category: string;
  images?: string[];
}

export interface CartLine {
  product: CartProduct;
  quantity: number;
}
interface RawCart {
  items: { product: CartProduct | null; quantity: number }[];
}

// product is null when it was deleted from the catalog after being added
const toLines = (c: RawCart): CartLine[] =>
  c.items.filter((i): i is CartLine => i.product !== null);

export const fetchCart = async (token: string, signal?: AbortSignal) =>
  toLines(await get<RawCart>("/cart", { token, signal }));

export const addToCart = async (
  token: string,
  productId: string,
  quantity = 1
) =>
  toLines(
    await post<RawCart>("/cart/items", { productId, quantity }, { token })
  );

export const setCartQty = async (
  token: string,
  productId: string,
  quantity: number
) =>
  toLines(
    await patch<RawCart>(`/cart/items/${productId}`, { quantity }, { token })
  );

export const removeFromCart = async (token: string, productId: string) =>
  toLines(await del<RawCart>(`/cart/items/${productId}`, { token }));
