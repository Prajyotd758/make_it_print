"use client";

import { useParams, useRouter } from "next/navigation";
import ProductDetailPage from "@/components/productPage/ProductDetailPage";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  return (
    <ProductDetailPage
      key={id}
      id={id}
      onBack={() => router.push("/products")}
      onOpenProduct={(p) => router.push(`/product/${p._id}`)}
      onBuyNow={(productId, qty) =>
        router.push(`/checkout?productId=${productId}&qty=${qty}`)
      }
    />
  );
}
