import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01",
    title: "Unique Fusion",
    desc: "A distinctive combination of traditional and contemporary styles, drawing inspiration from India's rich cultural heritage."
  },
  {
    num: "02",
    title: "Innovative Leadership",
    desc: "Guided by visionary design principles and sustainable practices to reshape the modern wardrobe."
  },
  {
    num: "03",
    title: "New Standards",
    desc: "Setting a fresh benchmark in the clothing sector with uncompromising attention to detail."
  },
  {
    num: "04",
    title: "Commitment to Quality",
    desc: "Dedicated to peerless craftsmanship and customer satisfaction in every thread."
  }
];

export default function Vision() {
  return (
    <section className="py-32 bg-secondary relative diagonal-cut">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase text-white mb-4">Brand Vision</h2>
          <div className="h-[2px] w-16 bg-primary mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-background p-8 border border-border hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 text-9xl font-display text-white/5 font-bold pointer-events-none group-hover:text-primary/10 transition-colors">
                {pillar.num}
              </div>
              <h3 className="text-2xl font-display font-bold text-white uppercase mb-4 tracking-wide relative z-10">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed relative z-10">
                {pillar.desc}
              </p>
              <div className="w-0 h-[2px] bg-accent mt-6 transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
