import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function VedhhaIntro({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 900);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* Diagonal slash lines — matches website motif */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(180,120,50,0.04) 10px, rgba(180,120,50,0.04) 20px)",
            }}
          />

          {/* Glow behind text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="absolute w-[60vw] h-[30vh] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(180,120,50,0.18) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* VEDHHA text */}
          <div className="relative flex flex-col items-center">
            {/* Letter-by-letter reveal */}
            <div className="flex overflow-hidden">
              {"VEDHHA".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display font-black text-white uppercase block"
                  style={{
                    fontSize: "clamp(4.5rem, 18vw, 14rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    textShadow: "0 0 60px rgba(180,120,50,0.5), 0 0 120px rgba(180,120,50,0.2)",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Golden underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="h-[3px] w-full mt-2"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(28 54% 50%), transparent)",
                transformOrigin: "left",
              }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-4 font-sans uppercase tracking-[0.55em] text-xs md:text-sm"
              style={{ color: "hsl(28 54% 50%)" }}
            >
              The Eklavya Wear
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
