"use client";

import { useRouter } from "next/navigation";
import ProductsPage from "@/components/productPage/ProductsPage";

export default function Page() {
  const router = useRouter();
  return <ProductsPage onOpenProduct={(p) => router.push(`/product/${p.id}`)} />;
}