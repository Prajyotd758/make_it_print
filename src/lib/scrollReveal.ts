import { gsap } from "@/lib/gsap";

interface RevealOptions {
  trigger?: Element | string | null;
  start?: string;
  stagger?: number;
}

export function revealOnScroll(
  scope: Element | null,
  selector: string,
  options: RevealOptions = {}
) {
  if (!scope) return;
  const { trigger, start = "top 85%", stagger = 0 } = options;

  const els = gsap.utils.toArray<Element>(scope.querySelectorAll(selector));

  els.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 28 });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: i * stagger,
      ease: "power2.out",
      scrollTrigger: {
        trigger: trigger ?? el,
        start,
        once: true,
        invalidateOnRefresh: true,
      },
    });
  });
}