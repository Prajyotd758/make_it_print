"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import ProductDetailPage from "@/components/productPage/ProductDetailPage";
import { PRODUCTS } from "@/components/productPage/data";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  if (!product) notFound();

  return (
    <ProductDetailPage
      key={id}
      product={product}
      onBack={() => router.push("/products")}
      onOpenProduct={(p) => router.push(`/products/${p.id}`)}
    />
  );
}
