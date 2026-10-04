"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import "./dripftingBg.css";

type Props = { children?: ReactNode; count?: number; multi?: boolean };

export default function DriftingBackground({
  children,
  count = 24,
  multi = false,
}: Props) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = layer.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    const rand = gsap.utils.random;

    const balls = (Array.from(el.children) as HTMLElement[]).map((n) => {
      const r = rand(20, Math.min(180, h * 0.3));
      const a = rand(0, Math.PI * 2);
      const base = rand(30, 80); // px per second
      n.style.width = n.style.height = `${r * 2}px`;
      n.style.opacity = String(rand(0.7, 0.9));
      return {
        n,
        r,
        base,
        hit: false,
        x: rand(r, w - r),
        y: rand(r, h - r),
        vx: Math.cos(a) * base,
        vy: Math.sin(a) * base,
      };
    });

    const draw = () =>
      balls.forEach((b) => {
        b.n.style.transform = `translate3d(${b.x - b.r}px,${b.y - b.r}px,0)`;
      });
    draw();

    let mx = -1e9,
      my = -1e9;
    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const leave = () => {
      mx = my = -1e9;
    };
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);

    const KICK = 520; // px per second, hover bounce strength

    const tick = (_t: number, dt: number) => {
      const s = Math.min(dt, 50) / 1000;

      for (const b of balls) {
        // hover bounce: kick away from the cursor once on entry
        const dx = b.x - mx,
          dy = b.y - my;
        const d = Math.hypot(dx, dy);
        if (d < b.r) {
          if (!b.hit) {
            b.hit = true;
            const nx = d ? dx / d : 1,
              ny = d ? dy / d : 0;
            b.vx = nx * KICK;
            b.vy = ny * KICK;
          }
        } else b.hit = false;

        // ease speed back down to the base drift speed
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > b.base) {
          const k = Math.max(b.base / sp, 1 - 2 * s);
          b.vx *= k;
          b.vy *= k;
        }

        b.x += b.vx * s;
        b.y += b.vy * s;
        if (b.x < b.r) {
          b.x = b.r;
          b.vx = Math.abs(b.vx);
        } else if (b.x > w - b.r) {
          b.x = w - b.r;
          b.vx = -Math.abs(b.vx);
        }
        if (b.y < b.r) {
          b.y = b.r;
          b.vy = Math.abs(b.vy);
        } else if (b.y > h - b.r) {
          b.y = h - b.r;
          b.vy = -Math.abs(b.vy);
        }
      }
      draw();
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div
        ref={layer}
        className="drift-bg"
        data-multi={multi}
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="drift-circle" />
        ))}
      </div>
      {children}
    </>
  );
}
