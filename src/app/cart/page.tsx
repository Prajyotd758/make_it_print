"use client";

import { useRouter } from "next/navigation";
import CartPage from "@/components/cartComponents/CartPage";

export default function Page() {
  const router = useRouter();
  return (
    <CartPage
      onContinue={() => router.push("/products")}
      onOpenProduct={(p) => router.push(`/product/${p.id}`)}
      onCheckout={() => router.push("/checkout")}
    />
  );
}
