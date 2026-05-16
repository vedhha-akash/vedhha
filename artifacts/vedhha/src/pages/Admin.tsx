import { useState, useEffect, useCallback } from "react";

interface Order {
  id: string;
  product: string;
  product_img: string;
  size: string;
  qty: number;
  price: string;
  price_num: number;
  payment: string;
  payment_label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: string;
  cancel_reason: string | null;
  razorpay_payment_id: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  shipped:   "bg-purple-500/20 text-purple-300 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const MAIN_PRODUCTS = [
  { id: "vedhha-blazer",   name: "VEDHHA Blazer",   sizes: ["S","M","L","XL","XXL"] },
  { id: "eklavya-bomber",  name: "Eklavya Bomber",   sizes: ["S","M","L","XL","XXL"] },
  { id: "heritage-hoodie", name: "Heritage Hoodie",  sizes: ["XS","S","M","L","XL","XXL"] },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("vedhha_admin_key") ?? "");
  const [inputKey, setInputKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState<"orders" | "stock" | "notify" | "flashsale" | "customers">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifyRequests, setNotifyRequests] = useState<{ id: number; product: string; name: string; contact: string; created_at: string }[]>([]);
  const [activeSale, setActiveSale] = useState<{ id: number; title: string; subtitle: string; discount_pct: number; ends_at: string } | null>(null);
  const [saleForm, setSaleForm] = useState({ title: "", subtitle: "", discount_pct: "50", hours: "24" });
  const [saleLoading, setSaleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [editing, setEditing] = useState<{ status: string; trackingNumber: string; notes: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  // Customers state
  interface Customer { id: number; phone: string; name: string; notificationsEnabled: boolean; createdAt: string; }
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersTotal, setCustomersTotal] = useState(0);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customersLoading, setCustomersLoading] = useState(false);

  // Stock state
  const [stock, setStock] = useState<Record<string, Record<string, number>>>({});
  const [stockEdits, setStockEdits] = useState<Record<string, Record<string, number>>>({});
  const [stockSaving, setStockSaving] = useState(false);

  const fetchOrders = useCallback(async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-key": key } });
      if (res.status === 401) {
        setError("Wrong password!");
        setAuthed(false);
        localStorage.removeItem("vedhha_admin_key");
        return;
      }
      const data = await res.json() as { orders: Order[] };
      setOrders(data.orders);
      setAuthed(true);
      localStorage.setItem("vedhha_admin_key", key);
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStock = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      const data = await res.json() as { stock: Record<string, Record<string, number>> };
      setStock(data.stock);
    } catch {}
  }, []);

  const fetchNotify = useCallback(async () => {
    try {
      const res = await fetch("/api/notify");
      const data = await res.json();
      setNotifyRequests(data);
    } catch {}
  }, []);

  const fetchFlashSale = useCallback(async () => {
    try {
      const res = await fetch("/api/flash-sale");
      const data = await res.json();
      setActiveSale(data.sale);
    } catch {}
  }, []);

  const fetchCustomers = useCallback(async (key: string, search = "") => {
    setCustomersLoading(true);
    try {
      const url = search ? `/api/customers?search=${encodeURIComponent(search)}` : "/api/customers";
      const res = await fetch(url, { headers: { "x-admin-key": key } });
      if (res.ok) {
        const data = await res.json() as { customers: { id: number; phone: string; name: string; notificationsEnabled: boolean; createdAt: string }[]; total: number };
        setCustomers(data.customers);
        if (!search) setCustomersTotal(data.total);
      }
    } catch {} finally {
      setCustomersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminKey) { fetchOrders(adminKey); fetchStock(); fetchNotify(); fetchFlashSale(); fetchCustomers(adminKey); }
  }, [adminKey, fetchOrders, fetchStock, fetchNotify, fetchFlashSale, fetchCustomers]);

  const handleCreateSale = async () => {
    if (!saleForm.title.trim() || !saleForm.discount_pct || !saleForm.hours) return;
    setSaleLoading(true);
    try {
      const endsAt = new Date(Date.now() + parseInt(saleForm.hours) * 3600 * 1000).toISOString();
      const res = await fetch("/api/flash-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ title: saleForm.title, subtitle: saleForm.subtitle, discount_pct: parseInt(saleForm.discount_pct), ends_at: endsAt }),
      });
      const data = await res.json();
      setActiveSale(data.sale);
    } catch {} finally { setSaleLoading(false); }
  };

  const handleEndSale = async () => {
    setSaleLoading(true);
    try {
      await fetch("/api/flash-sale", { method: "DELETE", headers: { "x-admin-key": adminKey } });
      setActiveSale(null);
    } catch {} finally { setSaleLoading(false); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminKey(inputKey.trim());
  };

  const handleUpdateOrder = async () => {
    if (!selected || !editing) return;
    setSaving(true);
    try {
      await fetch(`/api/orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({
          status: editing.status,
          trackingNumber: editing.trackingNumber || null,
          notes: editing.notes || null,
        }),
      });
      await fetchOrders(adminKey);
      setSelected(null);
      setEditing(null);
    } catch {
      alert("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNotifyWhatsApp = (order: Order, trackingNum: string) => {
    const msg = [
      `🛍️ *VEDHHA — Order Update*`,
      ``,
      `Hi ${order.name}! Aapka order ship ho gaya! 🚀`,
      ``,
      `*Order ID:* ${order.id}`,
      `*Product:* ${order.product} (Size: ${order.size})`,
      trackingNum ? `*Tracking Number:* ${trackingNum}` : "",
      ``,
      `Koi sawaal ho toh WhatsApp karo. Thank you! 🙏`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/91${order.phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSaveStock = async (productId: string) => {
    setStockSaving(true);
    const edits = stockEdits[productId] ?? {};
    try {
      await Promise.all(
        Object.entries(edits).map(([size, quantity]) =>
          fetch("/api/stock", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
            body: JSON.stringify({ productId, size, quantity }),
          })
        )
      );
      await fetchStock();
      setStockEdits((prev) => { const n = { ...prev }; delete n[productId]; return n; });
    } catch {
      alert("Failed to save stock. Please try again.");
    } finally {
      setStockSaving(false);
    }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const counts: Record<string, number> = { all: orders.length };
  STATUS_OPTIONS.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-display text-3xl text-white uppercase tracking-widest">VEDHHA</p>
            <p className="font-sans text-white/40 text-sm mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Admin Password</label>
              <input
                type="password"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent border border-white/20 px-4 py-3 font-sans text-white placeholder-white/20 focus:outline-none focus:border-primary text-sm"
                autoFocus
              />
            </div>
            {error && <p className="font-sans text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-sans text-sm py-3 uppercase tracking-widest hover:bg-primary/80 transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
        <div>
          <p className="font-display text-xl uppercase tracking-widest">VEDHHA Admin</p>
          <p className="font-sans text-white/40 text-xs">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { fetchOrders(adminKey); fetchStock(); fetchNotify(); fetchCustomers(adminKey); }} className="font-sans text-xs border border-white/20 px-3 py-1.5 hover:border-primary hover:text-primary transition-colors">↻</button>
          <button onClick={() => { localStorage.removeItem("vedhha_admin_key"); setAuthed(false); setAdminKey(""); }} className="font-sans text-xs text-white/40 hover:text-white transition-colors">Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setView("orders")} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors ${view === "orders" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}>
          Orders ({orders.length})
        </button>
        <button onClick={() => setView("stock")} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors ${view === "stock" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}>
          Stock
        </button>
        <button onClick={() => setView("notify")} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors ${view === "notify" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}>
          Notify ({notifyRequests.length})
        </button>
        <button onClick={() => setView("flashsale")} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors ${view === "flashsale" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}>
          ⚡ Sale
        </button>
        <button onClick={() => { setView("customers"); fetchCustomers(adminKey, customerSearch); }} className={`flex-1 py-3 font-sans text-sm font-medium transition-colors ${view === "customers" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}>
          Customers ({customersTotal})
        </button>
      </div>

      {/* ORDERS VIEW */}
      {view === "orders" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-4">
            {[["all", "All"], ...STATUS_OPTIONS.map(s => [s, s.charAt(0).toUpperCase() + s.slice(1)])].map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)} className={`border px-3 py-2 text-center transition-all ${filter === key ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/30"}`}>
                <p className={`font-display text-lg ${filter === key ? "text-primary" : "text-white"}`}>{counts[key] ?? 0}</p>
                <p className="font-sans text-white/40 text-xs">{label}</p>
              </button>
            ))}
          </div>

          {/* Orders list */}
          <div className="px-4 pb-4 space-y-3">
            {loading && <p className="font-sans text-white/40 text-sm text-center py-8">Loading orders...</p>}
            {!loading && filtered.length === 0 && <p className="font-sans text-white/40 text-sm text-center py-8">Koi order nahi mila</p>}
            {filtered.map(order => (
              <div key={order.id} className="border border-white/10 bg-white/2 hover:border-white/20 transition-colors">
                <div className="flex items-start gap-3 p-4">
                  {order.product_img && <img src={order.product_img} alt={order.product} className="w-14 h-16 object-cover border border-white/10 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-display text-sm uppercase text-white truncate">{order.product}</p>
                        <p className="font-sans text-white/50 text-xs">Size {order.size} × {order.qty} · ₹{(order.price_num * order.qty).toLocaleString("en-IN")}</p>
                      </div>
                      <span className={`font-sans text-xs border px-2 py-0.5 shrink-0 ${STATUS_COLORS[order.status] ?? "bg-white/10 text-white/50 border-white/20"}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <p className="font-sans text-white/70 text-xs">👤 {order.name} · 📱 +91 {order.phone}</p>
                      <p className="font-sans text-white/50 text-xs">{order.address}, {order.city}, {order.state} — {order.pincode}</p>
                      <p className="font-sans text-white/40 text-xs">💳 {order.payment_label} · 🕐 {formatDate(order.created_at)}</p>
                      {order.tracking_number && <p className="font-sans text-purple-400 text-xs">📦 Tracking: {order.tracking_number}</p>}
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/8 px-4 py-2 flex items-center justify-between">
                  <p className="font-sans text-white/30 text-xs">{order.id}</p>
                  <button onClick={() => { setSelected(order); setEditing({ status: order.status, trackingNumber: order.tracking_number ?? "", notes: order.notes ?? "" }); }} className="font-sans text-xs text-primary hover:text-primary/70 transition-colors">
                    Manage →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* STOCK VIEW */}
      {view === "stock" && (
        <div className="px-4 py-4 space-y-6">
          <p className="font-sans text-white/40 text-xs">Har size ka stock set karo. 0 = Sold Out.</p>
          {MAIN_PRODUCTS.map(product => {
            const productStock = stock[product.id] ?? {};
            const productEdits = stockEdits[product.id] ?? {};
            const hasEdits = Object.keys(productEdits).length > 0;
            return (
              <div key={product.id} className="border border-white/10">
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <p className="font-display text-base uppercase text-white tracking-wide">{product.name}</p>
                  {hasEdits && (
                    <button
                      onClick={() => handleSaveStock(product.id)}
                      disabled={stockSaving}
                      className="font-sans text-xs bg-primary text-white px-3 py-1.5 hover:bg-primary/80 transition-colors disabled:opacity-50"
                    >
                      {stockSaving ? "Saving..." : "Save"}
                    </button>
                  )}
                </div>
                <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {product.sizes.map(size => {
                    const current = productEdits[size] !== undefined ? productEdits[size] : (productStock[size] ?? 0);
                    const isZero = current === 0;
                    return (
                      <div key={size} className="text-center">
                        <p className={`font-sans text-xs mb-1 ${isZero ? "text-red-400" : "text-white/50"}`}>{size}</p>
                        <input
                          type="number"
                          min={0}
                          value={current}
                          onChange={e => setStockEdits(prev => ({
                            ...prev,
                            [product.id]: { ...(prev[product.id] ?? {}), [size]: Math.max(0, parseInt(e.target.value) || 0) }
                          }))}
                          className={`w-full text-center bg-transparent border py-2 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors ${isZero ? "border-red-500/40" : "border-white/20"}`}
                        />
                        {isZero && <p className="font-sans text-red-400/70 text-[10px] mt-1">Sold Out</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order detail modal */}
      {selected && editing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => { setSelected(null); setEditing(null); }}>
          <div className="w-full sm:max-w-md bg-[#0d0d0d] border border-white/10 max-h-[90dvh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0d0d0d]">
              <p className="font-display text-lg uppercase tracking-wide">Manage Order</p>
              <button onClick={() => { setSelected(null); setEditing(null); }} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>
            <div className="px-5 py-5 space-y-4">
              {/* Customer info */}
              <div className="border border-white/10 divide-y divide-white/8">
                <div className="px-4 py-2"><p className="font-sans text-primary text-xs uppercase tracking-widest font-semibold">Customer</p></div>
                {[
                  ["Order ID", selected.id],
                  ["Name", selected.name],
                  ["Phone", `+91 ${selected.phone}`],
                  ["Product", `${selected.product} — ${selected.size} × ${selected.qty}`],
                  ["Amount", `₹${(selected.price_num * selected.qty).toLocaleString("en-IN")}`],
                  ["Payment", selected.payment_label],
                  ["Address", `${selected.address}, ${selected.city}, ${selected.state} — ${selected.pincode}`],
                  ["Ordered", formatDate(selected.created_at)],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-3 px-4 py-2.5">
                    <span className="font-sans text-white/40 text-xs w-20 shrink-0">{label}</span>
                    <span className="font-sans text-white/80 text-xs break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* Update form */}
              <div className="space-y-3">
                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Order Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => setEditing({ ...editing, status: s })} className={`font-sans text-xs border px-3 py-1.5 transition-all ${editing.status === s ? "border-primary bg-primary/10 text-primary" : "border-white/20 text-white/50 hover:border-white/40"}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={editing.trackingNumber}
                    onChange={e => setEditing({ ...editing, trackingNumber: e.target.value })}
                    placeholder="e.g. DTDC1234567890"
                    className="w-full bg-transparent border border-white/20 px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1">Notes (internal)</label>
                  <textarea
                    value={editing.notes}
                    onChange={e => setEditing({ ...editing, notes: e.target.value })}
                    placeholder="Any internal notes..."
                    rows={2}
                    className="w-full bg-transparent border border-white/20 px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* WhatsApp Notify */}
                {(editing.status === "shipped" || editing.status === "confirmed") && (
                  <button
                    onClick={() => handleNotifyWhatsApp(selected, editing.trackingNumber)}
                    className="w-full border border-green-500/40 text-green-400 font-sans text-sm py-2.5 hover:bg-green-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    📱 WhatsApp pe customer ko notify karo
                  </button>
                )}

                <button
                  onClick={handleUpdateOrder}
                  disabled={saving}
                  className="w-full bg-primary text-white font-sans text-sm py-3 uppercase tracking-widest hover:bg-primary/80 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLASH SALE VIEW */}
      {view === "flashsale" && (
        <div className="p-4 space-y-5">
          {activeSale ? (
            <div className="space-y-4">
              <div className="border border-primary/40 bg-primary/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg text-white uppercase">Active Flash Sale ⚡</p>
                  <span className="bg-green-500/20 text-green-300 border border-green-500/30 font-sans text-xs px-2 py-1">LIVE</span>
                </div>
                <p className="font-sans text-primary font-bold text-2xl">{activeSale.discount_pct}% OFF</p>
                <p className="font-sans text-white text-sm font-medium">{activeSale.title}</p>
                {activeSale.subtitle && <p className="font-sans text-white/50 text-xs">{activeSale.subtitle}</p>}
                <p className="font-sans text-white/40 text-xs">Ends: {formatDate(activeSale.ends_at)}</p>
              </div>
              <button
                onClick={handleEndSale}
                disabled={saleLoading}
                className="w-full border border-red-500/40 text-red-400 font-sans text-sm py-3 hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {saleLoading ? "Ending..." : "🛑 End Flash Sale Now"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-sans text-xs text-white/40 uppercase tracking-widest">Create New Flash Sale</p>
              <div className="space-y-3">
                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={saleForm.title}
                    onChange={e => setSaleForm({ ...saleForm, title: e.target.value })}
                    placeholder="Flash Sale — Today Only!"
                    className="w-full bg-transparent border border-white/20 px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1.5">Subtitle (optional)</label>
                  <input
                    type="text"
                    value={saleForm.subtitle}
                    onChange={e => setSaleForm({ ...saleForm, subtitle: e.target.value })}
                    placeholder="Limited stock — order now!"
                    className="w-full bg-transparent border border-white/20 px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1.5">Discount %</label>
                    <select
                      value={saleForm.discount_pct}
                      onChange={e => setSaleForm({ ...saleForm, discount_pct: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/20 px-3 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-primary"
                    >
                      {[40,50,60].map(v => <option key={v} value={v}>{v}%</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1.5">Duration</label>
                    <select
                      value={saleForm.hours}
                      onChange={e => setSaleForm({ ...saleForm, hours: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/20 px-3 py-2.5 font-sans text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="2">2 hours</option>
                      <option value="6">6 hours</option>
                      <option value="12">12 hours</option>
                      <option value="24">24 hours</option>
                      <option value="48">48 hours</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCreateSale}
                  disabled={saleLoading || !saleForm.title.trim()}
                  className="w-full bg-primary text-white font-sans text-sm py-3.5 uppercase tracking-widest hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saleLoading ? "Creating..." : "⚡ Launch Flash Sale"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOMERS VIEW */}
      {view === "customers" && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="font-sans text-xs text-white/40 uppercase tracking-widest">
              {customersTotal} total registered customer{customersTotal !== 1 ? "s" : ""}
              {customerSearch && customers.length !== customersTotal && ` · ${customers.length} matching`}
            </p>
          </div>

          {/* WhatsApp Broadcast Box */}
          <div className="border border-green-500/25 bg-green-500/5 p-3 space-y-2">
            <p className="font-sans text-green-400 text-xs uppercase tracking-widest">📱 WhatsApp Broadcast</p>
            <textarea
              id="wa-broadcast-msg"
              rows={3}
              defaultValue={`Namaste! 🙏 VEDHHA mein aapka swagat hai — The Eklavya Wear.\n\nAapke liye khaas picks:\n⚡ Gen Z Drop — Oversized Streetwear Tees\n🎩 Gentleman Collection — Premium Linen Kurta\n\nOrder karein: vedhha.com\n\nShukriya! — Team VEDHHA`}
              className="w-full bg-black/40 border border-white/10 px-3 py-2 font-sans text-xs text-white/80 placeholder-white/20 focus:outline-none focus:border-green-500/50 resize-none"
            />
            <button
              onClick={() => {
                const msg = (document.getElementById("wa-broadcast-msg") as HTMLTextAreaElement)?.value || "";
                const encoded = encodeURIComponent(msg);
                customers.filter(c => c.phone).forEach((c, i) => {
                  setTimeout(() => {
                    window.open(`https://wa.me/91${c.phone}?text=${encoded}`, "_blank");
                  }, i * 600);
                });
              }}
              className="w-full py-2 font-sans text-xs text-green-400 border border-green-500/40 hover:bg-green-500/10 transition-colors uppercase tracking-widest"
            >
              📲 Sabko WhatsApp Bhejo ({customers.filter(c => c.phone).length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={customerSearch}
              onChange={e => {
                setCustomerSearch(e.target.value);
                fetchCustomers(adminKey, e.target.value);
              }}
              placeholder="Search by name or phone..."
              className="w-full bg-transparent border border-white/20 px-4 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary"
            />
            {customerSearch && (
              <button
                onClick={() => { setCustomerSearch(""); fetchCustomers(adminKey, ""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-sm"
              >✕</button>
            )}
          </div>
          {customersLoading && <p className="font-sans text-white/40 text-sm text-center py-8">Loading customers...</p>}
          {!customersLoading && customers.length === 0 && (
            <p className="font-sans text-white/30 text-sm text-center py-12">{customerSearch ? "No customers found for that search." : "No customers registered yet."}</p>
          )}
          {!customersLoading && customers.length > 0 && (
            <div className="space-y-2">
              {customers.map(c => (
                <div key={c.id} className="border border-white/10 bg-white/[0.02] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="font-sans text-white text-sm font-medium">{c.name}</p>
                    <p className="font-sans text-white/50 text-xs mt-0.5">+91 {c.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-sans text-xs border px-2 py-0.5 ${c.notificationsEnabled ? "border-green-500/30 bg-green-500/10 text-green-300" : "border-white/10 text-white/30"}`}>
                      {c.notificationsEnabled ? "Notifs on" : "Notifs off"}
                    </span>
                    <p className="font-sans text-white/30 text-xs">{formatDate(c.createdAt)}</p>
                    {c.phone && (
                      <a
                        href={`https://wa.me/91${c.phone}?text=${encodeURIComponent(`Namaste ${c.name} ji! 🙏 VEDHHA mein aapka swagat hai — The Eklavya Wear.\n\nAapke liye khaas picks:\n⚡ Gen Z Drop — Oversized Streetwear Tees\n🎩 Gentleman Collection — Premium Linen Kurta\n\nOrder karein: vedhha.com\n\nShukriya! — Team VEDHHA`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-green-500/40 text-green-400 font-sans text-xs px-3 py-1.5 hover:bg-green-500/10 transition-colors"
                      >
                        📱 WA
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NOTIFY REQUESTS VIEW */}
      {view === "notify" && (
        <div className="p-4 space-y-3">
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest mb-4">{notifyRequests.length} restock request{notifyRequests.length !== 1 ? "s" : ""}</p>
          {notifyRequests.length === 0 ? (
            <p className="font-sans text-white/30 text-sm text-center py-12">No restock requests yet.</p>
          ) : (
            notifyRequests.map((r) => (
              <div key={r.id} className="border border-white/10 bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-sans text-white text-sm font-medium">{r.name}</p>
                  <p className="font-sans text-white/50 text-xs">{r.contact}</p>
                  <p className="font-sans text-primary text-xs mt-1 uppercase tracking-wider">{r.product}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-sans text-white/30 text-xs">{formatDate(r.created_at)}</p>
                  <a
                    href={`https://wa.me/${r.contact.replace(/\D/g, "").startsWith("91") ? "" : "91"}${r.contact.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${r.name}! Great news — *${r.product}* is back in stock at VEDHHA! Order now at vedhha.com 🎉`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-green-500/40 text-green-400 font-sans text-xs px-3 py-1.5 hover:bg-green-500/10 transition-colors"
                  >
                    📱 Notify
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
