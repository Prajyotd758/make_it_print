"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, Star, MoreVertical, Trash2 } from "lucide-react";
import type { WishlistProduct } from "@/lib/api/wishlist";

interface Props {
  product: WishlistProduct;
  selected: boolean;
  removing: boolean;
  carting: boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

export default function WishlistCard({
  product: p,
  selected,
  removing,
  carting,
  onToggleSelect,
  onRemove,
  onAddToCart,
}: Props) {
  const [menu, setMenu] = useState(false);

  return (
    <article className={cx("wl-card", selected && "is-selected", removing && "is-removing")}>
      <div className="wl-media">
        {p.images?.[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images[0]} alt={p.title} loading="lazy" />
        )}
        {p.badge && <span className="wl-badge">{p.badge}</span>}
        <button
          type="button"
          className="wl-heart"
          aria-label="Remove from wishlist"
          onClick={() => onRemove(p._id)}
        >
          <Heart size={16} fill="currentColor" />
        </button>
      </div>

      <div className="wl-card-body">
        <div className="wl-card-top">
          <label className="wl-cat-label">
            <input
              type="checkbox"
              className="wl-check"
              checked={selected}
              onChange={() => onToggleSelect(p._id)}
              aria-label={`Select ${p.title}`}
            />
            {p.category}
          </label>

          <div className="wl-menu-wrap">
            <button
              type="button"
              className="wl-menu-btn"
              aria-label="More options"
              onClick={() => setMenu((m) => !m)}
            >
              <MoreVertical size={16} />
            </button>
            {menu && (
              <>
                <div className="wl-menu-backdrop" onClick={() => setMenu(false)} />
                <div className="wl-menu">
                  <button
                    type="button"
                    className="wl-menu-item"
                    onClick={() => {
                      setMenu(false);
                      onRemove(p._id);
                    }}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="wl-card-title">{p.title}</h3>

        <div className="wl-meta">
          {p.rating != null && (
            <>
              <Star size={13} fill="#fbc112" stroke="#fbc112" />
              <strong>{p.rating.toFixed(1)}</strong>
              {p.reviewCount != null && <span>({p.reviewCount})</span>}
            </>
          )}
          {p.size && (
            <>
              {p.rating != null && <span>·</span>}
              <span>{p.size}</span>
            </>
          )}
        </div>

        <p className="wl-price">{inr(p.price)}</p>

        <div className="wl-card-actions">
          <button
            type="button"
            className="wl-card-btn cart"
            disabled={carting}
            onClick={() => onAddToCart(p._id)}
          >
            <ShoppingCart size={15} />
            {carting ? "Adding…" : "Add to Cart"}
          </button>
          <Link href={`/products/${p._id}`} className="wl-card-btn view">
            <Eye size={15} /> View
          </Link>
        </div>
      </div>
    </article>
  );
}
