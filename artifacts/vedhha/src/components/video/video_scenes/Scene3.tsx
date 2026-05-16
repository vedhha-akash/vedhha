import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-[#0a0a0a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <motion.video 
        src={`${import.meta.env.BASE_URL}videos/scene3-walking.mp4`}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 5, ease: "linear" }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
      
      <motion.div 
        className="absolute bottom-20 left-0 right-0 text-center px-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="w-16 h-[2px] bg-[#c8832a] mx-auto mb-6" />
        <h2 className="text-[6vw] font-bold tracking-widest uppercase text-white/90" style={{ fontFamily: 'var(--font-body)' }}>
          The Eklavya Wear
        </h2>
      </motion.div>
    </motion.div>
  );
}
