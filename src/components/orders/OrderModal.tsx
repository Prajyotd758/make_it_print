"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getOrder, type Order } from "@/lib/api/checkout";
import "./order-modal.css";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const cache = new Map<string, Order>();

export default function OrderModal({
  id,
  token,
  onClose,
}: {
  id: string;
  token: string;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(cache.get(id) ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    const hit = cache.get(id);
    if (hit) return setOrder(hit);
    let stop = false;
    setOrder(null);
    setError("");
    getOrder(token, id)
      .then((o) => {
        if (stop) return;
        if (o.status !== "pending") cache.set(id, o);
        setOrder(o);
      })
      .catch((e) => !stop && setError(e.message || "Could not load order"));
    return () => {
      stop = true;
    };
  }, [id, token]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="om" onClick={onClose}>
      <div
        className="om-card"
        role="dialog"
        aria-modal="true"
        aria-label="Order details"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="om-x" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <header className="om-head">
          <span className={`om-badge ${order?.status ?? ""}`}>
            {order?.status ?? "loading"}
          </span>
          <h2>Order #{id.slice(-8).toUpperCase()}</h2>
          {order && (
            <p className="om-mono">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </header>

        {error ? (
          <p className="om-err">{error}</p>
        ) : !order ? (
          <div className="om-skel" aria-busy="true" aria-label="Loading order">
            <i className="s-row" />
            <i className="s-row" />
            <i className="s-line" />
            <i className="s-line short" />
            <i className="s-block" />
          </div>
        ) : (
          <div className="om-body">
            <section>
              <h3 className="om-mono">Items</h3>
              {order.items.map((i, k) => (
                <div className="om-item" key={k}>
                  {i.image ? (
                    <img src={i.image} alt={i.title} />
                  ) : (
                    <div className="om-sw" style={{ color: i.custom?.color }}>
                      Aa
                    </div>
                  )}
                  <div>
                    <p>{i.title}</p>
                    <span className="om-mono">Qty {i.quantity}</span>
                  </div>
                  <b>{inr(i.price * i.quantity)}</b>
                </div>
              ))}
              <div className="om-row">
                <span>Subtotal</span>
                <span>{inr(order.subtotal)}</span>
              </div>
              <div className="om-row">
                <span>Shipping</span>
                <span>{order.shipping ? inr(order.shipping) : "Free"}</span>
              </div>
              <div className="om-total">
                <span>Total</span>
                <span>{inr(order.total)}</span>
              </div>
            </section>

            <section className="om-addr">
              <h3 className="om-mono">Delivery address</h3>
              <p>
                <b>{order.address.name}</b>
              </p>
              <p className="om-muted">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
                {order.address.city}, {order.address.state} –{" "}
                {order.address.pincode}
              </p>
              <p className="om-mono">{order.address.phone}</p>
              {order.razorpayPaymentId && (
                <>
                  <h3 className="om-mono" style={{ marginTop: 16 }}>
                    Payment
                  </h3>
                  <p className="om-mono">{order.razorpayPaymentId}</p>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
