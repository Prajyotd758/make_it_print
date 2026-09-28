"use client";

import { useMemo, useState, type ReactNode } from "react";
import { PRODUCTS } from "@/components/productPage/data";
import type { CartItem, Product } from "@/lib/types";
import { categoryName, inr, thumbBg } from "../productPage/ui";
import "./cart.css";

const FREE_SHIPPING_AT = 999;
const SHIPPING_FEE = 79;

const DEMO_ITEMS: CartItem[] = PRODUCTS.slice(0, 3).map((product, i) => ({
  product,
  qty: i + 1,
  material: product.materials[0],
  size: product.sizes[1],
  color: product.colors[i % product.colors.length].name,
}));

const lineId = (i: CartItem) =>
  `${i.product.id}-${i.material}-${i.size}-${i.color}`;

/* ---------- icons (inline SVG, inherit currentColor) ---------- */
const Svg = ({
  children,
  size = 20,
}: {
  children: ReactNode;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const CartIcon = () => (
  <Svg size={34}>
    <path d="M3 4h2.5l2.2 10.2a1 1 0 001 .8h8.6a1 1 0 001-.8L20 8H6.4" />
    <circle cx="9.5" cy="19" r="1.2" />
    <circle cx="17" cy="19" r="1.2" />
  </Svg>
);
const TagIcon = () => (
  <Svg size={20}>
    <path d="M3 12.5V4h8.5L21 13.5 13.5 21 3 12.5z" />
    <circle cx="7.5" cy="8.5" r="1.2" />
  </Svg>
);

const TrashIcon = () => (
  <Svg size={16}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </Svg>
);
const ClipboardIcon = () => (
  <Svg size={30}>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 4h6v3H9zM8.500 11h7M8.500 15h7" />
  </Svg>
);
const TruckIcon = ({ size = 40 }: { size?: number }) => (
  <Svg size={size}>
    <path d="M2 6h11v10H2zM13 9h4.500L21 12.500V16h-8" />
    <circle cx="6.500" cy="17.500" r="1.800" />
    <circle cx="17" cy="17.500" r="1.800" />
  </Svg>
);
const LockIcon = () => (
  <Svg size={18}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 018 0v3" />
  </Svg>
);
const ArrowIcon = () => (
  <Svg size={16}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
const BackIcon = () => (
  <Svg size={16}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </Svg>
);
const ShieldIcon = () => (
  <Svg size={24}>
    <path d="M12 3l7 3v5c0 4.500-3 8-7 10-4-2-7-5.500-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);
const HeartIcon = () => (
  <Svg size={24}>
    <path d="M12 20.500s-7.500-4.600-9.200-9.400C1.700 7.900 3.600 4.800 6.800 4.800c2 0 3.500 1.100 5.200 3.100 1.700-2 3.200-3.100 5.200-3.100 3.200 0 5.100 3.100 4 6.300-1.700 4.800-9.200 9.400-9.200 9.400z" />
  </Svg>
);

interface CartPageProps {
  initialItems?: CartItem[];
  onContinue?: () => void;
  onCheckout?: (items: CartItem[]) => void;
  onOpenProduct?: (product: Product) => void;
}

export default function CartPage({
  initialItems = DEMO_ITEMS,
  onContinue = () => {},
  onCheckout = () => {},
  onOpenProduct = () => {},
}: CartPageProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (lineId(i) === id ? { ...i, qty: Math.max(1, qty) } : i))
    );
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => lineId(i) !== id));

  const { units, subtotal, savings, shipping, total } = useMemo(() => {
    const units = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
    const savings = items.reduce(
      (n, i) => n + (i.product.mrp - i.product.price) * i.qty,
      0
    );
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
    return { units, subtotal, savings, shipping, total: subtotal + shipping };
  }, [items]);

  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <span className="eyebrow">Your Cart</span>
        <h1 className="cart-h1">Nothing here yet</h1>
        <button
          className="cart-checkout cart-checkout--auto"
          onClick={onContinue}
        >
          Browse products
        </button>
      </div>
    );
  }

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

      <div className="cart-layout">
        <section className="cart-panel">
          <div className="cart-cols">
            <span>Product</span>
            <span>Quantity</span>
            <span>Total</span>
          </div>

          {items.map((i) => {
            const id = lineId(i);
            const p = i.product;
            const hex =
              p.colors.find((c) => c.name === i.color)?.hex ?? "#1c1c1c";
            return (
              <article key={id} className="cart-item">
                <button
                  className="cart-thumb"
                  style={{ background: thumbBg(p.hue) }}
                  onClick={() => onOpenProduct(p)}
                  aria-label={p.title}
                >
                  {p.image && <img src={p.image} alt={p.title} />}
                </button>

                <div className="cart-info">
                  <span className="cart-pill">{categoryName(p.category)}</span>
                  <button
                    className="cart-name"
                    onClick={() => onOpenProduct(p)}
                  >
                    {p.title}
                  </button>
                  <div className="cart-opts">
                    <span>{i.material}</span>
                    <span className="cart-sep">•</span>
                    <span>{i.size}</span>
                    <span className="cart-swatch">
                      <i style={{ background: hex }} />
                      {i.color}
                    </span>
                  </div>
                  <span className="cart-unit">{inr(p.price)} each</span>
                  <button className="cart-remove" onClick={() => remove(id)}>
                    <TrashIcon /> Remove
                  </button>
                </div>

                <div className="cart-qty">
                  <button
                    aria-label="Decrease"
                    onClick={() => setQty(id, i.qty - 1)}
                  >
                    −
                  </button>
                  <span>{i.qty}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty(id, i.qty + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-line">{inr(p.price * i.qty)}</div>
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
              <div className="save">
                <span>You save</span>
                <span>- {inr(savings)}</span>
              </div>
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

            <button className="cart-checkout" onClick={() => onCheckout(items)}>
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
