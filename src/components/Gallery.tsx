"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/scrollReveal";
import { IconArrow } from "@/components/icons";

const ITEMS = [
  {
    title: "Elephant Model",
    meta: "FDM · PLA",
    dark: false,
    img: "/elephant_mode.webp",
  },
  { title: "Gojo Figure", meta: "FDM · PLA", dark: true, img: "/gojo.png" },
  { title: "Decorative Pot", meta: "FDM · PLA", dark: false, img: "/pot.webp" },
  { title: "Prop Gun", meta: "FDM · PETG", dark: true, img: "/gun.webp" },
  {
    title: "Batman Mask",
    meta: "FDM · PETG",
    dark: false,
    img: "/batman_mask.webp",
  },
  {
    title: "Spider-Man Figure",
    meta: "FDM · PLA",
    dark: true,
    img: "/spder-man-black.webp",
  },
];

export default function Gallery() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(root.current, ".work-card", {
        trigger: root.current,
        stagger: 0.08,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="work" ref={root}>
      <div className="wrap">
        <div className="section__head">
          <div>
            <span className="eyebrow">Our Work</span>
            <h2 className="section__title">
              Selected projects &amp; showpieces
            </h2>
          </div>
          <p className="section__desc">
            A glimpse into the models, miniatures and modules we&apos;ve
            delivered for clients.
          </p>
        </div>

        <div className="work__grid">
          {ITEMS.map((item, i) => (
            <div
              className={`work-card reveal ${
                item.dark ? "work-card--dark" : ""
              }`}
              key={item.title}
            >
              <img src={item.img} alt={item.title} className="work-card__img" />
              <div className="work-card__overlay" />
              <span className="work-card__badge mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="work-card__foot">
                <span className="work-card__meta">
                  {item.title}
                  <small>{item.meta}</small>
                </span>
                <span className="work-card__arrow">
                  <IconArrow />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
