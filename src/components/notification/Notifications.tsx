"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";

export type NotifyType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "toast"
  | "accent"
  | "brand";

export interface NotifyOptions {
  type?: NotifyType;
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void }; // button on the right
  link?: { label: string; href: string }; // text link under the message
  duration?: number; // ms, default 4500
  persistent?: boolean; // stays until closed
}
interface Item extends NotifyOptions {
  id: number;
  type: NotifyType;
  leaving?: boolean;
}

/* ---------- store (callable from anywhere on the client) ---------- */
let items: Item[] = [];
let seq = 0;
const subs = new Set<() => void>();
const set = (next: Item[]) => {
  items = next;
  subs.forEach((f) => f());
};

function dismiss(id: number) {
  if (!items.some((i) => i.id === id && !i.leaving)) return;
  set(items.map((i) => (i.id === id ? { ...i, leaving: true } : i)));
  setTimeout(() => set(items.filter((i) => i.id !== id)), 200);
}

export function notify(opts: NotifyOptions): number {
  const id = ++seq;
  set([...items, { ...opts, id, type: opts.type ?? "toast" }].slice(-4)); // max 4 on screen
  return id;
}

const short =
  (type: NotifyType) =>
  (title: string, message?: string, o: Partial<NotifyOptions> = {}) =>
    notify({ ...o, type, title, message });

notify.success = short("success");
notify.error = short("error");
notify.warning = short("warning");
notify.info = short("info");
notify.toast = short("toast");
notify.accent = short("accent");
notify.brand = short("brand");
notify.dismiss = dismiss;
notify.clear = () => items.forEach((i) => dismiss(i.id));

/* ---------- icons ---------- */
const Disc = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="currentColor" />
    <g
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  </svg>
);
const ICONS: Record<NotifyType, ReactNode> = {
  success: (
    <Disc>
      <path d="M7 12.5l3.2 3.2L17 9" />
    </Disc>
  ),
  toast: (
    <Disc>
      <path d="M7 12.5l3.2 3.2L17 9" />
    </Disc>
  ),
  error: (
    <Disc>
      <path d="M8 8l8 8M16 8l-8 8" />
    </Disc>
  ),
  info: (
    <Disc>
      <path d="M12 11v6M12 7.5v.01" />
    </Disc>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5L22.5 21h-21L12 2.5z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5v5M12 17.6v.01"
        stroke="#12110f"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  accent: (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <g
        stroke="#12110f"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 6.5l5 2.8v5.4l-5 2.8-5-2.8V9.3l5-2.8zM7 9.3l5 2.8 5-2.8M12 12.1v5.4" />
      </g>
    </svg>
  ),
  brand: <b className="nt-m">M</b>,
};

/* ---------- card ---------- */
function Card({ n }: { n: Item }) {
  const timer = useRef<number | undefined>(undefined);
  const duration = n.persistent ? 0 : n.duration ?? 4500;
  const stop = () => window.clearTimeout(timer.current);
  const start = () => {
    stop();
    if (duration > 0)
      timer.current = window.setTimeout(() => dismiss(n.id), duration);
  };
  useEffect(() => {
    start();
    return stop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`nt nt--${n.type}${n.leaving ? " is-out" : ""}`}
      role={n.type === "error" ? "alert" : "status"}
      onMouseEnter={stop} // pause while hovered
      onMouseLeave={start}
    >
      <span className="nt-icon">{n.icon ?? ICONS[n.type]}</span>
      <div className="nt-body">
        <p className="nt-title">{n.title}</p>
        {n.message && <p className="nt-msg">{n.message}</p>}
        {n.link && (
          <a
            className="nt-link"
            href={n.link.href}
            onClick={() => dismiss(n.id)}
          >
            {n.link.label} →
          </a>
        )}
      </div>
      {n.action && (
        <button
          className="nt-action"
          onClick={() => {
            n.action!.onClick();
            dismiss(n.id);
          }}
        >
          {n.action.label}
        </button>
      )}
      <button
        className="nt-x"
        aria-label="Dismiss"
        onClick={() => dismiss(n.id)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}

/* ---------- mount once in the root layout ---------- */
const EMPTY: Item[] = [];
export default function Notifications() {
  const list = useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => items,
    () => EMPTY
  );
  return (
    <>
      <style>{CSS}</style>
      <div className="nt-wrap" aria-live="polite">
        {list.map((n) => (
          <Card key={n.id} n={n} />
        ))}
      </div>
    </>
  );
}

const CSS = `
.nt-wrap{position:fixed;top:16px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:12px;width:min(380px,calc(100vw - 32px));pointer-events:none}
.nt{--c:#12110f;--bg:#fff;pointer-events:auto;position:relative;display:flex;gap:14px;align-items:flex-start;padding:16px 44px 16px 22px;background:var(--bg);color:#12110f;border:1px solid rgba(18,17,16,.08);border-radius:12px;box-shadow:0 8px 24px rgba(18,17,16,.08);overflow:hidden;animation:nt-in .22s ease-out}
.nt::before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--c)}
.nt--toast::before{display:none}
.nt--toast{--c:#22a55b;padding-left:20px}
.nt--success{--c:#22a55b;--bg:#eef9f1}
.nt--error{--c:#ec4a4a;--bg:#fdeeee}
.nt--warning{--c:#f5b800;--bg:#fff7de}
.nt--info{--c:#2f80ed;--bg:#eaf3ff}
.nt--accent{--c:#f5b800;--bg:#fff8e5}
.nt--brand{--c:#f5b800;--bg:#161513;color:#fff;border-color:#161513}
.nt-icon{flex:none;width:28px;height:28px;color:var(--c);display:grid;place-items:center}
.nt-icon svg{width:100%;height:100%}
.nt--brand .nt-icon{width:36px;height:36px}
.nt-m{width:100%;height:100%;border-radius:50%;background:#f5b800;color:#12110f;display:grid;place-items:center;font-weight:800;font-size:16px}
.nt-body{flex:1;min-width:0}
.nt-title{margin:0;font-size:15px;font-weight:600;line-height:1.3}
.nt-msg{margin:4px 0 0;font-size:13px;line-height:1.45;color:rgba(18,17,16,.6)}
.nt--brand .nt-msg{color:rgba(255,255,255,.8)}
.nt-link{display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#c98a00;text-decoration:underline}
.nt-action{flex:none;align-self:center;padding:8px 14px;border:0;border-radius:8px;background:#f5b800;color:#12110f;font:700 13px inherit;cursor:pointer;transition:transform .15s,filter .15s}
.nt-action:hover{filter:brightness(1.06);transform:translateY(-1px)}
.nt-action:active{transform:none}
.nt-x{position:absolute;top:12px;right:12px;width:24px;height:24px;display:grid;place-items:center;border:0;border-radius:6px;background:none;color:inherit;opacity:.55;cursor:pointer;transition:opacity .15s,background .15s}
.nt-x:hover{opacity:1;background:rgba(18,17,16,.07)}
.nt--brand .nt-x:hover{background:rgba(255,255,255,.14)}
.nt.is-out{animation:nt-out .2s ease-in forwards}
@keyframes nt-in{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@keyframes nt-out{to{opacity:0;transform:translateX(16px)}}
@media (max-width:520px){.nt-wrap{left:16px;width:auto}}
@media (prefers-reduced-motion:reduce){.nt,.nt.is-out{animation-duration:.01s}}
`;
