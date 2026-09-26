"use client";

import { useEffect, useState } from "react";
import { IconArrow } from "@/components/icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__mark" aria-hidden="true">
            <span />
          </span>
          makeitprint<span className="dot">.</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#work">Our Work</a>
          <a href="#customers">Customers</a>
          <a href="#contact">Contact</a>
        </nav>

        <a href="#contact" className="btn btn--solid btn--sm nav__cta">
          Start a Project <IconArrow />
        </a>

        <button className="nav__menu-btn" aria-label="Open menu">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M0 1H16M0 6H16M0 11H16" stroke="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
