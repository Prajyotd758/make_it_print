"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/scrollReveal";
import Link from "next/link";
import {
  IconArrow,
  IconCube,
  IconDraft,
  IconGem,
  IconToy,
} from "@/components/landingPageComponents/icons";

const SERVICES = [
  {
    icon: IconCube,
    title: "3D Printing",
    text: "High-resolution FDM plastic printing for functional prototypes, custom replacement parts, and low-volume production.",
    tags: "FDM · Resin · PLA · PETG",
  },
  {
    icon: IconDraft,
    title: "Engineering Drawings",
    text: "Professional 2D blueprints and technical 3D CAD modeling. Turning sketches into manufacturing-ready schematics.",
    tags: "CAD · Blueprints · STEP/IGES",
  },
  {
    icon: IconGem,
    title: "Miniature Items",
    text: "Ultra-detailed tabletop figures, micro architectural scale models, and dioramas crafted with microscopic resin detail.",
    tags: "Tabletop · Dioramas · Scale",
  },
  {
    icon: IconToy,
    title: "Custom Toys",
    text: "Articulated action figures, modular puzzles, and vibrant bespoke toys engineered with durable, bio-safe materials.",
    tags: "Articulated · Bio-safe · Modular",
  },
];

export default function Services() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(root.current, ".service-card", {
        trigger: root.current,
        stagger: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" id="services" ref={root}>
      <div className="wrap">
        <div className="section__head">
          <div>
            <span className="eyebrow">Fabrication &amp; Design</span>
            <h2 className="section__title">
              Everything you need to make it real
            </h2>
          </div>
          <p className="section__desc">
            Four core capabilities, one obsessive standard: precision. From
            one-off prototypes to intricate miniatures.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div className="service-card reveal" key={s.title}>
                <div className="service-card__top">
                  <span className="service-card__icon">
                    <Icon />
                  </span>
                  <span className="service-card__arrow">
                    {s.title === "3D Printing" ||
                    s.title === "Engineering Drawings" ? (
                      <Link
                        href={`/service/${
                          s.title === "3D Printing"
                            ? "3d-printing"
                            : "engineering-drawings"
                        } `}
                      >
                        <IconArrow />
                      </Link>
                    ) : (
                      <IconArrow />
                    )}
                  </span>
                </div>
                <span className="service-card__index mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__text">{s.text}</p>
                <span className="service-card__tags">{s.tags}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
