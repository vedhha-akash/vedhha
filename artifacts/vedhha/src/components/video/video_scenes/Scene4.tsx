import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img 
        src={`${import.meta.env.BASE_URL}vedhha-logo.png`}
        className="w-48 h-48 object-contain mb-8"
        initial={{ scale: 0.8, opacity: 0, filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(10deg) brightness(1.2)' }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: 'brightness(0) invert(60%) sepia(40%) saturate(1500%) hue-rotate(5deg) brightness(1.1)' }} // gold tint
      />
      
      <motion.p
        className="text-[5vw] uppercase tracking-[0.3em] text-white/80 font-bold mb-4"
        style={{ fontFamily: 'var(--font-body)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.6 }}
      >
        Limited pieces.
      </motion.p>
      
      <motion.p
        className="text-[4.5vw] tracking-wider text-[#c8832a] font-medium"
        style={{ fontFamily: 'var(--font-body)' }}
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        vedhha.com
      </motion.p>
    </motion.div>
  );
}
