"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { addToCart } from "@/lib/api/cart";
import { ApiRequestError } from "@/lib/api/client";
import { notify } from "@/components/notification/Notifications";

export function useAddToCart() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef(new Set<string>()); // blocks double clicks per product

  return async (product: { _id: string; title: string }, quantity = 1) => {
    if (status === "loading" || pending.current.has(product._id)) return;

    const token = session?.accessToken;
    const toLogin = () => router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    if (!token || session?.error) return toLogin();

    pending.current.add(product._id);
    try {
      await addToCart(token, product._id, quantity);
      notify.toast("Added to cart", product.title, {
        action: { label: "View Cart", onClick: () => router.push("/cart") },
      });
    } catch (e) {
      if (e instanceof ApiRequestError && e.status === 401) return toLogin();
      notify.error(
        "Couldn't add to cart",
        e instanceof ApiRequestError ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      pending.current.delete(product._id);
    }
  };
}