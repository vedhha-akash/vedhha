import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { ALL_PRODUCTS } from "@/data/products";
import type { Product } from "@/data/products";

interface Props {
  open: boolean;
  tab: "liked" | "wishlist";
  onClose: () => void;
  onProduct: (product: Product) => void;
}

export default function WishlistDrawer({ open, tab, onClose, onProduct }: Props) {
  const { liked, wishlisted, toggleLike, toggleWishlist } = useWishlist();

  const items = tab === "liked"
    ? ALL_PRODUCTS.filter(p => liked.has(p.name))
    : ALL_PRODUCTS.filter(p => wishlisted.has(p.name));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[151] w-full max-w-sm bg-[#0e0e0e] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                {tab === "liked" ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#c8832a" stroke="#c8832a" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#c8832a" stroke="#c8832a" strokeWidth="1.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                )}
                <h3 className="text-white font-display text-lg uppercase tracking-widest">
                  {tab === "liked" ? "Liked" : "Wishlist"}
                </h3>
                <span className="text-white/40 font-sans text-sm">({items.length})</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  {tab === "liked" ? (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" opacity="0.2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  )}
                  <p className="text-white/30 font-sans text-sm">
                    {tab === "liked"
                      ? "No liked products yet. Tap the heart on any product."
                      : "Your wishlist is empty. Tap the bookmark on any product."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {items.map(product => (
                    <div
                      key={product.name}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => { onClose(); setTimeout(() => onProduct(product), 200); }}
                    >
                      {/* Product image */}
                      <div className="w-16 h-16 bg-secondary shrink-0 overflow-hidden">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-display text-sm uppercase leading-tight truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-primary font-display text-base font-bold">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-white/30 text-xs line-through">{product.originalPrice}</span>
                          )}
                          {product.discount && !product.soldOut && (
                            <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5">{product.discount}</span>
                          )}
                        </div>
                        {product.soldOut && (
                          <span className="text-white/30 font-sans text-xs">Sold Out</span>
                        )}
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          tab === "liked" ? toggleLike(product.name) : toggleWishlist(product.name);
                        }}
                        className="shrink-0 w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
