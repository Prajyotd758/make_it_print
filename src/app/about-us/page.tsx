"use client";

import { useState, Fragment, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriftingBackground from "@/components/DriftingBackground";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

type Links = {
  instagram: string;
  linkedin: string;
  facebook?: string;
  x?: string;
};
type Founder = {
  name: string;
  role: string;
  tags: string[];
  bio: string;
  color: string; // placeholder until real photo
  image?: string;
  dark?: boolean;
  knowMore?: boolean;
  moreImage?: string;
  links: Links;
};

const FOUNDERS: Founder[] = [
  {
    name: "Prasad",
    role: "Founder",
    tags: ["Maker", "Engineer", "Builder"],
    bio: "I’m Prasad Shilge, Founder of Make It Print. With over 8 years of hands-on experience in 3D printing, mechanical design, electronics, and prototyping, I enjoy turning ideas into practical and innovative solutions.\n My focus is on using 3D printing to solve real-world problems and create functional, reliable, and customized products. From prototypes and custom parts to creative products, I aim to deliver quality solutions that bring ideas to life.",
    color: "#f2b27a",
    image: "/prasad.png",
    dark: true,
    links: {
      instagram: "https://www.instagram.com/prasadshilge?stkn=ZnB0NWxoeGJxZThh",
      linkedin:
        "https://www.linkedin.com/in/prasad-shilge?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      facebook: "https://www.facebook.com/share/1CpCaFUMQ7/",
      // x: "#",
    }, // TODO
  },
  {
    name: "Prajyot",
    role: "CTO",
    tags: ["Tech Visionary", "Innovator", "Builder"],
    bio: "I build software😎.",
    knowMore: true,
    moreImage: "/meme.jpg",
    color: "#8fc1c9",
    image: "/prajyot.jpeg",
    links: {
      instagram: "https://www.instagram.com/prajyot_dange_/",
      linkedin:
        "https://www.linkedin.com/in/prajyot-dange-1a28b423a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    }, // TODO
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
const CHAPTERS1 = [
  {
    t: "The discovery",
    p: "I met prasad for a project, then we started working together.",
  },
  {
    t: "Today",
    p: "Today, I maintain the online infrastructure of **Make It Print**.",
  },
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

function KnowMore({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const img = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next)
      gsap.fromTo(
        img.current,
        {
          opacity: 0,
          y: 16,
          scale: 0.94,
          clipPath: "inset(0 0 100% 0 round 16px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0 0 0% 0 round 16px)",
          duration: 0.7,
          ease: "power3.out",
        }
      );
    setTimeout(() => ScrollTrigger.refresh(), 600); // card height changed
  };

  return (
    <>
      <button
        type="button"
        className="ab-more"
        onClick={toggle}
        aria-expanded={open}
      >
        {open ? "Show less" : "Know more"} <span>→</span>
      </button>
      <div className={`ab-more-wrap ${open ? "open" : ""}`}>
        <div>
          <div className="ab-more-img" ref={img}>
            <img src={src} alt={alt} />
          </div>
        </div>
      </div>
    </>
  );
}

const Ico = ({
  children,
  size = 18,
}: {
  children: ReactNode;
  size?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
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

const VALUES = [
  {
    t: "Bigger Dreams",
    d: "We think long term.",
    i: (
      <Ico size={22}>
        <path d="M5 19c0-3 1.5-4.5 3-5l7-7c2-2 5-2.5 5-2.5s-.5 3-2.5 5l-7 7c-.5 1.5-2 3-5.5 2.5z" />
        <circle cx="15" cy="9" r="1.5" />
      </Ico>
    ),
  },
  {
    t: "Smarter Solutions",
    d: "We build with purpose.",
    i: (
      <Ico size={22}>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
      </Ico>
    ),
  },
  {
    t: "A Brighter Future",
    d: "We create for people.",
    i: (
      <Ico size={22}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5M16 14.5c2.5 0 5 1.5 5 4.5" />
      </Ico>
    ),
  },
];

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const $ = gsap.utils.toArray as <T extends Element>(s: string) => T[];
      const wide = window.innerWidth > 860;

      /* hero */
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".ab-hero .ab-eyebrow", { opacity: 0, x: -24, duration: 0.5 })
        .from(
          ".ab-hero .ch",
          { yPercent: 120, rotate: 8, duration: 1, stagger: 0.03 },
          "-=.2"
        )
        .from(".ab-hero p", { opacity: 0, y: 20, duration: 0.7 }, "-=.6")
        .from(
          ".ab-note",
          { opacity: 0, rotate: -8, y: 20, duration: 0.8 },
          "-=.4"
        )
        .fromTo(
          ".ab-arrow path",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
          "-=.3"
        );

      /* founder cards */
      $<HTMLElement>(".ab-card").forEach((card, i) => {
        const q = gsap.utils.selector(card);
        const rest = wide ? (i % 2 ? 2.5 : -3) : 0;
        gsap.set(card, { rotation: rest });
        gsap.set(q(".ab-photo-in"), { autoAlpha: 0 });
        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 85%" },
            defaults: { ease: "power3.out" },
          })
          .from(card, {
            y: 110,
            opacity: 0,
            rotation: rest + (i % 2 ? 6 : -6),
            transformPerspective: 900,
            duration: 1.1,
            delay: i * 0.15,
          })
          .fromTo(
            q(".ab-curtain"),
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
            "-=.6"
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
            q(".ab-role, .ab-tags, .ab-hr, .ab-intro"),
            { opacity: 0, y: 18, duration: 0.5, stagger: 0.09 },
            "-=.6"
          )
          .from(
            q(".ab-social a"),
            { scale: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2.6)" },
            "-=.3"
          );

        /* 3D tilt + glare, straighten on hover */
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
        card.addEventListener("pointerenter", () =>
          gsap.to(card, { rotation: 0, duration: 0.5, ease: "power3.out" })
        );
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          ry((x - 0.5) * 10);
          rx(-(y - 0.5) * 10);
          card.style.setProperty("--mx", `${x * 100}%`);
          card.style.setProperty("--my", `${y * 100}%`);
        });
        card.addEventListener("pointerleave", () => {
          rx(0);
          ry(0);
          gsap.to(card, { rotation: rest, duration: 0.6, ease: "power3.out" });
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

      /* value strip */
      gsap.from(".ab-value", {
        y: 50,
        opacity: 0,
        scale: 0.94,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-value", start: "top 92%" },
      });
      gsap.from(".ab-value-item", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ab-value", start: "top 92%" },
      });

      /* story timeline (unchanged) */
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
            <Split text="Great minds." />
            <br />
            <Split text="A shared vision." />{" "}
          </h1>
          <p>
            We’re a team of builders, dreamers and problem solvers, brought
            together by a simple belief — technology should make life easier,
            smarter and more human.
          </p>

          <div className="ab-note" aria-hidden>
            <span>
              Different minds.
              <br />
              Same mission.
            </span>
            <svg className="ab-arrow" viewBox="0 0 60 70" fill="none">
              <path
                pathLength="1"
                d="M48 4C50 28 36 48 12 62M12 62l4-16M12 62l16-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </header>
      </main>

      <section className="ab-content">
        <div className="ab-cards">
          {FOUNDERS.map((f) => (
            <article key={f.name} className={`ab-card ${f.dark ? "dark" : ""}`}>
              <div className="ab-tilt">
                <div className="ab-photo">
                  <div className="ab-photo-in" style={{ background: f.color }}>
                    {f.image && <img src={f.image} alt={f.name} />}
                  </div>
                  <span className="ab-curtain" />
                </div>
                <div className="ab-body">
                  <span className="ab-role">{f.role}</span>
                  <h2 className="ab-name">
                    <Split text={f.name} />
                  </h2>
                  <div className="ab-tags">
                    {f.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <hr className="ab-hr" />
                  <p className="ab-intro">{f.bio}</p>
                  {f.knowMore && (f.moreImage ?? f.image) && (
                    <KnowMore src={(f.moreImage ?? f.image)!} alt={f.name} />
                  )}
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

        <div className="ab-value">
          {VALUES.map((v) => (
            <div key={v.t} className="ab-value-item">
              <span className="ab-value-ico">{v.i}</span>
              <div>
                <strong>{v.t}</strong>
                <span>{v.d}</span>
              </div>
            </div>
          ))}
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
        <div className="ab-story">
          <h2 className="ab-story-title">Prajyot’s story</h2>
          <div className="ab-line">
            <i className="ab-line-fill" />
          </div>
          {CHAPTERS1.map((c, i) => (
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
