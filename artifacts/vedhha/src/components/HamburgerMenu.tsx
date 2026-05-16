import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSignIn, useClerk } from "@clerk/react";
import type { VedhhaOrder } from "@/components/OrderModal";
import ReferralPanel from "@/components/ReferralPanel";
import { useVedhhaTheme } from "@/context/ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────
type Panel =
  | null
  | "about"
  | "studio"
  | "insider"
  | "giftcards"
  | "contact"
  | "faqs"
  | "legal"
  | "legal-terms"
  | "legal-privacy"
  | "legal-center"
  | "login"
  | "orders"
  | "referral";

const CANCEL_REASONS = [
  "Changed my mind",
  "Wrong size",
  "Ordered by mistake",
  "Delivery too slow",
  "Other",
];

interface VedhhaUser {
  name: string;
  contact: string;
  notificationsEnabled: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const PHONE = "+91 9151304494";
const WHATSAPP = "https://wa.me/919151304494";

function slideVariants(dir: "left" | "right" = "right") {
  const x = dir === "right" ? "100%" : "-100%";
  return {
    initial: { x, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { type: "spring", damping: 28, stiffness: 280 } },
    exit: { x, opacity: 0, transition: { duration: 0.22 } },
  };
}

// ── Sub-panel header ──────────────────────────────────────────────────────────
function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
      <button
        onClick={onBack}
        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
      >
        ←
      </button>
      <span className="font-display text-xl text-white uppercase tracking-widest">{title}</span>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutPanel({ onBack }: { onBack: () => void }) {
  const pillars = [
    {
      num: "01",
      title: "Unique Fusion",
      desc: "A distinctive combination of traditional and contemporary styles, drawing inspiration from India's rich cultural heritage.",
    },
    {
      num: "02",
      title: "Innovative Leadership",
      desc: "Guided by visionary design principles and sustainable practices to reshape the modern wardrobe.",
    },
    {
      num: "03",
      title: "New Standards",
      desc: "Setting a fresh benchmark in the clothing sector with uncompromising attention to detail.",
    },
    {
      num: "04",
      title: "Commitment to Quality",
      desc: "Dedicated to peerless craftsmanship and customer satisfaction in every thread.",
    },
  ];

  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="About" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Brand name + story */}
        <div>
          <h2 className="font-display text-5xl text-white uppercase leading-none mb-1">
            The <span className="text-primary">Eklavya</span> Store
          </h2>
          <div className="h-[2px] w-16 bg-accent mb-4" />
          <p className="font-sans text-white/60 text-sm leading-relaxed mb-3">
            Founded on March 9, 2024, VEDHHA emerges as the new benchmark in Indian luxury fashion.
            Under the visionary leadership of Aakash Sharma (CEO) and co-founder Rakesh Sharma,
            we forge armor for the modern urban warrior.
          </p>
          <p className="font-sans text-white/60 text-sm leading-relaxed">
            Our garments are a striking fusion of India's rich cultural heritage and contemporary
            streetwear silhouettes — a testament to mastery, dedication, and the warrior spirit.
          </p>
        </div>

        {/* Established badge */}
        <div className="border-l-4 border-primary pl-4">
          <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-0.5">Established</p>
          <p className="font-display text-3xl text-white uppercase">March 9, 2024</p>
        </div>

        {/* Brand Vision */}
        <div>
          <p className="font-display text-2xl text-white uppercase tracking-wider mb-3">Brand Vision</p>
          <div className="space-y-3">
            {pillars.map((p) => (
              <div key={p.num} className="bg-white/4 border border-white/10 p-4 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 font-display text-6xl text-white/5 font-bold pointer-events-none">
                  {p.num}
                </div>
                <p className="font-display text-base text-white uppercase tracking-wide mb-1 relative z-10">{p.title}</p>
                <p className="font-sans text-white/50 text-xs leading-relaxed relative z-10">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── VEDHHA STUDIO ─────────────────────────────────────────────────────────────
function VedhhaStudioPanel({ onBack }: { onBack: () => void }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Vedhha Studio" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        <div className="border border-primary/30 bg-primary/5 p-5">
          <p className="font-display text-3xl text-primary uppercase tracking-wider mb-1">
            Where Ideas Meet Fabric
          </p>
          <p className="font-sans text-white/60 text-sm leading-relaxed">
            Vedhha Studio is the creative heart of our brand — where every stitch, graphic, and silhouette is born.
          </p>
        </div>

        {[
          {
            title: "Design Process",
            body: "Each piece starts as a sketch inspired by Indian street culture and global streetwear. Our team hand-picks every fabric weight, dye, and cut before a single sample is made.",
          },
          {
            title: "Limited Drops",
            body: "We believe in scarcity with purpose. Every Vedhha drop is intentionally limited — once it's gone, it's gone. No mass production, no restocks without notice.",
          },
          {
            title: "Craftsmanship",
            body: "All garments are made in-house with 240gsm+ premium cotton and acid-wash techniques mastered over years. Quality is non-negotiable.",
          },
          {
            title: "Collaborations",
            body: "Interested in a collaboration or custom commission? Reach us on WhatsApp — we work with artists, photographers, and creators who share the Eklavya spirit.",
          },
        ].map((item) => (
          <div key={item.title} className="border-l-2 border-primary/40 pl-4">
            <p className="font-display text-lg text-white uppercase tracking-wide mb-1">{item.title}</p>
            <p className="font-sans text-white/55 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center font-sans uppercase tracking-[0.25em] text-xs bg-primary text-white px-4 py-3 hover:bg-primary/80 transition-colors"
        >
          Connect with Studio →
        </a>
      </div>
    </motion.div>
  );
}

// ── VEDHHA INSIDER ────────────────────────────────────────────────────────────
function VedhhaInsiderPanel({ onBack, user }: { onBack: () => void; user: VedhhaUser | null }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Vedhha Insider" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        <div className="bg-accent/10 border border-accent/30 p-5">
          <p className="font-display text-2xl text-accent uppercase tracking-wider mb-1">
            Be the First to Know
          </p>
          <p className="font-sans text-white/60 text-sm leading-relaxed">
            Vedhha Insider is our exclusive circle — early access to drops, special discounts, and behind-the-scenes content.
          </p>
        </div>

        {[
          { icon: "⚡", title: "Early Drop Access", body: "Insiders get notified 24 hours before any public drop goes live." },
          { icon: "🎁", title: "Exclusive Discounts", body: "Special discount codes on select collections, only for Insiders." },
          { icon: "📸", title: "Behind the Scenes", body: "Exclusive lookbooks, studio footage, and design process content." },
          { icon: "🏆", title: "Loyalty Rewards", body: "Every purchase earns you Insider points — redeem for discounts on future orders." },
        ].map((item) => (
          <div key={item.title} className="flex gap-4 items-start">
            <span className="text-2xl mt-0.5">{item.icon}</span>
            <div>
              <p className="font-display text-lg text-white uppercase tracking-wide mb-0.5">{item.title}</p>
              <p className="font-sans text-white/55 text-sm leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}

        {user ? (
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="font-display text-xl text-accent uppercase">Welcome, {user.name}!</p>
            <p className="font-sans text-white/50 text-xs mt-1">You're already an Insider.</p>
          </div>
        ) : (
          <a
            href={WHATSAPP + "?text=Hi%20VEDHHA!%20I%20want%20to%20join%20Vedhha%20Insider."}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center font-sans uppercase tracking-[0.25em] text-xs bg-accent text-black font-bold px-4 py-3 hover:opacity-90 transition-opacity"
          >
            Join Insider — WhatsApp Us →
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── GIFT CARDS ────────────────────────────────────────────────────────────────
function GiftCardsPanel({ onBack }: { onBack: () => void }) {
  const denominations = ["₹500", "₹1,000", "₹2,000", "₹3,500", "₹5,000", "Custom"];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Gift Cards" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        <p className="font-sans text-white/60 text-sm leading-relaxed">
          Gift the Eklavya spirit. VEDHHA Gift Cards are redeemable on any available item — perfect for someone who defines their own style.
        </p>

        <div>
          <p className="font-display text-base text-white/80 uppercase tracking-wider mb-3">Choose Value</p>
          <div className="grid grid-cols-3 gap-2">
            {denominations.map((d) => (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className={`py-3 font-display text-lg uppercase border transition-all ${
                  selected === d
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/20 text-white/60 hover:border-primary hover:text-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[
            { icon: "✉️", text: "Sent directly to recipient's WhatsApp" },
            { icon: "📅", text: "Valid for 12 months from date of purchase" },
            { icon: "🔁", text: "Can be used across multiple orders" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-white/50 font-sans text-sm">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <a
          href={
            selected
              ? `${WHATSAPP}?text=Hi%20VEDHHA!%20I%20want%20to%20buy%20a%20${encodeURIComponent(selected)}%20Gift%20Card.`
              : WHATSAPP
          }
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center font-sans uppercase tracking-[0.25em] text-xs bg-primary text-white px-4 py-3 hover:bg-primary/80 transition-colors"
        >
          {selected ? `Buy ${selected} Gift Card` : "Select & Buy →"}
        </a>
      </div>
    </motion.div>
  );
}

// ── CONTACT US ────────────────────────────────────────────────────────────────
function ContactUsPanel({ onBack }: { onBack: () => void }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Contact Us" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        <p className="font-sans text-white/60 text-sm leading-relaxed">
          We're available on WhatsApp — the fastest way to reach us for orders, queries, or just to say hi.
        </p>

        <div className="space-y-3">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-white/15 p-4 hover:border-primary/60 transition-colors group"
          >
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-display text-base text-white uppercase tracking-wide">WhatsApp</p>
              <p className="font-sans text-primary text-sm group-hover:underline">{PHONE}</p>
            </div>
            <span className="ml-auto text-white/30 group-hover:text-primary transition-colors">→</span>
          </a>

          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="flex items-center gap-4 border border-white/15 p-4 hover:border-primary/60 transition-colors group"
          >
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-display text-base text-white uppercase tracking-wide">Call Us</p>
              <p className="font-sans text-primary text-sm group-hover:underline">{PHONE}</p>
            </div>
            <span className="ml-auto text-white/30 group-hover:text-primary transition-colors">→</span>
          </a>

          <a
            href="mailto:vedhha.eklavya@gmail.com"
            className="flex items-center gap-4 border border-white/15 p-4 hover:border-primary/60 transition-colors group"
          >
            <span className="text-2xl">✉️</span>
            <div>
              <p className="font-display text-base text-white uppercase tracking-wide">Email</p>
              <p className="font-sans text-primary text-sm group-hover:underline">vedhha.eklavya@gmail.com</p>
            </div>
            <span className="ml-auto text-white/30 group-hover:text-primary transition-colors">→</span>
          </a>
        </div>

        <div className="border border-white/10 p-4 bg-white/3">
          <p className="font-display text-base text-white uppercase tracking-wide mb-1">Response Time</p>
          <p className="font-sans text-white/50 text-sm">We typically reply within 2–4 hours between 10 AM – 8 PM IST, Monday to Sunday.</p>
        </div>

        <div className="border border-white/10 p-4 bg-white/3">
          <p className="font-display text-base text-white uppercase tracking-wide mb-1">Location</p>
          <p className="font-sans text-white/50 text-sm">India-based brand. Shipping across all major Indian cities.</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── FAQs ──────────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    q: "How do I place an order?",
    a: "Browse our Collections, click 'Buy Now' on any available item, and you'll be connected to our WhatsApp. Just tell us your size, colour preference, and delivery address — we'll handle the rest.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI (GPay, PhonePe, Paytm), NEFT/IMPS bank transfer, and cash on delivery (select pincodes). WhatsApp us to confirm payment before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery is 5–7 business days across India. Express delivery (2–3 days) is available for select cities — ask us on WhatsApp to confirm availability.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "Exchanges are accepted within 7 days of delivery for size issues. Returns are accepted only for damaged or defective items. Products must be unworn, unwashed, and in original packaging.",
  },
  {
    q: "What sizes do you offer?",
    a: "We stock XS, S, M, L, XL, and XXL. Tap any product to view the size guide and measurements in the product details.",
  },
  {
    q: "Are the Gen Z Collection items coming back?",
    a: "Our Gen Z Collection drops are limited edition. Tap 'Notify Me' on any sold-out item and we'll message you on WhatsApp the moment a restock is confirmed.",
  },
  {
    q: "Do you ship outside India?",
    a: "Currently we ship within India only. International shipping is planned for the near future — follow us for updates.",
  },
  {
    q: "How do I track my order?",
    a: "Once dispatched, we'll send you a tracking link directly to your WhatsApp. You can also ask us anytime for a status update.",
  },
  {
    q: "Are VEDHHA products available on Amazon, Flipkart, or Myntra?",
    a: "🚀 Coming Soon! We're actively working on listing VEDHHA products on Amazon, Flipkart, and Myntra. It will be available there in some time — stay tuned! For now, you can order directly through our website or WhatsApp.",
  },
  {
    q: "How do I know my order is authentic?",
    a: "Every VEDHHA piece comes with a branded tag. All orders are processed directly through us via WhatsApp — there are no third-party sellers.",
  },
  {
    q: "What if I receive a damaged product?",
    a: "We're sorry! Take a photo of the damage and send it to us on WhatsApp within 48 hours of delivery. We'll arrange a replacement or refund immediately.",
  },
  {
    q: "How can I contact VEDHHA?",
    a: `WhatsApp us at ${PHONE} or tap 'Contact Us' in the menu. We respond within 2–4 hours (10 AM – 8 PM IST).`,
  },
];

function FAQsPanel({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="FAQs" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {FAQ_DATA.map((item, i) => (
          <div key={i} className="border border-white/10 overflow-hidden">
            <button
              className="w-full text-left flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-sans text-white text-sm pr-2">{item.q}</span>
              <motion.span
                animate={{ rotate: open === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-primary text-lg shrink-0"
              >
                ↓
              </motion.span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-white/10">
                    <p className="font-sans text-white/60 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="pt-2 pb-4">
          <p className="font-sans text-white/30 text-xs text-center">
            Still have questions? WhatsApp us at {PHONE}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── LEGAL ─────────────────────────────────────────────────────────────────────
function LegalPanel({ onBack, setPanel }: { onBack: () => void; setPanel: (p: Panel) => void }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Legal" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-3">
        {[
          { label: "Terms of Use", panel: "legal-terms" as Panel, desc: "Rules governing use of vedhha.com" },
          { label: "Privacy Policy", panel: "legal-privacy" as Panel, desc: "How we handle your personal data" },
          { label: "Privacy Center", panel: "legal-center" as Panel, desc: "Manage your data & cookie preferences" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setPanel(item.panel)}
            className="w-full text-left flex items-start justify-between gap-3 border border-white/10 p-4 hover:border-primary/40 transition-colors group"
          >
            <div>
              <p className="font-display text-lg text-white uppercase tracking-wide">{item.label}</p>
              <p className="font-sans text-white/40 text-xs mt-0.5">{item.desc}</p>
            </div>
            <span className="text-white/30 group-hover:text-primary transition-colors mt-1">→</span>
          </button>
        ))}
        <p className="font-sans text-white/25 text-xs text-center pt-2">
          VEDHHA — The Eklavya Wear. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
}

function LegalTermsPanel({ onBack }: { onBack: () => void }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Terms of Use" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 font-sans text-sm text-white/60 leading-relaxed">
        <p className="text-white/90 text-xs uppercase tracking-widest">Last updated: April 2026</p>

        {[
          {
            heading: "1. Acceptance of Terms",
            body: "By accessing vedhha.com, you agree to these Terms of Use. If you do not agree, please discontinue use of this website.",
          },
          {
            heading: "2. Use of the Website",
            body: "This website is intended for personal, non-commercial use. You may not use our content, product images, or brand assets without written permission from VEDHHA.",
          },
          {
            heading: "3. Products & Orders",
            body: "All orders are placed through WhatsApp and processed manually. VEDHHA reserves the right to refuse or cancel any order at its discretion. Prices are subject to change without prior notice.",
          },
          {
            heading: "4. Intellectual Property",
            body: "All content on this website — including text, graphics, logos, product designs, and images — is the exclusive property of VEDHHA (The Eklavya Wear). Unauthorized reproduction is strictly prohibited.",
          },
          {
            heading: "5. Limitation of Liability",
            body: "VEDHHA is not liable for any indirect or consequential damages arising from the use of this website or products purchased. Our liability is limited to the value of the product purchased.",
          },
          {
            heading: "6. Governing Law",
            body: "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.",
          },
          {
            heading: "7. Changes",
            body: "VEDHHA reserves the right to update these terms at any time. Continued use of the website constitutes acceptance of revised terms.",
          },
        ].map((s) => (
          <div key={s.heading}>
            <p className="font-display text-base text-white uppercase tracking-wide mb-1">{s.heading}</p>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LegalPrivacyPanel({ onBack }: { onBack: () => void }) {
  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Privacy Policy" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 font-sans text-sm text-white/60 leading-relaxed">
        <p className="text-white/90 text-xs uppercase tracking-widest">Last updated: April 2026</p>

        {[
          {
            heading: "1. Information We Collect",
            body: "When you interact with us via WhatsApp or this website, we may collect your name, phone number, email address, and delivery address solely for fulfilling your order.",
          },
          {
            heading: "2. How We Use Your Data",
            body: "Your information is used only to process orders, provide customer support, and send updates about your order. We do not use your data for advertising unless you explicitly opt in.",
          },
          {
            heading: "3. Notifications",
            body: "If you allow browser notifications, we may send you alerts about new collections, restocks, and exclusive offers. You can disable this at any time in your browser settings.",
          },
          {
            heading: "4. Data Sharing",
            body: "We do not sell, trade, or share your personal information with third parties. Your data stays with VEDHHA only.",
          },
          {
            heading: "5. Data Retention",
            body: "We retain order data for up to 2 years for accounting and return purposes. You may request deletion at any time by contacting us on WhatsApp.",
          },
          {
            heading: "6. Cookies",
            body: "This website uses minimal cookies for performance and user experience (e.g. remembering your login state). No third-party tracking cookies are used.",
          },
          {
            heading: "7. Contact",
            body: `For any privacy-related concerns, WhatsApp us at ${PHONE}.`,
          },
        ].map((s) => (
          <div key={s.heading}>
            <p className="font-display text-base text-white uppercase tracking-wide mb-1">{s.heading}</p>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LegalCenterPanel({ onBack }: { onBack: () => void }) {
  const [analytics, setAnalytics] = useState(true);
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("vedhha_notifications") === "true";
  });

  const toggleNotifications = async () => {
    if (!notifications) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setNotifications(true);
          localStorage.setItem("vedhha_notifications", "true");
        }
      }
    } else {
      setNotifications(false);
      localStorage.setItem("vedhha_notifications", "false");
    }
  };

  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Privacy Center" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
        <p className="font-sans text-white/55 text-sm leading-relaxed">
          Manage your data preferences and control how VEDHHA uses your information.
        </p>

        {[
          {
            label: "Essential Cookies",
            desc: "Required for the website to function. Cannot be disabled.",
            value: true,
            disabled: true,
            toggle: () => {},
          },
          {
            label: "Analytics",
            desc: "Helps us understand how visitors use our site (no personal data shared).",
            value: analytics,
            disabled: false,
            toggle: () => setAnalytics(!analytics),
          },
          {
            label: "Drop Notifications",
            desc: "Browser alerts for new collections and restocks.",
            value: notifications,
            disabled: false,
            toggle: toggleNotifications,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 border border-white/10 p-4">
            <div>
              <p className="font-display text-base text-white uppercase tracking-wide">{item.label}</p>
              <p className="font-sans text-white/45 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
            <button
              onClick={item.toggle}
              disabled={item.disabled}
              className={`shrink-0 w-12 h-6 rounded-full transition-colors relative mt-1 ${
                item.value ? "bg-primary" : "bg-white/20"
              } ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${
                  item.value ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}

        <div className="pt-2 space-y-2">
          <button
            onClick={() => {
              localStorage.removeItem("vedhha_user");
              window.location.reload();
            }}
            className="w-full text-left px-4 py-3 border border-white/10 font-sans text-sm text-white/50 hover:border-red-500/50 hover:text-red-400 transition-colors"
          >
            Delete My Account Data
          </button>
          <p className="font-sans text-white/25 text-xs px-1">
            Deletes your saved login data from this device. For full data removal, contact us on WhatsApp.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── MY ORDERS ─────────────────────────────────────────────────────────────────
const ORDER_STATUS_STYLE: Record<string, string> = {
  pending:   "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
  confirmed: "border-blue-500/40 text-blue-400 bg-blue-500/10",
  shipped:   "border-purple-500/40 text-purple-400 bg-purple-500/10",
  delivered: "border-green-500/40 text-green-400 bg-green-500/10",
  cancelled: "border-red-500/40 text-red-400 bg-red-500/10",
  active:    "border-primary/40 text-primary bg-primary/10",
};
const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", shipped: "Shipped",
  delivered: "Delivered", cancelled: "Cancelled", active: "Active",
};

function MyOrdersPanel({ onBack }: { onBack: () => void }) {
  const [orders, setOrders] = useState<VedhhaOrder[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("vedhha_orders") ?? "[]") as VedhhaOrder[];
      return [...raw].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  });
  const [dbStatuses, setDbStatuses] = useState<Record<string, { status: string; tracking_number: string | null }>>({});
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelConfirmed, setCancelConfirmed] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      const result: Record<string, { status: string; tracking_number: string | null }> = {};
      await Promise.all(orders.map(async (order) => {
        try {
          const res = await fetch(`/api/orders/customer/${order.id}`);
          if (res.ok) {
            const data = await res.json() as { status: string; tracking_number: string | null };
            result[order.id] = { status: data.status, tracking_number: data.tracking_number };
          }
        } catch {}
      }));
      setDbStatuses(result);
    };
    if (orders.length > 0) fetchStatuses();
  }, [orders.length]);

  const handleCancelConfirm = (id: string) => {
    if (!cancelReason) return;
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "cancelled" as const, cancelReason } : o
    );
    setOrders(updated);
    localStorage.setItem("vedhha_orders", JSON.stringify(updated));
    setCancelConfirmed(id);
    setCancellingId(null);
    setCancelReason("");
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="My Orders" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <span className="text-4xl">🛍️</span>
            <p className="font-display text-xl text-white/40 uppercase tracking-wide">No orders yet</p>
            <p className="font-sans text-white/30 text-xs">Your placed orders will appear here</p>
          </div>
        ) : (
          orders.map((order) => {
            const dbInfo = dbStatuses[order.id];
            const liveStatus = dbInfo?.status ?? order.status ?? "active";
            const isCancelled = liveStatus === "cancelled";
            const totalOrderAmt = order.priceNum * order.qty;
            const canCancel = !isCancelled && liveStatus !== "shipped" && liveStatus !== "delivered" && totalOrderAmt > 3000;
            const isOnlinePaid = order.payment === "upi" || order.payment === "bank";
            const isBeingCancelled = cancellingId === order.id;
            const wasCancelledNow = cancelConfirmed === order.id;
            const statusStyle = ORDER_STATUS_STYLE[liveStatus] ?? ORDER_STATUS_STYLE.active;
            const statusLabel = ORDER_STATUS_LABEL[liveStatus] ?? "Active";

            return (
              <div
                key={order.id}
                className={`border ${isCancelled ? "border-white/10 opacity-60" : "border-white/15"} overflow-hidden`}
              >
                {/* Order card header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white/3 border-b border-white/8">
                  <img
                    src={order.productImg}
                    alt={order.product}
                    className="w-10 h-12 object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-white uppercase truncate">{order.product}</p>
                    <p className="font-sans text-primary text-xs font-medium">{order.price}</p>
                  </div>
                  <span className={`text-[10px] font-bold font-sans px-2 py-1 uppercase tracking-wider border shrink-0 ${statusStyle}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Order details */}
                <div className="px-4 py-3 space-y-1.5">
                  {[
                    { label: "Order ID", value: order.id },
                    { label: "Size", value: `${order.size} × ${order.qty}` },
                    { label: "Payment", value: order.paymentLabel },
                    { label: "Date", value: formatDate(order.timestamp) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="font-sans text-white/40 text-xs">{row.label}</span>
                      <span className="font-sans text-white/80 text-xs text-right">{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <span className="font-sans text-white/40 text-xs">Deliver to: </span>
                    <span className="font-sans text-white/60 text-xs">{order.city}, {order.state}</span>
                  </div>
                  {dbInfo?.tracking_number && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="font-sans text-purple-400 text-xs">📦 Tracking: {dbInfo.tracking_number}</span>
                    </div>
                  )}
                </div>

                {/* Cancellation notice */}
                {isCancelled && order.cancelReason && !wasCancelledNow && (
                  <div className="px-4 pb-3 space-y-1">
                    <p className="font-sans text-red-400/70 text-xs">Reason: {order.cancelReason}</p>
                    {isOnlinePaid && (
                      <p className="font-sans text-amber-400/70 text-xs">↩ Refund will be credited within 24 hours</p>
                    )}
                  </div>
                )}

                {/* Cancel success msg */}
                {wasCancelledNow && (
                  <div className="px-4 pb-3">
                    <p className="font-sans text-red-400 text-xs">Order cancelled.</p>
                    {isOnlinePaid && (
                      <p className="font-sans text-amber-400 text-xs mt-0.5">Refund will be credited within 24 hours.</p>
                    )}
                  </div>
                )}

                {/* Cancel button */}
                {canCancel && !isBeingCancelled && (
                  <div className="px-4 pb-3">
                    <button
                      onClick={() => { setCancellingId(order.id); setCancelReason(""); }}
                      className="font-sans text-xs text-red-400/70 hover:text-red-400 transition-colors border border-red-500/20 hover:border-red-500/50 px-3 py-1.5"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {/* Cancel form */}
                {isBeingCancelled && (
                  <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
                    <p className="font-sans text-white/50 text-xs uppercase tracking-widest">Reason for cancellation</p>
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full bg-[#0d0d0d] border border-white/20 px-3 py-2 font-sans text-sm text-white focus:outline-none focus:border-primary appearance-none"
                    >
                      <option value="" disabled>Select a reason</option>
                      {CANCEL_REASONS.map((r) => (
                        <option key={r} value={r} className="bg-[#0d0d0d]">{r}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelConfirm(order.id)}
                        disabled={!cancelReason}
                        className="flex-1 py-2 font-sans text-xs uppercase tracking-wider bg-red-600/80 hover:bg-red-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Confirm Cancel
                      </button>
                      <button
                        onClick={() => { setCancellingId(null); setCancelReason(""); }}
                        className="px-4 py-2 font-sans text-xs text-white/50 border border-white/15 hover:border-white/30 transition-colors"
                      >
                        Keep
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}

// ── GOOGLE LINK BUTTON ────────────────────────────────────────────────────────

function LinkGoogleButton() {
  const { signIn, isLoaded } = useSignIn();
  const [linking, setLinking] = useState(false);

  const [linkError, setLinkError] = useState<string | null>(null);

  const handleLink = async () => {
    if (!isLoaded || !signIn) return;
    setLinking(true);
    setLinkError(null);
    const base = import.meta.env.BASE_URL as string;
    const baseTrimmed = base.endsWith("/") ? base.slice(0, -1) : base;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}${baseTrimmed}/sign-in/sso-callback`,
        redirectUrlComplete: `${window.location.origin}${baseTrimmed}/`,
      });
    } catch (err) {
      setLinking(false);
      const msg = err instanceof Error ? err.message : "Google login not enabled yet";
      setLinkError(msg);
    }
  };

  return (
    <>
      <button
        onClick={handleLink}
        disabled={!isLoaded || linking}
        className="mt-2.5 w-full py-2 font-sans text-xs text-white/60 border border-white/15 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {linking ? "Redirecting…" : "Link Google Account"}
      </button>
      {linkError && (
        <p className="mt-1.5 font-sans text-red-400 text-[10px] text-center leading-tight">{linkError}</p>
      )}
    </>
  );
}

// ── LOGIN MODAL ───────────────────────────────────────────────────────────────

function LoginPanel({
  onBack,
  onLogin,
}: {
  onBack: () => void;
  onLogin: (user: VedhhaUser) => void;
}) {
  const [step, setStep] = useState<"input" | "otp" | "name">("input");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<VedhhaUser | null>(null);
  const [welcomeUser, setWelcomeUser] = useState<VedhhaUser | null>(null);

  const otpTokenRef = useRef<string | null>(null);
  const { signIn, isLoaded: signInLoaded } = useSignIn();

  const handleGoogleSignIn = async () => {
    if (!signInLoaded || !signIn) return;
    const base = import.meta.env.BASE_URL as string;
    const baseTrimmed = base.endsWith("/") ? base.slice(0, -1) : base;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}${baseTrimmed}/sign-in/sso-callback`,
        redirectUrlComplete: `${window.location.origin}${baseTrimmed}/`,
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  // Auto-complete login after showing the "Welcome back" flash
  useEffect(() => {
    if (!welcomeUser) return;
    const t = setTimeout(() => { onLogin(welcomeUser); }, 1400);
    return () => clearTimeout(t);
  }, [welcomeUser, onLogin]);

  const cleanEmail = email.trim().toLowerCase();

  const lookupAndProceed = async () => {
    try {
      const sessionRes = await fetch("/api/otp/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (sessionRes.ok) {
        const { token } = (await sessionRes.json()) as { token: string };
        otpTokenRef.current = token;

        const lookupRes = await fetch(`/api/customers/${encodeURIComponent(cleanEmail)}`, {
          headers: { "X-OTP-Token": token },
        });
        if (lookupRes.ok) {
          const data = (await lookupRes.json()) as { isReturning: boolean; customer?: { name: string; notificationsEnabled: boolean | null } };
          if (data.isReturning && data.customer) {
            const u: VedhhaUser = {
              name: data.customer.name,
              contact: cleanEmail,
              notificationsEnabled: data.customer.notificationsEnabled ?? false,
            };
            if (typeof data.customer.notificationsEnabled === "boolean") {
              localStorage.setItem("vedhha_user", JSON.stringify(u));
              localStorage.setItem("vedhha_notifications", u.notificationsEnabled ? "true" : "false");
              setWelcomeUser(u);
            } else {
              setNameInput(data.customer.name);
              setPendingUser(u);
              setShowNotifModal(true);
            }
            return;
          }
        }
      }
    } catch {
      // If session or lookup fails, fall through to name step
    }
    setStep("name");
  };

  const handleContinue = async () => {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send OTP");
      }
      setStep("otp");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otpValue.length < 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: otpValue }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Incorrect OTP. Please try again.");
      }
      lookupAndProceed();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setOtpValue("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not resend OTP. Please try again.");
      }
    } catch {
      setError("Could not resend OTP. Please try again.");
    }
  };

  const handleFinishLogin = () => {
    setError("");
    if (nameInput.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    const u: VedhhaUser = {
      name: nameInput.trim(),
      contact: cleanEmail,
      notificationsEnabled: false,
    };
    setPendingUser(u);
    setShowNotifModal(true);
  };

  const finishWithNotif = async (allow: boolean) => {
    let notifEnabled = false;
    if (allow && "Notification" in window) {
      const perm = await Notification.requestPermission();
      notifEnabled = perm === "granted";
      localStorage.setItem("vedhha_notifications", notifEnabled ? "true" : "false");
    }
    const finalUser: VedhhaUser = { ...pendingUser!, notificationsEnabled: notifEnabled };
    localStorage.setItem("vedhha_user", JSON.stringify(finalUser));

    try {
      const token = otpTokenRef.current;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["X-OTP-Token"] = token;
      const saveRes = await fetch("/api/customers/upsert", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: cleanEmail,
          name: finalUser.name,
          notificationsEnabled: notifEnabled,
        }),
      });
      if (!saveRes.ok) {
        console.warn("[VEDHHA] Customer DB save failed:", saveRes.status, await saveRes.text());
      }
      otpTokenRef.current = null;
    } catch (err) {
      // Non-blocking: local login still succeeds even if DB save fails
      console.warn("[VEDHHA] Customer DB save error:", err);
    }

    onLogin(finalUser);
  };

  if (showNotifModal && pendingUser) {
    return (
      <motion.div {...slideVariants()} className="flex flex-col h-full">
        <PanelHeader title="Notifications" onBack={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
          <div className="w-16 h-16 border-2 border-accent flex items-center justify-center text-3xl">🔔</div>
          <div>
            <p className="font-display text-2xl text-white uppercase tracking-wide mb-2">
              Stay in the Loop
            </p>
            <p className="font-sans text-white/55 text-sm leading-relaxed">
              Allow VEDHHA to send you browser notifications for new drops, restocks, and exclusive Insider updates.
            </p>
          </div>
          <div className="w-full space-y-3">
            <button
              onClick={() => finishWithNotif(true)}
              className="w-full py-3 font-sans uppercase tracking-[0.25em] text-xs bg-accent text-black font-bold hover:opacity-90 transition-opacity"
            >
              Allow Notifications
            </button>
            <button
              onClick={() => finishWithNotif(false)}
              className="w-full py-3 font-sans uppercase tracking-[0.25em] text-xs border border-white/20 text-white/50 hover:border-white/40 hover:text-white/80 transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Welcome-back flash shown to returning users while auto-login completes
  if (welcomeUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full items-center justify-center px-6 text-center space-y-5"
      >
        <div className="w-16 h-16 border-2 border-primary flex items-center justify-center text-3xl">✓</div>
        <div>
          <p className="font-display text-2xl text-primary uppercase tracking-widest mb-1">Welcome Back!</p>
          <p className="font-sans text-white/55 text-sm">Hey {welcomeUser.name}, great to see you.</p>
        </div>
        <p className="font-sans text-white/30 text-xs">Logging you in…</p>
      </motion.div>
    );
  }

  return (
    <motion.div {...slideVariants()} className="flex flex-col h-full">
      <PanelHeader title="Login / Sign Up" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

        {/* Step: Email Input */}
        {step === "input" && (
          <div className="space-y-5">
            <div className="text-center space-y-1 pt-2">
              <p className="font-display text-xl text-white uppercase tracking-wide">Enter Your Email</p>
              <p className="font-sans text-white/40 text-xs">We'll send a 4-digit OTP to your email</p>
            </div>
            <div className="flex border border-white/20 overflow-hidden focus-within:border-primary transition-colors">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className="flex-1 bg-transparent px-4 py-3.5 font-sans text-base text-white placeholder-white/25 focus:outline-none"
              />
            </div>
            {error && <p className="font-sans text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleContinue}
              disabled={loading}
              className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP…" : "Send OTP →"}
            </button>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-sans text-white/25 text-xs uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 border border-white/10 bg-white/[0.03]">
              <div>
                <p className="font-sans text-white/50 text-xs uppercase tracking-widest">Phone Login</p>
                <p className="font-sans text-white/25 text-[11px] mt-0.5">Currently unavailable — coming soon</p>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest px-2 py-1 border border-white/15 text-white/30">Soon</span>
            </div>
          </div>
        )}

        {/* Step: OTP Input */}
        {step === "otp" && (
          <div className="space-y-5 pt-2">
            <div className="text-center space-y-1">
              <p className="font-display text-xl text-white uppercase tracking-wide">Enter OTP</p>
              <p className="font-sans text-white/40 text-xs">
                Sent to <span className="text-primary">{cleanEmail}</span>
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              {[0, 1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="tel"
                  maxLength={1}
                  value={otpValue[i] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const arr = otpValue.split("");
                    arr[i] = val;
                    const newOtp = arr.join("").slice(0, 4);
                    setOtpValue(newOtp);
                    if (val && i < 3) {
                      const next = document.getElementById(`otp-box-${i + 1}`);
                      if (next) (next as HTMLInputElement).focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otpValue[i] && i > 0) {
                      const prev = document.getElementById(`otp-box-${i - 1}`);
                      if (prev) (prev as HTMLInputElement).focus();
                    }
                  }}
                  id={`otp-box-${i}`}
                  className="w-14 h-14 text-center text-xl font-display text-white bg-transparent border-2 border-white/20 focus:border-primary focus:outline-none transition-colors"
                />
              ))}
            </div>
            {error && <p className="font-sans text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otpValue.length < 4}
              className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Verify OTP →"}
            </button>
            <div className="flex items-center justify-between text-xs font-sans">
              <button
                onClick={() => { setStep("input"); setError(""); setOtpValue(""); }}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                ← Change Email
              </button>
              <button
                onClick={handleResendOtp}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Step: Name */}
        {step === "name" && (
          <div className="space-y-4">
            <p className="font-sans text-white/55 text-sm">What should we call you?</p>
            <input
              type="text"
              placeholder="Your Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full bg-transparent border border-white/20 px-4 py-3 font-sans text-sm text-white placeholder-white/25 focus:border-primary focus:outline-none transition-colors"
            />
            {error && <p className="font-sans text-red-400 text-xs">{error}</p>}
            <button
              onClick={handleFinishLogin}
              className="w-full py-3 font-sans uppercase tracking-[0.25em] text-xs bg-primary text-white hover:bg-primary/80 transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-white/10">
          <p className="font-sans text-white/25 text-xs leading-relaxed">
            By continuing, you agree to VEDHHA's Terms of Use and Privacy Policy. Your data is never sold or shared with third parties.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN MENU ─────────────────────────────────────────────────────────────────
function MainMenu({
  setPanel,
  user,
  close,
}: {
  setPanel: (p: Panel) => void;
  user: VedhhaUser | null;
  close: () => void;
}) {
  const scrollToCollections = (section?: string) => {
    close();
    setTimeout(() => {
      const el = document.getElementById("collections");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      if (section) {
        setTimeout(() => {
          const btn = document.querySelector(`[data-section="${section}"]`) as HTMLButtonElement;
          if (btn) btn.click();
        }, 600);
      }
    }, 300);
  };

  return (
    <motion.div
      key="main"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { type: "spring", damping: 28, stiffness: 280 } }}
      exit={{ x: "-100%", opacity: 0, transition: { duration: 0.22 } }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* User greeting */}
      {user && (
        <div className="px-5 py-3 bg-primary/10 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 border border-primary/40 flex items-center justify-center font-display text-primary text-sm uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-white text-sm">Hey, {user.name}!</p>
              <p className="font-sans text-white/40 text-xs truncate">{user.contact}</p>
            </div>
          </div>
          {/* Google linking hidden until Google OAuth is configured in Auth pane */}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Section 1: Collections */}
        <div className="border-b border-white/8 py-2">
          {[
            { label: "Our Collection", sub: "All drops", icon: "🛍️", action: () => { setTheme("genz"); scrollToCollections(); } },
            { label: "Gen Z Collection", sub: "Limited drops", icon: "⚡", action: () => { setTheme("genz"); scrollToCollections("genz"); } },
            { label: "Gentleman Clothes", sub: "Premium menswear", icon: "🎩", action: () => { setTheme("gentleman"); scrollToCollections("main"); } },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="font-display text-lg text-white uppercase tracking-wide">{item.label}</p>
                  <p className="font-sans text-white/35 text-xs">{item.sub}</p>
                </div>
              </div>
              <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
            </button>
          ))}
        </div>

        {/* Section 2: Brand */}
        <div className="border-b border-white/8 py-2">
          {[
            {
              label: "About",
              badge: null,
              icon: "🏛️",
              panel: "about" as Panel,
            },
            {
              label: "Vedhha Studio",
              badge: "NEW",
              icon: "🎨",
              panel: "studio" as Panel,
            },
            {
              label: "Vedhha Insider",
              badge: null,
              icon: "⭐",
              panel: "insider" as Panel,
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setPanel(item.panel)}
              className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-sans text-white/80 text-base">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold font-sans px-2 py-0.5 bg-accent/20 text-accent border border-accent/40 uppercase tracking-widest">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
            </button>
          ))}
        </div>

        {/* Section 3: Utility */}
        <div className="border-b border-white/8 py-2">
          {[
            { label: "Gift Cards", icon: "🎁", panel: "giftcards" as Panel },
            { label: "Contact Us", icon: "📞", panel: "contact" as Panel },
            { label: "FAQs", icon: "❓", panel: "faqs" as Panel },
            { label: "Legal", icon: "📋", panel: "legal" as Panel },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setPanel(item.panel)}
              className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="font-sans text-white/70 text-base">{item.label}</span>
              </div>
              <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
            </button>
          ))}
        </div>

        {/* My Orders (always visible) */}
        <div className="border-b border-white/8 py-2">
          <button
            onClick={() => setPanel("orders")}
            className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">📦</span>
              <span className="font-sans text-white/80 text-base">My Orders</span>
            </div>
            <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
          </button>
          <button
            onClick={() => setPanel("referral")}
            className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🎁</span>
              <div>
                <span className="font-sans text-white/80 text-base block">Refer a Friend</span>
                <span className="font-sans text-primary text-xs">Both get 40% off</span>
              </div>
            </div>
            <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
          </button>
        </div>

        {/* Login / Logout */}
        <div className="py-2">
          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem("vedhha_user");
                window.location.reload();
              }}
              className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              <span className="text-base">🚪</span>
              <span className="font-sans text-white/50 text-base group-hover:text-white transition-colors">
                Logout
              </span>
            </button>
          ) : (
            <button
              onClick={() => setPanel("login")}
              className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">👤</span>
                <span className="font-sans text-white/80 text-base">Login / Sign Up</span>
              </div>
              <span className="text-white/25 group-hover:text-primary transition-colors">→</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-white/8">
        <p className="font-sans text-white/20 text-xs">© 2026 VEDHHA — The Eklavya Wear</p>
      </div>
    </motion.div>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const { theme, setTheme } = useVedhhaTheme();
  const [user, setUser] = useState<VedhhaUser | null>(() => {
    try {
      const saved = localStorage.getItem("vedhha_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const pendingBuyProduct = useRef<unknown>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onRequireLogin = (e: Event) => {
      pendingBuyProduct.current = (e as CustomEvent).detail ?? null;
      setIsOpen(true);
      setPanel("login");
    };
    window.addEventListener("vedhha:requireLogin", onRequireLogin);
    return () => window.removeEventListener("vedhha:requireLogin", onRequireLogin);
  }, []);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => setPanel(null), 300);
  };

  const handleLogin = (u: VedhhaUser) => {
    setUser(u);
    setPanel(null);
    setIsOpen(false);
    const prod = pendingBuyProduct.current;
    pendingBuyProduct.current = null;
    if (prod) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("vedhha:loginSuccess", { detail: prod }));
      }, 350);
    }
  };

  const renderPanel = () => {
    const back = () => setPanel(null);
    const legalBack = () => setPanel("legal");
    switch (panel) {
      case "about": return <AboutPanel onBack={back} />;
      case "studio": return <VedhhaStudioPanel onBack={back} />;
      case "insider": return <VedhhaInsiderPanel onBack={back} user={user} />;
      case "giftcards": return <GiftCardsPanel onBack={back} />;
      case "contact": return <ContactUsPanel onBack={back} />;
      case "faqs": return <FAQsPanel onBack={back} />;
      case "legal": return <LegalPanel onBack={back} setPanel={setPanel} />;
      case "legal-terms": return <LegalTermsPanel onBack={legalBack} />;
      case "legal-privacy": return <LegalPrivacyPanel onBack={legalBack} />;
      case "legal-center": return <LegalCenterPanel onBack={legalBack} />;
      case "login": return <LoginPanel onBack={back} onLogin={handleLogin} />;
      case "orders": return <MyOrdersPanel onBack={back} />;
      case "referral": return <ReferralPanel onBack={back} />;
      default: return null;
    }
  };

  return (
    <>
      {/* Hamburger Button — fixed top-left */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-[90] w-11 h-11 flex flex-col justify-center items-center gap-[5px] bg-black/70 border border-white/15 backdrop-blur-md hover:border-primary/60 transition-colors group"
        aria-label="Open menu"
      >
        <motion.span className="w-5 h-[1.5px] bg-white origin-center transition-colors group-hover:bg-primary" />
        <motion.span className="w-5 h-[1.5px] bg-white transition-colors group-hover:bg-primary" />
        <motion.span className="w-3 h-[1.5px] bg-white origin-right transition-colors group-hover:bg-primary" />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-0 left-0 bottom-0 w-[88vw] max-w-[360px] border-r z-[110] flex flex-col overflow-hidden transition-colors duration-600 ${theme === "gentleman" ? "bg-[hsl(28,12%,8%)] border-[hsl(28,15%,18%)]" : "bg-[#080808] border-white/8"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className={`flex items-center justify-between px-5 py-3 border-b shrink-0 transition-colors duration-600 ${theme === "gentleman" ? "bg-[hsl(28,10%,11%)] border-[hsl(28,15%,18%)]" : "bg-[#0d0d0d] border-white/10"}`}>
              <img
                src="/vedhha-logo.png"
                alt="VEDHHA Logo"
                className="h-14 w-auto object-contain brightness-[3] contrast-[0.8]"
              />
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {panel === null ? (
                  <MainMenu key="main" setPanel={setPanel} user={user} close={close} />
                ) : (
                  <div key={panel} className="absolute inset-0 bg-[#080808] flex flex-col">
                    {renderPanel()}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
