import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE = "";

interface Props {
  open: boolean;
  onClose: () => void;
  productName: string;
}

export default function NotifyMeModal({ open, onClose, productName }: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !contact.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productName, name: name.trim(), contact: contact.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName(""); setContact(""); setDone(false); setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[400] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 p-6"
          >
            {done ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center mx-auto">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="font-display text-xl text-white uppercase">You're on the list!</p>
                <p className="font-sans text-sm text-white/50">We'll notify you the moment <span className="text-primary">{productName}</span> is back in stock.</p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full py-3 font-sans text-xs uppercase tracking-[0.25em] bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <p className="font-display text-xl text-white uppercase tracking-wide">Notify Me</p>
                  <p className="font-sans text-xs text-white/40 mt-1">Be the first to know when <span className="text-primary">{productName}</span> is back.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Arjun Sharma"
                      className="w-full bg-transparent border border-white/15 text-white font-sans text-sm px-3 py-2.5 focus:border-primary outline-none placeholder:text-white/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-white/50 uppercase tracking-widest block mb-2">Phone / Email</label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="9876543210 or you@email.com"
                      className="w-full bg-transparent border border-white/15 text-white font-sans text-sm px-3 py-2.5 focus:border-primary outline-none placeholder:text-white/20 transition-colors"
                    />
                  </div>
                  {error && <p className="font-sans text-red-400 text-xs">{error}</p>}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Notify Me When Back"}
                  </motion.button>
                  <button onClick={handleClose} className="w-full py-2 font-sans text-xs text-white/30 hover:text-white/60 transition-colors">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
