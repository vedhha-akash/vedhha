import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const WHATSAPP_LINK = "https://wa.me/919151304494?text=Hi%20VEDHHA!%20I%20have%20a%20question%20about%20your%20collection.";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    const pulseTimer = setTimeout(() => setPulse(false), 8000);
    return () => { clearTimeout(timer); clearTimeout(pulseTimer); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="fixed bottom-6 right-5 z-[300]"
        >
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 hover:bg-[#22c55e] transition-colors"
          >
            {pulse && (
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-50" />
            )}
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
              <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.612 1.83 6.51L4 29l7.697-1.803A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="white"/>
              <path d="M21.5 18.9c-.3-.15-1.77-.874-2.044-.973-.274-.099-.473-.148-.673.149-.199.297-.773.972-.947 1.171-.174.199-.347.224-.647.075-.3-.15-1.265-.466-2.41-1.485-.89-.794-1.49-1.774-1.664-2.073-.174-.3-.018-.462.13-.61.134-.134.3-.348.449-.522.149-.174.199-.3.299-.498.099-.199.05-.373-.025-.522-.075-.15-.673-1.621-.922-2.22-.243-.582-.49-.503-.673-.512l-.574-.01c-.199 0-.522.075-.796.373-.274.3-1.047 1.023-1.047 2.493 0 1.47 1.072 2.89 1.221 3.088.15.199 2.11 3.22 5.112 4.514.715.308 1.273.492 1.708.63.717.228 1.37.196 1.886.119.575-.086 1.77-.724 2.02-1.423.249-.699.249-1.298.174-1.422-.074-.124-.274-.199-.573-.348z" fill="#25D366"/>
            </svg>
          </a>
          <div className="absolute bottom-16 right-0 pointer-events-none">
            <AnimatePresence>
              {pulse && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#0d0d0d] border border-white/10 rounded px-3 py-2 whitespace-nowrap"
                >
                  <p className="font-sans text-xs text-white">Chat with us on WhatsApp</p>
                  <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-[#0d0d0d] border-r border-b border-white/10 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
