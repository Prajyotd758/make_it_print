"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const TAGS = [
  "FDM Printing",
  "Resin Precision",
  "CAD Drafting",
  "Miniatures",
  "Custom Toys",
  "Prototyping",
  "Low-Volume Runs",
  "Engineering Drawings",
];

export default function Marquee() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 26,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  const row = TAGS.map((t) => <span key={t}>{t}</span>);

  return (
    <div className="marquee">
      <div className="marquee__track" ref={trackRef}>
        {row}
        {row}
      </div>
    </div>
  );
}
