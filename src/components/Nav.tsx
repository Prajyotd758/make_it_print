"use client";

import { useEffect, useState } from "react";
import { IconArrow } from "@/components/icons";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.overflow = "";
    };
  }, []);


  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={closeMenu}>
          <div>
            <img src="/logo.png" alt="" className="logo" />
          </div>
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

        <button
          className="nav__menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M0 1H16M0 6H16M0 11H16" stroke="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <div className={`nav__mobile ${menuOpen ? "is-open" : ""}`}>
        <a href="#services" onClick={closeMenu}>
          Services
        </a>
        <a href="#work" onClick={closeMenu}>
          Our Work
        </a>
        <a href="#customers" onClick={closeMenu}>
          Customers
        </a>
        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>
      </div>
    </header>
  );
}
