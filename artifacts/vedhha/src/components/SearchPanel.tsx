import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_PRODUCTS, type Product } from "@/data/products";
import ProductModal from "@/components/ProductModal";
import OrderModal from "@/components/OrderModal";

const parsePrice = (p: string) => parseInt(p.replace(/[₹,\s]/g, ""), 10);

const MAX_PRICE = 8000;

type SortOrder = "none" | "asc" | "desc";

export default function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOrder>("none");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSort("none");
      setMinPrice(0);
      setMaxPrice(MAX_PRICE);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    let list = [...ALL_PRODUCTS];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.collection ?? "").toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => {
      const n = parsePrice(p.price);
      return n >= minPrice && n <= maxPrice;
    });

    if (sort === "asc") list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (sort === "desc") list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));

    return list;
  }, [query, sort, minPrice, maxPrice]);

  const handleMinChange = (v: string) => {
    const n = parseInt(v) || 0;
    setMinPrice(Math.min(n, maxPrice));
  };
  const handleMaxChange = (v: string) => {
    const n = parseInt(v) || MAX_PRICE;
    setMaxPrice(Math.max(n, minPrice));
  };

  return (
    <>
      {/* Search Button — next to hamburger */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-[72px] z-[90] w-11 h-11 flex items-center justify-center bg-black/70 border border-white/15 backdrop-blur-md hover:border-primary/60 transition-colors"
        aria-label="Search products"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-white">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[120]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-panel"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 left-0 right-0 z-[130] flex flex-col"
            style={{
              background: "#0a0a0a",
              borderBottom: "1px solid hsl(var(--primary)/25)",
              maxHeight: "92dvh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products — name, category, style..."
                className="flex-1 bg-transparent text-white text-sm font-sans placeholder:text-white/30 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-white/40 hover:text-white text-lg transition-colors leading-none w-6 h-6 flex items-center justify-center">×</button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white text-xl transition-colors w-7 h-7 flex items-center justify-center ml-1"
              >✕</button>
            </div>

            {/* Filters Row */}
            <div
              className="flex flex-wrap items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Sort */}
              <div className="flex items-center gap-1.5">
                <span className="text-white/35 text-xs font-sans uppercase tracking-wider">Sort:</span>
                {(["asc", "desc", "none"] as SortOrder[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`text-xs font-sans px-2.5 py-1 transition-colors border ${
                      sort === s
                        ? "text-[#0a0a0a] border-transparent"
                        : "text-white/50 border-white/15 hover:border-white/30 hover:text-white/80"
                    }`}
                    style={sort === s ? { background: "hsl(var(--primary))" } : {}}
                  >
                    {s === "asc" ? "Low → High" : s === "desc" ? "High → Low" : "Default"}
                  </button>
                ))}
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-white/35 text-xs font-sans uppercase tracking-wider">₹</span>
                <input
                  type="number"
                  value={minPrice || ""}
                  onChange={(e) => handleMinChange(e.target.value)}
                  placeholder="Min"
                  min={0}
                  max={MAX_PRICE}
                  className="w-16 bg-black/40 border border-white/15 text-white text-xs font-sans px-2 py-1 focus:outline-none focus:border-primary/50 placeholder:text-white/25"
                />
                <span className="text-white/30 text-xs">–</span>
                <input
                  type="number"
                  value={maxPrice >= MAX_PRICE ? "" : maxPrice}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  placeholder="Max"
                  min={0}
                  max={MAX_PRICE}
                  className="w-16 bg-black/40 border border-white/15 text-white text-xs font-sans px-2 py-1 focus:outline-none focus:border-primary/50 placeholder:text-white/25"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="px-4 py-2 shrink-0">
              <p className="text-white/30 text-xs font-sans">
                {results.length} {results.length === 1 ? "product" : "products"} found
                {query && <> for "<span className="text-white/60">{query}</span>"</>}
              </p>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <span className="text-4xl opacity-30">🔍</span>
                  <p className="text-white/30 font-sans text-sm">No products match your search</p>
                  <button
                    onClick={() => { setQuery(""); setSort("none"); setMinPrice(0); setMaxPrice(MAX_PRICE); }}
                    className="text-xs font-sans text-primary/70 underline mt-1"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {results.map((product) => (
                    <motion.button
                      key={product.name}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.18 }}
                      onClick={() => setSelectedProduct(product)}
                      className="text-left flex flex-col overflow-hidden group relative"
                      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {/* Image */}
                      <div className="relative w-full aspect-square bg-[#111] overflow-hidden">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/vedhha-logo.png"; }}
                        />
                        {product.soldOut && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white/70 text-[10px] font-display uppercase tracking-widest border border-white/20 px-2 py-1">Sold Out</span>
                          </div>
                        )}
                        {product.collection && (
                          <span className="absolute top-2 left-2 text-[9px] font-display uppercase tracking-wider px-1.5 py-0.5" style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}>
                            {product.collection}
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="px-2.5 py-2" style={{ background: "#0d0d0d" }}>
                        <p className="text-white text-xs font-display uppercase tracking-wide leading-tight line-clamp-1">{product.name}</p>
                        <p className="font-sans text-xs mt-0.5" style={{ color: "hsl(var(--primary))" }}>{product.price}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product & Order Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuy={(p) => { setSelectedProduct(null); setOrderProduct(p); }}
      />
      <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} />
    </>
  );
}
