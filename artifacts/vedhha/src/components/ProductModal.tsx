import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";
import NotifyMeModal from "@/components/NotifyMeModal";

const WHATSAPP_NUMBER = "919151304494";

function getBuyLink(productName: string, price: string) {
  const message = encodeURIComponent(
    `Hi VEDHHA! I'm interested in buying the *${productName}* (${price}). Please share more details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getShareUrl(product: Product) {
  return `https://vedhha.com/?product=${slugify(product.name)}`;
}

interface Props {
  product: Product | null;
  onClose: () => void;
  onBuy?: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onBuy }: Props) {
  const [showNotify, setShowNotify] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => { setActiveImg(0); }, [product]);

  useEffect(() => {
    if (!product) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  async function handleShare() {
    if (!product) return;
    const shareUrl = getShareUrl(product);
    const shareData = {
      title: `${product.name} — VEDHHA`,
      text: `Check out *${product.name}* on VEDHHA — The Eklavya Wear!\n${product.price}${product.originalPrice ? ` (was ${product.originalPrice})` : ""}\n\nShop now:`,
      url: shareUrl,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const images = product?.images?.length ? product.images : product ? [product.img] : [];

  return (
    <>
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0e0e0e] border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white transition-colors bg-black/60"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="grid md:grid-cols-2">
                {/* Product Image Carousel */}
                <div className="flex flex-col bg-secondary">
                  {/* Main image */}
                  <div
                    className="relative aspect-[3/4] md:aspect-auto md:min-h-[380px] overflow-hidden cursor-pointer select-none"
                    onClick={() => images.length > 1 && setActiveImg(i => (i + 1) % images.length)}
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current === null || images.length <= 1) return;
                      const diff = touchStartX.current - e.changedTouches[0].clientX;
                      if (Math.abs(diff) > 40) {
                        if (diff > 0) setActiveImg(i => (i + 1) % images.length);
                        else setActiveImg(i => (i - 1 + images.length) % images.length);
                      }
                      touchStartX.current = null;
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImg}
                        src={images[activeImg]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>

                    {/* Circular discount badge — top left corner like Amazon */}
                    {product.discount && !product.soldOut && (
                      <div className="absolute top-3 left-3 w-12 h-12 rounded-full bg-primary flex flex-col items-center justify-center shadow-lg z-10">
                        <span className="text-white font-bold text-[10px] leading-none">
                          {product.discount.replace(" OFF", "")}
                        </span>
                        <span className="text-white/80 text-[8px] leading-none">off</span>
                      </div>
                    )}

                    {/* Gender & category tags — bottom left */}
                    <div className="absolute bottom-12 left-3 flex gap-2 z-10">
                      <span className="bg-black/70 text-white font-sans text-[10px] uppercase tracking-widest px-2 py-1 backdrop-blur-sm">
                        {product.category}
                      </span>
                      <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-1 backdrop-blur-sm ${
                        product.gender === "Men"
                          ? "bg-blue-900/80 text-blue-200"
                          : product.gender === "Women"
                          ? "bg-rose-900/80 text-rose-200"
                          : "bg-primary/80 text-white"
                      }`}>
                        {product.gender}
                      </span>
                    </div>

                    {/* Dot indicators + share — bottom right like Amazon */}
                    <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between px-4 z-10">
                      {/* Dots */}
                      <div className="flex items-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                            className={`rounded-full transition-all duration-200 ${
                              activeImg === i
                                ? "w-3 h-3 bg-primary"
                                : "w-2 h-2 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Share button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShare(); }}
                        className="flex items-center gap-1.5 bg-black/60 border border-white/20 text-white/80 hover:text-white hover:border-white/50 px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors backdrop-blur-sm"
                      >
                        {copied ? (
                          <span className="text-primary">Copied!</span>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                            </svg>
                            Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div>
                    {/* Name & Price */}
                    <div className="mb-4">
                      <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-white leading-tight">
                        {product.name}
                      </h2>
                      <div className="h-[2px] w-12 bg-primary mt-2 mb-3" />
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-primary font-display text-3xl font-bold">
                          {product.price}
                        </p>
                        {product.originalPrice && (
                          <p className="text-white/40 font-display text-xl line-through">
                            {product.originalPrice}
                          </p>
                        )}
                        {product.discount && !product.soldOut && (
                          <span className="bg-primary/20 text-primary border border-primary/40 text-xs font-bold uppercase tracking-widest px-2 py-1">
                            {product.discount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Details list */}
                    <div>
                      <h4 className="text-white font-sans text-xs uppercase tracking-[0.3em] mb-3">
                        Product Details
                      </h4>
                      <ul className="space-y-2">
                        {product.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground font-sans text-sm">
                            <span className="text-primary mt-1 shrink-0">▸</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Buy Now CTA */}
                  <div className="space-y-3">
                    {product.soldOut ? (
                      <>
                        <div className="w-full text-center font-sans uppercase tracking-[0.3em] text-sm border border-white/10 text-white/30 py-4 cursor-not-allowed">
                          Sold Out
                        </div>
                        <button
                          onClick={() => setShowNotify(true)}
                          className="block w-full text-center font-sans uppercase tracking-[0.25em] text-xs border border-accent/60 text-accent py-3 hover:border-accent hover:bg-accent/10 transition-colors"
                        >
                          🔔 Notify Me When Back in Stock
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onBuy ? onBuy(product) : window.open(getBuyLink(product.name, product.price), "_blank")}
                          className="block w-full text-center font-sans uppercase tracking-[0.3em] text-sm bg-primary text-white py-4 hover:bg-primary/80 transition-colors font-semibold"
                        >
                          Buy Now — {product.price}
                        </button>
                        <a
                          href={getBuyLink(product.name, product.price)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center font-sans uppercase tracking-[0.25em] text-xs border border-white/20 text-white/70 py-3 hover:border-primary hover:text-primary transition-colors"
                        >
                          Order on WhatsApp
                        </a>
                        <button
                          onClick={handleShare}
                          className="flex items-center justify-center gap-2 w-full font-sans uppercase tracking-[0.2em] text-xs border border-white/10 text-white/50 py-3 hover:border-white/30 hover:text-white/80 transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                          </svg>
                          {copied ? "Link Copied!" : "Share This Product"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    {product && (
      <NotifyMeModal open={showNotify} onClose={() => setShowNotify(false)} productName={product.name} />
    )}
    </>
  );
}
