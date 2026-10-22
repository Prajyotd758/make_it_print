const BASE = process.env.NEXT_PUBLIC_API_URL;

async function req<T>(
  token: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message ?? "Request failed");
  return (body?.data ?? body) as T;
}

export type Address = {
  _id?: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type OrderItem = {
  product?: string;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  custom?: { name: string; font: string; color: string };
};

export type Order = {
  _id: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  items: OrderItem[];
  address: Address;
  subtotal: number;
  shipping: number;
  total: number;
  razorpayPaymentId?: string;
  createdAt: string;
};

export const getAddresses = (t: string) => req<Address[]>(t, "/addresses");
export const saveAddress = (t: string, a: Address) =>
  req<Address>(t, "/addresses", { method: "POST", body: JSON.stringify(a) });

// Server builds the order (cart, buy-now or custom keychain) and computes the amount itself.
export const createOrder = (
  t: string,
  body: {
    addressId: string;
    notes?: string;
    buyNow?: { productId: string; quantity: number };
    custom?: {
      type: "keychain";
      name: string;
      font: string;
      color: string;
      quantity: number;
    };
  }
) =>
  req<{
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  }>(t, "/orders", { method: "POST", body: JSON.stringify(body) });

export const verifyPayment = (
  t: string,
  body: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) =>
  req<{ success: boolean }>(t, "/orders/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getOrder = (t: string, id: string) =>
  req<Order>(t, `/orders/${id}`);
