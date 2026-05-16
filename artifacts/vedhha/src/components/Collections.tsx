import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, GENZ_PRODUCTS, type Product } from "@/data/products";
import ProductModal from "./ProductModal";
import OrderModal from "./OrderModal";
import { useVedhhaTheme } from "@/context/ThemeContext";
import { useWishlist } from "@/context/WishlistContext";

const MAIN_TABS = ["All", "Men", "Women", "Unisex"] as const;
type MainTab = (typeof MAIN_TABS)[number];

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ProductCard({
  prod,
  liked,
  wishlisted,
  onLike,
  onWishlist,
  onClick,
  onBuy,
  index = 0,
  showPrice = true,
}: {
  prod: Product;
  liked: boolean;
  wishlisted: boolean;
  onLike: (e: React.MouseEvent) => void;
  onWishlist: (e: React.MouseEvent) => void;
  onClick: () => void;
  onBuy: (e: React.MouseEvent) => void;
  index?: number;
  showPrice?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
        <motion.img
          src={prod.img}
          alt={prod.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 ${prod.soldOut ? "grayscale-[30%]" : ""}`}
          style={{ transformOrigin: "center" }}
        />

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* SOLD OUT stamp */}
        {prod.soldOut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.4, type: "spring" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="border-4 border-white/60 px-5 py-1">
              <span className="font-display font-black text-white uppercase tracking-[0.4em] text-xl">
                Sold Out
              </span>
            </div>
          </motion.div>
        )}

        {/* Category tag — top left */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className="bg-black/70 text-white font-sans text-[10px] uppercase tracking-widest px-2 py-1 backdrop-blur-sm">
            {prod.category}
          </span>
          {prod.discount && !prod.soldOut && (
            <span className="bg-primary text-white font-sans text-[10px] font-bold uppercase tracking-widest px-2 py-1">
              {prod.discount}
            </span>
          )}
        </div>

        {/* Like & Wishlist — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.1 }}
            onClick={onLike}
            className={`w-9 h-9 flex items-center justify-center bg-black/70 border backdrop-blur-sm transition-colors duration-200 ${
              liked ? "border-primary text-primary" : "border-white/20 text-white/60 hover:border-primary hover:text-primary"
            }`}
            title="Like"
          >
            <HeartIcon filled={liked} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.1 }}
            onClick={onWishlist}
            className={`w-9 h-9 flex items-center justify-center bg-black/70 border backdrop-blur-sm transition-colors duration-200 ${
              wishlisted ? "border-accent text-accent" : "border-white/20 text-white/60 hover:border-accent hover:text-accent"
            }`}
            title="Wishlist"
          >
            <BookmarkIcon filled={wishlisted} />
          </motion.button>
        </div>

        {/* Bottom hover bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="font-sans uppercase tracking-[0.25em] text-xs text-white/80">
            Tap to explore
          </span>
          <span className="text-white/80 text-lg">→</span>
        </motion.div>
      </div>

      {/* Product info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h4 className="text-white font-display text-xl uppercase tracking-wide leading-tight">{prod.name}</h4>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-wider mt-0.5">{prod.category}</p>
        </div>
        {showPrice && (
          <div className="flex flex-col items-end shrink-0">
            <p className={`font-display text-2xl font-bold ${prod.soldOut ? "text-white/25 line-through" : "text-primary"}`}>
              {prod.price}
            </p>
            {prod.originalPrice && !prod.soldOut && (
              <p className="text-white/35 font-display text-sm line-through leading-none">
                {prod.originalPrice}
              </p>
            )}
            {prod.discount && !prod.soldOut && (
              <span className="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 mt-0.5">
                {prod.discount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 mt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onLike}
          className={`flex items-center gap-1 font-sans text-xs transition-colors px-2 py-1 border ${
            liked ? "border-primary text-primary" : "border-white/10 text-white/30 hover:border-primary hover:text-primary"
          }`}
        >
          <HeartIcon filled={liked} />
          {liked ? "Liked" : "Like"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onWishlist}
          className={`flex items-center gap-1 font-sans text-xs transition-colors px-2 py-1 border ${
            wishlisted ? "border-accent text-accent" : "border-white/10 text-white/30 hover:border-accent hover:text-accent"
          }`}
        >
          <BookmarkIcon filled={wishlisted} />
          {wishlisted ? "Wishlisted" : "Wishlist"}
        </motion.button>

        {prod.soldOut ? (
          <span className="ml-auto font-sans uppercase tracking-[0.2em] text-xs border border-white/10 text-white/25 px-4 py-2 cursor-not-allowed">
            Sold Out
          </span>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBuy}
            className="ml-auto font-sans uppercase tracking-[0.2em] text-xs bg-primary text-white px-4 py-2 hover:bg-primary/80 transition-colors"
          >
            Buy Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default function Collections() {
  const [activeSection, setActiveSection] = useState<"main" | "genz">("genz");
  const [activeTab, setActiveTab] = useState<MainTab>("All");
  const { setTheme } = useVedhhaTheme();

  function switchSection(section: "main" | "genz") {
    setActiveSection(section);
    setTheme(section === "main" ? "gentleman" : "genz");
  }
  const { liked, wishlisted, toggleLike, toggleWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const pendingProduct = useRef<Product | null>(null);

  useEffect(() => {
    const onLoginSuccess = (e: Event) => {
      const prod = (e as CustomEvent<Product>).detail;
      if (prod) {
        setSelectedProduct(null);
        setOrderProduct(prod);
      }
      pendingProduct.current = null;
    };
    window.addEventListener("vedhha:loginSuccess", onLoginSuccess);
    return () => window.removeEventListener("vedhha:loginSuccess", onLoginSuccess);
  }, []);

  function handleBuyClick(prod: Product) {
    try {
      const saved = localStorage.getItem("vedhha_user");
      if (saved) {
        setSelectedProduct(null);
        setOrderProduct(prod);
        return;
      }
    } catch {}
    pendingProduct.current = prod;
    window.dispatchEvent(new CustomEvent("vedhha:requireLogin", { detail: prod }));
  }

  const filteredMain =
    activeTab === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.gender === activeTab);

  const handleToggleLike = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    toggleLike(name);
  };
  const handleToggleWishlist = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    toggleWishlist(name);
  };

  return (
    <>
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuy={(prod) => handleBuyClick(prod)}
      />
      <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />

      <section id="collections" className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1400px]">

          {/* Section switcher */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase text-white mb-4">
              Collections
            </h2>
            <div className="flex gap-3 flex-wrap">
              <button
                data-section="genz"
                onClick={() => switchSection("genz")}
                className={`font-sans uppercase tracking-[0.25em] text-sm px-6 py-3 border transition-all duration-300 flex items-center gap-2 ${
                  activeSection === "genz"
                    ? "bg-accent border-accent text-black font-bold"
                    : "border-accent/40 text-accent hover:border-accent"
                }`}
              >
                ⚡ Gen Z Collection
                <span className="text-[10px] bg-black/20 px-2 py-0.5 font-bold tracking-wider">
                  SOLD OUT
                </span>
              </button>
              <button
                data-section="main"
                onClick={() => switchSection("main")}
                className={`font-sans uppercase tracking-[0.25em] text-sm px-6 py-3 border transition-all duration-300 ${
                  activeSection === "main"
                    ? "bg-primary border-primary text-white"
                    : "border-white/20 text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                🎩 Gentleman Clothes
              </button>
            </div>
          </motion.div>

          {/* ── MAIN COLLECTION ── */}
          <AnimatePresence mode="wait">
            {activeSection === "main" && (
              <motion.div
                key="main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Gender filter tabs */}
                <div className="flex gap-3 mb-10 flex-wrap">
                  {MAIN_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`font-sans uppercase tracking-[0.25em] text-sm px-6 py-2 border transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-primary border-primary text-white"
                          : "border-white/20 text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {tab}
                      <span className="ml-2 text-xs opacity-60">
                        ({tab === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.gender === tab).length})
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {filteredMain.map((prod, i) => (
                    <ProductCard
                      key={prod.name}
                      prod={prod}
                      index={i}
                      liked={liked.has(prod.name)}
                      wishlisted={wishlisted.has(prod.name)}
                      onLike={(e) => handleToggleLike(e, prod.name)}
                      onWishlist={(e) => handleToggleWishlist(e, prod.name)}
                      onClick={() => setSelectedProduct(prod)}
                      onBuy={(e) => { e.stopPropagation(); handleBuyClick(prod); }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── GEN Z COLLECTION ── */}
            {activeSection === "genz" && (
              <motion.div
                key="genz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Gen Z header */}
                <div className="mb-10 p-5 border border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display text-2xl text-accent uppercase tracking-widest">Gen Z Collection</span>
                    <span className="font-sans text-xs bg-white/10 border border-white/20 text-white/60 px-3 py-1 uppercase tracking-widest">
                      All Sold Out
                    </span>
                  </div>
                  <p className="text-muted-foreground font-sans text-sm">
                    These limited drops are sold out. Stay tuned for restocks — or DM us on WhatsApp to get notified.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {GENZ_PRODUCTS.map((prod, i) => (
                    <ProductCard
                      key={prod.name}
                      prod={prod}
                      index={i}
                      showPrice={false}
                      liked={liked.has(prod.name)}
                      wishlisted={wishlisted.has(prod.name)}
                      onLike={(e) => handleToggleLike(e, prod.name)}
                      onWishlist={(e) => handleToggleWishlist(e, prod.name)}
                      onClick={() => setSelectedProduct(prod)}
                      onBuy={(e) => { e.stopPropagation(); handleBuyClick(prod); }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
