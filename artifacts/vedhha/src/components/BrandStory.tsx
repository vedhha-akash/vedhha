import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="relative py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-display font-bold uppercase mb-6 text-white leading-none">
              The<br />
              <span className="text-primary">Eklavya</span><br />
              Store
            </h2>
            <div className="h-[2px] w-24 bg-accent mb-8" />
            <p className="text-muted-foreground text-lg md:text-xl font-sans mb-6 leading-relaxed">
              Founded on March 9, 2024, VEDHHA emerges as the new benchmark in Indian luxury fashion. 
              Under the visionary leadership of Aakash Sharma (CEO) and co-founder Rakesh Sharma, 
              we forge armor for the modern urban warrior.
            </p>
            <p className="text-muted-foreground text-lg md:text-xl font-sans leading-relaxed">
              Our garments are a striking fusion of India's rich cultural heritage and contemporary 
              streetwear silhouettes—a testament to mastery, dedication, and the warrior spirit.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-secondary relative overflow-hidden slash-motif diagonal-cut-bottom">
              <div className="absolute inset-0 border border-border m-4 mix-blend-overlay" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-8">
                <p className="font-display text-5xl text-white/10 uppercase tracking-widest leading-none">
                  Heritage<br/>Meets<br/>Future
                </p>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-black p-6 border-l-4 border-primary">
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-1">Established</p>
              <p className="font-display text-4xl text-white">MARCH 9, 2024</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
