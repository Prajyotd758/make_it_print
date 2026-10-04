import { CATEGORIES } from "./data";
import type { Product } from "@/lib/types";

export const thumbBg = (h: number): string =>
  `linear-gradient(135deg,hsl(${42 + (h % 10)} 55% 94%),hsl(${44 + (h % 10)} 60% 85%))`;

export const inr = (n: number): string => "₹" + n.toLocaleString("en-IN");
export const discount = (p: Product): number => Math.round((1 - p.price / 15) * 100);
export const code = (p: Product): string => `MIP-${String(p._id).padStart(3, "0")}`;
export const categoryName = (id: string): string => CATEGORIES.find((c) => c.id === id)?.name ?? "";

export function Star() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 9.3l6.9-1z" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
