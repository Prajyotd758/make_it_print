"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import gsap from "gsap";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  Calendar,
  Pencil,
  Trash2,
  ChevronRight,
  ArrowRight,
  Plus,
  Lock,
  Zap,
  MessageCircle,
} from "lucide-react";
import { ApiRequestError } from "@/lib/api/client";
import {
  getProfile,
  deleteAddress,
  createAddress,
  updateAddress,
  updateProfile,
  changePassword,
  type Profile,
  type Address,
  type AddressInput,
  type OrderSummary,
} from "@/lib/api/profile";
import DriftingBackground from "@/components/DriftingBackground";
import "./profile.css";

const TABS = ["profile", "orders", "addresses", "settings"] as const;
type Tab = (typeof TABS)[number];
const NAV = [
  [User, "Profile", "profile"],
  [Package, "Orders", "orders"],
  [MapPin, "Addresses", "addresses"],
  [Settings, "Settings", "settings"],
] as const;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const date = (d: string, o: Intl.DateTimeFormatOptions) =>
  new Date(d).toLocaleDateString("en-IN", o);

function Img({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [bad, setBad] = useState(false);
  return src && !bad ? (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setBad(true)}
    />
  ) : (
    <div className={`${className} img-fallback`} role="img" aria-label={alt} />
  );
}

function Empty({
  text,
  href,
  cta,
}: {
  text: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="empty">
      <p>{text}</p>
      <Link href={href} className="btn btn-primary">
        {cta}
      </Link>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <label className="fld">
      <span>{label}</span>
      {children}
      {error?.[0] && <em className="err">{error[0]}</em>}
    </label>
  );
}

function OrderRows({ orders }: { orders: OrderSummary[] }) {
  if (!orders.length)
    return (
      <Empty
        text="You haven’t placed any orders yet."
        href="/products"
        cta="Browse products"
      />
    );
  return (
    <>
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <Img
            src={o.items[0]?.image}
            alt={o.items[0]?.name ?? "Order item"}
            className="thumb"
          />
          <div className="o-info">
            <b>
              {o.items[0]?.name ?? "Order"}
              {o.items.length > 1 && ` +${o.items.length - 1} more`}
            </b>
            <small>
              Order #{o.orderNumber} ·{" "}
              {date(o.createdAt, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </small>
          </div>
          <div className="o-price">
            <span className={`badge ${o.status.toLowerCase()}`}>
              {o.status}
            </span>
            <b>{inr(o.total)}</b>
          </div>
          <Link href={`/orders/${o._id}`} className="btn btn-ghost">
            View Details
          </Link>
        </div>
      ))}
    </>
  );
}

function AddressCard({
  a,
  onEdit,
  onDelete,
}: {
  a: Address;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="addr">
      <div className="addr-h">
        <b>{a.label}</b>
        {a.isDefault && <span className="badge default">Default</span>}
        <span className="addr-actions">
          <button onClick={onEdit} aria-label="Edit address">
            <Pencil size={15} />
          </button>
          <button onClick={onDelete} aria-label="Delete address">
            <Trash2 size={15} />
          </button>
        </span>
      </div>
      <p>
        {[a.line1, a.line2].filter(Boolean).join(", ")}
        <br />
        {a.city} - {a.pincode}
        <br />
        {a.state}, {a.country ?? "India"}
      </p>
    </div>
  );
}

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (v: AddressInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [f, setF] = useState<AddressInput>({
    label: initial?.label ?? "",
    line1: initial?.line1 ?? "",
    line2: initial?.line2 ?? "",
    city: initial?.city ?? "",
    state: initial?.state ?? "",
    pincode: initial?.pincode ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [err, setErr] = useState<Record<string, string[]>>({});
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k: keyof AddressInput, v: string | boolean) =>
    setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const local: Record<string, string[]> = {};
    (["label", "line1", "city", "state"] as const).forEach((k) => {
      if (!f[k]?.trim()) local[k] = ["Required"];
    });
    if (!/^\d{6}$/.test(f.pincode))
      local.pincode = ["Enter a valid 6-digit pincode"];
    setErr(local);
    setMsg("");
    if (Object.keys(local).length) return;
    setSaving(true);
    try {
      await onSave(f);
    } catch (x) {
      if (x instanceof ApiRequestError) {
        setErr(x.fieldErrors);
        setMsg(x.message);
      } else setMsg("Something went wrong");
      setSaving(false);
    }
  }

  const fields: [keyof AddressInput, string][] = [
    ["label", "Label (Home, Work…)"],
    ["line1", "Address line 1"],
    ["line2", "Address line 2 (optional)"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "Pincode"],
  ];
  return (
    <form className="form card pf-reveal" onSubmit={submit} noValidate>
      <h2>{initial ? "Edit address" : "Add new address"}</h2>
      <div className="grid2">
        {fields.map(([k, l]) => (
          <Field key={k} label={l} error={err[k]}>
            <input
              className="input"
              value={(f[k] as string) ?? ""}
              onChange={(e) => set(k, e.target.value)}
              inputMode={k === "pincode" ? "numeric" : undefined}
              maxLength={k === "pincode" ? 6 : 120}
            />
          </Field>
        ))}
      </div>
      <label className="check">
        <input
          type="checkbox"
          checked={!!f.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
        />
        Set as default address
      </label>
      {msg && (
        <p className="form-msg" role="alert">
          {msg}
        </p>
      )}
      <div className="actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save address"}
        </button>
      </div>
    </form>
  );
}

function PersonalForm({
  profile,
  token,
  onSaved,
}: {
  profile: Profile;
  token: string;
  onSaved: (name: string) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [err, setErr] = useState<string[]>();
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setOk(false);
    setErr(undefined);
    const n = name.trim();
    if (n.length < 2) return setErr(["Name must be at least 2 characters"]);
    setSaving(true);
    try {
      const u = await updateProfile({ name: n }, token);
      onSaved(u.name);
      setOk(true);
    } catch (x) {
      if (x instanceof ApiRequestError) {
        setErr(x.fieldErrors.name);
        setMsg(x.message);
      } else setMsg("Something went wrong");
    }
    setSaving(false);
  }
  return (
    <form className="card form pf-reveal" onSubmit={submit} noValidate>
      <h2>
        <User size={18} />
        Personal Information
      </h2>
      <Field label="Full name" error={err}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />
      </Field>
      <Field label="Email">
        <input className="input" value={profile.email} disabled />
      </Field>
      {msg && (
        <p className="form-msg" role="alert">
          {msg}
        </p>
      )}
      {ok && (
        <p className="form-ok" role="status">
          Saved
        </p>
      )}
      <div className="actions">
        <button
          className="btn btn-primary"
          disabled={saving || name.trim() === profile.name}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function PasswordForm({ token }: { token: string }) {
  const [f, setF] = useState({ cur: "", next: "", conf: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setOk(false);
    const l: Record<string, string> = {};
    if (!f.cur) l.cur = "Enter your current password";
    if (f.next.length < 8) l.next = "Use at least 8 characters";
    if (f.conf !== f.next) l.conf = "Passwords don’t match";
    setErr(l);
    if (Object.keys(l).length) return;
    setSaving(true);
    try {
      await changePassword(
        { currentPassword: f.cur, newPassword: f.next },
        token
      );
      setF({ cur: "", next: "", conf: "" });
      setOk(true);
    } catch (x) {
      setMsg(x instanceof ApiRequestError ? x.message : "Something went wrong");
    }
    setSaving(false);
  }
  const inp = (k: "cur" | "next" | "conf", l: string) => (
    <Field label={l} error={err[k] ? [err[k]] : undefined}>
      <input
        className="input"
        type="password"
        autoComplete={k === "cur" ? "current-password" : "new-password"}
        value={f[k]}
        onChange={(e) => setF((p) => ({ ...p, [k]: e.target.value }))}
      />
    </Field>
  );
  return (
    <form className="card form pf-reveal" onSubmit={submit} noValidate>
      <h2>
        <Lock size={18} />
        Change Password
      </h2>
      {inp("cur", "Current password")}
      {inp("next", "New password")}
      {inp("conf", "Confirm new password")}
      {msg && (
        <p className="form-msg" role="alert">
          {msg}
        </p>
      )}
      {ok && (
        <p className="form-ok" role="status">
          Password updated
        </p>
      )}
      <div className="actions">
        <button className="btn btn-primary" disabled={saving}>
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Profile | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<Tab>("profile");
  const [form, setForm] = useState<null | "new" | string>(null); // "new" or address id being edited

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };
  const go = (t: Tab) => {
    setTab(t);
    setForm(null);
    history.replaceState(
      null,
      "",
      t === "profile" ? location.pathname : `#${t}`
    );
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const h = location.hash.slice(1) as Tab;
    if (TABS.includes(h)) setTab(h);
  }, []);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (status === "loading") return;
      if (!token) {
        router.replace("/login?next=/profile");
        return;
      }
      setState("loading");
      try {
        setData(await getProfile(token, signal));
        setState("ready");
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
        if (e instanceof ApiRequestError && e.status === 401) {
          router.replace("/login?next=/profile");
          return;
        }
        setError(
          e instanceof Error ? e.message : "Could not load your profile"
        );
        setState("error");
      }
    },
    [router, token, status]
  );

  useEffect(() => {
    const c = new AbortController();
    load(c.signal);
    return () => c.abort();
  }, [load]);

  useLayoutEffect(() => {
    if (
      state !== "ready" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pf-reveal",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }, root);
    return () => ctx.revert();
  }, [state, tab, form]);

  const refresh = async () => setData(await getProfile(token!));

  async function saveAddress(v: AddressInput) {
    if (form === "new") await createAddress(v, token!);
    else await updateAddress(form!, v, token!);
    await refresh();
    flash(form === "new" ? "Address added" : "Address updated");
    setForm(null);
  }

  async function removeAddress(id: string) {
    if (!data || !confirm("Delete this address?")) return;
    const prev = data;
    setData({
      ...data,
      addresses: data.addresses.filter((a) => a._id !== id),
      stats: {
        ...data.stats,
        addresses: Math.max(0, data.stats.addresses - 1),
      },
    });
    try {
      await deleteAddress(id, token!);
      flash("Address deleted");
    } catch (e) {
      setData(prev);
      flash(e instanceof Error ? e.message : "Could not delete address");
    }
  }

  async function logout() {
    // clear any client stores here (cart, etc.) if needed
    await signOut({ redirect: false }); // clears the session cookie
    router.replace("/login");
    router.refresh(); // drops cached server-component data from the old session
  }

  const since = data
    ? date(data.createdAt, { month: "short", year: "numeric" })
    : "";
  const editing =
    form && form !== "new"
      ? data?.addresses.find((a) => a._id === form)
      : undefined;

  return (
    <div className="pf" ref={root}>
      <aside className="pf-side">
        {data && (
          <div className="pf-mini">
            <span className="avatar sm">
              <User size={18} />
            </span>
            <div>
              <b>{data.name}</b>
              <span>{data.email}</span>
            </div>
          </div>
        )}
        <nav>
          {NAV.map(([Icon, label, t]) => (
            <button
              key={t}
              className={`nav-item ${tab === t ? "active" : ""}`}
              aria-current={tab === t}
              onClick={() => go(t)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
          <button className="nav-item logout" onClick={logout}>
            <LogOut size={18} />
            Log Out
          </button>
        </nav>
      </aside>

      <main className="pf-main">
        {state === "loading" && (
          <div
            className="skeletons"
            aria-busy="true"
            aria-label="Loading profile"
          >
            <div className="skel h-hero" />
            <div className="skel-row">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skel h-stat" />
              ))}
            </div>
            <div className="skel h-block" />
          </div>
        )}

        {state === "error" && (
          <div className="card error" role="alert">
            <h2>Couldn’t load your profile</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => load()}>
              Try again
            </button>
          </div>
        )}

        {state === "ready" && data && (
          <>
            {tab === "profile" && (
              <>
                <section className="hero pf-reveal">
                  <DriftingBackground count={28} />
                  <div className="avatar-wrap">
                    <div className="avatar lg">
                      <User size={72} strokeWidth={1.4} />
                    </div>
                  </div>
                  <div className="hero-text">
                    <h1>{data.name}</h1>
                    <p className="muted">{data.email}</p>
                    <span className="chip">
                      <Calendar size={14} />
                      Member since {since}
                    </span>
                  </div>
                  <div className="hero-art" aria-hidden="true">
                    Ideas
                    <br />
                    Designs
                    <br />
                    Physical
                  </div>
                </section>

                <section className="stats">
                  {(
                    [
                      [Package, data.stats.orders, "Total Orders", "orders"],
                      [
                        MapPin,
                        data.stats.addresses,
                        "Saved Addresses",
                        "addresses",
                      ],
                      [Calendar, since, "Member Since", "profile"],
                    ] as const
                  ).map(([Icon, v, l, t]) => (
                    <button
                      key={l}
                      className="card stat pf-reveal"
                      onClick={() => go(t)}
                    >
                      <span className="ico">
                        <Icon size={18} />
                      </span>
                      <div>
                        <b>{v}</b>
                        <small>{l}</small>
                      </div>
                      <ChevronRight size={16} className="arrow" />
                    </button>
                  ))}
                </section>

                <section className="card pf-reveal">
                  <header className="sec-h">
                    <h2>Recent Orders</h2>
                    {data.recentOrders.length > 0 && (
                      <button className="link" onClick={() => go("orders")}>
                        View All Orders <ArrowRight size={14} />
                      </button>
                    )}
                  </header>
                  <OrderRows orders={data.recentOrders} />
                </section>

                <div className="two-col">
                  <div className="col">
                    <section className="card pf-reveal">
                      <header className="sec-h">
                        <h2>
                          <Settings size={18} />
                          Settings
                        </h2>
                      </header>
                      {[
                        [
                          User,
                          "Personal Information",
                          "Update your name and profile details",
                        ],
                      ].map(([Icon, t, s]: any) => (
                        <button
                          key={t}
                          className="row-link"
                          onClick={() => go("settings")}
                        >
                          <Icon size={18} />
                          <div>
                            <b>{t}</b>
                            <small>{s}</small>
                          </div>
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </section>
                  </div>
                  <div className="col">
                    <section className="card pf-reveal">
                      <header className="sec-h">
                        <h2>
                          <MapPin size={18} />
                          Addresses
                        </h2>
                        {data.addresses.length > 0 && (
                          <button
                            className="link"
                            onClick={() => go("addresses")}
                          >
                            View All <ArrowRight size={14} />
                          </button>
                        )}
                      </header>
                      {data.addresses.length === 0 && (
                        <p className="muted pad">No saved addresses yet.</p>
                      )}
                      {data.addresses.slice(0, 2).map((a) => (
                        <AddressCard
                          key={a._id}
                          a={a}
                          onEdit={() => {
                            go("addresses");
                            setForm(a._id);
                          }}
                          onDelete={() => removeAddress(a._id)}
                        />
                      ))}
                      <button
                        className="add-addr"
                        onClick={() => {
                          go("addresses");
                          setForm("new");
                        }}
                      >
                        <Plus size={16} />
                        Add New Address
                      </button>
                    </section>
                    <section className="card pf-reveal">
                      <header className="sec-h">
                        <h2>
                          <Zap size={18} />
                          Quick Actions
                        </h2>
                      </header>
                      <Link href="/contact" className="row-link">
                        <span className="ico">
                          <MessageCircle size={18} />
                        </span>
                        <div>
                          <b>Contact Support</b>
                          <small>Get help with your orders or queries</small>
                        </div>
                        <ChevronRight size={16} />
                      </Link>
                    </section>
                  </div>
                </div>
              </>
            )}

            {tab === "orders" && (
              <section className="card pf-reveal">
                <header className="sec-h">
                  <h2>Orders</h2>
                </header>
                <OrderRows orders={data.recentOrders} />
              </section>
            )}

            {tab === "addresses" && (
              <>
                <header className="sec-h tab-h pf-reveal">
                  <h1>Addresses</h1>
                  {!form && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setForm("new")}
                    >
                      <Plus size={16} />
                      Add New Address
                    </button>
                  )}
                </header>
                {form && (
                  <AddressForm
                    key={form}
                    initial={editing}
                    onSave={saveAddress}
                    onCancel={() => setForm(null)}
                  />
                )}
                {data.addresses.length === 0 && !form ? (
                  <div className="card pf-reveal">
                    <p className="muted pad">No saved addresses yet.</p>
                  </div>
                ) : (
                  <div className="addr-grid">
                    {data.addresses.map((a) => (
                      <div className="pf-reveal" key={a._id}>
                        <AddressCard
                          a={a}
                          onEdit={() => setForm(a._id)}
                          onDelete={() => removeAddress(a._id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "settings" && (
              <>
                <header className="tab-h pf-reveal">
                  <h1>Settings</h1>
                </header>
                <PersonalForm
                  profile={data}
                  token={token!}
                  onSaved={(name) => setData((d) => d && { ...d, name })}
                />
                <PasswordForm token={token!} />
              </>
            )}
          </>
        )}
      </main>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
