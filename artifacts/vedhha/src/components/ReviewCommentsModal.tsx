import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Comment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

interface Props {
  reviewKey: string | null;
  reviewerName: string;
  reviewText: string;
  onClose: () => void;
  onCommentAdded: (reviewKey: string) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ReviewCommentsModal({ reviewKey, reviewerName, reviewText, onClose, onCommentAdded }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!reviewKey) return;
    setLoading(true);
    fetch(`/api/customer-reviews/comments/${encodeURIComponent(reviewKey)}`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [reviewKey]);

  const submit = async () => {
    if (!name.trim() || !comment.trim() || !reviewKey) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/customer-reviews/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewKey, name: name.trim(), comment: comment.trim() }),
      });
      const data = await res.json();
      setComments(prev => [...prev, data]);
      setComment("");
      onCommentAdded(reviewKey);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {reviewKey && (
        <>
          <motion.div
            key="cm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[400]"
            onClick={onClose}
          />
          <motion.div
            key="cm-panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:bottom-0 sm:right-4 sm:w-[400px] sm:max-h-[90vh] z-[410] flex flex-col"
            style={{ background: "#0d0d0d", border: "1px solid hsl(var(--primary)/20)", maxHeight: "85vh" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0">
              <div>
                <p className="font-display text-white text-sm uppercase tracking-wide">Comments</p>
                <p className="font-sans text-white/35 text-[11px] mt-0.5">on {reviewerName}'s review</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white text-xl">×</button>
            </div>

            {/* Original review snippet */}
            <div className="px-4 py-3 border-b border-white/6 shrink-0" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="font-sans text-white/50 text-xs leading-relaxed line-clamp-2">"{reviewText}"</p>
              <p className="font-sans text-white/25 text-[10px] mt-1">— {reviewerName}</p>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-sans text-white/25 text-sm">No comments yet.</p>
                  <p className="font-sans text-white/15 text-xs mt-1">Be the first to comment!</p>
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "hsl(var(--primary)/70)" }}
                    >
                      {c.name.trim().split(/\s+/).map(w => w[0]?.toUpperCase()).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-white text-xs font-medium">{c.name}</span>
                        <span className="font-sans text-white/25 text-[10px]">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="font-sans text-white/60 text-xs leading-relaxed mt-0.5">{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add comment */}
            <div className="px-4 py-3 border-t border-white/8 shrink-0 space-y-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-black/40 border border-white/12 text-white text-xs font-sans px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-primary/40"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder="Add a comment..."
                  className="flex-1 bg-black/40 border border-white/12 text-white text-xs font-sans px-3 py-2 placeholder:text-white/20 focus:outline-none focus:border-primary/40"
                />
                <button
                  onClick={submit}
                  disabled={!name.trim() || !comment.trim() || submitting}
                  className="px-3 py-2 text-xs font-display uppercase tracking-wider transition-opacity disabled:opacity-30"
                  style={{ background: "hsl(var(--primary))", color: "#0a0a0a" }}
                >
                  {submitting ? "..." : "Post"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
