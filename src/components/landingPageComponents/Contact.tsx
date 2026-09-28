"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { revealOnScroll } from "@/lib/scrollReveal";
import { IconMail, IconPhone, IconPin } from "@/components/landingPageComponents/icons";

export default function Contact() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(root.current, ".reveal", { trigger: root.current });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="wrap contact__grid">
        <div className="reveal">
          <span className="contact__eyebrow">Contact Us</span>
          <h2 className="contact__title">
            Let&apos;s build something precise together
          </h2>
          <p className="contact__text">
            Send us your sketch, STL, or a rough idea. We&apos;ll get back
            within 24 hours with a quote and a game plan.
          </p>
        </div>

        <div className="contact__card reveal">
          <div className="contact-row">
            <span className="contact-row__icon">
              <IconPhone />
            </span>
            <div>
              <span className="contact-row__label">Mobile</span>
              <a href="tel:+919922635394" className="contact-row__value">
                +91 99226 35394
              </a>
            </div>
          </div>

          <div className="contact-row">
            <span className="contact-row__icon">
              <IconMail />
            </span>
            <div>
              <span className="contact-row__label">Email</span>
              <a href="mailto:contact@makeitprint.store" className="contact-row__value">
                contact@makeitprint.store
              </a>
              <div className="contact-row__sub">makeitprint27@gmail.com</div>
            </div>
          </div>

          <div className="contact-row">
            <span className="contact-row__icon">
              <IconPin />
            </span>
            <div>
              <span className="contact-row__label">Location</span>
              <div className="contact-row__value">Chhatrapati Sambhaji Nagar</div>
              <div className="contact-row__sub">
                Chh. Sambhajinagar, Maharashtra 431001, India
              </div>
            </div>
          </div>

          <div className="contact__reg">
            GST No · 27DECPS4995R1Z9
            <br />
            UDYAM · UDYAM-MH-04-0314051
          </div>
        </div>
      </div>
    </section>
  );
}
