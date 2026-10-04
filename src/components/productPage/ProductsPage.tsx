"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES } from "./data";
import type { Product, Pagination } from "@/lib/types";
import {
  fetchProducts,
  fetchCategoryCounts,
  type SortKey,
} from "@/lib/api/products";
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
import { ApiRequestError } from "@/lib/api/client";
import { signIn } from "next-auth/react";
import { useWishlistIds } from "@/lib/hooks/useWishlistIds";

const PAGE_SIZE = 12;

const PRICE_BUCKETS: {
  id: string;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { id: "all", label: "Any price" },
  { id: "u300", label: "Under ₹300", max: 299 },
  { id: "300", label: "₹300 – ₹600", min: 300, max: 600 },
  { id: "600", label: "₹600 – ₹1,000", min: 601, max: 1000 },
  { id: "1000", label: "Above ₹1,000", min: 1001 },
];

/* ───────────────────────── Card ───────────────────────── */

interface CardProps {
  p: Product;
  wished: boolean;
  adding: boolean;
  onWish: (id: string) => void;
  onOpen: (p: Product) => void;
  onAdd: (p: Product) => void;
  wishBusy: boolean;
}

function Card({
  p,
  wished,
  wishBusy,
  adding,
  onWish,
  onOpen,
  onAdd,
}: CardProps) {
  const badge = !p.inStock ? "Sold out" : p.sold > 700 ? "Featured" : null;

  const color = p.colors?.[0];
  const size = p.sizes?.[1] ?? p.sizes?.[0];
  const [main, alt] = p.images ?? [];

  return (
    <article className="pl-card">
      <div className="pl-media">
        <button
          className="pl-img"
          style={{ background: thumbBg(p.hue) }}
          onClick={() => onOpen(p)}
          aria-label={p.title}
        >
          {main && <img src={main} alt={p.title} loading="lazy" />}

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

        {badge && <span className="pl-badge">{badge}</span>}

        <button
          className={`pl-heart ${wished ? "on" : ""}`}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          disabled={wishBusy}
          onClick={() => onWish(p._id)}
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
            {p.materials?.[0]} {size}
          </span>

          {color && (
            <span>
              <i className="pl-dot" style={{ background: color.hex }} />
              {color.name}
            </span>
          )}
        </div>

        <div className="pl-price">{inr(p.price)}</div>

        <div className="pl-rate">
          <Star /> {p.rating} <em>({p.reviews})</em>
        </div>

        <button
          className="pl-add"
          disabled={!p.inStock || adding}
          onClick={() => onAdd(p)}
        >
          {adding ? (
            "Adding…"
          ) : (
            <>
              <CartIcon /> Add to cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}

/* ───────────────────────── Skeleton ───────────────────────── */

function SkeletonCard() {
  return (
    <div className="pl-card pl-skel" aria-hidden>
      <div className="pl-sk-img" />
      <div className="pl-sk-body">
        <span className="pl-sk-line" style={{ width: "35%" }} />
        <span className="pl-sk-line" style={{ width: "85%", height: 16 }} />
        <span className="pl-sk-line" style={{ width: "55%" }} />
        <span className="pl-sk-line" style={{ width: "30%", height: 18 }} />
        <span className="pl-sk-line" style={{ width: "100%", height: 38 }} />
      </div>
    </div>
  );
}

const SkeletonGrid = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </>
);

/* ───────────────────────── Page ───────────────────────── */

interface ProductsPageProps {
  onOpenProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onRequireAuth?: () => void; // called when a logged-out user taps the heart
}

export default function ProductsPage({
  onOpenProduct = () => {},
  onAddToCart = () => {},
  onRequireAuth = () => signIn(),
}: ProductsPageProps) {
  // filters
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState<string>("");
  const [debouncedQ, setDebouncedQ] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [price, setPrice] = useState<string>("all");
  const [topRated, setTopRated] = useState<boolean>(false);
  const [inStock, setInStock] = useState<boolean>(false);

  // data
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const [counts, setCounts] = useState<{
    total: number;
    byId: Record<string, number>;
  }>({
    total: 0,
    byId: {},
  });

  // ui
  const [open, setOpen] = useState({
    cat: true,
    price: true,
    refine: true,
  });

  const {
    ids: wish,
    pending: wishPending,
    notice,
    toggle,
    authed,
  } = useWishlistIds();

  const handleWish = (id: string) => {
    if (!authed) return onRequireAuth();
    void toggle(id);
  };

  const sentinelRef = useRef<HTMLDivElement>(null);
  // blocks duplicate "load more" triggers before React re-renders
  const busyRef = useRef<boolean>(false);

  const [adding, setAdding] = useState<Set<string>>(new Set());

  const handleAdd = async (p: Product) => {
    if (adding.has(p._id)) return;
    setAdding((prev) => new Set(prev).add(p._id));
    try {
      await onAddToCart(p);
    } finally {
      setAdding((prev) => {
        const next = new Set(prev);
        next.delete(p._id);
        return next;
      });
    }
  };

  const toggleSec = (k: keyof typeof open) => {
    setOpen((o) => ({
      ...o,
      [k]: !o[k],
    }));
  };

  // any filter change restarts the list from page 1
  const withReset =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      set(v);
      setPage(1);
    };

  const changeCat = withReset(setCat);
  const changeSort = withReset(setSort);
  const changePrice = withReset(setPrice);
  const changeTopRated = withReset(setTopRated);
  const changeInStock = withReset(setInStock);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [q]);

  // fetch products (replace on page 1, append on later pages)
  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      const bucket = PRICE_BUCKETS.find((b) => b.id === price);

      busyRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetchProducts(
          {
            page,
            limit: PAGE_SIZE,
            sort,
            category: cat !== "all" ? cat : undefined,
            q: debouncedQ,
            minPrice: bucket?.min,
            maxPrice: bucket?.max,
            minRating: topRated ? 4.5 : undefined,
            inStock,
          },
          controller.signal
        );

        setProducts((prev) => {
          if (page === 1) return res.products;
          const seen = new Set(prev.map((p) => p._id));
          return [...prev, ...res.products.filter((p) => !seen.has(p._id))];
        });
        setPagination(res.pagination);
      } catch (e) {
        if ((e as Error)?.name === "AbortError") {
          return;
        }

        setError(
          e instanceof ApiRequestError ? e.message : "Couldn't load products."
        );
      } finally {
        if (!controller.signal.aborted) {
          busyRef.current = false;
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [page, cat, debouncedQ, sort, price, topRated, inStock, reloadKey]);

  // fetch sidebar category counts once
  useEffect(() => {
    const controller = new AbortController();

    const loadCategoryCounts = async () => {
      try {
        const { total, categories } = await fetchCategoryCounts(
          controller.signal
        );

        setCounts({
          total,
          byId: Object.fromEntries(categories.map((c) => [c.id, c.count])),
        });
      } catch (e) {
        if ((e as Error)?.name === "AbortError") {
          return;
        }

        console.error("Failed to load category counts:", e);
      }
    };

    void loadCategoryCounts();

    return () => {
      controller.abort();
    };
  }, []);

  // infinite scroll: load the next page when the sentinel nears the viewport
  const hasNext = pagination?.hasNext ?? false;

  const loadMore = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    setPage((p) => p + 1);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNext || loading || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNext, loading, error, loadMore]);

  const dirty = price !== "all" || topRated || inStock;

  const reset = () => {
    setPrice("all");
    setTopRated(false);
    setInStock(false);
    setPage(1);
  };

  const title = cat === "all" ? "All Products" : categoryName(cat);

  const [first, ...rest] = title.split(" ");

  const total = pagination?.total ?? 0;

  const initialLoading = loading && page === 1;
  const loadingMore = loading && page > 1;

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
                onClick={() => changeCat("all")}
              >
                <GridIcon />
                <span>All</span>
                <small>{counts.total}</small>
              </button>

              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`pl-cat ${cat === c.id ? "on" : ""}`}
                  onClick={() => changeCat(c.id)}
                >
                  {CATEGORY_ICONS[c.id]}

                  <span>{c.name}</span>

                  <small>{counts.byId[c.id] ?? 0}</small>
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
                    onChange={() => changePrice(b.id)}
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
                  onChange={(e) => changeTopRated(e.target.checked)}
                />
                Rated 4.5 and above
              </label>

              <label className="pl-check">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => changeInStock(e.target.checked)}
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
              <b>{total}</b> {total === 1 ? "Product" : "Products"}
            </span>

            <label className="pl-sort">
              <SortStarIcon />

              <select
                value={sort}
                onChange={(e) => changeSort(e.target.value as SortKey)}
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

          {error && products.length === 0 ? (
            <div className="pl-empty">
              {error}{" "}
              <button
                className="pl-clear"
                onClick={() => setReloadKey((k) => k + 1)}
              >
                Retry
              </button>
            </div>
          ) : initialLoading ? (
            <div className="pl-grid" aria-busy="true">
              <SkeletonGrid count={PAGE_SIZE} />
            </div>
          ) : products.length === 0 ? (
            <div className="pl-empty">Nothing matches your selection.</div>
          ) : (
            <>
              <div className="pl-grid">
                {products.map((p) => (
                  <Card
                    key={p._id}
                    p={p}
                    adding={adding.has(p._id)}
                    wished={wish.has(p._id)}
                    wishBusy={wishPending.has(p._id)}
                    onWish={handleWish}
                    onOpen={onOpenProduct}
                    onAdd={handleAdd}
                  />
                ))}
              </div>

              {/* infinite-scroll footer */}
              <div ref={sentinelRef} className="pl-more" aria-live="polite">
                {loadingMore && (
                  <>
                    <span className="pl-spinner" aria-hidden />
                    Loading more products…
                  </>
                )}

                {error && !loading && (
                  <>
                    {error}{" "}
                    <button
                      className="pl-clear"
                      onClick={() => setReloadKey((k) => k + 1)}
                    >
                      Retry
                    </button>
                  </>
                )}

                {!hasNext && !loading && !error && (
                  <span className="pl-end">You&apos;ve seen it all</span>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
