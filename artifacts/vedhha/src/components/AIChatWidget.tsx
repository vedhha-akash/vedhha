import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hey! I'm VEDHHA AI — your personal style assistant. Ask me anything about products, sizing, delivery, or payments!",
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const replyText = (data.reply || "").trim();
      const reply: Message = {
        id: Date.now().toString() + "_ai",
        role: "assistant",
        content: replyText || "I couldn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          role: "assistant",
          content: isTimeout
            ? "Response took too long. Please try again or WhatsApp us: +91 91513 04494"
            : "Something went wrong. Please try again or WhatsApp us: +91 91513 04494",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-24 right-24 z-[200] w-[90vw] max-w-[360px] flex flex-col rounded-none overflow-hidden shadow-2xl"
            style={{ border: "1px solid hsl(var(--primary)/30)", background: "#0a0a0a" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: "hsl(var(--primary)/12)", borderBottom: "1px solid hsl(var(--primary)/20)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 flex items-center justify-center text-sm font-display font-bold"
                  style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}
                >
                  V
                </div>
                <div>
                  <p className="text-white font-display text-sm uppercase tracking-widest leading-none">VEDHHA AI</p>
                  <p className="text-white/40 text-[10px] font-sans mt-0.5">Style Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors text-lg w-7 h-7 flex items-center justify-center"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "360px", minHeight: "200px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[80%] px-3 py-2 text-sm font-sans leading-relaxed rounded-none"
                    style={{
                      background: msg.role === "user"
                        ? "hsl(var(--primary))"
                        : "rgba(255,255,255,0.06)",
                      color: msg.role === "user" ? "#0a0a0a" : "rgba(255,255,255,0.88)",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <span
                        key={i}
                        className="block rounded-full animate-pulse"
                        style={{
                          width: 7,
                          height: 7,
                          background: "rgba(255,255,255,0.5)",
                          animationDelay: `${delay}s`,
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 shrink-0"
              style={{ borderTop: "1px solid hsl(var(--primary)/15)", background: "#0d0d0d" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about products, sizing, delivery..."
                className="flex-1 bg-transparent text-white text-sm font-sans placeholder:text-white/25 focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-8 h-8 flex items-center justify-center transition-opacity disabled:opacity-30"
                style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}
                aria-label="Send"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-24 z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: isOpen ? "hsl(var(--primary)/80)" : "hsl(var(--primary))",
          color: "#0a0a0a",
          boxShadow: "0 4px 24px hsl(var(--primary)/40)",
        }}
        aria-label="Open VEDHHA AI chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
              className="text-xl font-light leading-none"
              style={{ color: "#0a0a0a" }}
            >
              ×
            </motion.span>
          ) : (
            <motion.svg
              key="sparkle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
