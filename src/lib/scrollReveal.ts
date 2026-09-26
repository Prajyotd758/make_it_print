"use client";

import { gsap } from "@/lib/gsap";

/**
 * Reveals matched elements (assumed to carry the .reveal class, which sets
 * opacity:0 + translateY via CSS) as they enter the viewport. Call inside a
 * gsap.context() scoped useEffect.
 */
export function revealOnScroll(scope, selector, opts = {}) {
  const els = scope.querySelectorAll(selector);
  if (!els.length) return;

  gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: opts.stagger ?? 0.1,
    scrollTrigger: {
      trigger: opts.trigger || els[0],
      start: opts.start || "top 85%",
      once: true,
    },
  });
}
