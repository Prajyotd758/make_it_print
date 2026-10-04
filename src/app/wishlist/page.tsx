"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2, Box } from "lucide-react";
import { useWishlist } from "@//lib/hooks/useWishlist";
import { addToCart } from "@/lib/api/cart"; // assumed: addToCart(productId: string, quantity?: number)
import WishlistCard from "@/components/wishlist/WishlistCard";
import "@/components/wishlist/wishlist.css";

const MAX_PRICE = 5000;
type Sort = "recent" | "price-asc" | "price-desc" | "rating";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const cx = (...a: (string | false | undefined)[]) =>
  a.filter(Boolean).join(" ");

export default function WishlistPage() {
  const { auth, items, status, pending, notice, notify, load, remove } =
    useWishlist();

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("recent");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [carting, setCarting] = useState<Set<string>>(new Set());

  // drop selections / category that no longer exist
  useEffect(() => {
    const ids = new Set(items.map((i) => i._id));
    setSelected((s) => {
      const next = new Set([...s].filter((id) => ids.has(id)));
      return next.size === s.size ? s : next;
    });
    if (category !== "all" && !items.some((i) => i.category === category)) {
      setCategory("all");
    }
  }, [items, category]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((i) => map.set(i.category, (map.get(i.category) ?? 0) + 1));
    return [...map.entries()];
  }, [items]);

  const visible = useMemo(() => {
    const list = items.filter(
      (i) =>
        (category === "all" || i.category === category) &&
        (maxPrice >= MAX_PRICE || i.price <= maxPrice)
    );
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return [...list].reverse(); // API appends, so newest is last
    }
  }, [items, category, maxPrice, sort]);

  const selectedVisible = visible.filter((p) => selected.has(p._id));
  const allSelected =
    visible.length > 0 && selectedVisible.length === visible.length;
  const filtersActive = category !== "all" || maxPrice < MAX_PRICE;

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s);
      allSelected
        ? visible.forEach((p) => n.delete(p._id))
        : visible.forEach((p) => n.add(p._id));
      return n;
    });

  const addToCartMany = async (ids: string[]) => {
    const todo = ids.filter((id) => !carting.has(id));
    if (!todo.length) return;

    const token = session?.accessToken;
    const toLogin = () =>
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    if (!token || session?.error) return toLogin();

    setCarting((c) => new Set([...c, ...todo]));
    const results = await Promise.allSettled(
      todo.map((id) => addToCart(token, id, 1))
    );
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const bad = todo.length - ok;
    notify(
      bad === 0
        ? ok === 1
          ? "Added to cart"
          : `Added ${ok} items to cart`
        : ok === 0
        ? "Couldn't add to cart. Try again."
        : `Added ${ok}, ${bad} failed`
    );
    setCarting((c) => {
      const n = new Set(c);
      todo.forEach((id) => n.delete(id));
      return n;
    });
  };

  const removeSelected = () => remove(selectedVisible.map((p) => p._id));

  return (
    <main className="wl-page">
      {/* Hero */}
      <section className="wl-hero">
        <div className="wl-hero-text">
          <p className="wl-eyebrow">Your Wishlist</p>
          <h1 className="wl-title">
            Saved for <span>Later</span>
          </h1>
          <p className="wl-sub">
            Your favourite 3D models, ready when you are.
          </p>
        </div>

        <div className="wl-hero-art">
          <div className="wl-blob" />
          {items[0]?.images?.[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={items[0].images[0]} alt="" className="wl-hero-img" />
          )}
          <p className="wl-note">
            Great ideas
            <br />
            deserve to
            <br />
            be printed
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="wl-body">
        {auth === "loading" ? (
          <GridSkeleton />
        ) : auth === "unauthenticated" ? (
          <StateCard
            title="Sign in to see your wishlist"
            text="Save models you like and find them here on any device."
            action={
              <button onClick={() => signIn()} className="wl-btn wl-btn-dark">
                Sign in
              </button>
            }
          />
        ) : (
          <div className="wl-layout">
            {/* Sidebar */}
            <aside className="wl-aside">
              <p className="wl-label">Categories</p>
              <ul className="wl-cats">
                <CategoryRow
                  active={category === "all"}
                  label="All Wishlist Items"
                  count={items.length}
                  onClick={() => setCategory("all")}
                  heart
                />
                {categories.map(([name, count]) => (
                  <CategoryRow
                    key={name}
                    active={category === name}
                    label={name}
                    count={count}
                    onClick={() => setCategory(name)}
                  />
                ))}
              </ul>

              <hr className="wl-divider" />
              <p className="wl-label">Price Range</p>
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price"
                className="wl-range"
              />
              <div className="wl-range-ends">
                <span>₹0</span>
                <span>{maxPrice >= MAX_PRICE ? "₹5,000+" : inr(maxPrice)}</span>
              </div>

              <hr className="wl-divider" />
              <label className="wl-label" htmlFor="wl-sort">
                Sort By
              </label>
              <select
                id="wl-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="wl-select"
              >
                <option value="recent">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <div className="wl-custom">
                <span className="wl-custom-icon">
                  <Box size={20} />
                </span>
                <div>
                  <p className="wl-custom-title">Need something custom?</p>
                  <p className="wl-custom-text">
                    Turn your idea into a 3D printed reality with us.
                  </p>
                  <Link href="/contact" className="wl-custom-link">
                    Request a Custom Project →
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="wl-panel">
              <div className="wl-toolbar">
                <p className="wl-count">
                  {filtersActive
                    ? `${visible.length} of ${items.length}`
                    : items.length}{" "}
                  {items.length === 1 ? "Item" : "Items"}
                </p>
                <div className="wl-actions">
                  <label className="wl-selectall">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      disabled={!visible.length}
                    />
                    Select All
                  </label>
                  <button
                    onClick={removeSelected}
                    disabled={!selectedVisible.length}
                    className="wl-btn wl-btn-outline"
                  >
                    <Trash2 size={15} /> Remove Selected
                  </button>
                  <button
                    onClick={() =>
                      addToCartMany(selectedVisible.map((p) => p._id))
                    }
                    disabled={!selectedVisible.length}
                    className="wl-btn wl-btn-primary"
                  >
                    <ShoppingCart size={15} /> Add to Cart (
                    {selectedVisible.length})
                  </button>
                </div>
              </div>

              {status === "loading" ? (
                <GridSkeleton bare />
              ) : status === "error" ? (
                <StateCard
                  bare
                  title="Couldn't load your wishlist"
                  text="Check your connection and try again."
                  action={
                    <button
                      onClick={() => load()}
                      className="wl-btn wl-btn-primary wl-btn-lg"
                    >
                      Retry
                    </button>
                  }
                />
              ) : items.length === 0 ? (
                <StateCard
                  bare
                  title="Your wishlist is empty"
                  text="Tap the heart on any model to save it here."
                  action={
                    <Link href="/products" className="wl-btn wl-btn-dark">
                      Browse products
                    </Link>
                  }
                />
              ) : visible.length === 0 ? (
                <StateCard
                  bare
                  title="No items match these filters"
                  text="Try a different category or raise the price limit."
                  action={
                    <button
                      onClick={() => {
                        setCategory("all");
                        setMaxPrice(MAX_PRICE);
                      }}
                      className="wl-btn wl-btn-outline wl-btn-lg"
                    >
                      Clear filters
                    </button>
                  }
                />
              ) : (
                <div className="wl-grid">
                  {visible.map((p) => (
                    <WishlistCard
                      key={p._id}
                      product={p}
                      selected={selected.has(p._id)}
                      removing={pending.has(p._id)}
                      carting={carting.has(p._id)}
                      onToggleSelect={toggle}
                      onRemove={(id) => remove([id])}
                      onAddToCart={(id) => addToCartMany([id])}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={cx("wl-toast", !!notice && "is-visible")}
      >
        {notice}
      </div>
    </main>
  );
}

function CategoryRow({
  active,
  label,
  count,
  onClick,
  heart,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  heart?: boolean;
}) {
  return (
    <li>
      <button onClick={onClick} className={cx("wl-cat", active && "is-active")}>
        {heart ? (
          <Heart size={16} className="wl-heart-ico" />
        ) : (
          <Box size={16} />
        )}
        <span className="wl-cat-name">{label}</span>
        <span className="wl-cat-count">{count}</span>
      </button>
    </li>
  );
}

function StateCard({
  title,
  text,
  action,
  bare,
}: {
  title: string;
  text: string;
  action: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <div className={cx("wl-state", !bare && "wl-panel")}>
      <span className="wl-state-icon">
        <Heart size={22} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="wl-state-action">{action}</div>
    </div>
  );
}

function GridSkeleton({ bare }: { bare?: boolean }) {
  return (
    <div className={cx("wl-grid", !bare && "wl-panel")}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="wl-skel">
          <div className="img" />
          <div className="l1" />
          <div className="l2" />
          <div className="l3" />
        </div>
      ))}
    </div>
  );
}
