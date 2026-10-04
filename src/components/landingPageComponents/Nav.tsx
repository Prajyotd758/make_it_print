"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// TODO: wire these to real cart / wishlist state
const cartCount = 0;
const wishlistCount = 0;

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
        <Link href="/" className="nav__brand" onClick={closeMenu}>
          <div>
            <img src="/logo.png" alt="Make It Print" className="logo" />
          </div>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <Link href="/#services">Services</Link>
          <Link href="/#work">Our Work</Link>
          <Link href="/products">Products</Link>
          <Link href="/#contact">Contact</Link>
        </nav>

        <div className="nav__actions">
          <Link
            href="/wishlist"
            className="nav__icon"
            aria-label="Wishlist"
            onClick={closeMenu}
          >
            <div>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              >
                <path d="M12 20.5s-7.5-4.6-9.2-9.4C1.7 7.900 3.600 4.800 6.800 4.800c2 0 3.500 1.100 5.200 3.100 1.700-2 3.200-3.100 5.200-3.100 3.200 0 5.100 3.100 4 6.300-1.700 4.800-9.200 9.400-9.200 9.400z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="nav__badge">{wishlistCount}</span>
              )}
            </div>
          </Link>

          <Link
            href="/cart"
            className="nav__icon"
            aria-label="Cart"
            onClick={closeMenu}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <path d="M5 8h14l-1 12H6L5 8z" />
              <path d="M9 8V6.500a3 3 0 016 0V8" />
            </svg>
            {cartCount > 0 && <span className="nav__badge">{cartCount}</span>}
          </Link>

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
      </div>

      <div className={`nav__mobile ${menuOpen ? "is-open" : ""}`}>
        <Link href="/#services" onClick={closeMenu}>
          Services
        </Link>
        <Link href="/#work" onClick={closeMenu}>
          Our Work
        </Link>
        <Link href="/products" onClick={closeMenu}>
          Products
        </Link>
        <Link href="/#contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </header>
  );
}
