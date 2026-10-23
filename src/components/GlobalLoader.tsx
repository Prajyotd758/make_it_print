"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getLoader, hideLoader, subscribeLoader } from "@/lib/loader";
import "./loader.css";

export default function GlobalLoader() {
  const { open, text } = useSyncExternalStore(
    subscribeLoader,
    getLoader,
    getLoader
  );
  const pathname = usePathname();

  // auto-hide once navigation completes
  useEffect(() => {
    hideLoader();
  }, [pathname]);

  // lock scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="gl"
      role="alertdialog"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="gl-box">
        <div className="gl-stack" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <p className="gl-text">{text}</p>
        <span className="gl-sub">Please don't close or refresh this page</span>
      </div>
    </div>
  );
}
