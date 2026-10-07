"use client";

import { useRef, useEffect, Fragment } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES, COMPANY, INDIVIDUAL } from "./data";
import "./ServiceDetail.css";

gsap.registerPlugin(ScrollTrigger);

const Split = ({ text }) => (
  <>
    {text.split(" ").map((w, wi, a) => (
      <Fragment key={wi}>
        <span className="sd-word">
          {[...w].map((c, i) => (
            <span className="sd-mask" key={i}>
              <span className="ch">{c}</span>
            </span>
          ))}
        </span>
        {wi < a.length - 1 && " "}
      </Fragment>
    ))}
  </>
);

const List = ({ items }) => (
  <ul className="sd-list">
    {items.map((t, i) => (
      <li key={t} className="sd-point">
        <span className="sd-badge">{String(i + 1).padStart(2, "0")}</span>
        <span className="sd-txt">{t}</span>
        <span className="sd-curtain" />
      </li>
    ))}
  </ul>
);

export default function ServiceDetail({ slug }) {
  const root = useRef(null);
  const s = SERVICES[slug];

  useEffect(() => {
    const ac = new AbortController();

    const ctx = gsap.context(() => {
      /* hero */
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .fromTo(
          ".sd-tabs",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }
        )
        .fromTo(
          ".sd-hero .sd-mono",
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "-=.3"
        )
        .fromTo(
          ".sd-hero .ch",
          { yPercent: 120, rotate: 8, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1, stagger: 0.03 },
          "-=.3"
        )
        .fromTo(
          ".sd-hero p",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=.6"
        );

      /* cards */
      gsap.utils.toArray(".sd-card").forEach((card, ci) => {
        const q = gsap.utils.selector(card);
        const tiles = q(".sd-point");
        const rest = ci % 2 ? 1.5 : -1.5;

        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
            defaults: { ease: "power3.out" },
          })
          .fromTo(
            card,
            { y: 60, opacity: 0, rotation: rest },
            { y: 0, opacity: 1, rotation: 0, duration: 0.9 }
          )
          .fromTo(
            q("h2 .ch"),
            { yPercent: 120, rotate: 8, opacity: 0 },
            {
              yPercent: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.025,
            },
            "-=.6"
          )
          // tiles fly in from alternating sides
          .fromTo(
            tiles,
            {
              opacity: 0,
              x: (i) => (i % 2 ? 60 : -60),
              rotation: (i) => (i % 2 ? 2 : -2),
            },
            { opacity: 1, x: 0, rotation: 0, duration: 0.7, stagger: 0.08 },
            "-=.4"
          )
          // curtain sweeps in, text appears behind it, curtain sweeps out
          .fromTo(
            q(".sd-curtain"),
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.35, stagger: 0.08, ease: "power3.inOut" },
            "<"
          )
          .fromTo(
            q(".sd-txt"),
            { opacity: 0 },
            { opacity: 1, duration: 0.01, stagger: 0.08 },
            "<+=.35"
          )
          .to(
            q(".sd-curtain"),
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.45,
              stagger: 0.08,
              ease: "power3.inOut",
            },
            "<"
          )
          // badges pop with a spin
          .fromTo(
            q(".sd-badge"),
            { scale: 0, rotate: -90, opacity: 0 },
            {
              scale: 1,
              rotate: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(2.4)",
            },
            "<"
          );

        // cursor glare on tiles
        tiles.forEach((t) =>
          t.addEventListener(
            "pointermove",
            (e) => {
              const r = t.getBoundingClientRect();
              t.style.setProperty("--mx", `${e.clientX - r.left}px`);
              t.style.setProperty("--my", `${e.clientY - r.top}px`);
            },
            { signal: ac.signal }
          )
        );
      });

      /* cta */
      gsap.fromTo(
        ".sd-cta",
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sd-cta", start: "top 92%", once: true },
        }
      );
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      clearTimeout(t);
      ac.abort();
      ctx.revert();
    };
  }, [slug]);

  return (
    <main className="sd" ref={root}>
      <div className="sd-wrap">
        <nav className="sd-tabs">
          {Object.entries(SERVICES).map(([k, v]) => (
            <Link
              key={k}
              href={`/service/${k}`}
              replace
              className={k === slug ? "on" : ""}
            >
              {v.short}
            </Link>
          ))}
        </nav>

        <header className="sd-hero">
          <span className="sd-mono">
            {s.n} · {s.tag}
          </span>
          <h1>
            <Split text={s.title} />
          </h1>
          <p>{s.lead}</p>
        </header>

        <section className="sd-card">
          <span className="sd-mono">What we offer</span>
          <h2>
            <Split text={s.title} />
          </h2>
          <List items={s.items} />
        </section>

        <div className="sd-two">
          <section className="sd-card">
            <span className="sd-mono">Business</span>
            <h2>
              <Split text="For Companies" />
            </h2>
            <List items={COMPANY} />
          </section>
          <section className="sd-card">
            <span className="sd-mono">Personal</span>
            <h2>
              <Split text="For Individual Customers" />
            </h2>
            <List items={INDIVIDUAL} />
          </section>
        </div>

        <div className="sd-cta">
          <div>
            <h3>Have a part or idea in mind?</h3>
            <p>Share your file or sketch and we'll take it from there.</p>
          </div>
          <Link href="/#contact" className="sd-btn">
            Get a Quote
          </Link>
        </div>
      </div>
    </main>
  );
}
