import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = "";

interface ReferralInfo {
  code: string;
  uses: number;
}

interface Props {
  onBack: () => void;
}

export default function ReferralPanel({ onBack }: Props) {
  const [step, setStep] = useState<"check" | "form" | "code">("check");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Try to load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("vedhha_referral");
    if (stored) {
      try {
        const r = JSON.parse(stored) as ReferralInfo;
        setReferral(r);
        setStep("code");
        // Refresh uses count
        fetch(`${API}/api/referral/validate/${r.code}`)
          .then(res => res.json())
          .catch(() => {});
      } catch {}
    } else {
      // Try to pre-fill from user session
      const user = localStorage.getItem("vedhha_user");
      if (user) {
        try {
          const u = JSON.parse(user);
          if (u.name) setName(u.name);
          if (u.phone) setContact(u.phone);
        } catch {}
      }
      setStep("form");
    }
  }, []);

  const handleGenerate = async () => {
    if (!name.trim() || !contact.trim()) {
      setError("Name and phone/email are both required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/referral/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), contact: contact.trim() }),
      });
      const data = await res.json() as ReferralInfo;
      setReferral(data);
      localStorage.setItem("vedhha_referral", JSON.stringify(data));
      setStep("code");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!referral) return;
    navigator.clipboard.writeText(referral.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOnWhatsApp = () => {
    if (!referral) return;
    const msg = `Hey, check out VEDHHA — India's freshest luxury streetwear! 🔥\n\nUse my referral code: *${referral.code}* — you'll get 40% off!\n\nShop now: vedhha.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
        <button onClick={onBack} className="text-white/50 hover:text-white transition-colors text-lg">←</button>
        <div>
          <p className="font-display text-lg text-white uppercase tracking-wide">Referral Program</p>
          <p className="font-sans text-xs text-white/40">Both of you get 40% off</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        {/* How it works */}
        <div className="border border-primary/20 bg-primary/5 p-4 space-y-3">
          <p className="font-display text-base text-white uppercase tracking-wide">How It Works</p>
          <div className="space-y-2">
            {[
              { n: "1", t: "Generate your unique referral code" },
              { n: "2", t: "Share it with a friend on WhatsApp" },
              { n: "3", t: "They use the code at checkout" },
              { n: "4", t: "Both of you get 40% off! 🎉" },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary font-sans text-xs flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                <p className="font-sans text-sm text-white/70">{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="font-sans text-xs text-white/40 uppercase tracking-widest">Create Your Code</p>
              <div>
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Arjun Sharma"
                  className="w-full bg-transparent border border-white/15 text-white font-sans text-sm px-3 py-2.5 focus:border-primary outline-none placeholder:text-white/20 transition-colors"
                />
              </div>
              <div>
                <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Phone / Email</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-transparent border border-white/15 text-white font-sans text-sm px-3 py-2.5 focus:border-primary outline-none placeholder:text-white/20 transition-colors"
                />
              </div>
              {error && <p className="font-sans text-red-400 text-xs">{error}</p>}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate My Code"}
              </motion.button>
            </motion.div>
          )}

          {step === "code" && referral && (
            <motion.div key="code" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border border-primary/40 bg-primary/10 p-5 text-center space-y-2">
                <p className="font-sans text-xs text-white/50 uppercase tracking-widest">Tera Referral Code</p>
                <p className="font-display text-3xl text-primary tracking-widest font-bold">{referral.code}</p>
                <p className="font-sans text-xs text-white/40">{referral.uses} baar use hua</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={copyCode}
                  className="py-3 border border-white/20 font-sans text-sm text-white hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? "✓ Copied!" : "📋 Copy Code"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={shareOnWhatsApp}
                  className="py-3 bg-[#25D366] font-sans text-sm text-white hover:bg-[#22c55e] transition-colors flex items-center justify-center gap-2"
                >
                  📱 Share
                </motion.button>
              </div>

              <div className="border border-white/8 bg-white/[0.02] p-4 space-y-2">
                <p className="font-sans text-xs text-white/50 uppercase tracking-widest">Share karne ka message</p>
                <p className="font-sans text-sm text-white/60 leading-relaxed">
                  "Yaar, VEDHHA checkout kar! Mera code <span className="text-primary font-bold">{referral.code}</span> use kar — <span className="text-primary">40% discount</span> milega! 🔥"
                </p>
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem("vedhha_referral");
                  setReferral(null);
                  setStep("form");
                }}
                className="w-full py-2 font-sans text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                Naaya code banao
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
