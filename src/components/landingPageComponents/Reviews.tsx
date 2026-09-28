"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../../styles/Reviews.css";

const CLIENTS = [
  { name: "Sterlite Technologies Limited", tag: "STL" },
  { name: "Mikronix Gauges Pvt. Ltd." },
  { name: "G.R. Engineering Works" },
];

const REVIEWS = [
  {
    name: "Rushikesh Patil",
    tag: "3D Printing & Custom Part",
    text: "Really good experience with Make It Print. The part was printed properly and the overall quality was very good. They also understood the requirement and delivered the work professionally.",
  },
  {
    name: "Aniket Naibal",
    tag: "Custom 3D Printing",
    text: "Very happy with the print quality and finishing. The team was helpful throughout the process and made sure the final product matched the requirement.",
  },
  {
    name: "Abhijeet",
    tag: "Prototype & 3D Printing",
    text: "Good quality 3D printing service. The communication was clear and the final part came out really well. Would definitely consider using Make It Print again.",
  },
  {
    name: "Anil",
    tag: "Customized 3D Print",
    text: "Good service and impressive print quality. They were able to understand the requirement and provide a practical 3D printed solution.",
  },
  {
    name: "Akash Patil",
    tag: "3D Printing Service",
    text: "Had a great experience with Make It Print. The print quality was good and the team was responsive and professional.",
  },
  {
    name: "Sohilkhan Pathan",
    tag: "Custom Prototype",
    text: "Excellent experience with the customization and printing process. The final product was well made and exactly what I needed.",
  },
  {
    name: "Abhishek Rapatwar",
    tag: "3D Printed Product",
    text: "Good quality work with attention to detail. The team was cooperative and delivered a clean-looking final product.",
  },
  {
    name: "Omkar Raut",
    tag: "Engineering 3D Print",
    text: "Very useful service for getting custom parts made quickly. The team understood the technical requirement and produced a good-quality part.",
  },
  {
    name: "Suraj Divate",
    tag: "Custom 3D Printing",
    text: "Really satisfied with the quality of the printed product. The process was smooth and the team was helpful with the requirements.",
  },
  {
    name: "Prajyot Dange",
    tag: "Prototype & Custom Part",
    text: "Professional service and good print quality. Make It Print is a useful option for anyone looking for customized 3D printed parts and prototypes.",
  },
]; 

const GAP = 22;
const AUTO_MS = 5000;

function usePerView() {
  const [pv, setPv] = useState(3);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPv(w <= 640 ? 1 : w <= 980 ? 2 : 3);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return pv;
}

export default function Reviews() {
  const pv = usePerView();
  const pageCount = Math.ceil(REVIEWS.length / pv);
  const [index, setIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (index >= pageCount) setIndex(0);
  }, [pageCount, index]);

  useEffect(() => {
    const track = trackRef.current;
    const card = cardRef.current;
    if (!track || !card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const offset = index * pv * (cardWidth + GAP);
    gsap.to(track, { x: -offset, duration: 0.6, ease: "power3.out" });
  }, [index, pv]);

  const resetAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % pageCount);
    }, AUTO_MS);
  };

  useEffect(() => {
    resetAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const goTo = (i: number) => {
    setIndex((i + pageCount) % pageCount);
    resetAuto();
  };

  return (
    <>
      <section className="section clients" id="clients">
        <div className="wrap">
          <div className="section__head">
            <div>
              <span className="eyebrow">Trusted by</span>
              <h2 className="section__title">
                Companies we&apos;ve worked with
              </h2>
            </div>
            <p className="section__desc">
              We provide 3D printing, prototyping and customized manufacturing
              solutions for businesses across different industries.
            </p>
          </div>

          <div className="clients__grid">
            {CLIENTS.map((c) => (
              <div className="client-card" key={c.name}>
                <span className="client-card__name">{c.name}</span>
                {c.tag && (
                  <span className="client-card__tag mono">{c.tag}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reviews" id="reviews">
        <div className="wrap">
          <div className="section__head">
            <div>
              <span className="eyebrow">Testimonials</span>
              <h2 className="section__title">What our customers say</h2>
            </div>
            <div className="reviews__nav">
              <button
                className="reviews__arrow"
                aria-label="Previous review"
                onClick={() => goTo(index - 1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="reviews__arrow"
                aria-label="Next review"
                onClick={() => goTo(index + 1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="reviews__viewport">
            <div className="reviews__track" ref={trackRef}>
              {REVIEWS.map((r, i) => (
                <article
                  className="review-card"
                  ref={i === 0 ? cardRef : null}
                  key={r.name}
                >
                  <div className="review-card__stars">★★★★★</div>
                  <p className="review-card__text">&ldquo;{r.text}&rdquo;</p>
                  <div className="review-card__foot">
                    <span className="review-card__name">{r.name}</span>
                    <span className="review-card__tag mono">{r.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="reviews__dots">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to review page ${i + 1}`}
                className={i === index ? "is-active" : ""}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
