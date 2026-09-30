"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "./data";
import type { Product } from "@/lib/types";
import { Star, categoryName, discount, inr } from "./ui";
import { CartIcon, HeartIcon } from "./icons";
import "./product-detail.css";

/**
 * Ratings, review counts and "sold" are generated placeholders in data.ts.
 * Keep this false until you have real numbers.
 */
const SHOW_SOCIAL_PROOF = false;
const MAX_QTY = 10;

export interface CartSelection {
  material: string;
  size: string;
  color: string;
  qty: number;
}

interface ProductDetailPageProps {
  /** Pass the product clicked on the listing page. */
  product?: Product;
  /** Or resolve by slug (useful once you add real URLs). */
  slug?: string;
  onBack?: () => void;
  onOpenProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, selection: CartSelection) => void;
  onBuyNow?: (product: Product, selection: CartSelection) => void;
}

const specValue = (p: Product, key: string) =>
  p.specs.find(([label]) => label === key)?.[1];

const priceLabel = (p: Product) =>
  p.price > 0 ? inr(p.price) : "Price on request";

/* ---------- small inline icons (no dependency on ./icons) ---------- */
const Arrow = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

/* ---------- gallery ---------- */
function Gallery({
  p,
  wished,
  onWish,
}: {
  p: Product;
  wished: boolean;
  onWish: () => void;
}) {
  const images = p.images ?? [];
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState<Set<number>>(new Set());

  const go = (n: number) => setI((n + images.length) % images.length);
  const markBroken = (n: number) => setBroken((s) => new Set(s).add(n));

  return (
    <div
      className="pd-gallery"
      tabIndex={0}
      aria-label={`${p.title} photos`}
      onKeyDown={(e) => {
        if (images.length < 2) return;
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
    >
      <div className="pd-stage">
        <div className="pd-main" style={{ background: "var(--cream-2)" }}>
          {images[i] && !broken.has(i) ? (
            <img
              key={i}
              src={images[i]}
              alt={`${p.title} – view ${i + 1}`}
              onError={() => markBroken(i)}
              decoding="async"
            />
          ) : (
            <div className="pd-noimg">Image unavailable</div>
          )}

          {images.length > 1 && (
            <>
              <button
                className="pd-arrow pd-arrow--l"
                aria-label="Previous image"
                onClick={() => go(i - 1)}
              >
                <Arrow dir="left" />
              </button>
              <button
                className="pd-arrow pd-arrow--r"
                aria-label="Next image"
                onClick={() => go(i + 1)}
              >
                <Arrow dir="right" />
              </button>
              <span className="pd-counter">
                {i + 1} / {images.length}
              </span>
            </>
          )}

          <button
            className={`pd-heart ${wished ? "on" : ""}`}
            aria-pressed={wished}
            aria-label="Add to wishlist"
            onClick={onWish}
          >
            <HeartIcon filled={wished} />
          </button>
        </div>

        {images.length > 1 && (
          <div className="pd-thumbs">
            {images.map((src, n) => (
              <button
                key={src}
                className={`pd-thumb ${n === i ? "on" : ""}`}
                aria-label={`View image ${n + 1}`}
                aria-current={n === i}
                onClick={() => setI(n)}
              >
                {!broken.has(n) && (
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    onError={() => markBroken(n)}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- page ---------- */
function Detail({
  p,
  onBack,
  onOpenProduct,
  onAddToCart,
  onBuyNow,
}: Required<Omit<ProductDetailPageProps, "product" | "slug">> & {
  p: Product;
}) {
  const [mat, setMat] = useState<string>(p.materials[0]);
  const [size, setSize] = useState<string>(p.sizes[0]);
  const [color, setColor] = useState<string>(p.colors?.[0]?.name ?? "");
  const [qty, setQty] = useState<number>(1);
  const [wished, setWished] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const priced = p.price > 0;
  const showMrp = priced && p.mrp > p.price;
  const canBuy = p.inStock && priced;
  const selection: CartSelection = { material: mat, size, color, qty };

  const facts = useMemo(() => {
    const pick = (label: string, key: string) => {
      const v = specValue(p, key);
      return v ? { label, value: v } : null;
    };
    const third =
      pick("Supports", "Supports") ??
      pick("Assembly", "Assembly") ??
      pick("Infill", "Infill");
    return [
      pick("Print time", "Print time"),
      pick("Dispatch", "Dispatch"),
      third,
    ].filter(Boolean) as { label: string; value: string }[];
  }, [p]);

  const related = useMemo(() => {
    const others = PRODUCTS.filter((x) => x.id !== p.id);
    const same = others.filter((x) => x.category === p.category);
    const rest = others.filter((x) => x.category !== p.category);
    return [...same, ...rest].slice(0, 4);
  }, [p]);

  return (
    <div className="pd">
      <div className="pd-wrap">
        <nav className="pd-crumb" aria-label="Breadcrumb">
          <button onClick={onBack}>Products</button>
          <span>/</span>
          <span>{categoryName(p.category)}</span>
          <span>/</span>
          <span className="cur">{p.title}</span>
        </nav>

        <div className="pd-detail">
          <Gallery p={p} wished={wished} onWish={() => setWished((w) => !w)} />

          <div className="pd-d">
            <span className="eyebrow">{categoryName(p.category)}</span>
            <h1>{p.title}</h1>

            {SHOW_SOCIAL_PROOF && (
              <div className="pd-meta">
                <span className="pd-rate">
                  <Star /> {p.rating} <em>({p.reviews} reviews)</em>
                </span>
                <span>{p.sold} sold</span>
              </div>
            )}

            <div className="pd-pricebox">
              <div className="pd-big">
                <strong className={priced ? "" : "pd-soon"}>
                  {priceLabel(p)}
                </strong>
                {showMrp && (
                  <>
                    <s>{inr(p.mrp)}</s>
                    <span className="pd-off">{discount(p)}% off</span>
                  </>
                )}
              </div>
              <p className="pd-tax">
                {priced
                  ? qty > 1
                    ? `${qty} × ${inr(p.price)} = ${inr(
                        p.price * qty
                      )} · Inclusive of all taxes`
                    : "Inclusive of all taxes"
                  : "Pricing for this model is coming soon."}
              </p>
            </div>

            {facts.length > 0 && (
              <dl className="pd-facts">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="pd-label">
              Material <b>{mat}</b>
            </div>
            <div className="pd-opts">
              {p.materials.map((m) => (
                <button
                  key={m}
                  className={`pd-opt ${mat === m ? "on" : ""}`}
                  aria-pressed={mat === m}
                  onClick={() => setMat(m)}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="pd-label">
              Size <b>{size}</b>
            </div>
            <div className="pd-opts">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  className={`pd-opt ${size === s ? "on" : ""}`}
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {p.colors?.length > 0 && (
              <>
                <div className="pd-label">
                  Colour <b>{color}</b>
                </div>
                <div className="pd-opts">
                  {p.colors.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={color === c.name}
                      className={`pd-dot ${color === c.name ? "on" : ""}`}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c.name)}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="pd-buy">
              <div className="pd-qty" role="group" aria-label="Quantity">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  −
                </button>
                <span aria-live="polite">{qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}
                >
                  +
                </button>
              </div>
              <button
                className="pd-btn pd-btn--ghost"
                disabled={!canBuy}
                onClick={() => onAddToCart(p, selection)}
              >
                <CartIcon /> Add to cart
              </button>
              <button
                className="pd-btn pd-btn--pri"
                disabled={!canBuy}
                onClick={() => onBuyNow(p, selection)}
              >
                {!p.inStock ? "Sold out" : priced ? "Buy now" : "Price soon"}
              </button>
            </div>

            <p className="pd-note">
              Printed to order in-house at Make It Print.
            </p>
          </div>
        </div>

        <div className="pd-cols">
          <section className="pd-card">
            <h2>Description</h2>
            <p>{p.description}</p>
          </section>
          <section className="pd-card">
            <h2>Specifications</h2>
            <div className="pd-specs">
              {p.specs.map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {related.length > 0 && (
          <section className="pd-related">
            <h2>You may also like</h2>
            <div className="pd-grid">
              {related.map((r) => (
                <button
                  key={r.id}
                  className="pd-rel"
                  onClick={() => onOpenProduct(r)}
                >
                  <span className="pd-relimg">
                    <img src={r.images[0]} alt="" loading="lazy" />
                  </span>
                  <span className="pd-kicker">{categoryName(r.category)}</span>
                  <h3>{r.title}</h3>
                  <span className="pd-relprice">{priceLabel(r)}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  product,
  slug,
  onBack = () => {},
  onOpenProduct = () => {},
  onAddToCart = () => {},
  onBuyNow = () => {},
}: ProductDetailPageProps) {
  const p = product ?? PRODUCTS.find((x) => x.slug === slug) ?? PRODUCTS[0];
  // key resets selected material/size/colour/qty/gallery whenever the product changes
  return (
    <Detail
      key={p.id}
      p={p}
      onBack={onBack}
      onOpenProduct={onOpenProduct}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
    />
  );
}
