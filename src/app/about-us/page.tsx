"use client";

import { Fragment, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriftingBackground from "@/components/DriftingBackground"; // adjust to your component
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

type Links = {
  instagram: string;
  linkedin: string;
  facebook: string;
  x: string;
};
type Founder = {
  name: string;
  role: string;
  color: string; // placeholder until real photo
  image?: string;
  intro: string;
  links: Links;
};

const FOUNDERS: Founder[] = [
  {
    name: "Prasad",
    role: "Founder",
    color: "#f2b27a",
    intro: "Hi, I’m the person behind Make It Print.",
    image:
      "https://cdn.vanguardngr.com/wp-content/uploads/2024/11/elon-musk-fighter.jpg",
    links: { instagram: "#", linkedin: "#", facebook: "#", x: "#" }, // TODO
  },
  {
    name: "Elon Musk",
    role: "Co-founder",
    color: "#8fc1c9",
    intro: "Placeholder. Replace with the second founder’s intro.",
    image:
      "https://cdn.vanguardngr.com/wp-content/uploads/2024/11/elon-musk-fighter.jpg",
    links: { instagram: "#", linkedin: "#", facebook: "#", x: "#" }, // TODO
  },
];

const CHAPTERS = [
  {
    t: "The curiosity",
    p: "I’ve been exploring 3D printing and making things for the past **8–9 years**. My journey started with a curiosity for **CNC machines, 2D printers, plotters, and mechanical systems**.",
  },
  {
    t: "The experience",
    p: "Over the years, I’ve worked on projects across **mechanical, electronics, computer, and mechatronics**.",
  },
  {
    t: "The problem",
    p: "While working on these projects, I often faced one common problem—**the part I needed simply wasn’t available in the market**. Getting custom parts machined could be expensive and time-consuming, especially for small quantities.",
  },
  {
    t: "The discovery",
    p: "That’s when I discovered the possibilities of **3D printing** and started exploring it seriously. What began as a hobby slowly became my passion and eventually turned into **Make It Print**.",
  },
  {
    t: "Today",
    p: "Today, I use my experience in **design, engineering, prototyping, and 3D printing** to solve real-world problems. For me, it’s not just about printing a part—it’s about **finding a practical way to make an idea possible**.",
  },
];

const SKILLS = [
  "CNC",
  "3D Printing",
  "Plotters",
  "Mechanical",
  "Electronics",
  "Mechatronics",
  "Prototyping",
  "Design",
];

const bold = (s: string): ReactNode =>
  s
    .split("**")
    .map((t, i) =>
      i % 2 ? <b key={i}>{t}</b> : <Fragment key={i}>{t}</Fragment>
    );

const Split = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((w, wi, a) => (
      <Fragment key={wi}>
        <span className="ab-word">
          {[...w].map((c, i) => (
            <span className="ab-mask" key={i}>
              <span className="ch">{c}</span>
            </span>
          ))}
        </span>
        {wi < a.length - 1 && " "}
      </Fragment>
    ))}
  </>
);

const Ico = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);
const ICONS: Record<keyof Links, ReactNode> = {
  instagram: (
    <Ico>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </Ico>
  ),
  linkedin: (
    <Ico>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-6M12 12.5c0-1.5 1-2.5 2.5-2.5S17 11 17 12.5V16" />
    </Ico>
  ),
  facebook: (
    <Ico>
      <path d="M14 8h2V4h-2.5C11 4 10 5.5 10 7.5V10H8v4h2v6h4v-6h2l.5-4H14V8.5c0-.3.2-.5.5-.5z" />
    </Ico>
  ),
  x: (
    <Ico>
      <path d="M4 4l16 16M20 4L4 20" />
    </Ico>
  ),
};
const LABEL: Record<keyof Links, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  x: "X",
};

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const $ = gsap.utils.toArray as <T extends Element>(s: string) => T[];

      /* hero */
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".ab-hero .ab-eyebrow", { opacity: 0, x: -24, duration: 0.5 })
        .from(
          ".ab-hero .ch",
          { yPercent: 120, rotate: 8, duration: 1, stagger: 0.025 },
          "-=.2"
        )
        .from(".ab-hero p", { opacity: 0, y: 20, duration: 0.7 }, "-=.6")
        .from(
          ".ab-marquee",
          { opacity: 0, y: 40, scaleX: 0.9, duration: 0.9 },
          "-=.5"
        );

      /* marquee */
      gsap.to(".ab-track", {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      /* founder cards */
      $<HTMLElement>(".ab-card").forEach((card, i) => {
        const q = gsap.utils.selector(card);
        gsap.set(q(".ab-photo-in"), { autoAlpha: 0 });
        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 82%" },
            defaults: { ease: "power3.out" },
          })
          .from(card, {
            y: 100,
            opacity: 0,
            rotateX: -18,
            transformPerspective: 900,
            duration: 1,
            delay: i * 0.12,
          })
          .fromTo(
            q(".ab-curtain"),
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
            "-=.5"
          )
          .set(q(".ab-photo-in"), { autoAlpha: 1 })
          .fromTo(
            q(".ab-photo-in"),
            { scale: 1.35 },
            { scale: 1, duration: 1.4 },
            "<"
          )
          .to(
            q(".ab-curtain"),
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.6,
              ease: "power3.inOut",
            },
            "<"
          )
          .from(
            q(".ab-badge"),
            { scale: 0, rotate: -60, duration: 0.7, ease: "back.out(2.4)" },
            "-=.6"
          )
          .from(
            q(".ab-name .ch"),
            {
              yPercent: 120,
              rotate: 10,
              duration: 0.9,
              stagger: 0.04,
              ease: "power4.out",
            },
            "-=.9"
          )
          .from(
            q(".ab-role, .ab-intro"),
            { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 },
            "-=.5"
          )
          .from(
            q(".ab-social a"),
            { scale: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2.6)" },
            "-=.3"
          );

        /* 3D tilt + glare */
        const tilt = card.querySelector<HTMLElement>(".ab-tilt")!;
        const rx = gsap.quickTo(tilt, "rotationX", {
          duration: 0.4,
          ease: "power3",
        });
        const ry = gsap.quickTo(tilt, "rotationY", {
          duration: 0.4,
          ease: "power3",
        });
        gsap.set(tilt, { transformPerspective: 900 });
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          ry((x - 0.5) * 14);
          rx(-(y - 0.5) * 14);
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        });
        card.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
        });
      });

      /* magnetic social buttons */
      $<HTMLElement>(".ab-social a").forEach((a) => {
        a.addEventListener("pointermove", (e) => {
          const r = a.getBoundingClientRect();
          gsap.to(a, {
            x: (e.clientX - r.left - r.width / 2) * 0.4,
            y: (e.clientY - r.top - r.height / 2) * 0.4,
            duration: 0.3,
          });
        });
        a.addEventListener("pointerleave", () =>
          gsap.to(a, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,.4)" })
        );
      });

      /* stats */
      $<HTMLElement>(".ab-stat").forEach((s, i) => {
        gsap.from(s, {
          y: 60,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          delay: i * 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: s, start: "top 88%" },
        });
        const n = s.querySelector<HTMLElement>("[data-count]");
        if (n) {
          const o = { v: 0 };
          gsap.to(o, {
            v: Number(n.dataset.count),
            duration: 1.6,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => (n.textContent = String(o.v)),
            scrollTrigger: { trigger: s, start: "top 88%" },
          });
        }
      });

      /* story timeline */
      gsap.fromTo(
        ".ab-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".ab-story",
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
      $<HTMLElement>(".ab-chapter").forEach((c, i) => {
        gsap.from(c, {
          x: i % 2 ? 90 : -90,
          opacity: 0,
          rotate: i % 2 ? 2 : -2,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: c, start: "top 85%" },
        });
        gsap.from(c.querySelector(".ab-num"), {
          scale: 0,
          rotate: -90,
          duration: 0.7,
          ease: "back.out(2.4)",
          scrollTrigger: { trigger: c, start: "top 85%" },
        });
      });
      gsap.from(".ab-cta", {
        y: 70,
        opacity: 0,
        scale: 0.94,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-cta", start: "top 90%" },
      });
    }, root);

    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <div className="ab" ref={root}>
      <div className="ab-fixed" aria-hidden>
        <DriftingBackground />
      </div>

      <main className="ab-content">
        <header className="ab-hero">
          <span className="ab-eyebrow">About us</span>
          <h1>
            <Split text="The people behind Make It Print" />
          </h1>
          <p>
            Makers, engineers and problem solvers turning ideas into real,
            printable parts.
          </p>
        </header>
      </main>

      {/* <div className="ab-marquee" aria-hidden>
        <div className="ab-track">
          {[...SKILLS, ...SKILLS, ...SKILLS, ...SKILLS].map((s, i) => (
            <span key={i}>
              {s}
              <i />
            </span>
          ))}
        </div>
      </div> */}

      <section className="ab-content">
        <div className="ab-cards">
          {FOUNDERS.map((f, i) => (
            <article key={f.name} className="ab-card">
              <div className="ab-tilt">
                <div className="ab-photo">
                  <div className="ab-photo-in" style={{ background: f.color }}>
                    {f.image && <img src={f.image} alt={f.name} />}
                  </div>
                  <span className="ab-curtain" />
                  <span className="ab-badge">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="ab-body">
                  <span className="ab-role">{f.role}</span>
                  <h2 className="ab-name">
                    <Split text={f.name} />
                  </h2>
                  <p className="ab-intro">{f.intro}</p>
                  <div className="ab-social">
                    {(Object.keys(f.links) as (keyof Links)[]).map((k) => (
                      <a
                        key={k}
                        href={f.links[k]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${f.name} on ${LABEL[k]}`}
                      >
                        {ICONS[k]}
                      </a>
                    ))}
                  </div>
                </div>
                <span className="ab-glare" />
              </div>
            </article>
          ))}
        </div>

        <div className="ab-stats">
          <div className="ab-stat">
            <strong>8–9</strong>
            <span>Years of making</span>
          </div>
          <div className="ab-stat">
            <strong data-count="4">0</strong>
            <span>Engineering fields</span>
          </div>
          <div className="ab-stat">
            <strong>∞</strong>
            <span>Ideas worth printing</span>
          </div>
        </div>

        <div className="ab-story">
          <h2 className="ab-story-title">Prasad’s story</h2>
          <div className="ab-line">
            <i className="ab-line-fill" />
          </div>
          {CHAPTERS.map((c, i) => (
            <div key={c.t} className={`ab-chapter ${i % 2 ? "r" : ""}`}>
              <span className="ab-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.t}</h3>
              <p>{bold(c.p)}</p>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
