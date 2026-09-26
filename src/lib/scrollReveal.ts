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

  gsap.utils.toArray(scope.querySelectorAll(selector)).forEach((el, i) => {
    gsap.from(el as Element, {
      opacity: 0,
      y: 28,
      duration: 0.8,
      delay: i * stagger,
      scrollTrigger: {
        trigger: trigger ?? (el as Element),
        start,
      },
    });
  });
}
