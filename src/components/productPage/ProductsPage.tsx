"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS } from "./data";
import type { Product } from "@/lib/types";
import { SearchIcon, Star, categoryName, inr, thumbBg } from "./ui";
import {
  CATEGORY_ICONS,
  CartIcon,
  ChevronIcon,
  GridIcon,
  HeartIcon,
  SortStarIcon,
} from "./icons";
import "./products.css";

type SortKey = "popular" | "rated" | "low" | "high";

const SORTERS: Record<SortKey, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.sold - a.sold,
  rated: (a, b) => b.rating - a.rating,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

const PRICE_BUCKETS: {
  id: string;
  label: string;
  test: (n: number) => boolean;
}[] = [
  { id: "all", label: "Any price", test: () => true },
  { id: "u300", label: "Under ₹300", test: (n) => n < 300 },
  { id: "300", label: "₹300 – ₹600", test: (n) => n >= 300 && n <= 600 },
  { id: "600", label: "₹600 – ₹1,000", test: (n) => n > 600 && n <= 1000 },
  { id: "1000", label: "Above ₹1,000", test: (n) => n > 1000 },
];

interface CardProps {
  p: Product;
  wished: boolean;
  onWish: (id: number) => void;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
}

function Card({ p, wished, onWish, onOpen, onAdd }: CardProps) {
  const badge = !p.inStock ? "Sold out" : p.sold > 700 ? "Featured" : null;
  const color = p.colors[0];
  const [main, alt] = p.images;
  return (
    <article className="pl-card">
      <div className="pl-media">
        <button
          className="pl-img"
          style={{ background: thumbBg(p.hue) }}
          onClick={() => onOpen(p)}
          aria-label={p.title}
        >
          <img src={main} alt={p.title} loading="lazy" />
          {alt && (
            <img
              className="pl-img-alt"
              src={alt}
              alt=""
              loading="lazy"
              aria-hidden
            />
          )}
        </button>
        {p.images.length > 1 && (
          <span className="pl-count">{p.images.length}</span>
        )}
        {badge && <span className="pl-badge">{badge}</span>}
        <button
          className={`pl-heart ${wished ? "on" : ""}`}
          aria-pressed={wished}
          aria-label="Add to wishlist"
          onClick={() => onWish(p.id)}
        >
          <HeartIcon filled={wished} />
        </button>
      </div>

      <div className="pl-body">
        <span className="pl-kicker">{categoryName(p.category)}</span>
        <button className="pl-name" onClick={() => onOpen(p)}>
          {p.title}
        </button>
        <div className="pl-opts">
          <span>
            <i className="pl-dot" />
            {p.materials[0]} {p.sizes[1]}
          </span>
          <span>
            <i className="pl-dot" style={{ background: color.hex }} />
            {color.name}
          </span>
        </div>
        <div className="pl-price">{inr(p.price)}</div>
        <div className="pl-rate">
          <Star /> {p.rating} <em>({p.reviews})</em>
        </div>
        <button
          className="pl-add"
          disabled={!p.inStock}
          onClick={() => onAdd(p)}
        >
          <CartIcon /> Add to cart
        </button>
      </div>
    </article>
  );
}

interface ProductsPageProps {
  onOpenProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductsPage({
  onOpenProduct = () => {},
  onAddToCart = () => {},
}: ProductsPageProps) {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [price, setPrice] = useState<string>("all");
  const [topRated, setTopRated] = useState<boolean>(false);
  const [inStock, setInStock] = useState<boolean>(false);
  const [open, setOpen] = useState({ cat: true, price: true, refine: true });
  const [wish, setWish] = useState<Set<number>>(new Set());

  const toggleWish = (id: number) =>
    setWish((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleSec = (k: keyof typeof open) =>
    setOpen((o) => ({ ...o, [k]: !o[k] }));

  const list = useMemo<Product[]>(() => {
    const term = q.trim().toLowerCase();
    const bucket = PRICE_BUCKETS.find((b) => b.id === price)!;
    return PRODUCTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        p.title.toLowerCase().includes(term) &&
        bucket.test(p.price) &&
        (!topRated || p.rating >= 4.5) &&
        (!inStock || p.inStock)
    ).sort(SORTERS[sort]);
  }, [cat, q, sort, price, topRated, inStock]);

  const count = (id: string) =>
    PRODUCTS.filter((p) => p.category === id).length;
  const dirty = price !== "all" || topRated || inStock;
  const reset = () => {
    setPrice("all");
    setTopRated(false);
    setInStock(false);
  };

  const title = cat === "all" ? "All Products" : categoryName(cat);
  const [first, ...rest] = title.split(" ");

  return (
    <div className="pl">
      <header className="pl-head">
        <div>
          <span className="eyebrow">The Collection</span>
          <h1 className="pl-h1">
            {first} {rest.length > 0 && <span>{rest.join(" ")}</span>}
          </h1>
          <p className="pl-sub">
            Discover our complete range of products, designed to make your life
            better.
          </p>
        </div>
        <label className="pl-search">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the collection..."
          />
        </label>
      </header>

      <div className="pl-layout">
        <aside className="pl-side">
          <button
            className="pl-sec pl-sec--main"
            onClick={() => toggleSec("cat")}
            aria-expanded={open.cat}
          >
            <span>
              <GridIcon /> Categories
            </span>
            <ChevronIcon up={open.cat} />
          </button>
          {open.cat && (
            <div className="pl-list">
              <button
                className={`pl-cat ${cat === "all" ? "on" : ""}`}
                onClick={() => setCat("all")}
              >
                <GridIcon />
                <span>All</span>
                <small>{PRODUCTS.length}</small>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`pl-cat ${cat === c.id ? "on" : ""}`}
                  onClick={() => setCat(c.id)}
                >
                  {CATEGORY_ICONS[c.id]}
                  <span>{c.name}</span>
                  <small>{count(c.id)}</small>
                </button>
              ))}
            </div>
          )}

          <button
            className="pl-sec"
            onClick={() => toggleSec("price")}
            aria-expanded={open.price}
          >
            <span>Price</span>
            <ChevronIcon up={open.price} />
          </button>
          {open.price && (
            <div className="pl-list">
              {PRICE_BUCKETS.map((b) => (
                <label key={b.id} className="pl-check">
                  <input
                    type="radio"
                    name="price"
                    checked={price === b.id}
                    onChange={() => setPrice(b.id)}
                  />
                  {b.label}
                </label>
              ))}
            </div>
          )}

          <button
            className="pl-sec"
            onClick={() => toggleSec("refine")}
            aria-expanded={open.refine}
          >
            <span>Refine</span>
            <ChevronIcon up={open.refine} />
          </button>
          {open.refine && (
            <div className="pl-list">
              <label className="pl-check">
                <input
                  type="checkbox"
                  checked={topRated}
                  onChange={(e) => setTopRated(e.target.checked)}
                />
                Rated 4.5 and above
              </label>
              <label className="pl-check">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                />
                In stock only
              </label>
              {dirty && (
                <button className="pl-clear" onClick={reset}>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </aside>

        <main className="pl-main">
          <div className="pl-bar">
            <span className="pl-count">
              <b>{list.length}</b> {list.length === 1 ? "Product" : "Products"}
            </span>
            <label className="pl-sort">
              <SortStarIcon />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort"
              >
                <option value="popular">Best selling</option>
                <option value="rated">Top rated</option>
                <option value="low">Price, low to high</option>
                <option value="high">Price, high to low</option>
              </select>
              <ChevronIcon />
            </label>
          </div>

          {list.length === 0 ? (
            <div className="pl-empty">Nothing matches your selection.</div>
          ) : (
            <div className="pl-grid">
              {list.map((p) => (
                <Card
                  key={p.id}
                  p={p}
                  wished={wish.has(p.id)}
                  onWish={toggleWish}
                  onOpen={onOpenProduct}
                  onAdd={onAddToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
