"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/scrollReveal";
import { IconArrow } from "@/components/icons";

const STATS = [
  { value: 500, decimals: 0, suffix: "+", label: "Projects Delivered" },
  { value: 0.05, decimals: 2, suffix: "mm", label: "Print Precision" },
  { value: 48, decimals: 0, suffix: "h", label: "Avg. Turnaround" },
  { value: 12, decimals: 0, suffix: "+", label: "Materials Supported" },
];

export default function Modules() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(root.current, ".reveal", { trigger: root.current });

      const nums = root.current.querySelectorAll(".stat__num");
      nums.forEach((el) => {
        const target = parseFloat(el.dataset.value);
        const decimals = parseInt(el.dataset.decimals, 10);
        const suffix = el.dataset.suffix || "";
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = counter.val.toFixed(decimals) + suffix;
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" ref={root} style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <div className="modules__cta reveal">
          <div>
            <span className="eyebrow">Custom Modules</span>
            <h2 className="section__title" style={{ marginBottom: 0 }}>
              Precision parts built to last a lifetime
            </h2>
          </div>
          <a href="#work" className="btn btn--outline">
            Browse Portfolio <IconArrow />
          </a>
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div className="stat reveal" key={s.label}>
              <span
                className="stat__num"
                data-value={s.value}
                data-decimals={s.decimals}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </span>
              <p className="stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
