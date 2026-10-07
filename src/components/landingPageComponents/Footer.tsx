"use client";

import { useState } from "react";
import { IconInsta } from "@/components/landingPageComponents/icons";
import PolicyModal from "../policyComponents/PolicyModal";
import {
  POLICIES,
  type Policy,
  type PolicyKey,
} from "../policyComponents/policyData";

const POLICY_ENTRIES = Object.entries(POLICIES) as [PolicyKey, Policy][];

export default function Footer(): React.JSX.Element {
  const [open, setOpen] = useState<PolicyKey | null>(null);

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div>
            <div className="footer__brand">
              <span className="nav__mark" aria-hidden="true">
                <span />
              </span>
              makeitprint.
            </div>
            <p className="footer__tagline">
              Precision 3D art, CAD &amp; custom fabrication for makers who care
              about detail.
            </p>
          </div>

          <div className="footer__col">
            <p className="footer__heading">Sitemap</p>
            <a href="#services">Services</a>
            <a href="#work">Our Work</a>
            <a href="#customers">Customers</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer__col">
            <p className="footer__heading">Policies</p>
            {POLICY_ENTRIES.map(([k, p]) => (
              <button key={k} type="button" onClick={() => setOpen(k)}>
                {p.label}
              </button>
            ))}
          </div>

          <div className="footer__col">
            <p className="footer__heading">Social</p>
            <a
              href="https://www.instagram.com/makeitprint.in?stkn=MXBuOWpkNXVwZDZ6cw=="
              target="_blank"
              rel="noreferrer"
              className="footer__social"
            >
              <IconInsta width={16} height={16} /> @MakeItPrint
            </a>
          </div>
        </div>

        <div className="footer__wordmark">
          <span>makeitprint</span>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} Make It Print. All rights reserved.
          </span>
          <span>Crafted in Chh. Sambhajinagar · Shipped all over india</span>
        </div>
      </div>

      {open && (
        <PolicyModal policy={POLICIES[open]} onClose={() => setOpen(null)} />
      )}
    </footer>
  );
}
