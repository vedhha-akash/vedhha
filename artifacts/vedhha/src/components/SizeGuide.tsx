import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const SIZE_CHART = [
  { size: "XS", chest: "34–35\"", waist: "28–29\"", hip: "36–37\"", indian: "S (Slim)" },
  { size: "S",  chest: "36–37\"", waist: "30–31\"", hip: "38–39\"", indian: "M (Regular)" },
  { size: "M",  chest: "38–39\"", waist: "32–33\"", hip: "40–41\"", indian: "L (Regular)" },
  { size: "L",  chest: "40–41\"", waist: "34–35\"", hip: "42–43\"", indian: "XL (Regular)" },
  { size: "XL", chest: "42–43\"", waist: "36–37\"", hip: "44–45\"", indian: "XXL (Regular)" },
  { size: "XXL",chest: "44–46\"", waist: "38–40\"", hip: "46–48\"", indian: "3XL" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function getBaseSize(height: number, weight: number): number {
  // Returns index in SIZES array
  let idx = 2; // default M
  if (weight < 52) idx = 0;
  else if (weight < 62) idx = 1;
  else if (weight < 72) idx = 2;
  else if (weight < 82) idx = 3;
  else if (weight < 95) idx = 4;
  else idx = 5;

  // Height adjustment
  if (height < 162 && idx > 0) idx -= 1;
  else if (height > 183 && idx < 5) idx += 1;

  return Math.max(0, Math.min(5, idx));
}

function calcRecommended(height: number, weight: number, fit: "slim" | "regular" | "oversized"): string {
  let idx = getBaseSize(height, weight);
  if (fit === "slim" && idx > 0) idx -= 1;
  if (fit === "oversized" && idx < 5) idx += 1;
  return SIZES[idx];
}

const FIT_TIPS = [
  { icon: "📏", tip: "Measure your chest — wrap the tape just below your underarms." },
  { icon: "🤏", tip: "For a slim fit, go one size down. For a relaxed fit, stick to your correct size." },
  { icon: "📦", tip: "For an oversized look — go one size up." },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSizeSelect?: (size: string) => void;
}

export default function SizeGuide({ open, onClose, onSizeSelect }: Props) {
  const [activeTab, setActiveTab] = useState<"chart" | "quiz">("chart");

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fit, setFit] = useState<"slim" | "regular" | "oversized" | "">("");
  const [result, setResult] = useState("");

  const resetQuiz = () => {
    setQuizStep(0); setHeight(""); setWeight(""); setFit(""); setResult("");
  };

  const handleQuizNext = () => {
    if (quizStep === 0 && (!height || isNaN(Number(height)))) return;
    if (quizStep === 1 && (!weight || isNaN(Number(weight)))) return;
    if (quizStep === 2 && !fit) return;
    if (quizStep === 2) {
      const rec = calcRecommended(Number(height), Number(weight), fit as "slim" | "regular" | "oversized");
      setResult(rec);
      setQuizStep(3);
    } else {
      setQuizStep(q => q + 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[301] p-0 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full sm:max-w-lg bg-[#0d0d0d] border border-white/10 max-h-[88dvh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
                <div>
                  <p className="font-display text-xl text-white uppercase tracking-wide">Size Guide</p>
                  <p className="font-sans text-white/40 text-xs">Chart · Find My Size</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white text-xl">✕</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 shrink-0">
                <button
                  onClick={() => { setActiveTab("chart"); }}
                  className={`flex-1 py-3 font-sans text-xs uppercase tracking-widest transition-colors ${activeTab === "chart" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}
                >
                  Size Chart
                </button>
                <button
                  onClick={() => { setActiveTab("quiz"); resetQuiz(); }}
                  className={`flex-1 py-3 font-sans text-xs uppercase tracking-widest transition-colors ${activeTab === "quiz" ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white"}`}
                >
                  🎯 Find My Size
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* SIZE CHART TAB */}
                {activeTab === "chart" && (
                  <div className="px-5 py-4 space-y-5">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[360px] border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            {["Size", "Chest", "Waist", "Hip", "Indian Equiv."].map((h) => (
                              <th key={h} className="font-sans text-white/40 text-xs uppercase tracking-widest py-2 px-2 text-left font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/6">
                          {SIZE_CHART.map((row) => (
                            <tr key={row.size} className="hover:bg-white/3 transition-colors">
                              <td className="py-3 px-2">
                                <span className="font-display text-primary text-sm font-bold">{row.size}</span>
                              </td>
                              <td className="font-sans text-white/80 text-xs py-3 px-2">{row.chest}</td>
                              <td className="font-sans text-white/80 text-xs py-3 px-2">{row.waist}</td>
                              <td className="font-sans text-white/80 text-xs py-3 px-2">{row.hip}</td>
                              <td className="font-sans text-white/50 text-xs py-3 px-2">{row.indian}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="border border-white/10 px-4 py-3">
                      <p className="font-display text-sm text-white uppercase tracking-wide mb-3">Measurement Tips</p>
                      <div className="space-y-2">
                        {FIT_TIPS.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-base shrink-0">{tip.icon}</span>
                            <p className="font-sans text-white/60 text-xs leading-relaxed">{tip.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-primary/8 border border-primary/20 px-4 py-3">
                      <p className="font-sans text-white/60 text-xs leading-relaxed">
                        <span className="text-primary font-medium">Note:</span> Measurements may vary slightly per garment. Agar doubt ho toh ek size bada lena better hai.
                      </p>
                    </div>
                  </div>
                )}

                {/* QUIZ TAB */}
                {activeTab === "quiz" && (
                  <div className="px-5 py-6">
                    <AnimatePresence mode="wait">
                      {quizStep === 0 && (
                        <motion.div
                          key="q0"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-5"
                        >
                          <div>
                            <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-1">Step 1 of 3</p>
                            <p className="font-display text-xl text-white uppercase">Tumhari height?</p>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={height}
                              onChange={e => setHeight(e.target.value)}
                              placeholder="e.g. 175"
                              className="w-full bg-transparent border border-white/20 px-4 py-3 font-sans text-2xl text-white placeholder-white/20 focus:border-primary focus:outline-none text-center tracking-wider"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-white/30 text-sm">cm</span>
                          </div>
                          <div className="flex gap-2">
                            {["160", "165", "170", "175", "180", "185"].map(h => (
                              <button key={h} onClick={() => setHeight(h)} className={`flex-1 py-2 font-sans text-xs border transition-colors ${height === h ? "border-primary text-primary" : "border-white/15 text-white/40 hover:border-white/40"}`}>{h}</button>
                            ))}
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleQuizNext}
                            disabled={!height}
                            className="w-full py-3.5 font-sans uppercase tracking-[0.25em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-30"
                          >
                            Next →
                          </motion.button>
                        </motion.div>
                      )}

                      {quizStep === 1 && (
                        <motion.div
                          key="q1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-5"
                        >
                          <div>
                            <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-1">Step 2 of 3</p>
                            <p className="font-display text-xl text-white uppercase">Tumhara weight?</p>
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              value={weight}
                              onChange={e => setWeight(e.target.value)}
                              placeholder="e.g. 70"
                              className="w-full bg-transparent border border-white/20 px-4 py-3 font-sans text-2xl text-white placeholder-white/20 focus:border-primary focus:outline-none text-center tracking-wider"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-white/30 text-sm">kg</span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {["55", "60", "65", "70", "75", "80", "90"].map(w => (
                              <button key={w} onClick={() => setWeight(w)} className={`flex-1 py-2 font-sans text-xs border transition-colors ${weight === w ? "border-primary text-primary" : "border-white/15 text-white/40 hover:border-white/40"}`}>{w}</button>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setQuizStep(0)} className="flex-1 py-3 font-sans text-xs border border-white/20 text-white/50 hover:text-white transition-colors">← Back</button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={handleQuizNext}
                              disabled={!weight}
                              className="flex-1 py-3 font-sans uppercase tracking-[0.2em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-30"
                            >
                              Next →
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {quizStep === 2 && (
                        <motion.div
                          key="q2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-5"
                        >
                          <div>
                            <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-1">Step 3 of 3</p>
                            <p className="font-display text-xl text-white uppercase">Fit preference?</p>
                          </div>
                          <div className="space-y-3">
                            {[
                              { id: "slim", label: "Slim Fit", desc: "Body-hugging, sharp silhouette", icon: "🔥" },
                              { id: "regular", label: "Regular Fit", desc: "Balanced — not too tight, not too loose", icon: "✨" },
                              { id: "oversized", label: "Oversized", desc: "Relaxed, streetwear vibe", icon: "💫" },
                            ].map(option => (
                              <button
                                key={option.id}
                                onClick={() => setFit(option.id as "slim" | "regular" | "oversized")}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 border transition-all text-left ${fit === option.id ? "border-primary bg-primary/10" : "border-white/15 hover:border-white/30"}`}
                              >
                                <span className="text-xl">{option.icon}</span>
                                <div>
                                  <p className={`font-sans text-sm font-medium ${fit === option.id ? "text-primary" : "text-white"}`}>{option.label}</p>
                                  <p className="font-sans text-white/40 text-xs">{option.desc}</p>
                                </div>
                                <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${fit === option.id ? "border-primary" : "border-white/30"}`}>
                                  {fit === option.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => setQuizStep(1)} className="flex-1 py-3 font-sans text-xs border border-white/20 text-white/50 hover:text-white transition-colors">← Back</button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={handleQuizNext}
                              disabled={!fit}
                              className="flex-1 py-3 font-sans uppercase tracking-[0.2em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-30"
                            >
                              Get Size →
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {quizStep === 3 && result && (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-5 text-center"
                        >
                          <div className="py-6 border border-primary/30 bg-primary/5">
                            <p className="font-sans text-xs text-white/40 uppercase tracking-widest mb-2">Tumhara recommended size</p>
                            <p className="font-display text-7xl text-primary font-bold">{result}</p>
                            <p className="font-sans text-white/50 text-sm mt-2">
                              {fit === "slim" ? "Slim Fit" : fit === "oversized" ? "Oversized" : "Regular Fit"} · {height}cm · {weight}kg
                            </p>
                          </div>
                          <p className="font-sans text-white/50 text-xs leading-relaxed">
                            Agar tumhara size dono ke beech mein hai, toh prefer karo <span className="text-white">{result}</span>. Slim cut chahiye toh ek size chhota lo.
                          </p>
                          <div className="flex gap-3">
                            <button onClick={resetQuiz} className="flex-1 py-3 font-sans text-xs border border-white/20 text-white/50 hover:text-white transition-colors">Retake Quiz</button>
                            {onSizeSelect && (
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { onSizeSelect(result); onClose(); }}
                                className="flex-1 py-3 font-sans uppercase tracking-[0.2em] text-sm bg-primary text-white hover:bg-primary/80 transition-colors"
                              >
                                Select {result}
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
