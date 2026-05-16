import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import SizeGuide from "@/components/SizeGuide";
import { useFlashSale } from "@/components/FlashSaleBanner";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const PAYMENT_OPTIONS = [
  { id: "cod", label: "Cash on Delivery", icon: "💵", sub: "Pay when your order arrives (you can also pay via UPI transfer)" },
  { id: "online", label: "Pay Online Now", icon: "💳", sub: "UPI · Cards · Net Banking — powered by Razorpay" },
];

export interface VedhhaOrder {
  id: string;
  product: string;
  productImg: string;
  size: string;
  qty: number;
  price: string;
  priceNum: number;
  payment: string;
  paymentLabel: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  timestamp: string;
  status: "active" | "cancelled";
  cancelReason?: string;
  razorpayPaymentId?: string;
}

export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[₹,\s]/g, ""), 10) || 0;
}

export function saveOrderToStorage(order: VedhhaOrder) {
  try {
    const existing = JSON.parse(localStorage.getItem("vedhha_orders") ?? "[]") as VedhhaOrder[];
    localStorage.setItem("vedhha_orders", JSON.stringify([order, ...existing]));
  } catch {}
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function OrderModal({ product, onClose }: Props) {
  const [step, setStep] = useState<"details" | "confirm" | "paying" | "success">("details");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState("cod");
  const [form, setForm] = useState({
    name: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placedOrder, setPlacedOrder] = useState<VedhhaOrder | null>(null);
  const [payError, setPayError] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [referralCode, setReferralCode] = useState(() => {
    const stored = localStorage.getItem("vedhha_referral");
    return stored ? "" : "";
  });
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [codeStatus, setCodeStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [codeOwner, setCodeOwner] = useState("");
  const flashSale = useFlashSale();

  const API_BASE = "";

  const checkReferralCode = useCallback(async (code: string) => {
    if (!code.trim()) { setCodeStatus("idle"); setReferralDiscount(0); return; }
    setCodeStatus("checking");
    try {
      const res = await fetch(`${API_BASE}/api/referral/validate/${code.trim().toUpperCase()}`);
      if (!res.ok) { setCodeStatus("invalid"); setReferralDiscount(0); return; }
      const data = await res.json() as { discount: number; owner: string };
      setReferralDiscount(data.discount);
      setCodeOwner(data.owner);
      setCodeStatus("valid");
    } catch {
      setCodeStatus("invalid");
      setReferralDiscount(0);
    }
  }, [API_BASE]);

  if (!product) return null;

  const priceNum = parsePrice(product.price);
  const baseTotal = priceNum * qty;
  const discountPct = Math.max(referralDiscount, flashSale?.discount_pct ?? 0);
  const discountAmt = discountPct > 0 ? Math.round(baseTotal * discountPct / 100) : 0;
  const totalNum = baseTotal - discountAmt;
  const totalStr = `₹${totalNum.toLocaleString("en-IN")}`;
  const baseTotalStr = `₹${baseTotal.toLocaleString("en-IN")}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!size) e.size = "Please select a size";
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "Please select a state";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!payment) e.payment = "Please select a payment method";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const selectedPayment = PAYMENT_OPTIONS.find((p) => p.id === payment);

  const buildWhatsAppMsg = (extra = "") => [
    `🛍️ *New Order — VEDHHA*`,
    ``,
    `*Product:* ${product.name}`,
    `*Size:* ${size}`,
    `*Quantity:* ${qty}`,
    `*Price:* ${product.price}${qty > 1 ? ` × ${qty} = ${totalStr}` : ""}`,
    `*Payment:* ${selectedPayment?.label ?? payment}`,
    extra,
    ``,
    `*Customer Details:*`,
    `👤 Name: ${form.name}`,
    `📱 Phone: +91 ${form.phone}`,
    ``,
    `*Delivery Address:*`,
    `${form.address}`,
    `${form.city}, ${form.state} — ${form.pincode}`,
  ].filter(Boolean).join("\n");

  const buildOrder = (extra: Partial<VedhhaOrder> = {}): VedhhaOrder => ({
    id: `VDH-${Date.now()}`,
    product: product.name,
    productImg: product.img,
    size,
    qty,
    price: product.price,
    priceNum,
    payment,
    paymentLabel: selectedPayment?.label ?? payment,
    name: form.name,
    phone: form.phone,
    address: form.address,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    timestamp: new Date().toISOString(),
    status: "active",
    ...extra,
  });

  const handleProceed = () => {
    if (validate()) setStep("confirm");
  };

  const saveAndConfirmOrder = async (order: VedhhaOrder) => {
    saveOrderToStorage(order);
    setPlacedOrder(order);
    const productId = product.name.toLowerCase().replace(/\s+/g, "-");
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {}
    try {
      await fetch("/api/stock/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size, qty }),
      });
    } catch {}
    if (referralCode && codeStatus === "valid") {
      fetch(`${API_BASE}/api/referral/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: referralCode }),
      }).catch(() => {});
    }
    setStep("success");
  };

  const handleConfirmStep = async () => {
    setPayError("");

    if (payment === "online") {
      setStep("paying");
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPayError("Could not load payment gateway. Please try again.");
        setStep("confirm");
        return;
      }
      try {
        const res = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalNum }),
        });
        if (!res.ok) throw new Error("Failed to create payment order");
        const { orderId, amount, currency, keyId } = await res.json() as {
          orderId: string; amount: number; currency: string; keyId: string;
        };

        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency,
          order_id: orderId,
          name: "VEDHHA — The Eklavya Wear",
          description: `${product.name} (${size}) × ${qty}`,
          image: "https://vedhha.com/vedhha-logo.png",
          prefill: { name: form.name, contact: `+91${form.phone}` },
          theme: { color: "#b47832" },
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            try {
              const verify = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const { verified } = await verify.json() as { verified: boolean };
              if (verified) {
                const order = buildOrder({ razorpayPaymentId: response.razorpay_payment_id });
                await saveAndConfirmOrder(order);
              } else {
                setPayError("Payment verification failed. Contact us on WhatsApp.");
                setStep("confirm");
              }
            } catch {
              setPayError("Payment verification failed. Contact us on WhatsApp.");
              setStep("confirm");
            }
          },
          modal: {
            ondismiss: () => {
              setStep("confirm");
            },
          },
        });
        rzp.open();
      } catch {
        setPayError("Payment failed. Please try again or choose Cash on Delivery.");
        setStep("confirm");
      }
      return;
    }

    const order = buildOrder();
    await saveAndConfirmOrder(order);
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    type = "text",
    maxLen?: number
  ) => (
    <div>
      <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        maxLength={maxLen}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={`w-full bg-transparent border px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none transition-colors ${
          errors[key] ? "border-red-500/60" : "border-white/20 focus:border-primary"
        }`}
      />
      {errors[key] && <p className="font-sans text-red-400 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  const headerTitle =
    step === "details" ? "Place Order" :
    step === "confirm" ? "Confirm Order" :
    step === "paying" ? "Processing..." :
    "Order Placed!";

  const headerSub =
    step === "details" ? "Fill in your details" :
    step === "confirm" ? "Review and confirm" :
    step === "paying" ? "Complete payment in the popup" :
    "Payment confirmed — thank you!";

  return (
    <>
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={step === "paying" ? undefined : onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full sm:max-w-md bg-[#0d0d0d] border border-white/10 max-h-[92dvh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div>
              <p className="font-display text-xl text-white uppercase tracking-wide">{headerTitle}</p>
              <p className="font-sans text-white/40 text-xs">{headerSub}</p>
            </div>
            {step !== "paying" && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white text-xl"
              >
                ✕
              </button>
            )}
          </div>

          {/* Product strip */}
          {step !== "success" && step !== "paying" && (
            <div className="flex items-center gap-3 px-5 py-3 bg-white/3 border-b border-white/8 shrink-0">
              <img src={product.img} alt={product.name} className="w-12 h-14 object-cover border border-white/10" />
              <div className="flex-1 min-w-0">
                <p className="font-display text-base text-white uppercase truncate">{product.name}</p>
                <p className="font-sans text-primary text-sm font-bold">{product.price}</p>
              </div>
              {size && (
                <span className="font-sans text-xs border border-primary/50 text-primary px-2 py-1">
                  {size} × {qty}
                </span>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            {/* PAYING — spinner */}
            {step === "paying" && (
              <div className="flex flex-col items-center justify-center h-48 gap-4">
                <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="font-sans text-white/50 text-sm">Opening payment window...</p>
                <p className="font-sans text-white/30 text-xs text-center">Complete the payment in the popup</p>
              </div>
            )}

            {/* SUCCESS */}
            {step === "success" && placedOrder && (
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-2xl text-white uppercase tracking-wide">Order Confirmed!</p>
                    <p className="font-sans text-white/40 text-sm mt-1">Thank you — we'll be in touch soon</p>
                  </div>
                </div>

                <div className="border border-primary/30 bg-primary/5">
                  <div className="px-4 py-2 border-b border-primary/20">
                    <p className="font-sans text-primary text-xs uppercase tracking-widest font-semibold">Order Summary</p>
                  </div>
                  <div className="divide-y divide-white/8">
                    {[
                      { label: "Order ID", value: placedOrder.id },
                      { label: "Product", value: placedOrder.product },
                      { label: "Size", value: `${placedOrder.size} × ${placedOrder.qty}` },
                      { label: "Amount", value: placedOrder.price },
                      { label: "Payment", value: placedOrder.paymentLabel },
                      { label: "Deliver to", value: `${placedOrder.city}, ${placedOrder.state}` },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between px-4 py-2.5">
                        <span className="font-sans text-white/40 text-xs">{row.label}</span>
                        <span className="font-sans text-white/90 text-xs font-medium text-right max-w-[60%] break-all">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/4 border border-white/10 px-4 py-4 space-y-2">
                  <p className="font-sans text-white/60 text-xs leading-relaxed text-center">
                    Your order is confirmed. Our team will contact you shortly to arrange delivery.
                  </p>
                  {placedOrder.payment === "online" ? (
                    <p className="font-sans text-green-400/80 text-xs text-center">
                      Payment received online — no further action needed.
                    </p>
                  ) : (
                    <p className="font-sans text-white/40 text-xs text-center">
                      Want to pay online? Transfer via UPI to <span className="text-primary font-medium">9151304494@kotak811</span> and WhatsApp the screenshot to <span className="text-primary font-medium">+91 91513 04494</span>
                    </p>
                  )}
                </div>

                <div className="bg-white/3 border border-white/10 px-4 py-3 text-center">
                  <p className="font-sans text-white/40 text-xs">
                    View order details in <span className="text-primary font-medium">My Orders</span> in the menu.
                  </p>
                </div>
              </div>
            )}

            {/* DETAILS */}
            {step === "details" && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest">Size *</label>
                    <button onClick={() => setShowSizeGuide(true)} className="font-sans text-xs text-primary/80 hover:text-primary transition-colors underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSize(s); setErrors({ ...errors, size: "" }); }}
                        className={`w-12 h-10 font-sans text-sm border transition-all ${
                          size === s ? "bg-primary border-primary text-white" : "border-white/20 text-white/60 hover:border-primary hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.size && <p className="font-sans text-red-400 text-xs mt-1">{errors.size}</p>}
                </div>

                <div>
                  <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 border border-white/20 text-white/60 hover:border-primary hover:text-primary transition-colors text-lg">−</button>
                    <span className="font-display text-xl text-white w-6 text-center">{qty}</span>
                    <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-9 h-9 border border-white/20 text-white/60 hover:border-primary hover:text-primary transition-colors text-lg">+</button>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <p className="font-display text-base text-white uppercase tracking-wide mb-3">Delivery Details</p>
                  <div className="space-y-3">
                    {field("name", "Full Name *", "Your full name")}
                    <div>
                      <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1">Phone Number *</label>
                      <div className={`flex border transition-colors ${errors.phone ? "border-red-500/60" : "border-white/20 focus-within:border-primary"}`}>
                        <span className="px-3 py-2.5 font-sans text-sm text-white/40 bg-white/5 border-r border-white/20">+91</span>
                        <input
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          maxLength={10}
                          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                          className="flex-1 bg-transparent px-3 py-2.5 font-sans text-sm text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>
                      {errors.phone && <p className="font-sans text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    {field("address", "Full Address *", "House / flat no., street, landmark")}
                    <div className="grid grid-cols-2 gap-3">
                      {field("city", "City *", "Your city")}
                      {field("pincode", "Pincode *", "6-digit pincode", "number", 6)}
                    </div>
                    <div>
                      <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-1">State *</label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className={`w-full bg-[#0d0d0d] border px-3 py-2.5 font-sans text-sm text-white focus:outline-none transition-colors appearance-none ${
                          errors.state ? "border-red-500/60" : "border-white/20 focus:border-primary"
                        }`}
                      >
                        <option value="" disabled className="text-white/40">Select your state</option>
                        {STATES.map((s) => (
                          <option key={s} value={s} className="bg-[#0d0d0d]">{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="font-sans text-red-400 text-xs mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <p className="font-display text-base text-white uppercase tracking-wide mb-3">Payment Method *</p>
                  <div className="space-y-2">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setPayment(opt.id); setErrors({ ...errors, payment: "" }); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 border transition-all text-left ${
                          payment === opt.id ? "border-primary bg-primary/10" : "border-white/15 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <div className="flex-1">
                          <p className={`font-sans text-sm font-medium ${payment === opt.id ? "text-primary" : "text-white"}`}>{opt.label}</p>
                          <p className="font-sans text-white/40 text-xs">{opt.sub}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payment === opt.id ? "border-primary" : "border-white/30"}`}>
                          {payment === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.payment && <p className="font-sans text-red-400 text-xs mt-1">{errors.payment}</p>}
                </div>

                {/* Referral Code / Flash Sale Discount */}
                <div className="border-t border-white/8 pt-4 space-y-2">
                  {flashSale && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-2.5 rounded-sm">
                      <span className="text-sm">⚡</span>
                      <p className="font-sans text-sm text-primary">Flash Sale: <strong>{flashSale.discount_pct}% off</strong> auto-applied!</p>
                    </div>
                  )}
                  <div>
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Referral Code (optional)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralCode}
                        onChange={e => { setReferralCode(e.target.value.toUpperCase()); setCodeStatus("idle"); setReferralDiscount(0); }}
                        placeholder="VED-NAME-XXXX"
                        className="flex-1 bg-transparent border border-white/15 text-white font-sans text-sm px-3 py-2.5 focus:border-primary outline-none placeholder:text-white/20 transition-colors uppercase"
                      />
                      <button
                        onClick={() => checkReferralCode(referralCode)}
                        disabled={codeStatus === "checking" || !referralCode.trim()}
                        className="px-4 py-2.5 border border-white/20 font-sans text-xs uppercase tracking-wider text-white hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                      >
                        {codeStatus === "checking" ? "..." : "Apply"}
                      </button>
                    </div>
                    {codeStatus === "valid" && (
                      <p className="font-sans text-green-400 text-xs mt-1">✓ Code valid! {referralDiscount}% off applied — referred by {codeOwner}</p>
                    )}
                    {codeStatus === "invalid" && (
                      <p className="font-sans text-red-400 text-xs mt-1">✗ Invalid code. Try again.</p>
                    )}
                  </div>
                  {discountPct > 0 && (
                    <div className="flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-2.5">
                      <span className="font-sans text-white/60 text-sm">Original Price</span>
                      <span className="font-sans text-white/40 text-sm line-through">{baseTotalStr}</span>
                    </div>
                  )}
                  {discountPct > 0 && (
                    <div className="flex items-center justify-between border border-primary/30 bg-primary/5 px-4 py-2.5">
                      <span className="font-sans text-primary text-sm font-medium">You Pay ({discountPct}% off)</span>
                      <span className="font-sans text-primary text-base font-bold">{totalStr}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* CONFIRM */}
            {step === "confirm" && (
              <div className="space-y-4">
                <div className="border border-white/10 divide-y divide-white/8">
                  {[
                    { label: "Product", value: product.name },
                    { label: "Size", value: size },
                    { label: "Quantity", value: `${qty} piece${qty > 1 ? "s" : ""}` },
                    discountPct > 0 ? { label: "Original", value: baseTotalStr } : null,
                    discountPct > 0 ? { label: `Discount (${discountPct}% off)`, value: `-₹${discountAmt.toLocaleString("en-IN")}` } : null,
                    { label: "Total", value: totalStr },
                    { label: "Payment", value: selectedPayment?.label ?? "" },
                  ].filter(Boolean).map((row) => (
                    <div key={row!.label} className={`flex justify-between px-4 py-3 ${row!.label.startsWith("Discount") ? "bg-primary/5" : ""}`}>
                      <span className={`font-sans text-sm ${row!.label.startsWith("Discount") ? "text-primary" : "text-white/50"}`}>{row!.label}</span>
                      <span className={`font-sans text-sm font-medium text-right ${row!.label.startsWith("Discount") ? "text-primary" : "text-white"}`}>{row!.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border border-white/10 divide-y divide-white/8">
                  <div className="px-4 py-2">
                    <p className="font-display text-sm text-white/50 uppercase tracking-wider">Delivery To</p>
                  </div>
                  <div className="px-4 py-3 space-y-1">
                    <p className="font-sans text-white text-sm font-medium">{form.name}</p>
                    <p className="font-sans text-white/60 text-sm">+91 {form.phone}</p>
                    <p className="font-sans text-white/60 text-sm leading-relaxed">{form.address}<br />{form.city}, {form.state} — {form.pincode}</p>
                  </div>
                </div>

                {payError && (
                  <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
                    <p className="font-sans text-red-400 text-xs">{payError}</p>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 px-4 py-3 flex items-start gap-3">
                  <span className="text-lg mt-0.5">{payment === "online" ? "💳" : "📦"}</span>
                  <p className="font-sans text-white/70 text-xs leading-relaxed">
                    {payment === "online"
                      ? "A secure Razorpay payment window will open. Pay via UPI, card, or net banking."
                      : "Your order will be confirmed and our team will contact you shortly to arrange delivery."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/10 shrink-0 space-y-2">
            {step === "details" && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleProceed}
                className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors">
                Review Order →
              </motion.button>
            )}

            {step === "confirm" && (
              <div className="space-y-2">
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleConfirmStep}
                  className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors flex items-center justify-center gap-2">
                  {payment === "online" ? <><span>💳</span> Pay Now →</> : <><span>✓</span> Confirm Order</>}
                </motion.button>
                <button onClick={() => { setStep("details"); setPayError(""); }}
                  className="w-full py-2 font-sans text-xs text-white/40 hover:text-white/70 transition-colors">
                  ← Edit Details
                </button>
              </div>
            )}

            {step === "success" && (
              <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
                className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-white/10 text-white hover:bg-white/20 transition-colors">
                Close
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    <SizeGuide open={showSizeGuide} onClose={() => setShowSizeGuide(false)} onSizeSelect={(s) => { setSize(s); setErrors({ ...errors, size: "" }); }} />
    </>
  );
}
