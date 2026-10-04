"use client";

import { useRouter } from "next/navigation";
import ProductsPage from "@/components/productPage/ProductsPage";
import { useAddToCart } from "@/lib/hooks/customHooks";

export default function Page() {
  const router = useRouter();
  const addToCart = useAddToCart();

  return (
    <ProductsPage
      onOpenProduct={(p) => router.push(`/product/${p._id}`)}
      onAddToCart={(p) => addToCart(p)}
    />
  );
}
