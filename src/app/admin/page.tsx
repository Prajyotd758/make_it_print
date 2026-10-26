"use client";
import { useEffect, useState } from "react";
import { get, patch } from "@/lib/api/client";
import "./admin.css";

const ADMIN_PASSWORD = "Prasad@9922";

type Item = {
  image: string;
  price: number;
  product: string;
  quantity: number;
  title: string;
};
type Address = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};
type Order = {
  _id: string;
  user: string;
  items: Item[];
  address: Address;
  notes: string;
  paidAt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shipping: number;
  source: string;
  status: string;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

const STATUS = [
  "pending",
  "paid",
  "failed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const cls = (s = "") => {
  const v = s.toLowerCase();
  if (v.includes("fail")) return "bad";
  if (
    ["paid", "success", "processing", "shipped", "delivered"].some((x) =>
      v.includes(x)
    )
  )
    return "ok";
  return "";
};
const rank = (s: string) =>
  ({ bad: 0, "": 1, ok: 2 }[cls(s) as "bad" | "" | "ok"]);

const Badge = ({ v }: { v: string }) => (
  <span className={`adm-badge ${cls(v)}`}>{v}</span>
);
const F = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="adm-f">
    <span className="adm-label">{label}</span>
    {children}
  </label>
);

function OrderRow({ order, token }: { order: Order; token: string }) {
  const [d, setD] = useState<Order>(order);
  const [msg, setMsg] = useState("");

  const set = <K extends keyof Order>(k: K, v: Order[K]) =>
    setD({ ...d, [k]: v });
  const setAddr = (k: keyof Address, v: string) =>
    setD({ ...d, address: { ...d.address, [k]: v } });
  const setItem = (i: number, k: keyof Item, v: string) =>
    setD({
      ...d,
      items: d.items.map((it, j) =>
        j === i
          ? { ...it, [k]: k === "price" || k === "quantity" ? Number(v) : v }
          : it
      ),
    });

  const save = async () => {
    setMsg("Saving...");
    try {
      const { user, ...body } = d;
      await patch(`/admin/orders/${order._id}`, body, { token });
      setMsg("Saved");
    } catch {
      setMsg("Failed");
    }
  };

  return (
    <details className="adm-order">
      <summary>
        <span className="adm-id">#{d._id.slice(-6)}</span>
        <span>{d.address.name}</span>
        <span className="adm-amt">₹{d.total}</span>
        <Badge v={d.status} />
        <span className="adm-id">{d.source}</span>
      </summary>
      <div className="adm-body">
        <p className="adm-label">
          Placed {new Date(d.createdAt).toLocaleString()} · User {d.user}
        </p>
        <div className="adm-grid">
          <F label="Status">
            <select
              value={d.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {Array.from(new Set([...STATUS, d.status])).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </F>
          <F label="Source">
            <input
              value={d.source}
              onChange={(e) => set("source", e.target.value)}
            />
          </F>
          <F label="Subtotal">
            <input
              type="number"
              value={d.subtotal}
              onChange={(e) => set("subtotal", Number(e.target.value))}
            />
          </F>
          <F label="Shipping">
            <input
              type="number"
              value={d.shipping}
              onChange={(e) => set("shipping", Number(e.target.value))}
            />
          </F>
          <F label="Total">
            <input
              type="number"
              value={d.total}
              onChange={(e) => set("total", Number(e.target.value))}
            />
          </F>
          <F label="Paid at">
            <input
              value={d.paidAt ?? ""}
              onChange={(e) => set("paidAt", e.target.value)}
            />
          </F>
          <F label="Razorpay order">
            <input
              value={d.razorpayOrderId ?? ""}
              onChange={(e) => set("razorpayOrderId", e.target.value)}
            />
          </F>
          <F label="Razorpay payment">
            <input
              value={d.razorpayPaymentId ?? ""}
              onChange={(e) => set("razorpayPaymentId", e.target.value)}
            />
          </F>
        </div>

        <h4 className="adm-label">Notes</h4>
        <input value={d.notes} onChange={(e) => set("notes", e.target.value)} />

        <h4 className="adm-label">Address</h4>
        <div className="adm-grid">
          {(Object.keys(d.address) as (keyof Address)[]).map((k) => (
            <F key={k} label={k}>
              <input
                value={d.address[k] ?? ""}
                onChange={(e) => setAddr(k, e.target.value)}
              />
            </F>
          ))}
        </div>

        <h4 className="adm-label">Items</h4>
        {d.items.map((it, i) => (
          <div className="adm-item" key={i}>
            <img src={it.image} alt="" />
            <input
              value={it.title}
              onChange={(e) => setItem(i, "title", e.target.value)}
            />
            <input
              type="number"
              title="Quantity"
              value={it.quantity}
              onChange={(e) => setItem(i, "quantity", e.target.value)}
            />
            <input
              type="number"
              title="Price"
              value={it.price}
              onChange={(e) => setItem(i, "price", e.target.value)}
            />
            <input
              className="adm-wide"
              title="Image URL"
              value={it.image}
              onChange={(e) => setItem(i, "image", e.target.value)}
            />
          </div>
        ))}

        <button className="adm-btn" onClick={save}>
          Save order
        </button>
        <span className="adm-msg">{msg}</span>
      </div>
    </details>
  );
}

function PayRow({ order, token }: { order: Order; token: string }) {
  const [d, setD] = useState<Order>(order);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setMsg("Saving...");
    try {
      const { total, status, razorpayOrderId, razorpayPaymentId } = d;
      await patch(
        `/admin/orders/${order._id}`,
        { total, status, razorpayOrderId, razorpayPaymentId },
        { token }
      );
      setMsg("Saved");
    } catch {
      setMsg("Failed");
    }
  };

  return (
    <tr>
      <td>{new Date(d.paidAt ?? d.createdAt).toLocaleString()}</td>
      <td className="adm-id">#{d._id.slice(-6)}</td>
      <td>
        <input
          value={d.razorpayOrderId ?? ""}
          onChange={(e) => setD({ ...d, razorpayOrderId: e.target.value })}
        />
      </td>
      <td>
        <input
          value={d.razorpayPaymentId ?? ""}
          onChange={(e) => setD({ ...d, razorpayPaymentId: e.target.value })}
        />
      </td>
      <td>
        <input
          type="number"
          value={d.total}
          onChange={(e) => setD({ ...d, total: Number(e.target.value) })}
        />
      </td>
      <td>
        <select
          value={d.status}
          onChange={(e) => setD({ ...d, status: e.target.value })}
        >
          {Array.from(new Set([...STATUS, d.status])).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </td>
      <td>
        <Badge v={d.status} />
      </td>
      <td>
        <button className="adm-btn sm" onClick={save}>
          Save
        </button>
        <span className="adm-msg">{msg}</span>
      </td>
    </tr>
  );
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const login = () =>
    pw === ADMIN_PASSWORD ? setToken(pw) : setError("Wrong password");

  useEffect(() => {
    if (!token) return;
    get<Order[]>("/admin/orders", { token })
      .then(setOrders)
      .catch(() => setError("Failed to load orders"));
  }, [token]);

  if (!token) {
    return (
      <div className="adm">
        <div className="adm-login">
          <span className="adm-label">Make It Print</span>
          <h1>Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button className="adm-btn" onClick={login}>
            Enter
          </button>
          {error && <div className="adm-err">{error}</div>}
        </div>
      </div>
    );
  }

  const paid = orders.filter((o) => cls(o.status) === "ok");
  const failed = orders.filter((o) => cls(o.status) === "bad");
  const want = { failed: "bad", pending: "", success: "ok" } as Record<
    string,
    string
  >;
  const shown = orders
    .filter((o) => filter === "all" || cls(o.status) === want[filter])
    .sort((a, b) => rank(a.status) - rank(b.status));

  return (
    <div className="adm">
      <div className="adm-wrap">
        <span className="adm-label">Make It Print</span>
        <h1>Admin dashboard</h1>
        {error && <div className="adm-err">{error}</div>}

        <div className="adm-stats">
          <div className="adm-stat">
            <span className="adm-label">Orders</span>
            <b>{orders.length}</b>
          </div>
          <div className="adm-stat hl">
            <span className="adm-label">Revenue (paid)</span>
            <b>₹{paid.reduce((s, o) => s + o.total, 0)}</b>
          </div>
          <div className="adm-stat">
            <span className="adm-label">Failed</span>
            <b>{failed.length}</b>
          </div>
        </div>

        <h2>
          Orders <small>{orders.length}</small>
        </h2>
        {orders.map((o) => (
          <OrderRow key={o._id} order={o} token={token} />
        ))}

        <h2>
          Transactions <small>{shown.length}</small>
        </h2>
        <div className="adm-bar">
          {["all", "failed", "pending", "success"].map((s) => (
            <button
              key={s}
              className={`adm-tab ${filter === s ? "on" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="adm-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Order</th>
                <th>Rzp order</th>
                <th>Rzp payment</th>
                <th>Total</th>
                <th>Status</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((o) => (
                <PayRow key={o._id} order={o} token={token} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
