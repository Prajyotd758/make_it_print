"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { getProductById, getRelatedProducts } from "@/lib/api/products";
import { Star, categoryName, inr } from "./ui";
import { CartIcon, HeartIcon } from "./icons";
import "./product-detail.css";

/** Flip to true once ratings/reviews/sold are real numbers. */
const SHOW_SOCIAL_PROOF = false;
const MAX_QTY = 10;

export interface CartSelection {
  material: string;
  size: string;
  color: string;
  qty: number;
}

interface ProductDetailPageProps {
  /** Mongo _id from the route, e.g. /products/[id] */
  id: string;
  onBack?: () => void;
  onOpenProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, selection: CartSelection) => void;
  onBuyNow?: (productId: string, qty: number) => void;
}

const priceLabel = (p: Product) =>
  p.price > 0 ? inr(p.price) : "Price on request";

const specEntries = (p: Product): [string, string][] =>
  Object.entries(p.specs ?? {}).map(([k, v]) => [k, String(v)]);

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
}: Required<Omit<ProductDetailPageProps, "id">> & { p: Product }) {
  const [mat, setMat] = useState<string>(p.materials?.[0] ?? "");
  const [size, setSize] = useState<string>(p.sizes?.[0] ?? "");
  const [color, setColor] = useState<string>(p.colors?.[0]?.name ?? "");
  const [qty, setQty] = useState<number>(1);
  const [wished, setWished] = useState<boolean>(false);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const ctrl = new AbortController();
    getRelatedProducts(p.category, p._id, ctrl.signal)
      .then(setRelated)
      .catch(() => {});
    return () => ctrl.abort();
  }, [p._id, p.category]);

  const priced = p.price > 0;
  const canBuy = p.inStock && priced;
  const selection: CartSelection = { material: mat, size, color, qty };
  const specs = useMemo(() => specEntries(p), [p]);

  const facts = useMemo(() => {
    const get = (key: string) => specs.find(([k]) => k === key)?.[1];
    const pick = (label: string, key: string) => {
      const v = get(key);
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
  }, [specs]);

  return (
    <div className="pd">
      <div className="pd-wrap">
        <nav className="pd-crumb" aria-label="Breadcrumb">
          <button onClick={onBack}>Products</button>
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

            {p.materials?.length > 0 && (
              <>
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
              </>
            )}

            {p.sizes?.length > 0 && (
              <>
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
              </>
            )}

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
                onClick={() => onBuyNow?.(p._id, qty)}
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
          {specs.length > 0 && (
            <section className="pd-card">
              <h2>Specifications</h2>
              <div className="pd-specs">
                {specs.map(([k, v]) => (
                  <div key={k}>
                    <span>{k}</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {related.length > 0 && (
          <section className="pd-related">
            <h2>You may also like</h2>
            <div className="pd-grid">
              {related.map((r) => (
                <button
                  key={r._id}
                  className="pd-rel"
                  onClick={() => onOpenProduct(r)}
                >
                  <span className="pd-relimg">
                    <img src={r.images?.[0]} alt="" loading="lazy" />
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
  id,
  onBack = () => {},
  onOpenProduct = () => {},
  onAddToCart = () => {},
  onBuyNow = () => {},
}: ProductDetailPageProps) {
  const [p, setP] = useState<Product | null>(null);
  const [status, setStatus] = useState<
    "loading" | "ready" | "notfound" | "error"
  >("loading");

  useEffect(() => {
    const ctrl = new AbortController();
    setStatus("loading");
    getProductById(id, ctrl.signal)
      .then((prod) => {
        setP(prod);
        setStatus("ready");
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setStatus(
          e?.status === 404 || e?.status === 400 ? "notfound" : "error"
        );
      });
    return () => ctrl.abort();
  }, [id]);

  if (status !== "ready" || !p) {
    return (
      <div className="pd">
        <div className="pd-wrap">
          <p className="pd-note">
            {status === "loading" && "Loading product…"}
            {status === "notfound" && "This product doesn't exist."}
            {status === "error" && "Couldn't load this product. Please retry."}
          </p>
          {status !== "loading" && (
            <button className="pd-btn pd-btn--ghost" onClick={onBack}>
              Back to products
            </button>
          )}
        </div>
      </div>
    );
  }

  // key resets material/size/colour/qty/gallery whenever the product changes
  return (
    <Detail
      key={p._id}
      p={p}
      onBack={onBack}
      onOpenProduct={onOpenProduct}
      onAddToCart={onAddToCart}
      onBuyNow={onBuyNow}
    />
  );
}
