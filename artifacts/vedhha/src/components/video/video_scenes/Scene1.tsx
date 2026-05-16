import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden flex flex-col justify-end pb-32 items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.video 
        src={`${import.meta.env.BASE_URL}videos/scene1-crowd.mp4`}
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale"
        autoPlay muted loop playsInline
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />

      <div className="relative z-10 px-8 text-center w-full">
        <motion.h1 
          className="text-[12vw] font-black uppercase text-white leading-[0.9]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {'Har koi ek'.split(' ').map((word, i) => (
            <motion.span 
              key={`w1-${i}`} 
              className="inline-block mr-[3vw]"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, delay: phase >= 1 ? i * 0.1 : 0 }}
            >
              {word}
            </motion.span>
          ))}
          <br/>
          {'jaisa dikhta hai.'.split(' ').map((word, i) => (
            <motion.span 
              key={`w2-${i}`} 
              className="inline-block mr-[3vw] text-white/70"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={phase >= 1 ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, delay: phase >= 1 ? 0.3 + (i * 0.1) : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </motion.div>
  );
}
