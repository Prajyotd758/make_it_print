"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/scrollReveal";

const GROUPS = [
  {
    title: "Architects & Engineers",
    text: "From concept mock-ups to precision prototypes for firms across the globe.",
  },
  {
    title: "Makers & Creators",
    text: "Minimalist desk goods, organizers, and functional lifestyle prints.",
  },
  {
    title: "Families & Collectors",
    text: "Colorful modular toys and heirloom-quality collectibles built to last.",
  },
];

export default function Customers() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(root.current, ".customer", {
        trigger: root.current,
        stagger: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="customers" ref={root}>
      <div className="wrap">
        <div className="section__head">
          <div>
            <span className="eyebrow">Our Customers</span>
            <h2 className="section__title">
              Trusted by makers, architects &amp; families
            </h2>
          </div>
        </div>

        <div className="customers__grid">
          {GROUPS.map((g) => (
            <div className="customer reveal" key={g.title}>
              <h3 className="customer__title">{g.title}</h3>
              <p className="customer__text">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
