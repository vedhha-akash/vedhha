import { motion } from "framer-motion";

export default function Quality() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase text-white mb-6">Uncompromising Quality</h2>
          <div className="h-[2px] w-16 bg-accent mx-auto mb-12" />
          
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div>
              <h4 className="text-xl font-display uppercase text-white mb-3">Premium Materials</h4>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Sourced from the finest mills, our fabrics offer durability that matches the modern urban lifestyle without sacrificing luxury feel.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-display uppercase text-white mb-3">Master Craftsmanship</h4>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                Every stitch is deliberate. Our artisans blend traditional Indian tailoring techniques with modern streetwear construction.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-display uppercase text-white mb-3">Sustainable Ethos</h4>
              <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                We believe true luxury shouldn't cost the earth. Our supply chain is designed with consciousness and longevity in mind.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
