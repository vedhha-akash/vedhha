import { motion } from "framer-motion";

const ITEMS = [
  "NEW DROP",
  "SIMPLE THINGS TEE",
  "FREE SHIPPING",
  "LIFE IS BEAUTIFUL TEE",
  "GEN Z COLLECTION",
  "LIMITED STOCK",
  "LIGHT WEIGHT BABY TEE",
  "NEVER BE MY RIVAL",
  "THE EKLAVYA WEAR",
  "COD AVAILABLE",
  "PREMIUM STREETWEAR",
  "VEDHHA",
];

export default function MarqueeTicker() {
  const repeated = [...ITEMS, ...ITEMS];

  return (
    <div
      className="w-full overflow-hidden py-2.5 relative z-10"
      style={{ background: "#c8832a", borderTop: "1px solid rgba(0,0,0,0.15)", borderBottom: "1px solid rgba(0,0,0,0.15)" }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 mx-3"
          >
            <span
              className="text-[11px] font-display font-bold tracking-[0.25em] uppercase"
              style={{ color: "#0a0a0a" }}
            >
              {item}
            </span>
            <span style={{ color: "#0a0a0a", opacity: 0.4, fontSize: 10 }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
