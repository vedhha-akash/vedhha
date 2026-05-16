import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashSale {
  id: number;
  title: string;
  subtitle: string;
  discount_pct: number;
  ends_at: string;
}

const API = "";

function useCountdown(endsAt: string) {
  const getRemaining = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, total: diff };
  }, [endsAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
    }, 1000);
    return () => clearInterval(timer);
  }, [getRemaining]);

  return remaining;
}

function Pad({ n }: { n: number }) {
  return <span>{String(n).padStart(2, "0")}</span>;
}

export default function FlashSaleBanner() {
  const [sale, setSale] = useState<FlashSale | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/flash-sale`)
      .then(r => r.json())
      .then(d => { if (d.sale) setSale(d.sale); })
      .catch(() => {});
  }, []);

  const remaining = useCountdown(sale?.ends_at ?? "");

  // Auto-hide when expired
  useEffect(() => {
    if (sale && !remaining) setSale(null);
  }, [sale, remaining]);

  if (!sale || dismissed || !remaining) return null;

  const { h, m, s } = remaining;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-primary relative z-40"
      >
        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-sm hidden sm:block">⚡</span>
            <div className="min-w-0">
              <span className="font-display text-white uppercase tracking-wider text-sm sm:text-base font-bold">{sale.title}</span>
              {sale.subtitle && <span className="font-sans text-white/80 text-xs ml-2 hidden sm:inline">{sale.subtitle}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 font-mono text-white font-bold text-sm bg-black/20 rounded px-2 py-1">
              <Pad n={h} />:<Pad n={m} />:<Pad n={s} />
            </div>
            <div className="bg-white text-primary font-display font-bold text-sm px-2 py-1 rounded uppercase tracking-wide">
              {sale.discount_pct}% OFF
            </div>
            <button onClick={() => setDismissed(true)} className="text-white/60 hover:text-white text-lg leading-none">×</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export type { FlashSale };
export function useFlashSale() {
  const [sale, setSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    fetch(`${API}/api/flash-sale`)
      .then(r => r.json())
      .then(d => { if (d.sale) setSale(d.sale); })
      .catch(() => {});
  }, []);

  const remaining = useCountdown(sale?.ends_at ?? "");
  useEffect(() => { if (sale && !remaining) setSale(null); }, [sale, remaining]);

  return sale && remaining ? sale : null;
}
