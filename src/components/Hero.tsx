"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { IconArrow, IconCheck } from "@/components/icons";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Set initial states BEFORE the browser paints.
      gsap.set(
        [
          ".hero__glow",
          ".eyebrow--pill",
          ".hero__title",
          ".hero__sub",
          ".hero__ctas",
          ".hero__badges",
          ".hero__block--a",
          ".hero__block--b",
          ".hero__block--c",
        ],
        {
          opacity: 0,
        }
      );

      gsap.set(
        [
          ".eyebrow--pill",
          ".hero__title",
          ".hero__sub",
          ".hero__ctas",
          ".hero__badges",
        ],
        {
          y: 12,
        }
      );

      gsap.set(".hero__block--a", {
        y: 10,
        scale: 0.97,
      });

      gsap.set(".hero__block--b", {
        y: 10,
        scale: 0.97,
      });

      gsap.set(".hero__block--c", {
        y: 10,
        scale: 0.97,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(".hero__glow", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
      })
        .to(
          ".eyebrow--pill",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.25"
        )
        .to(
          ".hero__title",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.25"
        )
        .to(
          ".hero__sub",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.3"
        )
        .to(
          ".hero__ctas",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
          "-=0.25"
        )
        .to(
          ".hero__badges",
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
          },
          "-=0.25"
        )
        .to(
          [".hero__block--a", ".hero__block--b", ".hero__block--c"],
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.08,
          },
          "-=0.35"
        );

      // Infinite floating animation after entrance.
      gsap.to(".hero__block--a", {
        y: -14,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });

      gsap.to(".hero__block--b", {
        y: -12,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });

      gsap.to(".hero__block--c", {
        y: -10,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.9,
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
              From Blueprint to Physical Product
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

          {/* <div className="hero__block hero__block--c">
            <span>CAD · v2.4</span>
            <span>SN-27</span>
          </div> */}
        </div>
      </div>
    </section>
  );
}
