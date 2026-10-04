"use client";

import { useParams, useRouter, notFound } from "next/navigation";
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
    />
  );
}
