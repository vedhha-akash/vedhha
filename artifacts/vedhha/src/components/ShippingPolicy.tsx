import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

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

export default function ShippingPolicy({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[350] overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="min-h-screen flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10">
              <div>
                <p className="font-display text-2xl text-white uppercase tracking-wide">Shipping & Policy</p>
                <p className="font-sans text-xs text-white/40">Everything you need to know</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center font-sans text-lg"
              >
                ×
              </button>
            </div>

            <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
              {sections.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="border border-white/8 bg-white/[0.02] p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <h3 className="font-display text-lg text-white uppercase tracking-wide">{s.title}</h3>
                  </div>
                  <p className="font-sans text-sm text-white/55 leading-relaxed">{s.content}</p>
                </motion.div>
              ))}

              <div className="border border-primary/30 bg-primary/5 p-5 text-center space-y-3">
                <p className="font-display text-lg text-white uppercase">Need Help?</p>
                <p className="font-sans text-sm text-white/50">We're here to answer any question about your order.</p>
                <a
                  href="https://wa.me/919151304494?text=Hi%20VEDHHA!%20I%20have%20a%20question%20about%20my%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-sans text-xs uppercase tracking-[0.25em] bg-primary text-white px-6 py-3 hover:bg-primary/80 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
