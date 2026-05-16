import { useLocation } from "wouter";
import { motion } from "framer-motion";

const sections = [
  {
    icon: "📦",
    title: "Dispatch Time",
    content: "All orders are dispatched within 3–5 business days of payment confirmation. You will receive a WhatsApp message with your tracking number once shipped.",
  },
  {
    icon: "🚚",
    title: "Delivery Timeline",
    content: "Standard delivery takes 5–8 business days across India. Remote locations (J&K, North East) may take 2–3 extra days. Express delivery available on request via WhatsApp.",
  },
  {
    icon: "💳",
    title: "Payment",
    content: "We accept UPI payments (9151304494@kotak811). Pay first, then we pack and ship. You'll get a confirmation message on WhatsApp within 2 hours of payment.",
  },
  {
    icon: "🔄",
    title: "Exchange Policy",
    content: "We offer size exchanges within 7 days of delivery. The product must be unused, unwashed, and in original condition with tags intact. Contact us on WhatsApp to initiate an exchange.",
  },
  {
    icon: "❌",
    title: "Returns & Refunds",
    content: "We do not offer cash refunds. However, if you receive a damaged or incorrect item, we will replace it at no extra cost. Send us a photo on WhatsApp within 48 hours of delivery.",
  },
  {
    icon: "📍",
    title: "Shipping Coverage",
    content: "We ship pan-India via reputed courier partners. International shipping is not available at the moment but coming soon.",
  },
];

export default function Shipping() {
  const [, navigate] = useLocation();

  return (
    <main className="bg-background min-h-screen text-foreground">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="font-sans text-white/50 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
        <div className="w-px h-4 bg-white/20" />
        <h1 className="font-display text-lg text-white uppercase tracking-wide">Shipping & Policy</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <div className="mb-10">
          <p className="font-display text-4xl text-white uppercase">Shipping &</p>
          <p className="font-display text-4xl text-primary uppercase">Policy</p>
          <p className="font-sans text-sm text-white/40 mt-3">Everything you need to know about ordering from VEDHHA.</p>
        </div>

        {sections.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="border border-white/8 bg-white/[0.02] p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-display text-xl text-white uppercase tracking-wide">{s.title}</h3>
            </div>
            <p className="font-sans text-sm text-white/55 leading-relaxed">{s.content}</p>
          </motion.div>
        ))}

        <div className="border border-primary/30 bg-primary/5 p-6 text-center space-y-4 mt-8">
          <p className="font-display text-xl text-white uppercase">Need Help?</p>
          <p className="font-sans text-sm text-white/50">We're here to answer any question about your order.</p>
          <a
            href="https://wa.me/919151304494?text=Hi%20VEDHHA!%20I%20have%20a%20question%20about%20shipping%20or%20my%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans text-xs uppercase tracking-[0.25em] bg-primary text-white px-8 py-3.5 hover:bg-primary/80 transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="font-sans text-xs text-white/25 uppercase tracking-widest">© 2024 VEDHHA — The Eklavya Wear</p>
        </div>
      </div>
    </main>
  );
}
