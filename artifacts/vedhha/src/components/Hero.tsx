import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GENZ_PRODUCTS } from "@/data/products";
import ProductModal from "@/components/ProductModal";
import type { Product } from "@/data/products";

const simpleThings = GENZ_PRODUCTS.find(p => p.name === "Simple Things Tee") || GENZ_PRODUCTS[0];
const lifeIsBeautiful = GENZ_PRODUCTS.find(p => p.name === "Life Is Beautiful Tee") || GENZ_PRODUCTS[1];
const lightWeightTee = GENZ_PRODUCTS.find(p => p.name === "Light Weight Baby Tee") || GENZ_PRODUCTS[2];
const neverBeMyRival = GENZ_PRODUCTS.find(p => p.name === "Never Be My Rival Tee") || GENZ_PRODUCTS[3];

const SLIDES = [
  {
    image: "/simple-things-dual.jpg",
    product: simpleThings,
    label: "Simple Things Tee",
    sub: "₹699 · 22% OFF",
  },
  {
    image: "/hero-slide-1.jpg",
    product: lifeIsBeautiful,
    label: "Life Is Beautiful Tee",
    sub: "₹599 · 25% OFF",
  },
  {
    image: "/hero-slide-2.jpg",
    product: neverBeMyRival,
    label: "Never Be My Rival Tee",
    sub: "New Drop · Gen Z Collection",
  },
  {
    image: "/hero-slide-3.png",
    product: lightWeightTee,
    label: "Light Weight Baby Tee",
    sub: "₹399 onwards · 33% OFF",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const touchStartX = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  // Auto-slide every 4s
  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  }

  function handleSlideClick() {
    const slide = SLIDES[current];
    if (slide.product) {
      setSelectedProduct(slide.product);
    } else {
      document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <section
        className="relative h-[100dvh] w-full overflow-hidden cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleSlideClick}
      >
        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={current}
            custom={direction}
            initial={{ x: direction * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -60, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0, 0.67, 0] }}
            className="absolute inset-0"
          >
            <img
              src={SLIDES[current].image}
              alt={SLIDES[current].label}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-sans tracking-[0.3em] text-[#c8832a] uppercase mb-1">
                {SLIDES[current].sub}
              </p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight uppercase leading-tight">
                {SLIDES[current].label}
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 bg-[#c8832a]/20 border border-[#c8832a]/40 px-4 py-2 pointer-events-none">
                <span className="text-white text-xs tracking-widest font-sans uppercase">
                  {SLIDES[current].product ? "Tap to Shop" : "Explore All"}
                </span>
                <span className="text-[#c8832a] text-sm">→</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-6 z-30 flex gap-2 pointer-events-none">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-[2px] transition-all duration-500 ${
                i === current ? "w-8 bg-[#c8832a]" : "w-3 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-[1px] h-10 bg-white/30"
          />
        </div>
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
