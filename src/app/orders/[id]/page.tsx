"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { inr } from "@/components/productPage/ui";
import { getOrder, type Order } from "@/lib/api/checkout";
import "../orders.css";

const POLL_MS = 2000;
const MAX_POLLS = 8;
const COLORS = ["#fbc112", "#121110", "#ffffff", "#ffd75e"];
const STEPS = ["Confirmed", "Printing", "Packed", "Shipped"];
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function burst(from: HTMLElement) {
  const layer = document.createElement("div");
  layer.className = "or-confetti";
  document.body.appendChild(layer);
  const b = from.getBoundingClientRect();
  const ox = b.left + b.width / 2;
  const oy = b.top + b.height / 2;
  const h = window.innerHeight;
  const r = gsap.utils.random;

  for (let i = 0; i < 90; i++) {
    const p = document.createElement("i");
    const w = r(6, 12);
    p.style.cssText = `left:${ox}px;top:${oy}px;width:${w}px;height:${
      Math.random() > 0.5 ? w : w * 2.2
    }px;background:${r(COLORS)};border-radius:${
      Math.random() > 0.7 ? "50%" : "2px"
    }`;
    layer.appendChild(p);
    const a = r(-Math.PI * 0.95, -Math.PI * 0.05);
    const d = r(140, 460);
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d;
    gsap
      .timeline({ delay: r(0, 0.15) })
      .to(p, {
        x: dx,
        y: dy,
        rotation: r(-360, 360),
        duration: r(0.6, 0.9),
        ease: "power3.out",
      })
      .to(p, {
        x: dx + r(-80, 80),
        y: h - oy + 60,
        rotation: "+=540",
        opacity: 0,
        duration: r(1.4, 2.2),
        ease: "power1.in",
      });
  }
  gsap.delayedCall(4, () => layer.remove());
}

const SHAPES = [
  { t: "cube", x: 7, y: 14, s: 64, d: 0.04 },
  { t: "layers", x: 87, y: 10, s: 78, d: 0.06 },
  { t: "ring", x: 92, y: 46, s: 56, d: 0.03 },
  { t: "plus", x: 4, y: 50, s: 34, d: 0.05 },
  { t: "cube", x: 82, y: 74, s: 48, d: 0.07 },
  { t: "layers", x: 10, y: 80, s: 60, d: 0.04 },
  { t: "ring", x: 50, y: 90, s: 40, d: 0.05 },
  { t: "plus", x: 72, y: 26, s: 26, d: 0.06 },
  { t: "cube", x: 30, y: 6, s: 36, d: 0.03 },
];
const EMBERS = Array.from({ length: 24 }, (_, i) => i);

function Shape({ t }: { t: string }) {
  if (t === "cube")
    return (
      <svg viewBox="0 0 64 64">
        <path d="M32 4L56 18L32 32L8 18Z" fill="#ffd75e" />
        <path d="M8 18L32 32V60L8 46Z" fill="#121110" />
        <path d="M56 18L32 32V60L56 46Z" fill="#fbc112" />
      </svg>
    );
  if (t === "layers")
    return (
      <svg viewBox="0 0 64 64">
        <rect x="6" y="38" width="52" height="12" rx="6" fill="#121110" />
        <rect x="10" y="22" width="44" height="12" rx="6" fill="#fbc112" />
        <rect x="16" y="6" width="32" height="12" rx="6" fill="#ffd75e" />
      </svg>
    );
  if (t === "ring")
    return (
      <svg viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r="24"
          fill="none"
          stroke="#fbc112"
          strokeWidth="7"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 10v44M10 32h44"
        stroke="#121110"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const justPaid = useSearchParams().get("success") === "1";
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (status === "unauthenticated")
      router.replace(
        `/login?callbackUrl=${encodeURIComponent(`/orders/${id}`)}`
      );
  }, [status, router, id]);

  useEffect(() => {
    if (!token) return;
    let stop = false;
    let tries = 0;
    const load = async () => {
      try {
        const o = await getOrder(token, id);
        if (stop) return;
        setOrder(o);
        if (o.status === "pending" && justPaid && ++tries < MAX_POLLS)
          setTimeout(load, POLL_MS);
      } catch (e: any) {
        if (!stop) setError(e.message || "Could not load order");
      }
    };
    load();
    return () => {
      stop = true;
    };
  }, [token, id, justPaid]);

  // ---- animations ----
  useIso(() => {
    const el = root.current;
    if (!order || !el) return;
    let off = () => {};

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (order.status === "paid") {
        const disc = el.querySelector<HTMLElement>(".or-disc")!;
        const path = el.querySelector<SVGPathElement>(".or-check path")!;
        const len = path.getTotalLength();

        tl.from(".or-badge", { y: -14, opacity: 0, duration: 0.4 })
          .from(
            ".or-disc",
            { scale: 0, duration: 0.7, ease: "back.out(1.8)" },
            "<0.1"
          )
          .fromTo(
            ".or-ring",
            { scale: 0.6, opacity: 0.7 },
            {
              scale: 2.6,
              opacity: 0,
              duration: 1.5,
              stagger: 0.18,
              ease: "power2.out",
            },
            "<0.3"
          )
          .fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
            "-=1.1"
          )
          .add(() => {
            if (justPaid) burst(disc);
          }, "-=0.2")
          .from(
            ".or-w > span",
            { yPercent: 115, duration: 0.8, stagger: 0.09 },
            "-=0.3"
          )
          .from(
            ".or-sub, .or-meta",
            { y: 18, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.45"
          )
          .from(
            ".or-step",
            { y: 24, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.3"
          )
          .from(
            ".or-fill",
            { scaleX: 0, transformOrigin: "left center", duration: 0.9 },
            "<0.2"
          )
          .from(
            ".or-card",
            { y: 44, opacity: 0, duration: 0.6, stagger: 0.12 },
            "-=0.6"
          )
          .add(() => {
            const n = { v: 0 };
            const t = totalRef.current;
            if (t) t.textContent = inr(0);
            gsap.to(n, {
              v: order.total,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                if (t) t.textContent = inr(Math.round(n.v));
              },
              onComplete: () => {
                if (t) t.textContent = inr(order.total);
              },
            });
          }, "<0.15")
          .from(
            ".or-item",
            { x: -24, opacity: 0, duration: 0.4, stagger: 0.08 },
            "-=0.4"
          )
          .from(".or-thanks", { y: 30, opacity: 0, duration: 0.6 }, "-=0.2");

        gsap.to(".or-step.now .or-dot", {
          scale: 1.25,
          repeat: -1,
          yoyo: true,
          duration: 0.8,
          ease: "sine.inOut",
        });

        const R = gsap.utils.random;

        gsap.from(".or-glow", { opacity: 0, duration: 1.6, stagger: 0.2 });
        gsap.to(".or-glow", {
          x: () => R(-120, 120),
          y: () => R(-90, 90),
          scale: () => R(0.85, 1.3),
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.8,
        });

        gsap.utils.toArray<HTMLElement>(".or-shape").forEach((s, i) => {
          gsap.from(s.firstElementChild, {
            scale: 0,
            opacity: 0,
            rotation: R(-90, 90),
            duration: 0.9,
            delay: 0.5 + i * 0.09,
            ease: "back.out(2)",
          });
          gsap.to(s, {
            y: R(-34, 34),
            x: R(-18, 18),
            rotation: R(-28, 28),
            duration: R(3, 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: R(0, 1.5),
          });
        });

        gsap.utils.toArray<HTMLElement>(".or-ember").forEach((e) => {
          gsap.set(e, { left: `${R(0, 100)}%`, scale: R(0.5, 1.7) });
          gsap.fromTo(
            e,
            { y: 0 },
            {
              y: -R(500, 1000),
              x: R(-70, 70),
              duration: R(6, 11),
              repeat: -1,
              delay: R(0, 6),
              ease: "none",
            }
          );
          gsap.fromTo(
            e,
            { opacity: 0 },
            {
              opacity: 0.9,
              duration: R(1.5, 3),
              repeat: -1,
              yoyo: true,
              delay: R(0, 3),
              ease: "sine.inOut",
            }
          );
        });

        // mouse parallax
        const movers = gsap.utils.toArray<HTMLElement>(".or-par").map((p) => ({
          x: gsap.quickTo(p, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(p, "y", { duration: 0.9, ease: "power3.out" }),
          d: Number(p.dataset.d),
        }));
        const onMove = (e: MouseEvent) => {
          const cx = e.clientX - window.innerWidth / 2;
          const cy = e.clientY - window.innerHeight / 2;
          movers.forEach((m) => {
            m.x(cx * m.d);
            m.y(cy * m.d);
          });
        };
        window.addEventListener("mousemove", onMove);
        off = () => window.removeEventListener("mousemove", onMove);
      } else {
        tl.from(".or-badge", { y: -10, opacity: 0, duration: 0.3 })
          .from(
            ".or-w > span",
            { yPercent: 115, duration: 0.6, stagger: 0.07 },
            "<"
          )
          .from(
            ".or-sub, .or-meta",
            { y: 14, opacity: 0, duration: 0.4, stagger: 0.08 },
            "-=0.3"
          )
          .from(
            ".or-card",
            { y: 30, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.3"
          );
      }
    }, el);

    return () => {
      off();
      ctx.revert();
    };
  }, [order?._id, order?.status, justPaid, id]);

  if (error)
    return (
      <main className="or">
        <p className="or-error">{error}</p>
      </main>
    );
  if (!order)
    return (
      <main className="or">
        <p className="or-muted">Loading…</p>
      </main>
    );

  const paid = order.status === "paid";
  const confirming = order.status === "pending" && justPaid;
  const title = paid
    ? "Awesome choice, genius."
    : confirming
    ? "Confirming your payment…"
    : order.status === "failed"
    ? "Payment failed"
    : "Order details";
  const sub = paid
    ? "Your order is locked in. Our printers are already warming up and your pieces are about to take shape, layer by layer."
    : confirming
    ? "Hang tight, this takes just a few seconds. Please don't close this page."
    : order.status === "failed"
    ? "No money was taken. You can head back to your cart and try again."
    : "";
  const words = title.split(" ");

  return (
    <div className="or-page" ref={root}>
      {paid && (
        <div className="or-bg" aria-hidden>
          <div className="or-dots" />
          <span className="or-glow g1" />
          <span className="or-glow g2" />
          <span className="or-glow g3" />
          <div className="or-scan" />
          {SHAPES.map((s, i) => (
            <div
              key={i}
              className="or-par"
              data-d={s.d}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s }}
            >
              <div className="or-shape">
                <Shape t={s.t} />
              </div>
            </div>
          ))}
          {EMBERS.map((i) => (
            <i key={i} className="or-ember" />
          ))}
        </div>
      )}

      <main className="or">
        <header className="or-hero">
          {paid && (
            <div className="or-seal" aria-hidden>
              <span className="or-ring" />
              <span className="or-ring" />
              <span className="or-ring" />
              <div className="or-disc">
                <svg className="or-check" viewBox="0 0 52 52" fill="none">
                  <path
                    d="M14 27l8 8 16-18"
                    stroke="#121110"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
          {confirming && <div className="or-spin" aria-hidden />}

          <span className={`or-badge ${order.status}`}>
            {paid
              ? "Payment successful"
              : confirming
              ? "confirming payment"
              : order.status}
          </span>

          <h1 className="or-title">
            {words.map((w, i) => (
              <span key={i}>
                <span
                  className={`or-w ${
                    paid && i === words.length - 1 ? "or-hl" : ""
                  }`}
                >
                  <span>{w}</span>
                </span>{" "}
              </span>
            ))}
          </h1>

          {sub && <p className="or-sub">{sub}</p>}
          <p className="or-mono or-meta">
            Order #{order._id.slice(-8).toUpperCase()} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </header>

        {paid && (
          <section className="or-steps" aria-label="Order progress">
            <div className="or-track">
              <div className="or-fill" />
            </div>
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`or-step ${i === 0 ? "done" : i === 1 ? "now" : ""}`}
              >
                <span className="or-dot">{i === 0 ? "✓" : i + 1}</span>
                <span className="or-mono">{s}</span>
              </div>
            ))}
          </section>
        )}

        <div className="or-grid">
          <section className="or-card">
            <h2>Items</h2>
            {order.items.map((i, k) => (
              <div className="or-item" key={k}>
                {i.image ? (
                  <img src={i.image} alt={i.title} />
                ) : (
                  <div className="or-swatch" style={{ color: i.custom?.color }}>
                    Aa
                  </div>
                )}
                <div>
                  <p>{i.title}</p>
                  <span className="or-mono">Qty {i.quantity}</span>
                </div>
                <strong>{inr(i.price * i.quantity)}</strong>
              </div>
            ))}
            <div className="or-row">
              <span>Subtotal</span>
              <span>{inr(order.subtotal)}</span>
            </div>
            <div className="or-row">
              <span>Shipping</span>
              <span>{order.shipping ? inr(order.shipping) : "Free"}</span>
            </div>
            <div className="or-total">
              <span>Total</span>
              <span ref={totalRef}>{inr(order.total)}</span>
            </div>
          </section>

          <aside className="or-card">
            <h2>Delivery address</h2>
            <p>
              <strong>{order.address.name}</strong>
            </p>
            <p className="or-muted">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
              {order.address.city}, {order.address.state} –{" "}
              {order.address.pincode}
            </p>
            <p className="or-mono">{order.address.phone}</p>
            {order.razorpayPaymentId && (
              <>
                <h2 style={{ marginTop: 24 }}>Payment</h2>
                <p className="or-mono">{order.razorpayPaymentId}</p>
              </>
            )}
            {!paid && !confirming && (
              <Link href="/cart" className="or-btn">
                Back to cart
              </Link>
            )}
          </aside>
        </div>

        {paid && (
          <section className="or-thanks">
            <span className="or-mono">Thank you for shopping with us</span>
            <h2>Visit again, we'll have more cool stuff waiting.</h2>
            <div className="or-actions">
              <Link href="/products" className="or-btn">
                Continue shopping
              </Link>
              <Link href="/" className="or-btn ghost">
                Back to home
              </Link>
            </div>
          </section>
        )}
      </main>

      {paid && (
        <div className="or-marquee" aria-hidden>
          <div>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                ORDER CONFIRMED ✦ MADE LAYER BY LAYER ✦ MAKE IT PRINT ✦ BUILT
                FOR YOU ✦ AWESOME CHOICE ✦{" "}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
