"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { inr } from "@/components/productPage/ui";
import { MAX_QTY, fetchCart, type CartLine } from "@/lib/api/cart";
import { getProductById } from "@/lib/api/products";
import {
  Address,
  createOrder,
  getAddresses,
  saveAddress,
  verifyPayment,
} from "@/lib/api/checkout";
import "@/components/checkout/checkout.css";
import {
  KEYCHAIN_PRICE,
  KEYCHAIN_FREE_SHIPPING_AT,
  parseKeychain,
} from "@/lib/keychain";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const EMPTY: Address = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};
const FREE_SHIPPING_AT = 999;
const SHIPPING_FEE = 79;

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="co">
          <h1>Loading…</h1>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const buyNowId = sp.get("productId");
  const buyNowQty = Math.min(MAX_QTY, Math.max(1, Number(sp.get("qty")) || 1));
  const custom = useMemo(() => parseKeychain(sp), [sp]);

  const [items, setItems] = useState<CartLine[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState<Address>(EMPTY);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const unauthorized = status === "unauthenticated" || !!session?.error;

  useEffect(() => {
    if (!unauthorized) return;
    const here = `${pathname}${sp.toString() ? `?${sp}` : ""}`;
    router.replace(`/login?callbackUrl=${encodeURIComponent(here)}`);
  }, [unauthorized, router, pathname, sp]);

  useEffect(() => {
    if (!token) return;
    const ac = new AbortController();
    const getLines = async (): Promise<CartLine[]> =>
      custom
        ? []
        : buyNowId
        ? [
            {
              product: await getProductById(buyNowId),
              quantity: buyNowQty,
            } as CartLine,
          ]
        : fetchCart(token, ac.signal);
    Promise.all([getLines(), getAddresses(token)])
      .then(([lines, a]) => {
        if (!custom && !lines.length) return router.replace("/cart");
        setItems(lines);
        setAddresses(a);
        if (a.length) {
          setSelected(a[0]._id!);
          setOpen(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });
    return () => ac.abort();
  }, [token, router, buyNowId, buyNowQty, custom]);

  const { units, subtotal, shipping, total } = useMemo(() => {
    const units = custom
      ? custom.quantity
      : items.reduce((n, l) => n + l.quantity, 0);
    const subtotal = custom
      ? KEYCHAIN_PRICE * custom.quantity
      : items.reduce((n, l) => n + l.product.price * l.quantity, 0);
    const freeAt = custom ? KEYCHAIN_FREE_SHIPPING_AT : FREE_SHIPPING_AT;
    const shipping = subtotal === 0 || subtotal >= freeAt ? 0 : SHIPPING_FEE;
    return { units, subtotal, shipping, total: subtotal + shipping };
  }, [items, custom]);

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const formValid =
    form.name &&
    /^\d{10}$/.test(form.phone) &&
    form.line1 &&
    form.city &&
    form.state &&
    /^\d{6}$/.test(form.pincode);

  async function handleSaveAddress() {
    if (!token) return;
    setError("");
    try {
      const a = await saveAddress(token, form);
      setAddresses([a, ...addresses]);
      setSelected(a._id!);
      setForm(EMPTY);
      setOpen(false);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function pay() {
    if (!token) return;
    if (!selected) return setError("Please select or add a delivery address.");
    if (!window.Razorpay)
      return setError("Payment SDK is still loading, try again.");
    setError("");
    setPaying(true);
    try {
      const order = await createOrder(token, {
        addressId: selected,
        notes,
        ...(buyNowId && {
          buyNow: { productId: buyNowId, quantity: buyNowQty },
        }),
        ...(custom && { custom: { type: "keychain" as const, ...custom } }),
      });
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // TODO: add key
        order_id: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        name: "Make It Print",
        description: "3D printed products",
        // image: "/logo.png",  // TODO
        // prefill: { name, email, contact },  // TODO
        theme: { color: "#fbc112" },
        handler: async (r: any) => {
          try {
            await verifyPayment(token, { orderId: order.orderId, ...r });
            router.push(`/orders/${order.orderId}?success=1`);
          } catch (e: any) {
            setError(e.message);
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on("payment.failed", (r: any) => {
        setError(r.error?.description ?? "Payment failed");
        setPaying(false);
      });
      rzp.open();
    } catch (e: any) {
      setError(e.message);
      setPaying(false);
    }
  }

  if (status === "loading" || unauthorized)
    return (
      <main className="co">
        <h1>Loading…</h1>
      </main>
    );

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <main className="co">
        <header className="co-head">
          <span className="co-label">Checkout</span>
          <h1>Complete your order</h1>
          <p>Add a delivery address and pay securely with Razorpay.</p>
        </header>

        <div className="co-grid">
          <div className="co-main">
            {/* 1. Address */}
            <section className="co-card">
              <div className="co-card-head">
                <span className="co-step">1</span>
                <h2>Delivery address</h2>
                <button className="co-link" onClick={() => setOpen(!open)}>
                  {open ? "Close" : "+ Add new"}
                </button>
              </div>

              {addresses.length > 0 && (
                <div className="co-addrs">
                  {addresses.map((a) => (
                    <label
                      key={a._id}
                      className={`co-addr ${selected === a._id ? "on" : ""}`}
                    >
                      <input
                        type="radio"
                        name="addr"
                        checked={selected === a._id}
                        onChange={() => setSelected(a._id!)}
                      />
                      <div>
                        <strong>{a.name}</strong>{" "}
                        <span className="co-mono">{a.phone}</span>
                        <p>
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} –{" "}
                          {a.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className={`co-collapse ${open ? "open" : ""}`}>
                <div>
                  <div className="co-form">
                    <Field
                      label="Full name"
                      value={form.name}
                      onChange={set("name")}
                    />
                    <Field
                      label="Phone"
                      value={form.phone}
                      onChange={set("phone")}
                      inputMode="numeric"
                      maxLength={10}
                    />
                    <Field
                      label="Address line 1"
                      value={form.line1}
                      onChange={set("line1")}
                      full
                    />
                    <Field
                      label="Address line 2 (optional)"
                      value={form.line2 ?? ""}
                      onChange={set("line2")}
                      full
                    />
                    <Field
                      label="City"
                      value={form.city}
                      onChange={set("city")}
                    />
                    <Field
                      label="State"
                      value={form.state}
                      onChange={set("state")}
                    />
                    <Field
                      label="Pincode"
                      value={form.pincode}
                      onChange={set("pincode")}
                      inputMode="numeric"
                      maxLength={6}
                    />
                  </div>
                  <button
                    className="co-btn dark"
                    disabled={!formValid}
                    onClick={handleSaveAddress}
                  >
                    Save address
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Notes */}
            <section className="co-card">
              <div className="co-card-head">
                <span className="co-step">2</span>
                <h2>
                  Notes <span className="co-muted">(optional)</span>
                </h2>
              </div>
              <textarea
                className="co-input"
                rows={3}
                maxLength={500}
                placeholder="Any special instructions for your order?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <span className="co-count">{notes.length}/500</span>
            </section>
          </div>

          {/* Summary */}
          <aside className="co-summary">
            <div className="co-sum-head">
              <h2>Order summary</h2>
              <span className="co-mono">
                {units} {units === 1 ? "piece" : "pieces"}
              </span>
            </div>

            {custom && (
              <div className="co-item">
                <div className="co-swatch" style={{ color: custom.color }}>
                  Aa
                </div>
                <div>
                  <p className="co-item-title">
                    Custom keychain · {custom.name}
                  </p>
                  <span className="co-mono">
                    {custom.font} · Qty {custom.quantity}
                  </span>
                </div>
                <strong>{inr(KEYCHAIN_PRICE * custom.quantity)}</strong>
              </div>
            )}

            {!custom &&
              (loading ? (
                <p className="co-muted">Loading…</p>
              ) : (
                items.map((i) => (
                  <div className="co-item" key={i.product._id}>
                    {i.product.images?.[0] && (
                      <img src={i.product.images[0]} alt={i.product.title} />
                    )}
                    <div>
                      <p className="co-item-title">{i.product.title}</p>
                      <span className="co-mono">Qty {i.quantity}</span>
                    </div>
                    <strong>{inr(i.product.price * i.quantity)}</strong>
                  </div>
                ))
              ))}

            <div className="co-row">
              <span>Subtotal</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="co-row">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="co-free">Free</span>
              ) : (
                <span>{inr(shipping)}</span>
              )}
            </div>
            <div className="co-total">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
            <p className="co-secure co-mono">Inclusive of all taxes</p>

            {error && <p className="co-error">{error}</p>}

            <button
              className="co-btn yellow"
              disabled={paying || loading || (!items.length && !custom)}
              onClick={pay}
            >
              {paying ? "Processing…" : `Pay now · ${inr(total)}`}
            </button>
            <p className="co-secure co-mono">Secured by Razorpay</p>
          </aside>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  full,
  ...rest
}: {
  label: string;
  full?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`co-field ${full ? "full" : ""}`}>
      <span className="co-mono">{label}</span>
      <input className="co-input" {...rest} />
    </label>
  );
}
