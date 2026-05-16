import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PRODUCTS = [
  "Heritage Hoodie",
  "Eklavya Bomber",
  "VEDHHA Blazer",
  "Lord I Can't But You Can Tee",
  "Seek His Kingdom Tee",
  "Keep God First Tee",
  "Tokyo Street Tee",
  "Cristo Vive Tee",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function WriteReviewModal({ open, onClose, onSubmitted }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [product, setProduct] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName(""); setLocation(""); setProduct("");
    setRating(0); setHoverRating(0); setReview("");
    setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const submit = async () => {
    if (!name.trim() || !location.trim() || !product || !rating || review.trim().length < 20) {
      setError("Please fill all fields. Review must be at least 20 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/customer-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location, product, rating, review }),
      });
      if (!res.ok) throw new Error("Failed");
      reset();
      onSubmitted();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="wr-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300]"
            onClick={handleClose}
          />
          <motion.div
            key="wr-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[440px] z-[310] flex flex-col"
            style={{ background: "#0d0d0d", border: "1px solid hsl(var(--primary)/25)" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div>
                <h3 className="font-display text-white text-lg uppercase tracking-wide">Write a Review</h3>
                <p className="font-sans text-white/40 text-xs mt-0.5">Share your VEDHHA experience</p>
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white text-xl transition-colors">×</button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: "70vh" }}>
              {/* Star Rating */}
              <div>
                <label className="font-sans text-white/50 text-xs uppercase tracking-wider mb-2 block">Your Rating *</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24"
                        fill={s <= displayRating ? "#c17f3e" : "none"}
                        stroke="#c17f3e" strokeWidth="1.5"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                  {displayRating > 0 && (
                    <span className="font-sans text-primary text-sm ml-2 self-center">
                      {["","Poor","Fair","Good","Great","Excellent"][displayRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Product */}
              <div>
                <label className="font-sans text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Product *</label>
                <select
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 text-white text-sm font-sans px-3 py-2.5 focus:outline-none focus:border-primary/50 appearance-none"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                >
                  <option value="" className="bg-[#0d0d0d]">Select a product...</option>
                  {PRODUCTS.map(p => <option key={p} value={p} className="bg-[#0d0d0d]">{p}</option>)}
                </select>
              </div>

              {/* Name + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Arjun S."
                    className="w-full bg-black/40 border border-white/15 text-white text-sm font-sans px-3 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="font-sans text-white/50 text-xs uppercase tracking-wider mb-1.5 block">City *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full bg-black/40 border border-white/15 text-white text-sm font-sans px-3 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="font-sans text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Your Review *</label>
                <textarea
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  placeholder="Tell us about your experience with the product — fit, quality, delivery..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/15 text-white text-sm font-sans px-3 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-primary/50 resize-none"
                />
                <p className="font-sans text-white/20 text-[10px] mt-1">{review.length} chars · min 20</p>
              </div>

              {error && (
                <p className="font-sans text-red-400 text-xs">{error}</p>
              )}
            </div>

            {/* Submit */}
            <div className="px-5 py-4 border-t border-white/8">
              <button
                onClick={submit}
                disabled={loading}
                className="w-full py-3 font-display text-sm uppercase tracking-widest transition-opacity disabled:opacity-50"
                style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
