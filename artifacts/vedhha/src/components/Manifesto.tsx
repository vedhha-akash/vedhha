import { motion } from "framer-motion";

export default function Manifesto() {
  return (
    <section className="py-40 bg-primary relative flex items-center justify-center overflow-hidden">
      {/* Background motif */}
      <div className="absolute inset-0 opacity-10 slash-motif pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-9xl font-display font-bold uppercase text-white leading-[0.85] tracking-tighter mix-blend-overlay"
        >
          CRAFTED FROM<br/>
          INDIA'S SOUL,<br/>
          WORN BY<br/>
          THE WORLD
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 font-sans text-white/80 uppercase tracking-[0.3em] text-sm md:text-base max-w-2xl mx-auto"
        >
          For those who wear their heritage like armor. Unapologetic, raw, and meticulously crafted.
        </motion.p>
      </div>
    </section>
  );
}
