"use client";

import { useState } from "react";
import { PRODUCTS } from "./data";
import type { Product } from "@/lib/types";
import { Star, categoryName, code, discount, inr, thumbBg } from "./ui";
import "./product-detail.css";

interface ProductDetailPageProps {
  product?: Product;
  onBack?: () => void;
  onOpenProduct?: (product: Product) => void;
}

export default function ProductDetailPage({
  product,
  onBack = () => {},
  onOpenProduct = () => {},
}: ProductDetailPageProps) {
  const p = product || PRODUCTS[0];
  const [img, setImg] = useState<number>(0);
  const [mat, setMat] = useState<string>(p.materials[0]);
  const [size, setSize] = useState<string>(p.sizes[1]);
  const [color, setColor] = useState<string>(p.colors[0].name);
  const [qty, setQty] = useState<number>(1);
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="pd">
      <div className="pd-wrap">
        <div className="pd-crumb">
          <button onClick={onBack}>Products</button>
          <span>/</span>
          <span>{categoryName(p.category)}</span>
          <span>/</span>
          <span className="cur">{p.title}</span>
        </div>

        <div className="pd-detail">
          <div>
            <div className="pd-ph pd-main" data-code={code(p)} style={{ background: thumbBg(p.hue + img * 25) }} />
            <div className="pd-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  aria-label={`View image ${i + 1}`}
                  className={`pd-ph ${img === i ? "on" : ""}`}
                  style={{ background: thumbBg(p.hue + i * 25) }}
                  onClick={() => setImg(i)}
                />
              ))}
            </div>
          </div>

          <div className="pd-d">
            <span className="eyebrow">{categoryName(p.category)}</span>
            <h1>{p.title}</h1>
            <div className="pd-meta pd-meta--lg">
              <span className="pd-rate"><Star /> {p.rating} <em>({p.reviews} reviews)</em></span>
              <span>{p.sold} sold</span>
            </div>

            <div className="pd-big">
              {inr(p.price)}
              <s>{inr(p.mrp)}</s>
              <span className="pd-off">-{discount(p)}%</span>
            </div>
            <p className="pd-tax">Inclusive of all taxes</p>

            <div className="pd-label">Material</div>
            <div className="pd-opts">
              {p.materials.map((m) => (
                <button key={m} className={`pd-opt ${mat === m ? "on" : ""}`} onClick={() => setMat(m)}>{m}</button>
              ))}
            </div>

            <div className="pd-label">Size</div>
            <div className="pd-opts">
              {p.sizes.map((s) => (
                <button key={s} className={`pd-opt ${size === s ? "on" : ""}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>

            <div className="pd-label">Colour <b>{color}</b></div>
            <div className="pd-opts">
              {p.colors.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  aria-label={c.name}
                  className={`pd-dot ${color === c.name ? "on" : ""}`}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>

            <div className="pd-buy">
              <div className="pd-qty">
                <button aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button aria-label="Increase" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="pd-btn" disabled={!p.inStock}>Add to cart</button>
              <button className="pd-btn pri" disabled={!p.inStock}>{p.inStock ? "Buy now" : "Sold out"}</button>
            </div>
          </div>
        </div>

        <div className="pd-cols">
          <section>
            <h2>Description</h2>
            <p>{p.description}</p>
          </section>
          <section>
            <h2>Specifications</h2>
            <div className="pd-specs">
              {p.specs.map(([k, v]) => (
                <div key={k}><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
          </section>
        </div>

        {related.length > 0 && (
          <section className="pd-related">
            <h2>You may also like</h2>
            <div className="pd-grid">
              {related.map((r) => (
                <button key={r.id} className="pd-rel" onClick={() => onOpenProduct(r)}>
                  <div className="pd-ph" data-code={code(r)} style={{ background: thumbBg(r.hue) }} />
                  <span className="pd-kicker">{categoryName(r.category)}</span>
                  <h3>{r.title}</h3>
                  <span className="pd-relprice">{inr(r.price)}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
