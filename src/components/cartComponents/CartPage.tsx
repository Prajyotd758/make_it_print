"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { categoryName, inr } from "../productPage/ui";
import { ApiRequestError } from "@/lib/api/client";
import { signOut, useSession } from "next-auth/react";
import { useRef } from "react"; // add to the existing react import
import {
  MAX_QTY,
  fetchCart,
  removeFromCart,
  setCartQty,
  type CartLine,
} from "@/lib/api/cart";
import "./cart.css";
import {
  CartIcon,
  TagIcon,
  TrashIcon,
  ClipboardIcon,
  TruckIcon,
  LockIcon,
  ArrowIcon,
  BackIcon,
  ShieldIcon,
  HeartIcon,
} from "./cartIcons";

const FREE_SHIPPING_AT = 999;
const SHIPPING_FEE = 79;

const toErr = (e: unknown) =>
  e instanceof ApiRequestError
    ? e
    : new ApiRequestError(
        (e as Error)?.message ?? "Something went wrong.",
        0,
        "UNKNOWN"
      );

/* ---- keep the existing icon components here (Svg, CartIcon, TagIcon, TrashIcon, ... HeartIcon) ---- */

interface CartPageProps {
  onContinue?: () => void;
  onCheckout?: (lines: CartLine[]) => void;
  onOpenProduct?: (productId: string) => void;
}

/* ---------- non-cart states ---------- */
const Shell = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => (
  <div className="cart cart--empty">
    <span className="eyebrow">Your Cart</span>
    <h1 className="cart-h1">{title}</h1>
    {children}
  </div>
);

export default function CartPage({
  onContinue = () => {},
  onCheckout = () => {},
  onOpenProduct = () => {},
}: CartPageProps) {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const router = useRouter();
  const pathname = usePathname();

  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [error, setError] = useState<ApiRequestError | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!token) return;
      setError(null);
      try {
        setLines(await fetchCart(token, signal));
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        setError(toErr(e));
      }
    },
    [token]
  );

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const unauthorized =
    status === "unauthenticated" || !!session?.error || error?.status === 401;

  useEffect(() => {
    if (unauthorized)
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }, [unauthorized, router, pathname]);

  // Optimistic update; the server response replaces it, a failure rolls it back.
  const run = async (
    id: string,
    next: CartLine[],
    call: (t: string) => Promise<CartLine[]>
  ) => {
    if (!token || !lines || busy.has(id)) return;
    const prev = lines;
    setActionError(null);
    setLines(next);
    setBusy((b) => new Set(b).add(id));
    try {
      setLines(await call(token));
    } catch (e) {
      setLines(prev);
      setActionError(toErr(e).message);
    } finally {
      setBusy((b) => {
        const n = new Set(b);
        n.delete(id);
        return n;
      });
    }
  };

  const setQty = (l: CartLine, qty: number) => {
    const quantity = Math.min(MAX_QTY, Math.max(1, qty));
    if (!lines || quantity === l.quantity) return;
    const id = l.product._id;
    run(
      id,
      lines.map((x) => (x.product._id === id ? { ...x, quantity } : x)),
      (t) => setCartQty(t, id, quantity)
    );
  };

  const remove = (l: CartLine) => {
    if (!lines) return;
    const id = l.product._id;
    run(
      id,
      lines.filter((x) => x.product._id !== id),
      (t) => removeFromCart(t, id)
    );
  };

  const { units, subtotal, savings, shipping, total } = useMemo(() => {
    const ls = lines ?? [];
    const units = ls.reduce((n, l) => n + l.quantity, 0);
    const subtotal = ls.reduce((n, l) => n + l.product.price * l.quantity, 0);
    const savings = ls.reduce(
      (n, l) =>
        n +
        Math.max(0, (l.product.mrp ?? l.product.price) - l.product.price) *
          l.quantity,
      0
    );
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
    return { units, subtotal, savings, shipping, total: subtotal + shipping };
  }, [lines]);

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  // session still resolving, or redirecting to login: never flash an error
  if (status === "loading" || unauthorized)
    return <Shell title="Loading your cart…" />;

  // real server / network failure
  if (error)
    return (
      <Shell title={error.message}>
        <button
          className="cart-checkout cart-checkout--auto"
          onClick={() => load()}
        >
          Try again
        </button>
      </Shell>
    );

  // authenticated, request in flight
  if (!lines) return <Shell title="Loading your cart…" />;

  if (lines.length === 0)
    return (
      <Shell title="Nothing here yet">
        <button
          className="cart-checkout cart-checkout--auto"
          onClick={onContinue}
        >
          Browse products
        </button>
      </Shell>
    );
  /* ---------- cart ---------- */
  return (
    <div className="cart">
      <div className="cart-head">
        <div className="cart-title">
          <div className="cart-badge-tile">
            <CartIcon />
            <span className="cart-badge">{units}</span>
          </div>
          <div>
            <span className="eyebrow cart-eyebrow">Your Cart</span>
            <h1 className="cart-h1">Shopping Cart</h1>
            <p className="cart-sub">
              Review your items and continue to checkout
            </p>
            <span className="cart-underline" />
          </div>
        </div>
        <span className="cart-count">
          <TagIcon /> {units} {units === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {actionError && (
        <p className="cart-error" role="alert">
          {actionError}
        </p>
      )}

      <div className="cart-layout">
        <section className="cart-panel">
          <div className="cart-cols">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {lines.map((l) => {
            const p = l.product;
            const pending = busy.has(p._id);
            return (
              <article key={p._id} className="cart-item" aria-busy={pending}>
                <button
                  className="cart-thumb"
                  onClick={() => onOpenProduct(p._id)}
                  aria-label={p.title}
                >
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.title} loading="lazy" />
                  )}
                </button>

                <div className="cart-info">
                  <span className="cart-pill">{categoryName(p.category)}</span>
                  <button
                    className="cart-name"
                    onClick={() => onOpenProduct(p._id)}
                  >
                    {p.title}
                  </button>
                  <span className="cart-unit">{inr(p.price)} each</span>
                  <button
                    className="cart-remove"
                    disabled={pending}
                    onClick={() => remove(l)}
                  >
                    <TrashIcon /> Remove
                  </button>
                </div>

                <div className="cart-qty">
                  <button
                    aria-label="Decrease"
                    disabled={pending || l.quantity <= 1}
                    onClick={() => setQty(l, l.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{l.quantity}</span>
                  <button
                    aria-label="Increase"
                    disabled={pending || l.quantity >= MAX_QTY}
                    onClick={() => setQty(l, l.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-line">{inr(p.price * l.quantity)}</div>
              </article>
            );
          })}
        </section>

        <aside className="cart-sum">
          <div className="cart-sum__head">
            <ClipboardIcon />
            <div>
              <h2>Order Summary</h2>
              <p>
                {shipping === 0
                  ? "You qualify for free shipping!"
                  : `Add ${inr(
                      FREE_SHIPPING_AT - subtotal
                    )} more for free shipping`}
              </p>
            </div>
            <span className="cart-sum__truck">
              <TruckIcon />
            </span>
            <div className="cart-bar">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="cart-sum__body">
            <div className="cart-rows">
              <div>
                <span>Subtotal</span>
                <span>{inr(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="save">
                  <span>You save</span>
                  <span>- {inr(savings)}</span>
                </div>
              )}
              <div>
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : inr(shipping)}</span>
              </div>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
            <p className="cart-tax">Inclusive of all taxes</p>

            <button
              className="cart-checkout"
              disabled={busy.size > 0}
              onClick={() => onCheckout(lines)}
            >
              <LockIcon /> Checkout <ArrowIcon />
            </button>

            <div className="cart-trust">
              <div>
                <ShieldIcon />
                <span>Secure Payments</span>
              </div>
              <div>
                <TruckIcon size={24} />
                <span>Fast &amp; Reliable Shipping</span>
              </div>
              <div>
                <HeartIcon />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <button className="cart-back" onClick={onContinue}>
        <BackIcon /> Continue shopping
      </button>
    </div>
  );
}
