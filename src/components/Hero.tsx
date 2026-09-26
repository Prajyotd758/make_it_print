"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { IconArrow, IconCheck } from "@/components/icons";

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero__glow", { opacity: 0, scale: 0.7, duration: 1.4 })
        .from(".eyebrow--pill", { autoAlpha: 0, y: 10, duration: 0.6 }, "-=1")
        .from(
          ".hero__title .line span",
          { yPercent: 110, duration: 0.9, stagger: 0.12 },
          "-=0.35"
        )
        .to(
          ".hl-mark",
          { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
          "-=0.3"
        )
        .from(".hero__sub", { autoAlpha: 0, y: 16, duration: 0.7 }, "-=0.55")
        .from(
          ".hero__ctas .btn",
          { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.1 },
          "-=0.45"
        )
        .from(
          ".hero__badges span",
          { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08 },
          "-=0.4"
        )
        .from(
          [".hero__block--a", ".hero__block--b", ".hero__block--c"],
          { autoAlpha: 0, y: 10, scale: 0.94, duration: 0.9, stagger: 0.12 },
          "-=0.8"
        )
        .from(".hero__tag", { autoAlpha: 0, duration: 0.6 }, "-=0.3");

      // gentle infinite float once everything has landed
      gsap.to(".hero__block--a", {
        y: -14,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.4,
      });
      gsap.to(".hero__block--b", {
        y: 12,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.4,
      });
      gsap.to(".hero__block--c", {
        y: -10,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.6,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__glow" aria-hidden="true" />

      <div className="wrap hero__wrap">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--pill">
            Precision 3D Studio · Chh. Sambhajinagar, India
          </span>

          <h1 className="hero__title">
            <span className="testing">
              From Blueprint to Physical Precision
            </span>
          </h1>

          <p className="hero__sub">
            We turn technical concepts and creative ideas into tangible reality
            — through precision 3D printing, expert CAD drafting, and
            fine-resolution miniature fabrication.
          </p>

          <div className="hero__ctas">
            <a href="#services" className="btn btn--solid">
              Explore Services <IconArrow />
            </a>
            <a href="#contact" className="btn btn--outline">
              Request Custom Project <IconArrow />
            </a>
          </div>

          <div className="hero__badges">
            <span>
              <IconCheck /> GST Registered
            </span>
            <span>
              <IconCheck /> UDYAM Certified
            </span>
            <span>
              <IconCheck /> Global Shipping
            </span>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="hero__block hero__block--a">
            <img src="/printer3.jpeg" alt="" className="hero__block-img" />
          </div>
          <div className="hero__block hero__block--b dots" />
          <div className="hero__block hero__block--c">
            <span>CAD · v2.4</span>
            <span>SN-27</span>
          </div>
        </div>
      </div>
    </section>
  );
}
