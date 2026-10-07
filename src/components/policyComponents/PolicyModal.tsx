"use client";

import { useRef, useLayoutEffect, useEffect, Fragment } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import type { Policy } from "./policyData";

interface SplitProps {
  text: string;
}

const Split = ({ text }: SplitProps) => (
  <>
    {text.split(" ").map((w, wi, a) => (
      <Fragment key={wi}>
        <span className="pm-word">
          {[...w].map((c, i) => (
            <span className="pm-mask" key={i}>
              <span className="pm-ch">{c}</span>
            </span>
          ))}
        </span>
        {wi < a.length - 1 && " "}
      </Fragment>
    ))}
  </>
);

interface PolicyModalProps {
  policy: Policy;
  onClose: () => void;
}

export default function PolicyModal({ policy, onClose }: PolicyModalProps) {
  const overlay = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = (): void => {
    gsap.to(box.current, {
      y: 30,
      opacity: 0,
      scale: 0.97,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(overlay.current, {
      opacity: 0,
      duration: 0.22,
      onComplete: onClose,
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(
          box.current,
          { y: 50, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5 },
          "-=.1"
        )
        .fromTo(
          ".pm-title .pm-ch",
          { yPercent: 120, rotate: 8, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 0.8, stagger: 0.025 },
          "-=.3"
        )
        .fromTo(
          ".pm-sec",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=.4"
        )
        .fromTo(
          ".pm-item",
          { x: -24, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.45, stagger: 0.05 },
          "<+=.1"
        )
        .fromTo(
          ".pm-badge",
          { scale: 0, rotate: -90 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "back.out(2.4)",
          },
          "<"
        );
    }, box);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className="pm-overlay" ref={overlay} onClick={close}>
      <div
        className="pm-box"
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-label={policy.title}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <div className="pm-head">
          <span className="pm-mono">{policy.tag}</span>
          <button
            className="pm-close"
            ref={closeBtn}
            onClick={close}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="pm-body">
          <h2 className="pm-title">
            <Split text={policy.title} />
          </h2>

          {policy.intro && <p className="pm-intro pm-sec">{policy.intro}</p>}

          {policy.sections.length === 0 && (
            <p className="pm-intro pm-sec">Details coming soon.</p>
          )}

          {policy.sections.map((s) => (
            <section key={s.h} className="pm-sec">
              <h3>{s.h}</h3>
              {s.p && <p>{s.p}</p>}
              {s.items && (
                <ul>
                  {s.items.map((t, i) => (
                    <li key={t} className="pm-item">
                      <span className="pm-badge">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.note && <p className="pm-note">{s.note}</p>}
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
