export default function Founder() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white">
      {/* SEO hidden content for crawlers */}
      <div className="sr-only">
        <h1>Aakash Sharma — Founder &amp; CEO of VEDHHA (The Eklavya Wear)</h1>
        <p>
          Aakash Sharma, also known as Akash Sharma or Eklavya, is the founder and CEO of VEDHHA —
          The Eklavya Wear, a luxury Indian streetwear brand based in Mumbai, Maharashtra, India.
          VEDHHA was founded in 2024 under the visionary leadership of Aakash Sharma.
          The brand blends traditional Indian heritage with Gen Z contemporary streetwear.
        </p>
      </div>

      {/* Hero */}
      <section className="relative w-full min-h-[60vh] flex flex-col items-center justify-end pb-16 pt-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/founder/akash-3.jpg"
            alt="Aakash Sharma — Founder and CEO of VEDHHA The Eklavya Wear, luxury Indian streetwear brand"
            className="w-full h-full object-cover object-top opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        </div>
        <div className="relative z-10">
          <p className="text-[#c8832a] text-xs tracking-[0.3em] uppercase mb-3 font-medium">Founder &amp; CEO</p>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-widest text-white mb-4">
            Aakash Sharma
          </h1>
          <p className="text-white/60 text-sm tracking-[0.2em] uppercase">VEDHHA — The Eklavya Wear</p>
        </div>
      </section>

      {/* About */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-[#c8832a] text-xs tracking-[0.3em] uppercase mb-6">The Vision</h2>
        <p className="text-white/80 text-base leading-relaxed mb-6">
          Aakash Sharma — known by the name <strong className="text-white">Eklavya</strong> — is the
          founder and creative force behind <strong className="text-white">VEDHHA (The Eklavya Wear)</strong>,
          a premium Indian streetwear brand born in Mumbai in 2024.
        </p>
        <p className="text-white/60 text-sm leading-relaxed mb-6">
          Inspired by Eklavya's unwavering dedication and self-taught mastery, Aakash built VEDHHA
          to represent a generation that refuses to be held back. The brand fuses India's rich cultural
          heritage with bold Gen Z aesthetics — limited drops, oversized silhouettes, and luxury craftsmanship
          for the bold generation.
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          Under Aakash Sharma's leadership, VEDHHA is setting new standards in Indian streetwear —
          combining innovative design, sustainable practices, and authentic storytelling.
        </p>
      </section>

      {/* Google Images SEO — images are present in DOM for indexing but not shown to visitors */}
      <div aria-hidden="true" style={{position:'absolute', width:1, height:1, overflow:'hidden', opacity:0, pointerEvents:'none', left:'-9999px'}}>
        <figure>
          <img src="/founder/akash-1.png" alt="Aakash Sharma founder of VEDHHA The Eklavya Wear Indian streetwear brand Mumbai" width="800" height="1000" />
          <figcaption>Aakash Sharma — Founder &amp; CEO of VEDHHA The Eklavya Wear | vedhha.com</figcaption>
        </figure>
        <figure>
          <img src="/founder/akash-2.jpg" alt="Akash Sharma CEO VEDHHA Eklavya Wear luxury Indian streetwear brand founder" width="800" height="600" />
          <figcaption>Aakash Sharma — VEDHHA Brand Founder | vedhha.com</figcaption>
        </figure>
        <figure>
          <img src="/founder/akash-3.jpg" alt="Aakash Sharma Eklavya VEDHHA brand owner Gen Z Indian fashion designer Mumbai 2024" width="600" height="900" />
          <figcaption>Aakash Sharma (Eklavya) — VEDHHA Founder | vedhha.com</figcaption>
        </figure>
        <figure>
          <img src="/founder/akash-4.jpg" alt="Aakash Sharma VEDHHA The Eklavya Wear founder streetwear fashion India 2024" width="600" height="900" />
          <figcaption>Aakash Sharma — CEO VEDHHA | vedhha.com</figcaption>
        </figure>
        <figure>
          <img src="/founder/akash-5.jpg" alt="Aakash Sharma vedhha.com owner Indian streetwear brand Gen Z collection Eklavya" width="800" height="1000" />
          <figcaption>Aakash Sharma — vedhha.com | VEDHHA The Eklavya Wear</figcaption>
        </figure>
      </div>

      {/* Brand Link */}
      <section className="text-center pb-20 px-6">
        <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Visit the Brand</p>
        <a
          href="/"
          className="inline-block border border-[#c8832a] text-[#c8832a] px-10 py-3 text-xs tracking-[0.3em] uppercase hover:bg-[#c8832a] hover:text-black transition-all duration-300"
        >
          VEDHHA — The Eklavya Wear
        </a>
      </section>
    </main>
  );
}
