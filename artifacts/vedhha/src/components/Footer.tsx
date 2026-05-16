import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary pt-24 pb-12 border-t border-border">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <h2 className="text-5xl font-display font-bold text-white uppercase mb-4">VEDHHA</h2>
            <p className="text-muted-foreground font-sans text-sm max-w-sm mb-6">
              The Eklavya Wear. A luxury clothing brand fusing traditional Indian cultural heritage with contemporary streetwear.
            </p>
            <div className="space-y-2 font-sans text-sm">
              <a
                href="tel:+919151304494"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary">Phone</span>
                <span>+91 91513 04494</span>
              </a>
              <a
                href="https://wa.me/919151304494"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary">WhatsApp</span>
                <span>+91 91513 04494</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display text-lg uppercase tracking-wider mb-6">Explore</h4>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground uppercase tracking-widest">
              <li><a href="#collections" className="hover:text-primary transition-colors">Collections</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Vision</a></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping &amp; Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display text-lg uppercase tracking-wider mb-6">Connect</h4>
            <ul className="space-y-3 font-sans text-sm text-muted-foreground">
              <li>
                <a
                  href="https://www.instagram.com/shri1lavya13"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  <span className="text-primary text-lg">&#x1F4F7;</span>
                  @shri1lavya13
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919151304494?text=Hi%20VEDHHA!%20I%20want%20to%20know%20more%20about%20your%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  <span className="text-primary text-lg">&#x1F4AC;</span>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="tel:+919151304494"
                  className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  <span className="text-primary text-lg">&#x1F4DE;</span>
                  Call Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest">
            &copy; 2024 VEDHHA. All Rights Reserved.
          </p>
          <p className="text-muted-foreground font-sans text-xs uppercase tracking-widest">
            The Eklavya Wear &mdash; Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}
