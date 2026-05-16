import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[#0a0a0a] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
    >
      {/* Radial spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(200,131,42,0.18) 0%, transparent 70%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Product image — dramatic drop from above */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8"
        initial={{ y: '-80%', opacity: 0 }}
        animate={phase >= 1 ? { y: '0%', opacity: 1 } : { y: '-80%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0 }}
      >
        <motion.img
          src={`${import.meta.env.BASE_URL}products/genz/keep-god-first-tee.jpg`}
          alt="Keep God First — VEDHHA Oversized Tee"
          className="w-[72vw] max-w-xs object-contain rounded-2xl shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(200,131,42,0.25), 0 30px 60px rgba(0,0,0,0.8)' }}
          animate={phase >= 1 ? { scale: [1.06, 1] } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Product name tag */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#c8832a] tracking-[0.25em] uppercase text-[3.5vw] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
            Keep God First Tee
          </p>
          <p className="text-white/50 tracking-widest text-[3vw] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
            Oversized Boxy Fit · ₹899
          </p>
        </motion.div>
      </motion.div>

      {/* "Tum mat pehno" text — bottom overlay */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 text-center px-8 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
      >
        <h2
          className="text-[10vw] font-black uppercase leading-tight text-white"
          style={{ fontFamily: 'var(--font-display)', textShadow: '0 4px 20px rgba(200,131,42,0.5)' }}
        >
          <span className="text-[#c8832a]">Tum</span> mat<br />
          <span className="text-[#c8832a]">pehno.</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}
